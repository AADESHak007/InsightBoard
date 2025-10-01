import { sodaClient } from './sodaClient';

// DOB Permit Issuance endpoint
const DOB_PERMITS_ENDPOINT = 'ipu4-2q9a.json';

// Housing Maintenance Code Violations endpoint
const HOUSING_VIOLATIONS_ENDPOINT = 'wvxf-dwi5.json';

export interface DOBPermit {
  borough?: string;
  bin__?: string;
  house__?: string;
  street_name?: string;
  job_type?: string;
  work_type?: string;
  permit_status?: string;
  filing_date?: string;
  issuance_date?: string;
  job_start_date?: string;
  [key: string]: string | undefined;
}

export interface HousingViolation {
  violationid?: string;
  buildingid?: string;
  boro?: string;
  housenumber?: string;
  streetname?: string;
  zip?: string;
  apartment?: string;
  class?: string; // A, B, C - severity
  inspectiondate?: string;
  currentstatus?: string;
  violationstatus?: string; // Open, Close
  rentimpairing?: string; // Y/N
  novdescription?: string;
  block?: string;
  lot?: string;
  [key: string]: string | undefined;
}

export interface PermitStats {
  totalPermits: number;
  newBuilding: number;
  alteration: number;
  demolition: number;
  permitsByBorough: Record<string, number>;
}

export interface ViolationStats {
  totalViolations: number;
  openViolations: number;
  closedViolations: number;
  classA: number; // Non-hazardous
  classB: number; // Hazardous
  classC: number; // Immediately hazardous
  violationsByBorough: Record<string, number>;
}

/**
 * Fetch DOB permits (limited to recent data for performance)
 */
export async function fetchDOBPermits(limit: number = 10000): Promise<DOBPermit[]> {
  try {
    const data = await sodaClient.query<DOBPermit>(
      DOB_PERMITS_ENDPOINT,
      `$limit=${limit}&$order=issuance_date DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching DOB permits:', error);
    return [];
  }
}

/**
 * Fetch housing violations (limited to recent data)
 */
export async function fetchHousingViolations(limit: number = 10000): Promise<HousingViolation[]> {
  try {
    const data = await sodaClient.query<HousingViolation>(
      HOUSING_VIOLATIONS_ENDPOINT,
      `$limit=${limit}&$order=inspectiondate DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching housing violations:', error);
    return [];
  }
}

/**
 * Calculate permit statistics
 */
export function calculatePermitStats(permits: DOBPermit[]): PermitStats {
  let newBuilding = 0;
  let alteration = 0;
  let demolition = 0;
  const permitsByBorough: Record<string, number> = {};

  permits.forEach(permit => {
    const jobType = (permit.job_type || '').toUpperCase();
    const borough = permit.borough || 'UNKNOWN';

    // Count by job type
    if (jobType.includes('NEW BUILDING') || jobType.includes('NB')) {
      newBuilding++;
    } else if (jobType.includes('ALTERATION') || jobType.includes('ALT')) {
      alteration++;
    } else if (jobType.includes('DEMOLITION') || jobType.includes('DM')) {
      demolition++;
    }

    // Count by borough
    permitsByBorough[borough] = (permitsByBorough[borough] || 0) + 1;
  });

  return {
    totalPermits: permits.length,
    newBuilding,
    alteration,
    demolition,
    permitsByBorough,
  };
}

/**
 * Calculate violation statistics
 */
export function calculateViolationStats(violations: HousingViolation[]): ViolationStats {
  let openViolations = 0;
  let closedViolations = 0;
  let classA = 0;
  let classB = 0;
  let classC = 0;
  const violationsByBorough: Record<string, number> = {};

  violations.forEach(violation => {
    const status = (violation.violationstatus || '').toUpperCase();
    const vClass = violation.class || '';
    const borough = violation.boro || 'UNKNOWN';

    // Count by status
    if (status === 'OPEN') {
      openViolations++;
    } else if (status === 'CLOSE') {
      closedViolations++;
    }

    // Count by class
    if (vClass === 'A') classA++;
    else if (vClass === 'B') classB++;
    else if (vClass === 'C') classC++;

    // Count by borough
    violationsByBorough[borough] = (violationsByBorough[borough] || 0) + 1;
  });

  return {
    totalViolations: violations.length,
    openViolations,
    closedViolations,
    classA,
    classB,
    classC,
    violationsByBorough,
  };
}

/**
 * Get yearly permit trends
 */
export function getYearlyPermitTrends(permits: DOBPermit[]): Array<{ year: number; permits: number }> {
  const yearData: Record<number, number> = {};

  permits.forEach(permit => {
    if (permit.issuance_date) {
      const year = new Date(permit.issuance_date).getFullYear();
      if (year >= 2015 && year <= 2025) {
        yearData[year] = (yearData[year] || 0) + 1;
      }
    }
  });

  const trends = [];
  for (let year = 2015; year <= 2025; year++) {
    trends.push({
      year,
      permits: yearData[year] || 0,
    });
  }

  return trends;
}

/**
 * Correlation analysis: Permits vs Violations by Borough
 */
export function getPermitViolationCorrelation(
  permits: DOBPermit[],
  violations: HousingViolation[]
): Array<{ borough: string; permits: number; violations: number; ratio: number }> {
  const permitStats = calculatePermitStats(permits);
  const violationStats = calculateViolationStats(violations);

  const boroughs = new Set([
    ...Object.keys(permitStats.permitsByBorough),
    ...Object.keys(violationStats.violationsByBorough),
  ]);

  return Array.from(boroughs)
    .map(borough => {
      const permitCount = permitStats.permitsByBorough[borough] || 0;
      const violationCount = violationStats.violationsByBorough[borough] || 0;
      const ratio = permitCount > 0 ? violationCount / permitCount : 0;

      return {
        borough,
        permits: permitCount,
        violations: violationCount,
        ratio, // Violations per permit (lower is better)
      };
    })
    .filter(b => b.borough !== 'UNKNOWN')
    .sort((a, b) => b.permits - a.permits);
}

