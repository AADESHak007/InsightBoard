import { sodaClient } from './sodaClient';

// SBS Certified Business List endpoint
const CERTIFIED_BUSINESS_ENDPOINT = 'ci93-uc8s.json';

export interface CertifiedBusiness {
  account_number?: string;
  vendor_formal_name?: string;
  vendor_dba?: string;
  telephone?: string;
  business_description?: string;
  certification?: string;
  cert_renewal_date?: string;
  ethnicity?: string;
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  date_of_establishment?: string;
  naics_sector?: string;
  naics_subsector?: string;
  naics_title?: string;
  borough?: string;
  latitude?: string;
  longitude?: string;
}

export interface BusinessStats {
  total: number;
  mbe: number;
  wbe: number;
  dbe: number;
  mwbe: number;
  growthRate?: number;
}

export interface BoroughBreakdown {
  borough: string;
  count: number;
  percentage: number;
}

export interface EthnicityBreakdown {
  ethnicity: string;
  count: number;
  percentage: number;
}

export interface SectorBreakdown {
  sector: string;
  count: number;
  percentage: number;
}

export interface YearlyGrowth {
  year: number;
  count: number;
  cumulative: number;
}

/**
 * Fetch all certified businesses
 */
export async function fetchCertifiedBusinesses(): Promise<CertifiedBusiness[]> {
  try {
    const data = await sodaClient.fetch<CertifiedBusiness>({
      endpoint: CERTIFIED_BUSINESS_ENDPOINT,
      limit: 50000,
    });
    return data;
  } catch (error) {
    console.error('Error fetching certified businesses:', error);
    return [];
  }
}

/**
 * Calculate business statistics
 */
export function calculateBusinessStats(businesses: CertifiedBusiness[]): BusinessStats {
  const mbe = businesses.filter(b => 
    b.certification?.includes('MBE')
  ).length;
  
  const wbe = businesses.filter(b => 
    b.certification?.includes('WBE')
  ).length;
  
  const dbe = businesses.filter(b => 
    b.certification?.includes('DBE')
  ).length;
  
  const mwbe = businesses.filter(b => 
    b.certification?.includes('MBE') && b.certification?.includes('WBE')
  ).length;

  return {
    total: businesses.length,
    mbe,
    wbe,
    dbe,
    mwbe,
  };
}

/**
 * Get borough breakdown
 */
export function getBoroughBreakdown(businesses: CertifiedBusiness[]): BoroughBreakdown[] {
  const boroughCounts = businesses.reduce((acc, business) => {
    const borough = business.borough || 'UNKNOWN';
    acc[borough] = (acc[borough] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = businesses.length;

  return Object.entries(boroughCounts)
    .map(([borough, count]) => ({
      borough,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get ethnicity breakdown
 */
export function getEthnicityBreakdown(businesses: CertifiedBusiness[]): EthnicityBreakdown[] {
  const ethnicityCounts = businesses.reduce((acc, business) => {
    const ethnicity = business.ethnicity || 'UNKNOWN';
    acc[ethnicity] = (acc[ethnicity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = businesses.length;

  return Object.entries(ethnicityCounts)
    .map(([ethnicity, count]) => ({
      ethnicity,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get sector breakdown
 */
export function getSectorBreakdown(businesses: CertifiedBusiness[], limit: number = 10): SectorBreakdown[] {
  const sectorCounts = businesses.reduce((acc, business) => {
    const sector = business.naics_sector || 'UNKNOWN';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = businesses.length;

  return Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      sector,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate yearly growth
 * Shows businesses established each year for trend analysis
 */
export function getYearlyGrowth(businesses: CertifiedBusiness[]): YearlyGrowth[] {
  const currentYear = new Date().getFullYear();
  const startYear = 2015; // Start from 2015 for better data

  const yearCounts = businesses.reduce((acc, business) => {
    if (business.date_of_establishment) {
      const year = new Date(business.date_of_establishment).getFullYear();
      if (year >= startYear && year <= currentYear) {
        acc[year] = (acc[year] || 0) + 1;
      }
    }
    return acc;
  }, {} as Record<number, number>);

  const growthData: YearlyGrowth[] = [];
  let cumulative = 0;

  for (let year = startYear; year <= currentYear; year++) {
    const count = yearCounts[year] || 0;
    cumulative += count;
    growthData.push({
      year,
      count,
      cumulative,
    });
  }

  return growthData;
}

/**
 * Calculate growth rate (average annual growth over last 5 years)
 * More reliable than year-over-year which can be volatile
 */
export function calculateGrowthRate(yearlyGrowth: YearlyGrowth[]): number {
  if (yearlyGrowth.length < 6) return 0;

  // Get last 5 complete years of data
  const recentYears = yearlyGrowth.slice(-6); // Last 6 entries for 5-year comparison
  const firstYear = recentYears[0];
  const lastYear = recentYears[recentYears.length - 1];

  if (firstYear.cumulative === 0) return 0;

  // Calculate average annual growth rate over 5 years
  const totalGrowth = lastYear.cumulative - firstYear.cumulative;
  const years = recentYears.length - 1;
  const averageAnnualGrowth = (totalGrowth / firstYear.cumulative / years) * 100;

  return averageAnnualGrowth;
}

