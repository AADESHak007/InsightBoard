export interface HealthDataResponse {
  restaurantStats: {
    totalInspections: number;
    gradeA: number;
    gradeB: number;
    gradeC: number;
    criticalViolations: number;
    nonCriticalViolations: number;
    inspectionsByBorough: Record<string, number>;
  };
  mortalityStats: {
    totalDeaths: number;
    topCauses: Array<{
      cause: string;
      deaths: number;
      percentage: number;
    }>;
    deathsByYear: Array<{
      year: string;
      deaths: number;
    }>;
    demographicBreakdown: Array<{
      demographic: string;
      deaths: number;
      percentage: number;
    }>;
  };
  lastUpdated: string;
}

