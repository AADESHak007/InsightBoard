'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import { useEducationData } from '@/hooks/useEducationData';
import { useHousingData } from '@/hooks/useHousingData';
import { useHealthData } from '@/hooks/useHealthData';
import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import { useTransportationData } from '@/hooks/useTransportationData';
import IndicatorCard from './IndicatorCard';
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
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#1f2937] rounded w-1/2 mb-6"></div>
            <div className="h-12 bg-[#1f2937] rounded w-full"></div>
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
        title: 'Student-Teacher Ratio',
        category: 'Education',
        description: 'Average students per teacher across NYC schools.',
        value: Math.round((education.data.stats.totalEnrollment / education.data.stats.totalSchools) * 10) / 10,
        unit: 'ratio',
        target: 15,
        targetCondition: '<=',
        lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC DOE',
        color: '#8b5cf6',
        higherIsBetter: false,
        explanation: 'Lower ratios indicate better teacher-student interaction and personalized attention, improving educational outcomes.',
      }
    );
  }

  // Housing Indicators
  if (housing.data) {
    indicators.push(
      {
        id: 'all-housing-1',
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
        id: 'all-housing-2',
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
        id: 'all-housing-3',
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
    indicators.push(
      {
        id: 'all-health-1',
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
        id: 'all-health-2',
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
    indicators.push(
      {
        id: 'all-environment-1',
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
        color: '#84cc16',
        higherIsBetter: true,
        explanation: 'Monitors urban forest vitality. Healthy trees improve air quality, reduce heat, and enhance neighborhood livability.',
      },
      {
        id: 'all-environment-2',
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
    indicators.push(
      {
        id: 'all-transportation-1',
        title: 'For-Hire Vehicles',
        category: 'Transportation',
        description: 'Total TLC-licensed vehicles in NYC.',
        value: transportation.data.fhvStats.totalVehicles,
        unit: 'vehicles',
        lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
        source: 'NYC TLC',
        color: '#06b6d4',
        higherIsBetter: true,
        explanation: 'Represents the size of the taxi and ride-share fleet, indicating transportation capacity and accessibility across the city.',
      },
      {
        id: 'all-transportation-2',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">NYC Insights Dashboard</h2>
            <p className="text-gray-300">
              Comprehensive overview of key metrics across all sectors in New York City. 
              Data sourced from NYC Open Data and updated regularly.
            </p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-400">{indicators.length}</div>
            <div className="text-sm text-gray-400">Key Metrics</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">8</div>
            <div className="text-sm text-gray-400">Sectors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">Live</div>
            <div className="text-sm text-gray-400">Data Status</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">NYC</div>
            <div className="text-sm text-gray-400">Open Data</div>
          </div>
        </div>
      </div>

      {/* All Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {indicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Sector Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5">
        <div className="bg-[#111827] border border-amber-500/30 rounded-lg p-5 hover:border-amber-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-xl">💼</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Business</h3>
          </div>
          <p className="text-sm text-gray-400">
            Certified businesses, job creation, and economic growth metrics
          </p>
        </div>

        <div className="bg-[#111827] border border-blue-500/30 rounded-lg p-5 hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Education</h3>
          </div>
          <p className="text-sm text-gray-400">
            Student enrollment, demographics, and school performance data
          </p>
        </div>

        <div className="bg-[#111827] border border-purple-500/30 rounded-lg p-5 hover:border-purple-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <span className="text-xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Housing</h3>
          </div>
          <p className="text-sm text-gray-400">
            Building permits, violations, and housing development trends
          </p>
        </div>

        <div className="bg-[#111827] border border-green-500/30 rounded-lg p-5 hover:border-green-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-xl">💚</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Health</h3>
          </div>
          <p className="text-sm text-gray-400">
            Restaurant inspections, mortality data, and public health metrics
          </p>
        </div>

        <div className="bg-[#111827] border border-red-500/30 rounded-lg p-5 hover:border-red-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-xl">🚨</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Public Safety</h3>
          </div>
          <p className="text-sm text-gray-400">
            Crime statistics, traffic collisions, and safety trends
          </p>
        </div>

        <div className="bg-[#111827] border border-lime-500/30 rounded-lg p-5 hover:border-lime-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-lime-500/20 flex items-center justify-center">
              <span className="text-xl">🌳</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Environment</h3>
          </div>
          <p className="text-sm text-gray-400">
            Air quality, street trees, and environmental health indicators
          </p>
        </div>

        <div className="bg-[#111827] border border-cyan-500/30 rounded-lg p-5 hover:border-cyan-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <span className="text-xl">🚕</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Transportation</h3>
          </div>
          <p className="text-sm text-gray-400">
            Taxi trips, FHV fleet, and urban mobility patterns
          </p>
        </div>

        <div className="bg-[#111827] border border-pink-500/30 rounded-lg p-5 hover:border-pink-500 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Economy</h3>
          </div>
          <p className="text-sm text-gray-400">
            Economic indicators and financial metrics (coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}

