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
    indicators.push({
      id: 'all-business-1',
      title: 'Certified Businesses',
      category: 'Business',
      description: 'Total MBE/WBE certified businesses in NYC.',
      value: business.data.stats.total,
      unit: 'businesses',
      lastUpdate: new Date(business.data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC SBS',
      trend: growthRate > 0 ? 'up' : 'stable',
      color: '#f59e0b',
    });
  }

  // Business Acceleration
  if (acceleration.data) {
    indicators.push({
      id: 'all-business-2',
      title: 'Jobs Created (2012-2019)',
      category: 'Business',
      description: 'Total jobs created through NYC Business Acceleration program.',
      value: acceleration.data.jobsStats.totalJobs,
      unit: 'jobs',
      lastUpdate: '2019-08-08',
      source: 'NYC SBS',
      color: '#10b981',
    });
  }

  // Education Indicators
  if (education.data) {
    indicators.push({
      id: 'all-education-1',
      title: 'Total Student Enrollment',
      category: 'Education',
      description: 'Total students enrolled in NYC public schools.',
      value: education.data.stats.totalEnrollment,
      unit: 'students',
      lastUpdate: new Date(education.data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#3b82f6',
    });
  }

  // Housing Indicators
  if (housing.data) {
    indicators.push({
      id: 'all-housing-1',
      title: 'Building Permits (2024)',
      category: 'Housing',
      description: 'Total new building permits issued in NYC.',
      value: housing.data.permitStats.totalPermits,
      unit: 'permits',
      lastUpdate: new Date(housing.data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOB',
      color: '#8b5cf6',
    });
  }

  // Health Indicators
  if (health.data) {
    const gradeAPercent = health.data.restaurantStats.totalInspections > 0
      ? (health.data.restaurantStats.gradeA / health.data.restaurantStats.totalInspections) * 100
      : 0;
    indicators.push({
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
    });
  }

  // Public Safety Indicators
  if (safety.data) {
    const casualtyRate = safety.data.collisionStats.totalCollisions > 0
      ? ((safety.data.collisionStats.totalInjured + safety.data.collisionStats.totalKilled) / 
         safety.data.collisionStats.totalCollisions) * 100
      : 0;
    indicators.push({
      id: 'all-safety-1',
      title: 'Traffic Collision Rate',
      category: 'Public Safety',
      description: 'Percentage of collisions resulting in casualties.',
      value: Math.round(casualtyRate * 10) / 10,
      unit: '%',
      target: 15,
      targetCondition: '<=',
      lastUpdate: new Date(safety.data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      trend: casualtyRate <= 15 ? 'down' : 'stable',
      color: '#dc2626',
    });
  }

  // Environment Indicators
  if (environment.data) {
    const treeHealthPercent = environment.data.treeStats.totalTrees > 0
      ? (environment.data.treeStats.goodHealth / environment.data.treeStats.totalTrees) * 100
      : 0;
    indicators.push({
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
    });
  }

  // Transportation Indicators
  if (transportation.data) {
    indicators.push({
      id: 'all-transportation-1',
      title: 'For-Hire Vehicles',
      category: 'Transportation',
      description: 'Total TLC-licensed vehicles in NYC.',
      value: transportation.data.fhvStats.totalVehicles,
      unit: 'vehicles',
      lastUpdate: new Date(transportation.data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC TLC',
      color: '#06b6d4',
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">NYC Insights Dashboard</h2>
        <p className="text-gray-300">
          Comprehensive overview of key metrics across all sectors in New York City. 
          Data sourced from NYC Open Data and updated regularly.
        </p>
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

