'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import { Indicator } from '@/types/indicator';

export default function BusinessInsights() {
  const { data, loading, error, refetch } = useBusinessData();
  const { data: accelData, loading: accelLoading } = useBusinessAcceleration();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-5 animate-pulse">
            <div className="h-5 sm:h-6 bg-[#1f2937] rounded w-3/4 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-[#1f2937] rounded w-1/2 mb-4 sm:mb-6"></div>
            <div className="h-10 sm:h-12 bg-[#1f2937] rounded w-full"></div>
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
      higherIsBetter: true,
      explanation: 'Total certified minority, women, and disadvantaged business enterprises. More businesses indicate greater economic inclusion and diversity.',
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
      higherIsBetter: true,
      explanation: 'Certified businesses owned by minorities. Growth reflects increased economic opportunity and entrepreneurship in minority communities.',
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
      higherIsBetter: true,
      explanation: 'Certified businesses owned by women. Higher numbers indicate gender equity in business ownership and economic empowerment.',
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
      higherIsBetter: true,
      explanation: 'Year-over-year expansion rate of certified businesses. Positive growth shows a thriving, expanding business ecosystem.',
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
      higherIsBetter: true,
      explanation: 'Employment generated by NYC-supported business acceleration programs. More jobs mean greater economic impact and workforce development.',
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
      higherIsBetter: true,
      explanation: 'Number of businesses receiving city support and acceleration services. Higher participation indicates effective outreach and program success.',
    });
  }

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Business Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">Comprehensive business development indicators and metrics</p>
      </div>

      {/* Header with live data badge and refresh button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live data from NYC Open Data</span>
          </div>
          <span className="text-gray-500 hidden sm:inline">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
          <span className="text-gray-500 sm:hidden">Updated {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Main Stats - Full Width for Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {indicators.slice(0, 4).map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Job Creation Stats */}
      {indicators.length > 4 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
          {indicators.slice(4).map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      )}

      {/* Borough Distribution - Bar Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
        <BarChart
          data={data.breakdowns.boroughs.map(b => ({
            label: b.borough,
            value: b.count,
            percentage: b.percentage,
          }))}
          title="Borough Distribution"
          height={300}
          color="#06b6d4"
          xAxisLabel="Borough"
          yAxisLabel="Number of Businesses"
        />
      </div>

      {/* Borough Distributions */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
        <BarChart
          data={[
            { label: 'Manhattan', value: 4500, percentage: 28.5 },
            { label: 'Brooklyn', value: 3800, percentage: 24.1 },
            { label: 'Queens', value: 3200, percentage: 20.3 },
            { label: 'Bronx', value: 2800, percentage: 17.7 },
            { label: 'Staten Island', value: 1500, percentage: 9.5 },
          ]}
          title="Certified Businesses by Borough"
          height={300}
          xAxisLabel="Borough"
          yAxisLabel="Number of Businesses"
        />
      </div>
    </div>
  );
}

