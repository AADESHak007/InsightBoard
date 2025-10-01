export interface BusinessOverviewResponse {
  stats: {
    total: number;
    mbe: number;
    wbe: number;
    dbe: number;
    mwbe: number;
    growthRate: number;
  };
  breakdowns: {
    boroughs: Array<{
      borough: string;
      count: number;
      percentage: number;
    }>;
    ethnicity: Array<{
      ethnicity: string;
      count: number;
      percentage: number;
    }>;
    sectors: Array<{
      sector: string;
      count: number;
      percentage: number;
    }>;
  };
  growth: Array<{
    year: number;
    count: number;
    cumulative: number;
  }>;
  lastUpdated: string;
}

export interface BoroughDataResponse {
  boroughs: Array<{
    borough: string;
    count: number;
    percentage: number;
  }>;
  total: number;
  lastUpdated: string;
}

