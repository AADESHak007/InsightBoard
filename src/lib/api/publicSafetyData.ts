import { sodaClient } from './sodaClient';

// NYPD Complaint Data endpoint
const NYPD_COMPLAINTS_ENDPOINT = 'qgea-i56i.json';

// Motor Vehicle Collisions endpoint
const VEHICLE_COLLISIONS_ENDPOINT = 'h9gi-nx95.json';

export interface CrimeComplaint {
  cmplnt_num?: string;
  cmplnt_fr_dt?: string;
  boro_nm?: string;
  ofns_desc?: string;
  law_cat_cd?: string; // FELONY, MISDEMEANOR, VIOLATION
  pd_desc?: string;
  susp_age_group?: string;
  susp_race?: string;
  vic_age_group?: string;
  latitude?: string;
  longitude?: string;
  [key: string]: string | undefined;
}

export interface VehicleCollision {
  crash_date?: string;
  crash_time?: string;
  borough?: string;
  number_of_persons_injured?: string;
  number_of_persons_killed?: string;
  number_of_pedestrians_injured?: string;
  number_of_pedestrians_killed?: string;
  number_of_cyclist_injured?: string;
  number_of_cyclist_killed?: string;
  number_of_motorist_injured?: string;
  number_of_motorist_killed?: string;
  contributing_factor_vehicle_1?: string;
  vehicle_type_code1?: string;
  [key: string]: string | undefined;
}

export interface CrimeStats {
  totalCrimes: number;
  felonies: number;
  misdemeanors: number;
  violations: number;
  crimesByBorough: Record<string, number>;
  topCrimeTypes: Array<{ type: string; count: number; percentage: number }>;
}

export interface CollisionStats {
  totalCollisions: number;
  totalInjured: number;
  totalKilled: number;
  pedestriansInjured: number;
  pedestriansKilled: number;
  cyclistsInjured: number;
  cyclistsKilled: number;
  collisionsByBorough: Record<string, number>;
  topCauses: Array<{ cause: string; count: number; percentage: number }>;
}

export interface BoroughSafetyData {
  borough: string;
  totalCrimes: number;
  felonies: number;
  misdemeanors: number;
  violations: number;
  totalCollisions: number;
  totalInjured: number;
  totalKilled: number;
  pedestriansInjured: number;
  cyclistsInjured: number;
}

/**
 * Fetch NYPD complaints
 */
export async function fetchNYPDComplaints(limit: number = 10000): Promise<CrimeComplaint[]> {
  try {
    const data = await sodaClient.query<CrimeComplaint>(
      NYPD_COMPLAINTS_ENDPOINT,
      `$limit=${limit}&$order=cmplnt_fr_dt DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching NYPD complaints:', error);
    return [];
  }
}

/**
 * Fetch vehicle collisions
 */
export async function fetchVehicleCollisions(limit: number = 10000): Promise<VehicleCollision[]> {
  try {
    const data = await sodaClient.query<VehicleCollision>(
      VEHICLE_COLLISIONS_ENDPOINT,
      `$limit=${limit}&$order=crash_date DESC`
    );
    return data;
  } catch (error) {
    console.error('Error fetching vehicle collisions:', error);
    return [];
  }
}

/**
 * Calculate crime statistics
 */
export function calculateCrimeStats(complaints: CrimeComplaint[]): CrimeStats {
  let felonies = 0;
  let misdemeanors = 0;
  let violations = 0;
  const crimesByBorough: Record<string, number> = {};
  const crimeTypes: Record<string, number> = {};

  complaints.forEach(complaint => {
    const category = (complaint.law_cat_cd || '').toUpperCase();
    const borough = complaint.boro_nm || 'UNKNOWN';
    const crimeType = complaint.ofns_desc || 'UNKNOWN';

    // Count by category
    if (category === 'FELONY') felonies++;
    else if (category === 'MISDEMEANOR') misdemeanors++;
    else if (category === 'VIOLATION') violations++;

    // Count by borough
    crimesByBorough[borough] = (crimesByBorough[borough] || 0) + 1;

    // Count by type
    crimeTypes[crimeType] = (crimeTypes[crimeType] || 0) + 1;
  });

  const total = complaints.length;
  const topCrimeTypes = Object.entries(crimeTypes)
    .map(([type, count]) => ({
      type,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCrimes: total,
    felonies,
    misdemeanors,
    violations,
    crimesByBorough,
    topCrimeTypes,
  };
}

/**
 * Calculate collision statistics
 */
export function calculateCollisionStats(collisions: VehicleCollision[]): CollisionStats {
  let totalInjured = 0;
  let totalKilled = 0;
  let pedestriansInjured = 0;
  let pedestriansKilled = 0;
  let cyclistsInjured = 0;
  let cyclistsKilled = 0;
  const collisionsByBorough: Record<string, number> = {};
  const causes: Record<string, number> = {};

  collisions.forEach(collision => {
    const borough = collision.borough || 'UNKNOWN';
    const cause = collision.contributing_factor_vehicle_1 || 'UNKNOWN';

    totalInjured += parseInt(collision.number_of_persons_injured || '0', 10);
    totalKilled += parseInt(collision.number_of_persons_killed || '0', 10);
    pedestriansInjured += parseInt(collision.number_of_pedestrians_injured || '0', 10);
    pedestriansKilled += parseInt(collision.number_of_pedestrians_killed || '0', 10);
    cyclistsInjured += parseInt(collision.number_of_cyclist_injured || '0', 10);
    cyclistsKilled += parseInt(collision.number_of_cyclist_killed || '0', 10);

    collisionsByBorough[borough] = (collisionsByBorough[borough] || 0) + 1;
    
    if (cause !== 'UNKNOWN' && cause !== 'Unspecified') {
      causes[cause] = (causes[cause] || 0) + 1;
    }
  });

  const total = collisions.length;
  const topCauses = Object.entries(causes)
    .map(([cause, count]) => ({
      cause,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCollisions: total,
    totalInjured,
    totalKilled,
    pedestriansInjured,
    pedestriansKilled,
    cyclistsInjured,
    cyclistsKilled,
    collisionsByBorough,
    topCauses,
  };
}

/**
 * Get yearly crime trends
 */
export function getYearlyCrimeTrends(complaints: CrimeComplaint[]): Array<{ year: number; crimes: number }> {
  const yearData: Record<number, number> = {};

  complaints.forEach(complaint => {
    if (complaint.cmplnt_fr_dt) {
      const year = new Date(complaint.cmplnt_fr_dt).getFullYear();
      if (year >= 2015 && year <= 2025) {
        yearData[year] = (yearData[year] || 0) + 1;
      }
    }
  });

  const trends = [];
  for (let year = 2015; year <= 2025; year++) {
    trends.push({
      year,
      crimes: yearData[year] || 0,
    });
  }

  return trends;
}

/**
 * Get borough breakdown for safety data
 */
export function getBoroughBreakdown(
  complaints: CrimeComplaint[],
  collisions: VehicleCollision[]
): BoroughSafetyData[] {
  const boroughMap: Record<string, {
    totalCrimes: number;
    felonies: number;
    misdemeanors: number;
    violations: number;
    totalCollisions: number;
    totalInjured: number;
    totalKilled: number;
    pedestriansInjured: number;
    cyclistsInjured: number;
  }> = {};

  // Normalize borough names
  const normalizeBoroughName = (boro?: string): string => {
    if (!boro) return 'Unknown';
    const normalized = boro.trim().toUpperCase();
    if (normalized === 'MANHATTAN' || normalized === '1') return 'Manhattan';
    if (normalized === 'BRONX' || normalized === '2') return 'Bronx';
    if (normalized === 'BROOKLYN' || normalized === '3') return 'Brooklyn';
    if (normalized === 'QUEENS' || normalized === '4') return 'Queens';
    if (normalized === 'STATEN ISLAND' || normalized === '5') return 'Staten Island';
    return boro;
  };

  // Process crime complaints
  complaints.forEach(complaint => {
    const borough = normalizeBoroughName(complaint.boro_nm);
    if (!boroughMap[borough]) {
      boroughMap[borough] = {
        totalCrimes: 0,
        felonies: 0,
        misdemeanors: 0,
        violations: 0,
        totalCollisions: 0,
        totalInjured: 0,
        totalKilled: 0,
        pedestriansInjured: 0,
        cyclistsInjured: 0,
      };
    }

    boroughMap[borough].totalCrimes++;

    const category = complaint.law_cat_cd?.toUpperCase();
    if (category === 'FELONY') boroughMap[borough].felonies++;
    else if (category === 'MISDEMEANOR') boroughMap[borough].misdemeanors++;
    else if (category === 'VIOLATION') boroughMap[borough].violations++;
  });

  // Process collisions
  collisions.forEach(collision => {
    const borough = normalizeBoroughName(collision.borough);
    if (!boroughMap[borough]) {
      boroughMap[borough] = {
        totalCrimes: 0,
        felonies: 0,
        misdemeanors: 0,
        violations: 0,
        totalCollisions: 0,
        totalInjured: 0,
        totalKilled: 0,
        pedestriansInjured: 0,
        cyclistsInjured: 0,
      };
    }

    boroughMap[borough].totalCollisions++;

    const injured = parseInt(collision.number_of_persons_injured || '0', 10);
    const killed = parseInt(collision.number_of_persons_killed || '0', 10);
    const pedestriansInjured = parseInt(collision.number_of_pedestrians_injured || '0', 10);
    const cyclistsInjured = parseInt(collision.number_of_cyclist_injured || '0', 10);

    boroughMap[borough].totalInjured += injured;
    boroughMap[borough].totalKilled += killed;
    boroughMap[borough].pedestriansInjured += pedestriansInjured;
    boroughMap[borough].cyclistsInjured += cyclistsInjured;
  });

  // Convert to array
  return Object.entries(boroughMap)
    .filter(([borough]) => borough !== 'Unknown')
    .map(([borough, data]) => ({
      borough,
      totalCrimes: data.totalCrimes,
      felonies: data.felonies,
      misdemeanors: data.misdemeanors,
      violations: data.violations,
      totalCollisions: data.totalCollisions,
      totalInjured: data.totalInjured,
      totalKilled: data.totalKilled,
      pedestriansInjured: data.pedestriansInjured,
      cyclistsInjured: data.cyclistsInjured,
    }))
    .sort((a, b) => a.borough.localeCompare(b.borough));
}

