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
  safetyEventsStats: {
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
  };
  lastUpdated: string;
}

