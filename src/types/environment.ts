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
  airQualityTrends: Array<{
    year: string;
    pm25: number;
    no2: number;
    ozone: number;
  }>;
  treeDiameterDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  lastUpdated: string;
}

