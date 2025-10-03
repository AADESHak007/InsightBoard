export interface EnvironmentDataResponse {
  airQualityStats: {
    avgPM25: number;
    avgNO2: number;
    avgOzone: number;
    pollutantsByBorough: Record<string, {
      pm25: number;
      no2: number;
      ozone: number;
    }>;
    totalMeasurements: number;
  };
  treeStats: {
    totalTrees: number;
    aliveTrees: number;
    deadTrees: number;
    goodHealth: number;
    fairHealth: number;
    poorHealth: number;
    treesByBorough: Record<string, number>;
    topSpecies: Array<{
      species: string;
      count: number;
      percentage: number;
    }>;
  };
  ghgEmissionsStats: {
    totalEmissions2023: number;
    totalEmissions2005: number;
    reductionPercent: number;
    reductionTons: number;
    emissionsBySector: Record<string, number>;
    yearlyTrend: Array<{
      year: string;
      emissions: number;
    }>;
  };
  recyclingDiversionStats: {
    currentDiversionRate: number;
    diversionRate2012: number;
    improvementPercent: number;
    totalWasteCollected: number;
    totalRecycled: number;
    yearlyTrend: Array<{
      year: string;
      diversionRate: number;
      totalWaste: number;
      totalRecycled: number;
    }>;
  };
  airQualityTrends: Array<{
    year: string;
    pm25: number;
    no2: number;
    ozone: number;
  }>;
  pm25YearlyTrend: Array<{
    year: string;
    pm25: number;
  }>;
  treeDiameterDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  lastUpdated: string;
}

