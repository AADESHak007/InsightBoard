export interface TransportationDataResponse {
  fhvStats: {
    totalVehicles: number;
    activeVehicles: number;
    wheelchairAccessible: number;
    vehiclesByType: Record<string, number>;
    vehiclesByYear: Record<string, number>;
    topBases: Array<{ name: string; vehicles: number }>;
  };
  taxiStats: {
    totalTrips: number;
    totalRevenue: number;
    avgFare: number;
    avgTripDistance: number;
    avgPassengers: number;
    totalTips: number;
    avgTipAmount: number;
    cashPayments: number;
    cardPayments: number;
    tripsByHour: Record<string, number>;
    topPickupZones: Array<{ zone: string; zoneName: string; trips: number }>;
    topDropoffZones: Array<{ zone: string; zoneName: string; trips: number }>;
    tripsByBorough: Record<string, number>;
    shortTrips: number;
    mediumTrips: number;
    longTrips: number;
  };
  subwayPerformanceStats: {
    yearlyTrend: Array<{ year: string; onTimePerformance: number; totalTrips: number; onTimeTrips: number }>;
    currentYearPerformance: number;
    bestYear: { year: string; performance: number };
    worstYear: { year: string; performance: number };
    performanceImprovement: number;
    averagePerformance: number;
    performanceByDivision: Array<{ division: string; performance: number; totalTrips: number }>;
    performanceByLine: Array<{ line: string; performance: number; totalTrips: number }>;
    peakPerformanceYear: { year: string; performance: number };
    recentTrend: 'improving' | 'declining' | 'stable';
  };
  hourlyDemand: Array<{
    hour: number;
    trips: number;
    avgFare: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  lastUpdated: string;
}

