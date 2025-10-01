export interface BusinessAccelerationResponse {
  jobsStats: {
    totalJobs: number;
    jobsThisYear: number;
    jobsLastYear: number;
    jobsGrowth: number;
    jobsGrowthPercentage: number;
  };
  newBusinessStats: {
    totalNewBusinesses: number;
    newBusinessesThisYear: number;
    newBusinessesLastYear: number;
    businessGrowth: number;
    businessGrowthPercentage: number;
  };
  sectorJobs: Array<{
    sector: string;
    jobs: number;
    businesses: number;
    percentage: number;
  }>;
  yearlyJobsTrend: Array<{
    year: number;
    jobs: number;
    businesses: number;
  }>;
  totalBusinesses: number;
  lastUpdated: string;
}

