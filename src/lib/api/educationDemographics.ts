import { sodaClient } from './sodaClient';

// NYC School Demographics endpoint
const SCHOOL_DEMOGRAPHICS_ENDPOINT = 's52a-8aq6.json';

export interface SchoolDemographic {
  dbn?: string;
  school_name?: string;
  year?: string;
  total_enrollment?: string;
  female_1?: string;
  female_2?: string;
  male_1?: string;
  male_2?: string;
  asian_1?: string;
  asian_2?: string;
  black_1?: string;
  black_2?: string;
  hispanic_1?: string;
  hispanic_2?: string;
  white_1?: string;
  white_2?: string;
  multiple_race_categories_not_represented_1?: string;
  multiple_race_categories_not_represented_2?: string;
  students_with_disabilities_1?: string;
  students_with_disabilities_2?: string;
  english_language_learners_1?: string;
  english_language_learners_2?: string;
  poverty_1?: string;
  poverty_2?: string;
  economic_need_index?: string;
}

export interface EducationStats {
  totalEnrollment: number;
  totalSchools: number;
  studentsWithDisabilities: number;
  disabilitiesPercentage: number;
  englishLanguageLearners: number;
  ellPercentage: number;
  studentsInPoverty: number;
  povertyPercentage: number;
  averageEconomicNeedIndex: number;
}

export interface DemographicBreakdown {
  asian: number;
  black: number;
  hispanic: number;
  white: number;
  other: number;
}

export interface YearlyTrend {
  year: string;
  enrollment: number;
  disabilities: number;
  ell: number;
  poverty: number;
  economicNeedIndex: number;
}

/**
 * Fetch school demographics
 */
export async function fetchSchoolDemographics(): Promise<SchoolDemographic[]> {
  try {
    const data = await sodaClient.fetch<SchoolDemographic>({
      endpoint: SCHOOL_DEMOGRAPHICS_ENDPOINT,
      limit: 50000,
    });
    return data;
  } catch (error) {
    console.error('Error fetching school demographics:', error);
    return [];
  }
}

/**
 * Calculate education statistics (using most recent year data)
 */
export function calculateEducationStats(demographics: SchoolDemographic[]): EducationStats {
  // Group by school and get latest year for each
  const latestBySchool = new Map<string, SchoolDemographic>();
  
  demographics.forEach(record => {
    const dbn = record.dbn || '';
    const year = record.year || '';
    
    if (!latestBySchool.has(dbn) || year > (latestBySchool.get(dbn)?.year || '')) {
      latestBySchool.set(dbn, record);
    }
  });

  const latestRecords = Array.from(latestBySchool.values());

  let totalEnrollment = 0;
  let totalDisabilities = 0;
  let totalELL = 0;
  let totalPoverty = 0;
  let economicNeedSum = 0;
  let economicNeedCount = 0;

  latestRecords.forEach(record => {
    const enrollment = parseInt(record.total_enrollment || '0', 10);
    const disabilities = parseInt(record.students_with_disabilities_1 || '0', 10);
    const ell = parseInt(record.english_language_learners_1 || '0', 10);
    const poverty = parseInt(record.poverty_1 || '0', 10);
    const eni = record.economic_need_index;

    totalEnrollment += enrollment;
    totalDisabilities += disabilities;
    totalELL += ell;
    totalPoverty += poverty;

    if (eni && eni !== 'No Data') {
      const eniValue = parseFloat(eni.replace('%', ''));
      if (!isNaN(eniValue)) {
        economicNeedSum += eniValue;
        economicNeedCount++;
      }
    }
  });

  return {
    totalEnrollment,
    totalSchools: latestRecords.length,
    studentsWithDisabilities: totalDisabilities,
    disabilitiesPercentage: totalEnrollment > 0 ? (totalDisabilities / totalEnrollment) * 100 : 0,
    englishLanguageLearners: totalELL,
    ellPercentage: totalEnrollment > 0 ? (totalELL / totalEnrollment) * 100 : 0,
    studentsInPoverty: totalPoverty,
    povertyPercentage: totalEnrollment > 0 ? (totalPoverty / totalEnrollment) * 100 : 0,
    averageEconomicNeedIndex: economicNeedCount > 0 ? economicNeedSum / economicNeedCount : 0,
  };
}

/**
 * Get demographic breakdown (latest year)
 */
export function getDemographicBreakdown(demographics: SchoolDemographic[]): DemographicBreakdown {
  const latestBySchool = new Map<string, SchoolDemographic>();
  
  demographics.forEach(record => {
    const dbn = record.dbn || '';
    const year = record.year || '';
    
    if (!latestBySchool.has(dbn) || year > (latestBySchool.get(dbn)?.year || '')) {
      latestBySchool.set(dbn, record);
    }
  });

  const latestRecords = Array.from(latestBySchool.values());

  let asian = 0, black = 0, hispanic = 0, white = 0, other = 0;

  latestRecords.forEach(record => {
    asian += parseInt(record.asian_1 || '0', 10);
    black += parseInt(record.black_1 || '0', 10);
    hispanic += parseInt(record.hispanic_1 || '0', 10);
    white += parseInt(record.white_1 || '0', 10);
    other += parseInt(record.multiple_race_categories_not_represented_1 || '0', 10);
  });

  return { asian, black, hispanic, white, other };
}

/**
 * Get yearly trends
 */
export function getYearlyTrends(demographics: SchoolDemographic[]): YearlyTrend[] {
  const yearData = demographics.reduce((acc, record) => {
    const year = record.year || '';
    if (!year) return acc;

    if (!acc[year]) {
      acc[year] = {
        enrollment: 0,
        disabilities: 0,
        ell: 0,
        poverty: 0,
        economicNeedSum: 0,
        economicNeedCount: 0,
      };
    }

    acc[year].enrollment += parseInt(record.total_enrollment || '0', 10);
    acc[year].disabilities += parseInt(record.students_with_disabilities_1 || '0', 10);
    acc[year].ell += parseInt(record.english_language_learners_1 || '0', 10);
    acc[year].poverty += parseInt(record.poverty_1 || '0', 10);

    const eni = record.economic_need_index;
    if (eni && eni !== 'No Data') {
      const eniValue = parseFloat(eni.replace('%', ''));
      if (!isNaN(eniValue)) {
        acc[year].economicNeedSum += eniValue;
        acc[year].economicNeedCount++;
      }
    }

    return acc;
  }, {} as Record<string, { enrollment: number; disabilities: number; ell: number; poverty: number; economicNeedSum: number; economicNeedCount: number }>);

  return Object.entries(yearData)
    .map(([year, data]) => ({
      year,
      enrollment: data.enrollment,
      disabilities: data.disabilities,
      ell: data.ell,
      poverty: data.poverty,
      economicNeedIndex: data.economicNeedCount > 0 
        ? data.economicNeedSum / data.economicNeedCount 
        : 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

