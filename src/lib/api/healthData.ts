import { sodaClient } from './sodaClient';

// Restaurant Inspection Results endpoint
const RESTAURANT_INSPECTIONS_ENDPOINT = '43nn-pn8j.json';

// Leading Causes of Death endpoint
const LEADING_CAUSES_DEATH_ENDPOINT = 'jb7j-dtam.json';

export interface RestaurantInspection {
  camis?: string;
  dba?: string;
  boro?: string;
  cuisine_description?: string;
  inspection_date?: string;
  action?: string;
  violation_code?: string;
  violation_description?: string;
  critical_flag?: string; // Critical, Not Critical
  score?: string;
  grade?: string; // A, B, C
  grade_date?: string;
  inspection_type?: string;
  [key: string]: string | undefined;
}

export interface DeathRecord {
  year?: string;
  leading_cause?: string;
  sex?: string;
  race_ethnicity?: string;
  deaths?: string;
  death_rate?: string;
  age_adjusted_death_rate?: string;
}

export interface RestaurantStats {
  totalInspections: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  criticalViolations: number;
  nonCriticalViolations: number;
  inspectionsByBorough: Record<string, number>;
}

export interface MortalityStats {
  totalDeaths: number;
  topCauses: Array<{ cause: string; deaths: number; percentage: number }>;
  deathsByYear: Array<{ year: string; deaths: number }>;
  demographicBreakdown: Array<{ demographic: string; deaths: number; percentage: number }>;
}

/**
 * Fetch restaurant inspections
 */
export async function fetchRestaurantInspections(limit: number = 10000): Promise<RestaurantInspection[]> {
  try {
    const data = await sodaClient.query<RestaurantInspection>(
      RESTAURANT_INSPECTIONS_ENDPOINT,
      `$limit=${limit}&$order=inspection_date DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching restaurant inspections:', error);
    return [];
  }
}

/**
 * Fetch leading causes of death
 */
export async function fetchLeadingCausesOfDeath(limit: number = 10000): Promise<DeathRecord[]> {
  try {
    const data = await sodaClient.query<DeathRecord>(
      LEADING_CAUSES_DEATH_ENDPOINT,
      `$limit=${limit}&$order=year DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching death data:', error);
    return [];
  }
}

/**
 * Calculate restaurant statistics
 */
export function calculateRestaurantStats(inspections: RestaurantInspection[]): RestaurantStats {
  let gradeA = 0;
  let gradeB = 0;
  let gradeC = 0;
  let criticalViolations = 0;
  let nonCriticalViolations = 0;
  const inspectionsByBorough: Record<string, number> = {};

  // Track unique restaurants by grade (latest grade)
  const restaurantGrades = new Map<string, string>();

  inspections.forEach(inspection => {
    const camis = inspection.camis || '';
    const grade = inspection.grade || '';
    const critical = (inspection.critical_flag || '').toUpperCase();
    const borough = inspection.boro || 'UNKNOWN';

    // Track latest grade for each restaurant
    if (grade && camis) {
      if (!restaurantGrades.has(camis) || grade) {
        restaurantGrades.set(camis, grade);
      }
    }

    // Count violations
    if (critical === 'CRITICAL') {
      criticalViolations++;
    } else if (critical === 'NOT CRITICAL') {
      nonCriticalViolations++;
    }

    // Count by borough
    inspectionsByBorough[borough] = (inspectionsByBorough[borough] || 0) + 1;
  });

  // Count grades
  restaurantGrades.forEach(grade => {
    if (grade === 'A') gradeA++;
    else if (grade === 'B') gradeB++;
    else if (grade === 'C') gradeC++;
  });

  return {
    totalInspections: inspections.length,
    gradeA,
    gradeB,
    gradeC,
    criticalViolations,
    nonCriticalViolations,
    inspectionsByBorough,
  };
}

/**
 * Calculate mortality statistics
 */
export function calculateMortalityStats(deathRecords: DeathRecord[]): MortalityStats {
  let totalDeaths = 0;
  const causeData: Record<string, number> = {};
  const yearData: Record<string, number> = {};
  const demographicData: Record<string, number> = {};

  deathRecords.forEach(record => {
    const deaths = parseInt(record.deaths || '0', 10);
    const cause = record.leading_cause || 'Unknown';
    const year = record.year || '';
    const demographic = record.race_ethnicity || 'Unknown';

    totalDeaths += deaths;

    // By cause
    causeData[cause] = (causeData[cause] || 0) + deaths;

    // By year
    if (year) {
      yearData[year] = (yearData[year] || 0) + deaths;
    }

    // By demographic
    demographicData[demographic] = (demographicData[demographic] || 0) + deaths;
  });

  // Top causes
  const topCauses = Object.entries(causeData)
    .map(([cause, deaths]) => ({
      cause,
      deaths,
      percentage: (deaths / totalDeaths) * 100,
    }))
    .sort((a, b) => b.deaths - a.deaths)
    .slice(0, 10);

  // Deaths by year
  const deathsByYear = Object.entries(yearData)
    .map(([year, deaths]) => ({ year, deaths }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Demographic breakdown
  const demographicBreakdown = Object.entries(demographicData)
    .map(([demographic, deaths]) => ({
      demographic,
      deaths,
      percentage: (deaths / totalDeaths) * 100,
    }))
    .sort((a, b) => b.deaths - a.deaths);

  return {
    totalDeaths,
    topCauses,
    deathsByYear,
    demographicBreakdown,
  };
}

