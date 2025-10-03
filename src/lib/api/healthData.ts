import { sodaClient } from './sodaClient';

// Restaurant Inspection Results endpoint
const RESTAURANT_INSPECTIONS_ENDPOINT = '43nn-pn8j.json';

// Leading Causes of Death endpoint
const LEADING_CAUSES_DEATH_ENDPOINT = 'jb7j-dtam.json';

// NYC Safety Events endpoint
const SAFETY_EVENTS_ENDPOINT = '3vyj-dkjt.json';

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

export interface SafetyEvent {
  name_of_org?: string;
  program?: string;
  address?: string;
  borough?: string;
  zip_code?: string;
  served_by?: string;
  event_date?: string;
  citywide_outreach?: string;
  agedisp?: string;
  head_start_prek?: string;
  hospital_health_care?: string;
  seniors?: string;
  community_site?: string;
  handsondisp1?: string;
  latitude?: string;
  longitude?: string;
  community_board?: string;
  council_district?: string;
  [key: string]: string | undefined;
}

export interface SafetyEventsStats {
  totalEvents: number;
  eventsByYear: Array<{
    year: string;
    totalEvents: number;
    programs: Record<string, number>;
  }>;
  programsByYear: Array<{
    year: string;
    program: string;
    count: number;
  }>;
  topPrograms: Array<{
    program: string;
    count: number;
    percentage: number;
  }>;
  eventsByBorough: Record<string, number>;
  outreachExpansion: {
    currentYear: number;
    previousYear: number;
    growthPercent: number;
  };
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
 * Fetch safety events data
 */
export async function fetchSafetyEvents(limit: number = 50000): Promise<SafetyEvent[]> {
  try {
    const data = await sodaClient.query<SafetyEvent>(
      SAFETY_EVENTS_ENDPOINT,
      `$limit=${limit}&$order=event_date DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching safety events:', error);
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

/**
 * Calculate safety events statistics
 */
export function calculateSafetyEventsStats(events: SafetyEvent[]): SafetyEventsStats {
  const yearData: Record<string, { totalEvents: number; programs: Record<string, number> }> = {};
  const programData: Record<string, number> = {};
  const boroughData: Record<string, number> = {};
  
  let totalEvents = 0;

  events.forEach(event => {
    // Only process events from 2014 onwards (past decade)
    if (!event.event_date) return;
    
    const eventDate = new Date(event.event_date);
    const year = eventDate.getFullYear().toString();
    
    if (eventDate.getFullYear() < 2014) return;

    const program = event.program || 'Unknown';
    const borough = event.borough || 'Unknown';

    // Count by year
    if (!yearData[year]) {
      yearData[year] = { totalEvents: 0, programs: {} };
    }
    yearData[year].totalEvents++;
    yearData[year].programs[program] = (yearData[year].programs[program] || 0) + 1;

    // Count by program
    programData[program] = (programData[program] || 0) + 1;

    // Count by borough
    boroughData[borough] = (boroughData[borough] || 0) + 1;

    totalEvents++;
  });

  // Create events by year
  const eventsByYear = Object.entries(yearData)
    .map(([year, data]) => ({
      year,
      totalEvents: data.totalEvents,
      programs: data.programs,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Create programs by year for trend analysis
  const programsByYear: Array<{ year: string; program: string; count: number }> = [];
  Object.entries(yearData).forEach(([year, data]) => {
    Object.entries(data.programs).forEach(([program, count]) => {
      programsByYear.push({ year, program, count });
    });
  });

  // Top programs
  const topPrograms = Object.entries(programData)
    .map(([program, count]) => ({
      program,
      count,
      percentage: (count / totalEvents) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate outreach expansion (current year vs previous year)
  // Use the most recent complete year vs the year before that
  const currentYear = eventsByYear[eventsByYear.length - 1];
  const previousYear = eventsByYear[eventsByYear.length - 2];
  
  // If current year has very few events (likely incomplete data), use previous year as current
  const isCurrentYearIncomplete = currentYear && currentYear.totalEvents < (previousYear?.totalEvents || 0) * 0.3;
  const effectiveCurrentYear = isCurrentYearIncomplete ? previousYear : currentYear;
  const effectivePreviousYear = isCurrentYearIncomplete ? eventsByYear[eventsByYear.length - 3] : previousYear;
  
  // Debug logging
  console.log('Safety Events Year-over-Year Analysis:', {
    allYears: eventsByYear.map(y => ({ year: y.year, events: y.totalEvents })),
    currentYear: currentYear ? { year: currentYear.year, events: currentYear.totalEvents } : null,
    previousYear: previousYear ? { year: previousYear.year, events: previousYear.totalEvents } : null,
    isCurrentYearIncomplete,
    effectiveCurrentYear: effectiveCurrentYear ? { year: effectiveCurrentYear.year, events: effectiveCurrentYear.totalEvents } : null,
    effectivePreviousYear: effectivePreviousYear ? { year: effectivePreviousYear.year, events: effectivePreviousYear.totalEvents } : null,
  });
  
  const outreachExpansion = {
    currentYear: effectiveCurrentYear?.totalEvents || 0,
    previousYear: effectivePreviousYear?.totalEvents || 0,
    growthPercent: effectivePreviousYear && effectivePreviousYear.totalEvents > 0 
      ? ((effectiveCurrentYear?.totalEvents || 0) - effectivePreviousYear.totalEvents) / effectivePreviousYear.totalEvents * 100
      : 0,
  };

  return {
    totalEvents,
    eventsByYear,
    programsByYear,
    topPrograms,
    eventsByBorough: boroughData,
    outreachExpansion,
  };
}

