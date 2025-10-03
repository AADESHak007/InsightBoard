'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import { useEducationData } from '@/hooks/useEducationData';
import { useHousingData } from '@/hooks/useHousingData';
import { useHealthData } from '@/hooks/useHealthData';
import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import { useTransportationData } from '@/hooks/useTransportationData';
import CompactMetricCard from './CompactMetricCard';
import { Indicator } from '@/types/indicator';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AllInsights() {
  const business = useBusinessData();
  const acceleration = useBusinessAcceleration();
  const education = useEducationData();
  const housing = useHousingData();
  const health = useHealthData();
  const safety = usePublicSafetyData();
  const environment = useEnvironmentData();
  const transportation = useTransportationData();

  const isLoading = business.loading || acceleration.loading || education.loading || 
                    housing.loading || health.loading || safety.loading || 
                    environment.loading || transportation.loading;

  const handleRefreshAll = () => {
    business.refetch();
    acceleration.refetch();
    education.refetch();
    housing.refetch();
    health.refetch();
    safety.refetch();
    environment.refetch();
    transportation.refetch();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-3 sm:p-4 animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-[#1f2937] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const indicators: Indicator[] = [];

  // Business Indicators
  if (business.data) {
    const growthRate = business.data.stats.growthRate || 0;
    indicators.push(
      {
        id: 'all-business-1',
        title: 'Total Certified Businesses',
        category: 'Business',
        description: 'Total MBE/WBE certified businesses in NYC.',
        value: business.data.stats.total,
        unit: 'businesses',
        lastUpdate: new Date(business.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC SBS',
        trend: growthRate > 0 ? 'up' : 'stable',
        color: '#f59e0b',
        higherIsBetter: true,
        explanation: 'Tracks the total count of minority and women-owned business enterprises certified by NYC, indicating economic diversity and inclusion.',
      },
      {
        id: 'all-business-2',
        title: 'Business Growth Rate',
        category: 'Business',
        description: 'Year-over-year growth in certified businesses.',
        value: Math.round(growthRate * 10) / 10,
        unit: '%',
        lastUpdate: new Date(business.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC SBS',
        color: '#10b981',
        higherIsBetter: true,
        explanation: 'Measures the rate of business certification growth, indicating economic expansion and entrepreneurial activity.',
      }
    );
  }

  // Business Acceleration
  if (acceleration.data) {
    indicators.push({
      id: 'all-business-3',
      title: 'Jobs Created (2012-2019)',
      category: 'Business',
      description: 'Total jobs created through NYC Business Acceleration program.',
      value: acceleration.data.jobsStats.totalJobs,
      unit: 'jobs',
      lastUpdate: '2019-08-08',
      source: 'NYC SBS',
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'Measures employment opportunities generated through city business development initiatives, reflecting economic growth and job market expansion.',
    });
  }

  // Education Indicators
  if (education.data) {
    const latestYearData = education.data.yearlyTrends[education.data.yearlyTrends.length - 1];
    const enrollmentGrowth = education.data.yearlyTrends.length > 1 
      ? ((latestYearData.enrollment - education.data.yearlyTrends[0].enrollment) / education.data.yearlyTrends[0].enrollment) * 100
      : 0;
    
    indicators.push(
      {
        id: 'all-education-1',
        title: 'Total Student Enrollment',
        category: 'Education',
        description: 'Total students enrolled in NYC public schools.',
        value: education.data.stats.totalEnrollment,
        unit: 'students',
        lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOE',
        color: '#3b82f6',
        higherIsBetter: true,
        explanation: 'Represents the total number of children accessing public education, indicating the scale of the education system and youth population.',
      },
      {
        id: 'all-education-2',
        title: 'Students with Disabilities',
        category: 'Education',
        description: 'Percentage of students requiring special education services.',
        value: Math.round(education.data.stats.disabilitiesPercentage * 10) / 10,
        unit: '%',
        target: 20,
        targetCondition: '<=',
        lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOE',
        trend: 'stable',
        color: '#ec4899',
        higherIsBetter: true,
        explanation: 'Share of students receiving special education services. This metric tracks accessibility and support for students with diverse learning needs.',
      },
      {
        id: 'all-education-3',
        title: 'Economic Need Index',
        category: 'Education',
        description: 'Average Economic Need Index across all schools (higher = more need).',
        value: Math.round(education.data.stats.averageEconomicNeedIndex * 10) / 10,
        unit: '%',
        target: 70,
        targetCondition: '<=',
        lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOE',
        trend: 'stable',
        color: '#f59e0b',
        higherIsBetter: false,
        explanation: 'Composite measure of student economic disadvantage. Lower index means less poverty, better housing stability, and improved family economic security.',
      },
      {
        id: 'all-education-4',
        title: 'Enrollment Growth',
        category: 'Education',
        description: 'Percentage change in student enrollment over time.',
        value: Math.round(enrollmentGrowth * 10) / 10,
        unit: '%',
        lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOE',
        trend: enrollmentGrowth > 0 ? 'up' : 'stable',
        color: '#10b981',
        higherIsBetter: true,
        explanation: 'Growth in student enrollment indicates population growth, increased school access, and confidence in public education system.',
      }
    );
  }

  // Housing Indicators
  if (housing.data) {
    const latestYearData = housing.data.affordableHousingStats.yearlyTrend[housing.data.affordableHousingStats.yearlyTrend.length - 1];
    
    indicators.push(
      {
        id: 'all-housing-1',
        title: 'Affordable Housing Units Created/Preserved',
        category: 'Housing',
        description: 'Track number of affordable units delivered per year - Mayor\'s housing promise vs. delivery.',
        value: latestYearData ? latestYearData.affordableUnits : 0,
        unit: 'units',
        target: 20000,
        targetCondition: '>=',
        lastUpdate: new Date(housing.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC HPD',
        color: '#10b981',
        higherIsBetter: true,
        explanation: 'Mayor\'s housing promise vs. delivery. NYC has created/preserved affordable housing units through various programs, demonstrating commitment to housing affordability and addressing the city\'s housing crisis.',
      },
      {
        id: 'all-housing-2',
        title: 'Building Permits (2024)',
        category: 'Housing',
        description: 'Total new building permits issued in NYC.',
        value: housing.data.permitStats.totalPermits,
        unit: 'permits',
        lastUpdate: new Date(housing.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOB',
        color: '#8b5cf6',
        higherIsBetter: true,
        explanation: 'Indicates new construction activity and housing development, reflecting real estate growth and urban expansion.',
      },
      {
        id: 'all-housing-3',
        title: 'Open Violations',
        category: 'Housing',
        description: 'Housing violations currently open and requiring attention.',
        value: housing.data.violationStats.totalViolations,
        unit: 'violations',
        target: 3000,
        targetCondition: '<=',
        lastUpdate: new Date(housing.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC HPD',
        color: '#ef4444',
        higherIsBetter: false,
        explanation: 'Unresolved housing issues currently impacting residents. Fewer open violations mean faster resolution and better tenant protection.',
      },
      {
        id: 'all-housing-4',
        title: 'Violation Closure Rate',
        category: 'Housing',
        description: 'Percentage of violations that have been resolved.',
        value: Math.round((housing.data.violationStats.closedViolations / housing.data.violationStats.totalViolations) * 100 * 10) / 10,
        unit: '%',
        target: 70,
        targetCondition: '>=',
        lastUpdate: new Date(housing.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC HPD',
        color: '#22c55e',
        higherIsBetter: true,
        explanation: 'Efficiency of addressing and fixing housing violations. Higher rates indicate effective enforcement and landlord responsiveness.',
      }
    );
  }

  // Health Indicators
  if (health.data) {
    const gradeAPercent = health.data.restaurantStats.totalInspections > 0
      ? (health.data.restaurantStats.gradeA / health.data.restaurantStats.totalInspections) * 100
      : 0;
    
    const currentYearEvents = health.data.safetyEventsStats.outreachExpansion.currentYear;
    const previousYearEvents = health.data.safetyEventsStats.outreachExpansion.previousYear;
    const growthPercent = health.data.safetyEventsStats.outreachExpansion.growthPercent;
    
    indicators.push(
      {
        id: 'all-health-1',
        title: 'Total Safety Events (Current Year)',
        category: 'Health',
        description: 'Total safety outreach events conducted this year.',
        value: currentYearEvents,
        unit: 'events',
        target: previousYearEvents,
        targetCondition: '>=',
        lastUpdate: new Date(health.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC Safety Events',
        trend: growthPercent > 0 ? 'up' : 'stable',
        color: '#10b981',
        higherIsBetter: true,
        explanation: 'Show if outreach efforts are expanding or shrinking across administrations. More events indicate increased public safety engagement and community outreach programs.',
      },
      {
        id: 'all-health-2',
        title: 'Safety Events Growth',
        category: 'Health',
        description: 'Year-over-year growth in safety outreach events.',
        value: Math.round(growthPercent * 10) / 10,
        unit: '%',
        target: 5,
        targetCondition: '>=',
        lastUpdate: new Date(health.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC Safety Events',
        trend: growthPercent >= 5 ? 'up' : 'stable',
        color: '#8b5cf6',
        higherIsBetter: true,
        explanation: 'Growth in safety outreach programs indicates expanding public safety initiatives and increased community engagement efforts.',
      },
      {
        id: 'all-health-3',
        title: 'Restaurant Grade A Rate',
        category: 'Health',
        description: 'Percentage of restaurants receiving Grade A rating.',
        value: Math.round(gradeAPercent * 10) / 10,
        unit: '%',
        target: 85,
        targetCondition: '>=',
        lastUpdate: new Date(health.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOHMH',
        trend: gradeAPercent >= 85 ? 'up' : 'stable',
        color: '#22c55e',
        higherIsBetter: true,
        explanation: 'Measures food safety compliance across NYC restaurants. Grade A means excellent sanitation, protecting public health.',
      },
      {
        id: 'all-health-4',
        title: 'Critical Violations',
        category: 'Health',
        description: 'Food safety violations requiring immediate attention.',
        value: health.data.mortalityStats.topCauses.find(c => c.cause.includes('Critical'))?.deaths || 0,
        unit: 'violations',
        target: 2000,
        targetCondition: '<=',
        lastUpdate: new Date(health.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOHMH',
        color: '#ef4444',
        higherIsBetter: false,
        explanation: 'Serious health hazards found during inspections. Lower numbers mean safer food handling and reduced public health risks.',
      }
    );
  }

  // Public Safety Indicators
  if (safety.data) {
    indicators.push(
      {
        id: 'all-safety-1',
        title: 'Crime Incidents (Recent)',
        category: 'Public Safety',
        description: 'Total crime complaints reported to NYPD (last 10,000 records).',
        value: safety.data.crimeStats.totalCrimes,
        unit: 'incidents',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#dc2626',
        higherIsBetter: false,
        explanation: 'Total reported criminal incidents in the city. Lower crime rates indicate safer neighborhoods and improved public safety.',
      },
      {
        id: 'all-safety-2',
        title: 'Felony Crimes',
        category: 'Public Safety',
        description: 'Serious crimes including murder, assault, robbery, burglary.',
        value: safety.data.crimeStats.felonies,
        unit: 'felonies',
        target: 3000,
        targetCondition: '<=',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#ef4444',
        higherIsBetter: false,
        explanation: 'Most serious criminal offenses with severe penalties. Lower counts mean reduced violent crime and enhanced community safety.',
      },
      {
        id: 'all-safety-3',
        title: 'Traffic Collisions',
        category: 'Public Safety',
        description: 'Motor vehicle crashes reported (last 10,000 records).',
        value: safety.data.collisionStats.totalCollisions,
        unit: 'crashes',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#f59e0b',
        higherIsBetter: false,
        explanation: 'Traffic accidents across NYC streets. Fewer collisions indicate safer road conditions and better traffic safety measures.',
      },
      {
        id: 'all-safety-4',
        title: 'Traffic Injuries',
        category: 'Public Safety',
        description: 'Total people injured in motor vehicle collisions.',
        value: safety.data.collisionStats.totalInjured,
        unit: 'injuries',
        target: 6000,
        targetCondition: '<=',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#f97316',
        higherIsBetter: false,
        explanation: 'People harmed in traffic crashes. Lower injury counts mean safer transportation and effective Vision Zero initiatives.',
      },
      {
        id: 'all-safety-5',
        title: 'Traffic Fatalities',
        category: 'Public Safety',
        description: 'Lives lost in motor vehicle crashes (Vision Zero target: 0).',
        value: safety.data.collisionStats.totalKilled,
        unit: 'deaths',
        target: 50,
        targetCondition: '<=',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#dc2626',
        higherIsBetter: false,
        explanation: 'Lives lost on NYC streets. Every reduction brings us closer to Vision Zero goal of eliminating traffic deaths entirely.',
      },
      {
        id: 'all-safety-6',
        title: 'Pedestrian Casualties',
        category: 'Public Safety',
        description: 'Pedestrians killed or injured in traffic incidents.',
        value: safety.data.collisionStats.pedestriansInjured + safety.data.collisionStats.pedestriansKilled,
        unit: 'casualties',
        target: 774,
        targetCondition: '<=',
        lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYPD',
        color: '#ec4899',
        higherIsBetter: false,
        explanation: 'Pedestrians harmed in traffic crashes. Lower numbers indicate safer streets and improved pedestrian infrastructure.',
      }
    );
  }

  // Environment Indicators
  if (environment.data) {
    const treeHealthPercent = environment.data.treeStats.totalTrees > 0
      ? (environment.data.treeStats.goodHealth / environment.data.treeStats.totalTrees) * 100
      : 0;
    
    // Calculate PM2.5 trend for insight
    const pm25Trend = environment.data.pm25YearlyTrend;
    const currentPM25 = pm25Trend.length > 0 ? pm25Trend[pm25Trend.length - 1].pm25 : 0;
    const firstPM25 = pm25Trend.length > 0 ? pm25Trend[0].pm25 : 0;
    const pm25Improvement = firstPM25 > 0 ? ((firstPM25 - currentPM25) / firstPM25) * 100 : 0;
    
    indicators.push(
      {
        id: 'all-environment-1',
        title: 'Air Quality Index (PM2.5)',
        category: 'Environment',
        description: 'Fine particulate matter levels - decade-long improvement trend.',
        value: Math.round(currentPM25 * 10) / 10,
        unit: 'μg/m³',
        target: 10,
        targetCondition: '<=',
        lastUpdate: new Date(environment.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DEP',
        trend: pm25Improvement > 10 ? 'down' : 'stable',
        color: '#84cc16',
        higherIsBetter: false,
        explanation: 'Air quality improvement under city initiatives. PM2.5 levels have decreased over the decade, showing successful environmental policies and cleaner air.',
      },
      {
        id: 'all-environment-2',
        title: 'Greenhouse Gas Emissions',
        category: 'Environment',
        description: 'Citywide CO2e emissions reduction - climate action policy impact.',
        value: environment.data.ghgEmissionsStats.reductionPercent,
        unit: '%',
        target: 20,
        targetCondition: '>=',
        lastUpdate: new Date(environment.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DEP',
        trend: environment.data.ghgEmissionsStats.reductionPercent >= 20 ? 'down' : 'stable',
        color: '#06b6d4',
        higherIsBetter: false,
        explanation: 'Climate action policy impact. NYC has achieved significant greenhouse gas emissions reduction through clean energy initiatives, building efficiency programs, and sustainable transportation policies.',
      },
      {
        id: 'all-environment-3',
        title: 'Recycling Diversion Rate',
        category: 'Environment',
        description: 'Share of waste recycled vs. landfill - environmental sustainability culture shift.',
        value: environment.data.recyclingDiversionStats.currentDiversionRate,
        unit: '%',
        target: 25,
        targetCondition: '>=',
        lastUpdate: new Date(environment.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DSNY',
        trend: environment.data.recyclingDiversionStats.improvementPercent > 10 ? 'up' : 'stable',
        color: '#10b981',
        higherIsBetter: true,
        explanation: 'Environmental sustainability culture shift. NYC has improved waste diversion through expanded recycling programs, composting initiatives, and public education campaigns promoting sustainable waste management practices.',
      },
      {
        id: 'all-environment-4',
        title: 'Street Tree Health',
        category: 'Environment',
        description: 'Percentage of street trees in good health condition.',
        value: Math.round(treeHealthPercent * 10) / 10,
        unit: '%',
        target: 70,
        targetCondition: '>=',
        lastUpdate: '2015-08-01',
        source: 'NYC Parks',
        trend: treeHealthPercent >= 70 ? 'up' : 'stable',
        color: '#22c55e',
        higherIsBetter: true,
        explanation: 'Monitors urban forest vitality. Healthy trees improve air quality, reduce heat, and enhance neighborhood livability.',
      },
      {
        id: 'all-environment-5',
        title: 'Total Street Trees',
        category: 'Environment',
        description: 'Total number of street trees in NYC.',
        value: environment.data.treeStats.totalTrees,
        unit: 'trees',
        lastUpdate: '2015-08-01',
        source: 'NYC Parks',
        color: '#22c55e',
        higherIsBetter: true,
        explanation: 'Total urban forest coverage. More trees mean better air quality, reduced urban heat, and enhanced neighborhood aesthetics.',
      }
    );
  }

  // Transportation Indicators
  if (transportation.data) {
    const subwayPerformance = transportation.data.subwayPerformanceStats;
    const currentPerformance = subwayPerformance.currentYearPerformance;
    const improvement = subwayPerformance.performanceImprovement;
    
    indicators.push(
      {
        id: 'all-transportation-1',
        title: 'Subway On-Time Performance',
        category: 'Transportation',
        description: 'Current year subway service reliability.',
        value: Math.round(currentPerformance * 10) / 10,
        unit: '%',
        target: 80,
        targetCondition: '>=',
        lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
        source: 'MTA',
        trend: subwayPerformance.recentTrend === 'improving' ? 'up' : subwayPerformance.recentTrend === 'declining' ? 'down' : 'stable',
        color: currentPerformance >= 80 ? '#10b981' : currentPerformance >= 70 ? '#f59e0b' : '#ef4444',
        chartData: subwayPerformance.yearlyTrend.map(t => ({
          year: parseInt(t.year),
          value: t.onTimePerformance,
        })),
        higherIsBetter: true,
        explanation: 'Service reliability improvements/declines. Higher percentages indicate better subway performance and more reliable public transportation for NYC residents.',
      },
      // {
      //   id: 'all-transportation-2',
      //   title: 'Subway Performance Improvement',
      //   category: 'Transportation',
      //   description: 'Decade-long improvement in subway reliability.',
      //   value: Math.round(improvement * 10) / 10,
      //   unit: '%',
      //   target: 0,
      //   targetCondition: '>=',
      //   lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
      //   source: 'MTA',
      //   trend: improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'stable',
      //   color: improvement > 0 ? '#10b981' : improvement < 0 ? '#ef4444' : '#6b7280',
      //   higherIsBetter: true,
      //   explanation: 'Long-term trend in subway service quality. Positive values indicate improving reliability over the decade, while negative values suggest declining service performance.',
      // },
      // {
      //   id: 'all-transportation-3',
      //   title: 'For-Hire Vehicles',
      //   category: 'Transportation',
      //   description: 'Total TLC-licensed vehicles in NYC.',
      //   value: transportation.data.fhvStats.totalVehicles,
      //   unit: 'vehicles',
      //   lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
      //   source: 'NYC TLC',
      //   color: '#06b6d4',
      //   higherIsBetter: true,
      //   explanation: 'Represents the size of the taxi and ride-share fleet, indicating transportation capacity and accessibility across the city.',
      // },
      {
        id: 'all-transportation-4',
        title: 'Yellow Taxi Trips',
        category: 'Transportation',
        description: 'Total yellow taxi trips recorded.',
        value: transportation.data.taxiStats.totalTrips,
        unit: 'trips',
        lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC TLC',
        color: '#f59e0b',
        higherIsBetter: true,
        explanation: 'Traditional taxi service usage. Higher numbers indicate strong demand for point-to-point transportation services.',
      }
    );
  }

  // Sort indicators: prioritize positive impact metrics first
  const sortedIndicators = [...indicators].sort((a, b) => {
    // Define positive impact categories (metrics that show good outcomes)
    const positiveImpactCategories = [
      'Business', 'Education', 'Environment', 'Health', 'Housing', 'Transportation'
    ];
    
    // Define positive impact titles (specific metrics that show good outcomes)
    const positiveImpactTitles = [
      'Total Certified Businesses', 'Business Growth Rate', 'Jobs Created',
      'Total Student Enrollment', 'Enrollment Growth', 'Students with Disabilities',
      'Air Quality Index (PM2.5)', 'Greenhouse Gas Emissions', 'Recycling Diversion Rate', 'Street Tree Health',
      'Restaurant Grade A Rate', 'Total Safety Events', 'Safety Events Growth',
      'Affordable Housing Units Created/Preserved', 'Building Permits', 'Violation Closure Rate',
      'Subway On-Time Performance', 'For-Hire Vehicles', 'Yellow Taxi Trips'
    ];
    
    // Check if metrics are positive impact
    const aIsPositive = positiveImpactCategories.includes(a.category) && 
                       (positiveImpactTitles.includes(a.title) || a.higherIsBetter === true);
    const bIsPositive = positiveImpactCategories.includes(b.category) && 
                       (positiveImpactTitles.includes(b.title) || b.higherIsBetter === true);
    
    // First, sort by positive impact (positive first)
    if (aIsPositive && !bIsPositive) return -1;
    if (!aIsPositive && bIsPositive) return 1;
    
    // Then by higherIsBetter (true first)
    if (a.higherIsBetter === true && b.higherIsBetter !== true) return -1;
    if (a.higherIsBetter !== true && b.higherIsBetter === true) return 1;
    
    // Then by category to group related metrics
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    
    return 0;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">NYC Key Metrics</h2>
            <p className="text-xs sm:text-sm text-gray-300">
              {indicators.length} metrics • Click any metric to expand details
            </p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex-shrink-0"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Compact Grid - 2-3 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
        {sortedIndicators.map((indicator) => (
          <CompactMetricCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 pt-2">
        Data from NYC Open Data • Updated regularly • Click metrics for detailed explanations
      </div>
    </div>
  );
}

