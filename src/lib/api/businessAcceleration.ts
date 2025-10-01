import { sodaClient } from './sodaClient';

// NYC Business Acceleration endpoint
const BUSINESS_ACCELERATION_ENDPOINT = '9b9u-8989.json';

export interface BusinessEstablishment {
  establishment_record_dba?: string;
  establishment_record_establishment_street?: string;
  establishment_record_establishment_borough?: string;
  establishment_record_business_sector?: string;
  establishment_record_establishment_category?: string;
  establishment_record_type_of_cuisine?: string;
  establishment_record_actual_opening_date?: string;
  number_of_employees?: string;
}

export interface JobsStats {
  totalJobs: number;
  jobsThisYear: number;
  jobsLastYear: number;
  jobsGrowth: number;
  jobsGrowthPercentage: number;
}

export interface NewBusinessStats {
  totalNewBusinesses: number;
  newBusinessesThisYear: number;
  newBusinessesLastYear: number;
  businessGrowth: number;
  businessGrowthPercentage: number;
}

export interface SectorJobs {
  sector: string;
  jobs: number;
  businesses: number;
  percentage: number;
}

/**
 * Fetch business establishments data
 */
export async function fetchBusinessEstablishments(): Promise<BusinessEstablishment[]> {
  try {
    const data = await sodaClient.fetch<BusinessEstablishment>({
      endpoint: BUSINESS_ACCELERATION_ENDPOINT,
      limit: 50000,
    });
    return data;
  } catch (error) {
    console.error('Error fetching business establishments:', error);
    return [];
  }
}

/**
 * Calculate jobs created statistics
 * Uses rolling 12-month period from current date
 */
export function calculateJobsStats(businesses: BusinessEstablishment[]): JobsStats {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  
  let totalJobs = 0;
  let jobsThisYear = 0; // Last 12 months
  let jobsLastYear = 0; // 12 months before that

  businesses.forEach(business => {
    const employees = parseInt(business.number_of_employees || '0', 10);
    totalJobs += employees;

    if (business.establishment_record_actual_opening_date) {
      const openingDate = new Date(business.establishment_record_actual_opening_date);
      
      // Last 12 months (e.g., Oct 2024 - Oct 2025)
      if (openingDate >= oneYearAgo && openingDate <= now) {
        jobsThisYear += employees;
      } 
      // Previous 12 months (e.g., Oct 2023 - Oct 2024)
      else if (openingDate >= twoYearsAgo && openingDate < oneYearAgo) {
        jobsLastYear += employees;
      }
    }
  });

  const jobsGrowth = jobsThisYear - jobsLastYear;
  const jobsGrowthPercentage = jobsLastYear > 0 ? (jobsGrowth / jobsLastYear) * 100 : 0;

  return {
    totalJobs,
    jobsThisYear,
    jobsLastYear,
    jobsGrowth,
    jobsGrowthPercentage,
  };
}

/**
 * Calculate new businesses statistics
 * Uses rolling 12-month period from current date
 */
export function calculateNewBusinessStats(businesses: BusinessEstablishment[]): NewBusinessStats {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  
  let newBusinessesThisYear = 0; // Last 12 months
  let newBusinessesLastYear = 0; // Previous 12 months

  businesses.forEach(business => {
    if (business.establishment_record_actual_opening_date) {
      const openingDate = new Date(business.establishment_record_actual_opening_date);
      
      // Last 12 months
      if (openingDate >= oneYearAgo && openingDate <= now) {
        newBusinessesThisYear++;
      } 
      // Previous 12 months
      else if (openingDate >= twoYearsAgo && openingDate < oneYearAgo) {
        newBusinessesLastYear++;
      }
    }
  });

  const businessGrowth = newBusinessesThisYear - newBusinessesLastYear;
  const businessGrowthPercentage = newBusinessesLastYear > 0 
    ? (businessGrowth / newBusinessesLastYear) * 100 
    : 0;

  return {
    totalNewBusinesses: businesses.length,
    newBusinessesThisYear,
    newBusinessesLastYear,
    businessGrowth,
    businessGrowthPercentage,
  };
}

/**
 * Get jobs by sector
 */
export function getJobsBySector(businesses: BusinessEstablishment[], limit: number = 10): SectorJobs[] {
  const sectorData = businesses.reduce((acc, business) => {
    const sector = business.establishment_record_business_sector || 'Unknown';
    const employees = parseInt(business.number_of_employees || '0', 10);
    
    if (!acc[sector]) {
      acc[sector] = { jobs: 0, businesses: 0 };
    }
    
    acc[sector].jobs += employees;
    acc[sector].businesses++;
    
    return acc;
  }, {} as Record<string, { jobs: number; businesses: number }>);

  const totalJobs = Object.values(sectorData).reduce((sum, data) => sum + data.jobs, 0);

  return Object.entries(sectorData)
    .map(([sector, data]) => ({
      sector,
      jobs: data.jobs,
      businesses: data.businesses,
      percentage: (data.jobs / totalJobs) * 100,
    }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, limit);
}

/**
 * Get yearly jobs trend (2012-2019)
 * Note: Dataset only contains data up to Aug 2019
 */
export function getYearlyJobsTrend(businesses: BusinessEstablishment[]): Array<{ year: number; jobs: number; businesses: number }> {
  const currentYear = 2019; // Dataset ends in 2019
  const startYear = 2012;

  const yearData = businesses.reduce((acc, business) => {
    if (business.establishment_record_actual_opening_date) {
      const year = new Date(business.establishment_record_actual_opening_date).getFullYear();
      
      if (year >= startYear && year <= currentYear) {
        if (!acc[year]) {
          acc[year] = { jobs: 0, businesses: 0 };
        }
        
        const employees = parseInt(business.number_of_employees || '0', 10);
        acc[year].jobs += employees;
        acc[year].businesses++;
      }
    }
    return acc;
  }, {} as Record<number, { jobs: number; businesses: number }>);

  const trend = [];
  for (let year = startYear; year <= currentYear; year++) {
    trend.push({
      year,
      jobs: yearData[year]?.jobs || 0,
      businesses: yearData[year]?.businesses || 0,
    });
  }

  return trend;
}

