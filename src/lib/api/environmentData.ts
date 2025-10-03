import { sodaClient } from './sodaClient';

// Air Quality endpoint
const AIR_QUALITY_ENDPOINT = 'c3uy-2p5r.json';

// Street Tree Census endpoint
const STREET_TREES_ENDPOINT = 'uvpi-gqnh.json';

// GHG Emissions Inventory endpoint
const GHG_EMISSIONS_ENDPOINT = 'wq7q-htne.json';

// DSNY Monthly Tonnage Data endpoint
const DSNY_TONNAGE_ENDPOINT = 'ebb7-mvp5.json';

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

export interface GHGEmissionsRecord {
  inventory_type?: string;
  sectors_sector?: string;
  category_full?: string;
  category_label?: string;
  source_full?: string;
  source_label?: string;
  source_units?: string;
  cy_2005_tco2e_100_yr_gwp?: string;
  cy_2006_tco2e_100_yr_gwp?: string;
  cy_2007_tco2e_100_yr_gwp?: string;
  cy_2008_tco2e_100_yr_gwp?: string;
  cy_2009_tco2e_100_yr_gwp?: string;
  cy_2010_tco2e?: string;
  cy_2011_tco2e?: string;
  cy_2012_tco2e?: string;
  cy_2013_tco2e?: string;
  cy_2014_tco2e?: string;
  cy_2015_tco2e?: string;
  cy_2016_tco2e?: string;
  cy_2017_tco2e?: string;
  cy_2018_tco2e?: string;
  cy_2019_tco2e?: string;
  cy_2020_tco2e?: string;
  cy_2021_tco2e?: string;
  cy_2022_tco2e?: string;
  cy_2023_tco2e?: string;
  _2005_2022_change_tco2e?: string;
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

export interface GHGEmissionsStats {
  totalEmissions2023: number;
  totalEmissions2005: number;
  reductionPercent: number;
  reductionTons: number;
  emissionsBySector: Record<string, number>;
  yearlyTrend: Array<{ year: string; emissions: number }>;
}

export interface DSNYTonnageRecord {
  month?: string;
  borough?: string;
  communitydistrict?: string;
  refusetonscollected?: string;
  papertonscollected?: string;
  mgptonscollected?: string;
  resorganicstons?: string;
  schoolorganictons?: string;
  leavesorganictons?: string;
  xmastreetons?: string;
  otherorganicstons?: string;
  borough_id?: string;
  [key: string]: string | undefined;
}

export interface RecyclingDiversionStats {
  currentDiversionRate: number;
  diversionRate2012: number;
  improvementPercent: number;
  totalWasteCollected: number;
  totalRecycled: number;
  yearlyTrend: Array<{ year: string; diversionRate: number; totalWaste: number; totalRecycled: number }>;
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
 * Fetch GHG emissions data
 */
export async function fetchGHGEmissions(limit: number = 10000): Promise<GHGEmissionsRecord[]> {
  try {
    const data = await sodaClient.query<GHGEmissionsRecord>(
      GHG_EMISSIONS_ENDPOINT,
      `$limit=${limit}&$where=inventory_type='Total'`
    );
    return data;
  } catch (error) {
    console.error('Error fetching GHG emissions:', error);
    return [];
  }
}

/**
 * Fetch DSNY tonnage data
 */
export async function fetchDSNYTonnage(limit: number = 50000): Promise<DSNYTonnageRecord[]> {
  try {
    const data = await sodaClient.query<DSNYTonnageRecord>(
      DSNY_TONNAGE_ENDPOINT,
      `$limit=${limit}&$order=month DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching DSNY tonnage data:', error);
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
 * Get yearly air quality trends focused on PM2.5 (2013-2023)
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

    // Only include years from 2013-2023
    const yearNum = parseInt(year);
    if (yearNum < 2013 || yearNum > 2023) return;

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
 * Get PM2.5 yearly trend data specifically for the insight
 */
export function getPM25YearlyTrend(records: AirQualityRecord[]): Array<{
  year: string;
  pm25: number;
}> {
  const yearData: Record<string, number[]> = {};

  records.forEach(record => {
    const name = (record.name || '').toLowerCase();
    const value = parseFloat(record.data_value || '0');
    
    // Only process PM2.5 records
    if (!name.includes('pm 2.5') && !name.includes('fine particles')) return;
    
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

    // Only include years from 2013-2023
    const yearNum = parseInt(year);
    if (yearNum < 2013 || yearNum > 2023) return;

    if (!yearData[year]) {
      yearData[year] = [];
    }
    
    yearData[year].push(value);
  });

  return Object.entries(yearData)
    .map(([year, values]) => ({
      year,
      pm25: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    }))
    .filter(d => d.pm25 > 0) // Filter out empty years
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

/**
 * Calculate GHG emissions statistics
 */
export function calculateGHGEmissionsStats(records: GHGEmissionsRecord[]): GHGEmissionsStats {
  // Find the "Total" record which contains citywide emissions
  const totalRecord = records.find(r => 
    r.inventory_type === 'Total' && 
    r.sectors_sector === 'Total' &&
    r.category_label === 'Total'
  );

  if (!totalRecord) {
    return {
      totalEmissions2023: 0,
      totalEmissions2005: 0,
      reductionPercent: 0,
      reductionTons: 0,
      emissionsBySector: {},
      yearlyTrend: [],
    };
  }

  // Extract yearly emissions data
  const yearlyEmissions: Record<string, number> = {};
  
  // 2005-2009 use 100_yr_gwp format
  yearlyEmissions['2005'] = parseFloat(totalRecord.cy_2005_tco2e_100_yr_gwp || '0');
  yearlyEmissions['2006'] = parseFloat(totalRecord.cy_2006_tco2e_100_yr_gwp || '0');
  yearlyEmissions['2007'] = parseFloat(totalRecord.cy_2007_tco2e_100_yr_gwp || '0');
  yearlyEmissions['2008'] = parseFloat(totalRecord.cy_2008_tco2e_100_yr_gwp || '0');
  yearlyEmissions['2009'] = parseFloat(totalRecord.cy_2009_tco2e_100_yr_gwp || '0');
  
  // 2010-2023 use standard tco2e format
  yearlyEmissions['2010'] = parseFloat(totalRecord.cy_2010_tco2e || '0');
  yearlyEmissions['2011'] = parseFloat(totalRecord.cy_2011_tco2e || '0');
  yearlyEmissions['2012'] = parseFloat(totalRecord.cy_2012_tco2e || '0');
  yearlyEmissions['2013'] = parseFloat(totalRecord.cy_2013_tco2e || '0');
  yearlyEmissions['2014'] = parseFloat(totalRecord.cy_2014_tco2e || '0');
  yearlyEmissions['2015'] = parseFloat(totalRecord.cy_2015_tco2e || '0');
  yearlyEmissions['2016'] = parseFloat(totalRecord.cy_2016_tco2e || '0');
  yearlyEmissions['2017'] = parseFloat(totalRecord.cy_2017_tco2e || '0');
  yearlyEmissions['2018'] = parseFloat(totalRecord.cy_2018_tco2e || '0');
  yearlyEmissions['2019'] = parseFloat(totalRecord.cy_2019_tco2e || '0');
  yearlyEmissions['2020'] = parseFloat(totalRecord.cy_2020_tco2e || '0');
  yearlyEmissions['2021'] = parseFloat(totalRecord.cy_2021_tco2e || '0');
  yearlyEmissions['2022'] = parseFloat(totalRecord.cy_2022_tco2e || '0');
  yearlyEmissions['2023'] = parseFloat(totalRecord.cy_2023_tco2e || '0');

  const totalEmissions2005 = yearlyEmissions['2005'];
  const totalEmissions2023 = yearlyEmissions['2023'];
  
  const reductionTons = totalEmissions2005 - totalEmissions2023;
  const reductionPercent = totalEmissions2005 > 0 ? (reductionTons / totalEmissions2005) * 100 : 0;

  // Create yearly trend array (2015-2023 as requested)
  const yearlyTrend = Object.entries(yearlyEmissions)
    .filter(([year]) => {
      const yearNum = parseInt(year);
      return yearNum >= 2015 && yearNum <= 2023;
    })
    .map(([year, emissions]) => ({
      year,
      emissions: Math.round(emissions / 1000), // Convert to thousands of tons
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return {
    totalEmissions2023: Math.round(totalEmissions2023 / 1000), // Convert to thousands of tons
    totalEmissions2005: Math.round(totalEmissions2005 / 1000), // Convert to thousands of tons
    reductionPercent: Math.round(reductionPercent * 10) / 10,
    reductionTons: Math.round(reductionTons / 1000), // Convert to thousands of tons
    emissionsBySector: {}, // Could be expanded to include sector breakdown
    yearlyTrend,
  };
}

/**
 * Calculate recycling diversion statistics
 */
export function calculateRecyclingDiversionStats(records: DSNYTonnageRecord[]): RecyclingDiversionStats {
  const yearlyData: Record<string, { totalWaste: number; totalRecycled: number }> = {};

  records.forEach(record => {
    // Extract year from month field (format: "2025 / 08")
    const monthStr = record.month || '';
    const yearMatch = monthStr.match(/(\d{4})/);
    if (!yearMatch) return;

    const year = yearMatch[1];
    const yearNum = parseInt(year);
    
    // Only include years from 2012-2025
    if (yearNum < 2012 || yearNum > 2025) return;

    // Parse tonnage values
    const refuse = parseFloat(record.refusetonscollected || '0');
    const paper = parseFloat(record.papertonscollected || '0');
    const mgp = parseFloat(record.mgptonscollected || '0');
    const resOrganics = parseFloat(record.resorganicstons || '0');
    const schoolOrganics = parseFloat(record.schoolorganictons || '0');
    const leavesOrganics = parseFloat(record.leavesorganictons || '0');
    const xmasTrees = parseFloat(record.xmastreetons || '0');
    const otherOrganics = parseFloat(record.otherorganicstons || '0');

    // Calculate totals
    const totalWaste = refuse + paper + mgp + resOrganics + schoolOrganics + leavesOrganics + xmasTrees + otherOrganics;
    const totalRecycled = paper + mgp + resOrganics + schoolOrganics + leavesOrganics + xmasTrees + otherOrganics;

    if (!yearlyData[year]) {
      yearlyData[year] = { totalWaste: 0, totalRecycled: 0 };
    }

    yearlyData[year].totalWaste += totalWaste;
    yearlyData[year].totalRecycled += totalRecycled;
  });

  // Calculate yearly trends
  const yearlyTrend = Object.entries(yearlyData)
    .map(([year, data]) => ({
      year,
      totalWaste: Math.round(data.totalWaste / 1000), // Convert to thousands of tons
      totalRecycled: Math.round(data.totalRecycled / 1000), // Convert to thousands of tons
      diversionRate: data.totalWaste > 0 ? (data.totalRecycled / data.totalWaste) * 100 : 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Get current and baseline diversion rates
  const currentYearData = yearlyTrend[yearlyTrend.length - 1];
  const baselineYearData = yearlyTrend.find(d => d.year === '2012');

  const currentDiversionRate = currentYearData ? Math.round(currentYearData.diversionRate * 10) / 10 : 0;
  const diversionRate2012 = baselineYearData ? Math.round(baselineYearData.diversionRate * 10) / 10 : 0;
  const improvementPercent = diversionRate2012 > 0 ? Math.round(((currentDiversionRate - diversionRate2012) / diversionRate2012) * 100 * 10) / 10 : 0;

  return {
    currentDiversionRate,
    diversionRate2012,
    improvementPercent,
    totalWasteCollected: currentYearData ? currentYearData.totalWaste : 0,
    totalRecycled: currentYearData ? currentYearData.totalRecycled : 0,
    yearlyTrend,
  };
}

