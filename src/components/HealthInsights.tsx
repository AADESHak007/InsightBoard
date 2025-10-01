'use client';

import { useHealthData } from '@/hooks/useHealthData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { Indicator } from '@/types/indicator';

export default function HealthInsights() {
  const { data, loading, error, refetch } = useHealthData();

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
        <p className="text-red-400 mb-2">Error loading health data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No health data available</p>
      </div>
    );
  }

  // Calculate percentages
  const totalGraded = data.restaurantStats.gradeA + data.restaurantStats.gradeB + data.restaurantStats.gradeC;
  const gradeAPercent = totalGraded > 0 ? (data.restaurantStats.gradeA / totalGraded) * 100 : 0;

  const indicators: Indicator[] = [
    {
      id: 'health-1',
      title: 'Restaurant Inspections',
      category: 'Health',
      description: 'Total restaurant inspections conducted (last 10,000 records).',
      value: data.restaurantStats.totalInspections,
      unit: 'inspections',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#3b82f6',
    },
    {
      id: 'health-2',
      title: 'Grade A Restaurants',
      category: 'Health',
      description: 'Percentage of restaurants with Grade A food safety rating.',
      value: Math.round(gradeAPercent * 10) / 10,
      unit: '%',
      target: 80,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      trend: gradeAPercent >= 80 ? 'up' : 'stable',
      color: '#10b981',
    },
    {
      id: 'health-3',
      title: 'Critical Violations',
      category: 'Health',
      description: 'Food safety violations requiring immediate attention.',
      value: data.restaurantStats.criticalViolations,
      unit: 'violations',
      target: data.restaurantStats.totalInspections * 0.2,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      trend: 'down',
      color: '#ef4444',
    },
    {
      id: 'health-4',
      title: 'Leading Cause of Death',
      category: 'Health',
      description: data.mortalityStats.topCauses.length > 0
        ? `Top mortality cause: ${data.mortalityStats.topCauses[0].cause.substring(0, 30)}...`
        : 'Top mortality cause data',
      value: data.mortalityStats.topCauses.length > 0 ? data.mortalityStats.topCauses[0].deaths : 0,
      unit: 'deaths',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#ec4899',
    },
    {
      id: 'health-5',
      title: 'Total Mortality (Recent)',
      category: 'Health',
      description: 'Total deaths tracked in recent records (last 10,000).',
      value: data.mortalityStats.totalDeaths,
      unit: 'deaths',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#8b5cf6',
      chartData: data.mortalityStats.deathsByYear.slice(-7).map(y => ({
        year: parseInt(y.year),
        value: y.deaths,
      })),
    },
    {
      id: 'health-6',
      title: 'Grade B & C Restaurants',
      category: 'Health',
      description: 'Restaurants requiring food safety improvements.',
      value: data.restaurantStats.gradeB + data.restaurantStats.gradeC,
      unit: 'restaurants',
      target: totalGraded * 0.2,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      trend: 'down',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {indicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Restaurant Grades Distribution */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Restaurant Food Safety Grades</h3>
          <p className="text-sm text-gray-400 mt-1">
            Grade distribution from recent inspections • Source: NYC DOHMH Restaurant Inspections
          </p>
        </div>
        <PieChart
          data={[
            {
              label: 'Grade A - Excellent',
              value: data.restaurantStats.gradeA,
              percentage: (data.restaurantStats.gradeA / totalGraded) * 100,
            },
            {
              label: 'Grade B - Good',
              value: data.restaurantStats.gradeB,
              percentage: (data.restaurantStats.gradeB / totalGraded) * 100,
            },
            {
              label: 'Grade C - Needs Improvement',
              value: data.restaurantStats.gradeC,
              percentage: (data.restaurantStats.gradeC / totalGraded) * 100,
            },
          ]}
          title=""
          size={450}
        />
      </div>

      {/* Top Causes of Death */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Top 10 Leading Causes of Death</h3>
          <p className="text-sm text-gray-400 mt-1">
            Source: NYC DOHMH Vital Statistics
          </p>
        </div>
        <div className="space-y-3">
          {data.mortalityStats.topCauses.filter(c => c.deaths > 0).map((cause, index) => (
            <div key={cause.cause}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">#{index + 1}</span>
                  <span className="truncate">{cause.cause}</span>
                </span>
                <span className="text-red-400 font-semibold whitespace-nowrap ml-2">
                  {cause.deaths.toLocaleString()} ({(cause.percentage || 0).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-[#1f2937] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500"
                  style={{ width: `${Math.min(cause.percentage || 0, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspections by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={Object.entries(data.restaurantStats.inspectionsByBorough)
            .filter(([borough]) => borough !== 'UNKNOWN')
            .map(([borough, count]) => ({
              label: borough,
              value: count,
              percentage: (count / data.restaurantStats.totalInspections) * 100,
            }))
            .sort((a, b) => b.value - a.value)}
          title="Restaurant Inspections by Borough"
          height={400}
          color="#3b82f6"
          xAxisLabel="Borough"
          yAxisLabel="Number of Inspections"
        />
      </div>
    </div>
  );
}

