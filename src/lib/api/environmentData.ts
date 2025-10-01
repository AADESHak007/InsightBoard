import { sodaClient } from './sodaClient';

// Air Quality endpoint
const AIR_QUALITY_ENDPOINT = 'c3uy-2p5r.json';

// Street Tree Census endpoint
const STREET_TREES_ENDPOINT = 'uvpi-gqnh.json';

export interface AirQualityRecord {
  unique_id?: string;
  indicator_id?: string;
  name?: string; // NO2, PM2.5, O3
  measure?: string;
  measure_info?: string; // ppb, mcg/m3
  geo_type_name?: string;
  geo_place_name?: string;
  time_period?: string;
  start_date?: string;
  data_value?: string;
  [key: string]: string | undefined;
}

export interface StreetTree {
  tree_id?: string;
  block_id?: string;
  tree_dbh?: string; // Diameter
  stump_diam?: string;
  curb_loc?: string;
  status?: string; // Alive, Dead, Stump
  health?: string; // Good, Fair, Poor
  spc_latin?: string;
  spc_common?: string;
  boroname?: string;
  nta_name?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: string | undefined;
}

export interface AirQualityStats {
  avgPM25: number;
  avgNO2: number;
  avgOzone: number;
  pollutantsByBorough: Record<string, { pm25: number; no2: number; ozone: number }>;
  totalMeasurements: number;
}

export interface TreeStats {
  totalTrees: number;
  aliveTrees: number;
  deadTrees: number;
  goodHealth: number;
  fairHealth: number;
  poorHealth: number;
  treesByBorough: Record<string, number>;
  topSpecies: Array<{ species: string; count: number; percentage: number }>;
}

/**
 * Fetch air quality data
 */
export async function fetchAirQuality(limit: number = 10000): Promise<AirQualityRecord[]> {
  try {
    const data = await sodaClient.query<AirQualityRecord>(
      AIR_QUALITY_ENDPOINT,
      `$limit=${limit}&$order=start_date DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return [];
  }
}

/**
 * Fetch street tree data
 */
export async function fetchStreetTrees(limit: number = 10000): Promise<StreetTree[]> {
  try {
    const data = await sodaClient.fetch<StreetTree>({
      endpoint: STREET_TREES_ENDPOINT,
      limit,
    });
    return data;
  } catch (error) {
    console.error('Error fetching street trees:', error);
    return [];
  }
}

/**
 * Calculate air quality statistics
 */
export function calculateAirQualityStats(records: AirQualityRecord[]): AirQualityStats {
  let pm25Sum = 0, pm25Count = 0;
  let no2Sum = 0, no2Count = 0;
  let ozoneSum = 0, ozoneCount = 0;
  const pollutantsByBorough: Record<string, { pm25: number; no2: number; ozone: number; counts: { pm25: number; no2: number; ozone: number } }> = {};

  records.forEach(record => {
    const name = (record.name || '').toLowerCase();
    const value = parseFloat(record.data_value || '0');
    
    // Extract borough - handle various formats
    let borough = 'UNKNOWN';
    const geoName = record.geo_place_name || '';
    
    if (geoName.toLowerCase().includes('bronx')) borough = 'Bronx';
    else if (geoName.toLowerCase().includes('brooklyn')) borough = 'Brooklyn';
    else if (geoName.toLowerCase().includes('manhattan')) borough = 'Manhattan';
    else if (geoName.toLowerCase().includes('queens')) borough = 'Queens';
    else if (geoName.toLowerCase().includes('staten island')) borough = 'Staten Island';
    else if (geoName.toLowerCase().includes('nyc') || geoName.toLowerCase().includes('new york')) borough = 'NYC-wide';

    if (!pollutantsByBorough[borough]) {
      pollutantsByBorough[borough] = {
        pm25: 0, no2: 0, ozone: 0,
        counts: { pm25: 0, no2: 0, ozone: 0 }
      };
    }

    if (name.includes('pm 2.5') || name.includes('fine particles')) {
      pm25Sum += value;
      pm25Count++;
      pollutantsByBorough[borough].pm25 += value;
      pollutantsByBorough[borough].counts.pm25++;
    } else if (name.includes('no2') || name.includes('nitrogen')) {
      no2Sum += value;
      no2Count++;
      pollutantsByBorough[borough].no2 += value;
      pollutantsByBorough[borough].counts.no2++;
    } else if (name.includes('o3') || name.includes('ozone')) {
      ozoneSum += value;
      ozoneCount++;
      pollutantsByBorough[borough].ozone += value;
      pollutantsByBorough[borough].counts.ozone++;
    }
  });

  // Average by borough
  const boroughAverages: Record<string, { pm25: number; no2: number; ozone: number }> = {};
  Object.entries(pollutantsByBorough).forEach(([borough, data]) => {
    boroughAverages[borough] = {
      pm25: data.counts.pm25 > 0 ? data.pm25 / data.counts.pm25 : 0,
      no2: data.counts.no2 > 0 ? data.no2 / data.counts.no2 : 0,
      ozone: data.counts.ozone > 0 ? data.ozone / data.counts.ozone : 0,
    };
  });

  return {
    avgPM25: pm25Count > 0 ? pm25Sum / pm25Count : 0,
    avgNO2: no2Count > 0 ? no2Sum / no2Count : 0,
    avgOzone: ozoneCount > 0 ? ozoneSum / ozoneCount : 0,
    pollutantsByBorough: boroughAverages,
    totalMeasurements: records.length,
  };
}

/**
 * Calculate tree statistics
 */
export function calculateTreeStats(trees: StreetTree[]): TreeStats {
  let aliveTrees = 0;
  let deadTrees = 0;
  let goodHealth = 0;
  let fairHealth = 0;
  let poorHealth = 0;
  const treesByBorough: Record<string, number> = {};
  const speciesCounts: Record<string, number> = {};

  trees.forEach(tree => {
    const status = (tree.status || '').toUpperCase();
    const health = (tree.health || '').toUpperCase();
    const borough = tree.boroname || 'UNKNOWN';
    const species = tree.spc_common || 'Unknown';

    // Count by status
    if (status === 'ALIVE') aliveTrees++;
    else if (status === 'DEAD') deadTrees++;

    // Count by health
    if (health === 'GOOD') goodHealth++;
    else if (health === 'FAIR') fairHealth++;
    else if (health === 'POOR') poorHealth++;

    // Count by borough
    treesByBorough[borough] = (treesByBorough[borough] || 0) + 1;

    // Count by species
    speciesCounts[species] = (speciesCounts[species] || 0) + 1;
  });

  const total = trees.length;
  const topSpecies = Object.entries(speciesCounts)
    .map(([species, count]) => ({
      species,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalTrees: total,
    aliveTrees,
    deadTrees,
    goodHealth,
    fairHealth,
    poorHealth,
    treesByBorough,
    topSpecies,
  };
}

/**
 * Get yearly air quality trends
 */
export function getYearlyAirQualityTrends(records: AirQualityRecord[]): Array<{
  year: string;
  pm25: number;
  no2: number;
  ozone: number;
}> {
  const yearData: Record<string, { pm25: number[]; no2: number[]; ozone: number[] }> = {};

  records.forEach(record => {
    const name = (record.name || '').toLowerCase();
    const value = parseFloat(record.data_value || '0');
    
    // Extract year from time_period or start_date
    let year = '';
    const timePeriod = record.time_period || '';
    const startDate = record.start_date || '';
    
    // Try to extract a 4-digit year
    const yearMatch = (timePeriod + ' ' + startDate).match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    if (!year || isNaN(value)) return;

    if (!yearData[year]) {
      yearData[year] = { pm25: [], no2: [], ozone: [] };
    }

    if (name.includes('pm 2.5') || name.includes('fine particles')) {
      yearData[year].pm25.push(value);
    } else if (name.includes('no2') || name.includes('nitrogen')) {
      yearData[year].no2.push(value);
    } else if (name.includes('o3') || name.includes('ozone')) {
      yearData[year].ozone.push(value);
    }
  });

  return Object.entries(yearData)
    .map(([year, data]) => ({
      year,
      pm25: data.pm25.length > 0 ? data.pm25.reduce((a, b) => a + b, 0) / data.pm25.length : 0,
      no2: data.no2.length > 0 ? data.no2.reduce((a, b) => a + b, 0) / data.no2.length : 0,
      ozone: data.ozone.length > 0 ? data.ozone.reduce((a, b) => a + b, 0) / data.ozone.length : 0,
    }))
    .filter(d => d.pm25 > 0 || d.no2 > 0 || d.ozone > 0) // Filter out empty years
    .sort((a, b) => a.year.localeCompare(b.year));
}

/**
 * Get tree diameter distribution
 */
export function getTreeDiameterDistribution(trees: StreetTree[]): Array<{
  range: string;
  count: number;
  percentage: number;
}> {
  const ranges = [
    { min: 0, max: 5, label: '0-5"' },
    { min: 5, max: 10, label: '5-10"' },
    { min: 10, max: 15, label: '10-15"' },
    { min: 15, max: 20, label: '15-20"' },
    { min: 20, max: 30, label: '20-30"' },
    { min: 30, max: 999, label: '30+"' },
  ];

  const counts = ranges.map(r => ({ ...r, count: 0 }));
  let total = 0;

  trees.forEach(tree => {
    const dbh = parseInt(tree.tree_dbh || '0', 10);
    if (dbh > 0) {
      total++;
      const rangeIdx = ranges.findIndex(r => dbh >= r.min && dbh < r.max);
      if (rangeIdx >= 0) counts[rangeIdx].count++;
    }
  });

  return counts.map(c => ({
    range: c.label,
    count: c.count,
    percentage: total > 0 ? (c.count / total) * 100 : 0,
  }));
}

