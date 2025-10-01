'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { Indicator } from '@/types/indicator';

export default function BusinessInsights() {
  const { data, loading, error, refetch } = useBusinessData();
  const { data: accelData, loading: accelLoading } = useBusinessAcceleration();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#1f2937] rounded w-1/2 mb-6"></div>
            <div className="h-12 bg-[#1f2937] rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading business data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No business data available</p>
      </div>
    );
  }

  // Convert API data to Indicator format
  const indicators: Indicator[] = [
    {
      id: 'business-1',
      title: 'Total Certified Businesses',
      category: 'Business',
      description: 'Total number of NYC certified M/WBE and DBE businesses.',
      value: data.stats.total,
      unit: 'businesses',
      target: data.stats.total * 1.1,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Open Data',
      trend: data.stats.growthRate > 0 ? 'up' : data.stats.growthRate < 0 ? 'down' : 'stable',
      color: '#8b5cf6',
    },
    {
      id: 'business-2',
      title: 'Minority Business Enterprises (MBE)',
      category: 'Business',
      description: 'Number of certified Minority-owned Business Enterprises.',
      value: data.stats.mbe,
      unit: 'MBE',
      target: Math.round(data.stats.total * 0.5),
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Open Data',
      trend: 'up',
      color: '#14b8a6',
    },
    {
      id: 'business-3',
      title: 'Women Business Enterprises (WBE)',
      category: 'Business',
      description: 'Number of certified Women-owned Business Enterprises.',
      value: data.stats.wbe,
      unit: 'WBE',
      target: Math.round(data.stats.total * 0.4),
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Open Data',
      trend: 'up',
      color: '#f59e0b',
    },
    {
      id: 'business-4',
      title: 'Business Growth Rate',
      category: 'Business',
      description: 'Average annual growth rate over the last 5 years.',
      value: Math.round(data.stats.growthRate * 10) / 10,
      unit: '%',
      target: 10,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Open Data',
      trend: data.stats.growthRate > 0 ? 'up' : 'down',
      color: '#06b6d4',
      chartData: data.growth.slice(-7).map(g => ({
        year: g.year,
        value: g.count,
      })),
    },
  ];

  // Add job creation indicators if acceleration data is available
  if (accelData && !accelLoading) {
    indicators.push({
      id: 'business-5',
      title: 'Total Jobs Tracked',
      category: 'Business',
      description: 'Total jobs from businesses in the acceleration program (2012-2019).',
      value: accelData.jobsStats.totalJobs,
      unit: 'jobs',
      lastUpdate: '2019-08-08',
      source: 'NYC Business Acceleration',
      trend: 'stable',
      color: '#10b981',
      chartData: accelData.yearlyJobsTrend.filter(y => y.year >= 2012 && y.year <= 2019).map(y => ({
        year: y.year,
        value: y.jobs,
      })),
    });

    indicators.push({
      id: 'business-6',
      title: 'Businesses in Program',
      category: 'Business',
      description: 'Total businesses assisted by NYC Business Acceleration (2012-2019).',
      value: accelData.totalBusinesses,
      unit: 'businesses',
      lastUpdate: '2019-08-08',
      source: 'NYC Business Acceleration',
      trend: 'stable',
      color: '#f59e0b',
      chartData: accelData.yearlyJobsTrend.filter(y => y.year >= 2012 && y.year <= 2019).map(y => ({
        year: y.year,
        value: y.businesses,
      })),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header with live data badge and refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Main Stats - Full Width for Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {indicators.slice(0, 4).map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Job Creation Stats */}
      {indicators.length > 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {indicators.slice(4).map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      )}

      {/* Borough Distribution - Bar Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={data.breakdowns.boroughs.map(b => ({
            label: b.borough,
            value: b.count,
            percentage: b.percentage,
          }))}
          title="Borough Distribution"
          height={400}
          color="#06b6d4"
          xAxisLabel="Borough"
          yAxisLabel="Number of Businesses"
        />
      </div>

      {/* Top Sectors - Pie Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Top 6 Business Sectors</h3>
            <span className="text-xs text-gray-400 bg-[#1a1f2e] px-3 py-1 rounded-full">
              {data.breakdowns.sectors.slice(0, 6).reduce((sum, s) => sum + s.count, 0).toLocaleString()} of {data.stats.total.toLocaleString()} businesses
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Source: NYC SBS M/WBE Certified Business List
          </p>
        </div>
        <PieChart
          data={data.breakdowns.sectors.slice(0, 6).map(s => ({
            label: s.sector,
            value: s.count,
            percentage: s.percentage,
          }))}
          title=""
          size={500}
        />
      </div>

      {/* Jobs by Sector */}
      {accelData && !accelLoading && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Jobs Created by Sector</h3>
              <span className="text-xs text-gray-400 bg-[#1a1f2e] px-3 py-1 rounded-full">
                {accelData.jobsStats.totalJobs.toLocaleString()} total jobs
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Source: NYC Business Acceleration Program (2012-2019)
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Dataset last updated: August 2019 (not actively maintained)</span>
            </div>
          </div>
          <div className="space-y-3">
            {accelData.sectorJobs.slice(0, 8).map((sector, index) => (
              <div key={sector.sector}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">#{index + 1}</span>
                    {sector.sector}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {sector.jobs.toLocaleString()} jobs • {sector.businesses} businesses
                  </span>
                </div>
                <div className="w-full bg-[#1f2937] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${Math.min(sector.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

