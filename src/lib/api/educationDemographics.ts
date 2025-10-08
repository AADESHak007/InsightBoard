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

export interface DetailedEducationStats {
  totalEnrollment: number;
  totalSchools: number;
  studentsWithDisabilities: number;
  disabilitiesPercentage: number;
  englishLanguageLearners: number;
  ellPercentage: number;
  studentsInPoverty: number;
  povertyPercentage: number;
  averageEconomicNeedIndex: number;
  averageSchoolSize: number;
}

export interface RaceEthnicityBreakdown {
  asian: number;
  asianPercentage: number;
  black: number;
  blackPercentage: number;
  hispanic: number;
  hispanicPercentage: number;
  white: number;
  whitePercentage: number;
  other: number;
  otherPercentage: number;
}

export interface GenderBreakdown {
  female: number;
  femalePercentage: number;
  male: number;
  malePercentage: number;
}

export interface EconomicNeedBreakdown {
  averageEconomicNeedIndex: number;
  schoolsWithHighNeed: number;
  schoolsWithHighNeedPercentage: number;
  economicNeedDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface EnrollmentTrend {
  year: string;
  totalEnrollment: number;
  schoolsCount: number;
  averageSchoolSize: number;
}

export interface BoroughBreakdown {
  borough: string;
  totalEnrollment: number;
  schoolsCount: number;
  averageSchoolSize: number;
  studentsWithDisabilities: number;
  disabilitiesPercentage: number;
  englishLanguageLearners: number;
  ellPercentage: number;
  studentsInPoverty: number;
  povertyPercentage: number;
}

/**
 * Fetch school demographics
 */
export async function fetchSchoolDemographics(limit: number = 50000): Promise<SchoolDemographic[]> {
  try {
    const data = await sodaClient.fetch<SchoolDemographic>({
      endpoint: SCHOOL_DEMOGRAPHICS_ENDPOINT,
      limit,
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

/**
 * Calculate detailed demographics statistics
 */
export function calculateDemographicsStats(demographics: SchoolDemographic[]): DetailedEducationStats {
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
    averageSchoolSize: latestRecords.length > 0 ? totalEnrollment / latestRecords.length : 0,
  };
}

/**
 * Get race and ethnicity breakdown with percentages
 */
export function getRaceEthnicityBreakdown(demographics: SchoolDemographic[]): RaceEthnicityBreakdown {
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
  let totalEnrollment = 0;

  latestRecords.forEach(record => {
    const enrollment = parseInt(record.total_enrollment || '0', 10);
    asian += parseInt(record.asian_1 || '0', 10);
    black += parseInt(record.black_1 || '0', 10);
    hispanic += parseInt(record.hispanic_1 || '0', 10);
    white += parseInt(record.white_1 || '0', 10);
    other += parseInt(record.multiple_race_categories_not_represented_1 || '0', 10);
    totalEnrollment += enrollment;
  });

  return {
    asian,
    asianPercentage: totalEnrollment > 0 ? (asian / totalEnrollment) * 100 : 0,
    black,
    blackPercentage: totalEnrollment > 0 ? (black / totalEnrollment) * 100 : 0,
    hispanic,
    hispanicPercentage: totalEnrollment > 0 ? (hispanic / totalEnrollment) * 100 : 0,
    white,
    whitePercentage: totalEnrollment > 0 ? (white / totalEnrollment) * 100 : 0,
    other,
    otherPercentage: totalEnrollment > 0 ? (other / totalEnrollment) * 100 : 0,
  };
}

/**
 * Get gender breakdown with percentages
 */
export function getGenderBreakdown(demographics: SchoolDemographic[]): GenderBreakdown {
  const latestBySchool = new Map<string, SchoolDemographic>();
  
  demographics.forEach(record => {
    const dbn = record.dbn || '';
    const year = record.year || '';
    
    if (!latestBySchool.has(dbn) || year > (latestBySchool.get(dbn)?.year || '')) {
      latestBySchool.set(dbn, record);
    }
  });

  const latestRecords = Array.from(latestBySchool.values());

  let female = 0, male = 0;
  let totalEnrollment = 0;

  latestRecords.forEach(record => {
    const enrollment = parseInt(record.total_enrollment || '0', 10);
    female += parseInt(record.female_1 || '0', 10);
    male += parseInt(record.male_1 || '0', 10);
    totalEnrollment += enrollment;
  });

  return {
    female,
    femalePercentage: totalEnrollment > 0 ? (female / totalEnrollment) * 100 : 0,
    male,
    malePercentage: totalEnrollment > 0 ? (male / totalEnrollment) * 100 : 0,
  };
}

/**
 * Get economic need breakdown with distribution
 */
export function getEconomicNeedBreakdown(demographics: SchoolDemographic[]): EconomicNeedBreakdown {
  const latestBySchool = new Map<string, SchoolDemographic>();
  
  demographics.forEach(record => {
    const dbn = record.dbn || '';
    const year = record.year || '';
    
    if (!latestBySchool.has(dbn) || year > (latestBySchool.get(dbn)?.year || '')) {
      latestBySchool.set(dbn, record);
    }
  });

  const latestRecords = Array.from(latestBySchool.values());

  let economicNeedSum = 0;
  let economicNeedCount = 0;
  let schoolsWithHighNeed = 0;
  let lowNeed = 0, mediumNeed = 0, highNeed = 0;

  latestRecords.forEach(record => {
    const eni = record.economic_need_index;
    
    if (eni && eni !== 'No Data') {
      const eniValue = parseFloat(eni.replace('%', ''));
      if (!isNaN(eniValue)) {
        economicNeedSum += eniValue;
        economicNeedCount++;
        
        if (eniValue >= 70) {
          highNeed++;
          schoolsWithHighNeed++;
        } else if (eniValue >= 40) {
          mediumNeed++;
        } else {
          lowNeed++;
        }
      }
    }
  });

  return {
    averageEconomicNeedIndex: economicNeedCount > 0 ? economicNeedSum / economicNeedCount : 0,
    schoolsWithHighNeed,
    schoolsWithHighNeedPercentage: latestRecords.length > 0 ? (schoolsWithHighNeed / latestRecords.length) * 100 : 0,
    economicNeedDistribution: {
      low: lowNeed,
      medium: mediumNeed,
      high: highNeed,
    },
  };
}

/**
 * Get enrollment trends by year
 */
export function getEnrollmentTrends(demographics: SchoolDemographic[]): EnrollmentTrend[] {
  const yearData = demographics.reduce((acc, record) => {
    const year = record.year || '';
    if (!year) return acc;

    if (!acc[year]) {
      acc[year] = {
        totalEnrollment: 0,
        schoolsCount: 0,
      };
    }

    const enrollment = parseInt(record.total_enrollment || '0', 10);
    if (enrollment > 0) {
      acc[year].totalEnrollment += enrollment;
      acc[year].schoolsCount++;
    }

    return acc;
  }, {} as Record<string, { totalEnrollment: number; schoolsCount: number }>);

  return Object.entries(yearData)
    .map(([year, data]) => ({
      year,
      totalEnrollment: data.totalEnrollment,
      schoolsCount: data.schoolsCount,
      averageSchoolSize: data.schoolsCount > 0 ? data.totalEnrollment / data.schoolsCount : 0,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

/**
 * Get borough breakdown (approximate based on DBN patterns)
 */
export function getBoroughBreakdown(demographics: SchoolDemographic[]): BoroughBreakdown[] {
  const latestBySchool = new Map<string, SchoolDemographic>();
  
  demographics.forEach(record => {
    const dbn = record.dbn || '';
    const year = record.year || '';
    
    if (!latestBySchool.has(dbn) || year > (latestBySchool.get(dbn)?.year || '')) {
      latestBySchool.set(dbn, record);
    }
  });

  const latestRecords = Array.from(latestBySchool.values());

  // Map DBN prefixes to boroughs (NYC DOE DBN system)
  const boroughMap: Record<string, string> = {
    '01': 'Manhattan',
    '02': 'Bronx',
    '03': 'Brooklyn',
    '04': 'Queens',
    '05': 'Staten Island',
    '06': 'Manhattan',
    '07': 'Bronx',
    '08': 'Brooklyn',
    '09': 'Queens',
    '10': 'Staten Island',
    '11': 'Manhattan',
    '12': 'Bronx',
    '13': 'Brooklyn',
    '14': 'Queens',
    '15': 'Staten Island',
    '16': 'Manhattan',
    '17': 'Bronx',
    '18': 'Brooklyn',
    '19': 'Queens',
    '20': 'Staten Island',
    '21': 'Manhattan',
    '22': 'Bronx',
    '23': 'Brooklyn',
    '24': 'Queens',
    '25': 'Staten Island',
    '26': 'Manhattan',
    '27': 'Bronx',
    '28': 'Brooklyn',
    '29': 'Queens',
    '30': 'Staten Island',
    '31': 'Manhattan',
    '32': 'Bronx',
  };

  const boroughData: Record<string, {
    totalEnrollment: number;
    schoolsCount: number;
    studentsWithDisabilities: number;
    englishLanguageLearners: number;
    studentsInPoverty: number;
  }> = {};

  latestRecords.forEach(record => {
    const dbn = record.dbn || '';
    const prefix = dbn.substring(0, 2);
    const borough = boroughMap[prefix] || 'Other';

    if (!boroughData[borough]) {
      boroughData[borough] = {
        totalEnrollment: 0,
        schoolsCount: 0,
        studentsWithDisabilities: 0,
        englishLanguageLearners: 0,
        studentsInPoverty: 0,
      };
    }

    const enrollment = parseInt(record.total_enrollment || '0', 10);
    if (enrollment > 0) {
      boroughData[borough].totalEnrollment += enrollment;
      boroughData[borough].schoolsCount++;
      boroughData[borough].studentsWithDisabilities += parseInt(record.students_with_disabilities_1 || '0', 10);
      boroughData[borough].englishLanguageLearners += parseInt(record.english_language_learners_1 || '0', 10);
      boroughData[borough].studentsInPoverty += parseInt(record.poverty_1 || '0', 10);
    }
  });

  return Object.entries(boroughData)
    .map(([borough, data]) => ({
      borough,
      totalEnrollment: data.totalEnrollment,
      schoolsCount: data.schoolsCount,
      averageSchoolSize: data.schoolsCount > 0 ? data.totalEnrollment / data.schoolsCount : 0,
      studentsWithDisabilities: data.studentsWithDisabilities,
      disabilitiesPercentage: data.totalEnrollment > 0 ? (data.studentsWithDisabilities / data.totalEnrollment) * 100 : 0,
      englishLanguageLearners: data.englishLanguageLearners,
      ellPercentage: data.totalEnrollment > 0 ? (data.englishLanguageLearners / data.totalEnrollment) * 100 : 0,
      studentsInPoverty: data.studentsInPoverty,
      povertyPercentage: data.totalEnrollment > 0 ? (data.studentsInPoverty / data.totalEnrollment) * 100 : 0,
    }))
    .sort((a, b) => b.totalEnrollment - a.totalEnrollment);
}

