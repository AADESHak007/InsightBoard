export interface HousingDataResponse {
  permitStats: {
    totalPermits: number;
    newBuilding: number;
    alteration: number;
    demolition: number;
    permitsByBorough: Record<string, number>;
  };
  violationStats: {
    totalViolations: number;
    openViolations: number;
    closedViolations: number;
    classA: number;
    classB: number;
    classC: number;
    violationsByBorough: Record<string, number>;
  };
  yearlyTrends: Array<{
    year: number;
    permits: number;
  }>;
  correlation: Array<{
    borough: string;
    permits: number;
    violations: number;
    ratio: number;
  }>;
  lastUpdated: string;
}

