export interface PublicSafetyDataResponse {
  crimeStats: {
    totalCrimes: number;
    felonies: number;
    misdemeanors: number;
    violations: number;
    crimesByBorough: Record<string, number>;
    topCrimeTypes: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
  };
  collisionStats: {
    totalCollisions: number;
    totalInjured: number;
    totalKilled: number;
    pedestriansInjured: number;
    pedestriansKilled: number;
    cyclistsInjured: number;
    cyclistsKilled: number;
    collisionsByBorough: Record<string, number>;
    topCauses: Array<{
      cause: string;
      count: number;
      percentage: number;
    }>;
  };
  yearlyTrends: Array<{
    year: number;
    crimes: number;
  }>;
  lastUpdated: string;
}

