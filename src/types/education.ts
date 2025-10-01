export interface EducationDemographicsResponse {
  stats: {
    totalEnrollment: number;
    totalSchools: number;
    studentsWithDisabilities: number;
    disabilitiesPercentage: number;
    englishLanguageLearners: number;
    ellPercentage: number;
    studentsInPoverty: number;
    povertyPercentage: number;
    averageEconomicNeedIndex: number;
  };
  demographicBreakdown: {
    asian: number;
    black: number;
    hispanic: number;
    white: number;
    other: number;
  };
  yearlyTrends: Array<{
    year: string;
    enrollment: number;
    disabilities: number;
    ell: number;
    poverty: number;
    economicNeedIndex: number;
  }>;
  totalRecords: number;
  lastUpdated: string;
}

