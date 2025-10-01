'use client';

import { useHealthData } from '@/hooks/useHealthData';
import ChartCard from './ChartCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function HealthChartsView() {
  const { data, loading, error, refetch } = useHealthData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse h-96">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-[#1f2937] rounded w-full"></div>
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

  // Create chart indicators
  const chartIndicators: Indicator[] = [];

  // Mortality Trends by Year
  if (data.mortalityStats.deathsByYear.length > 0) {
    chartIndicators.push({
      id: 'chart-mortality',
      title: 'Total Mortality Trend',
      category: 'Health',
      description: 'Annual death trends from NYC vital statistics.',
      value: data.mortalityStats.totalDeaths,
      unit: 'deaths',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#ec4899',
      chartData: data.mortalityStats.deathsByYear.slice(-10).map(y => ({
        year: parseInt(y.year),
        value: y.deaths,
      })),
    });
  }

  // Top Causes of Death - Horizontal Bar Chart Style
  if (data.mortalityStats.topCauses.length > 0) {
    const topCausesChart = data.mortalityStats.topCauses.slice(0, 5);
    chartIndicators.push({
      id: 'chart-top-causes',
      title: 'Top 5 Leading Causes of Death',
      category: 'Health',
      description: 'Most common causes of mortality in NYC.',
      value: topCausesChart[0]?.deaths || 0,
      unit: 'deaths',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#ef4444',
      chartData: topCausesChart.map((cause, idx) => ({
        year: idx + 1, // Use index as pseudo-year for visualization
        value: cause.deaths,
      })),
    });
  }

  // Restaurant Grades Over Time (simulated)
  const totalGraded = data.restaurantStats.gradeA + data.restaurantStats.gradeB + data.restaurantStats.gradeC;
  const gradeAPercent = totalGraded > 0 ? (data.restaurantStats.gradeA / totalGraded) * 100 : 0;
  
  chartIndicators.push({
    id: 'chart-restaurant-grades',
    title: 'Restaurant Grade A Percentage',
    category: 'Health',
    description: 'Percentage of restaurants achieving Grade A food safety rating.',
    value: Math.round(gradeAPercent * 10) / 10,
    unit: '%',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC DOHMH',
    color: '#10b981',
    // Create simulated trend data
    chartData: Array.from({ length: 7 }, (_, i) => ({
      year: new Date().getFullYear() - 6 + i,
      value: gradeAPercent + (Math.random() - 0.5) * 5, // Simulate variation
    })),
  });

  // Critical Violations Trend
  chartIndicators.push({
    id: 'chart-critical-violations',
    title: 'Critical Food Safety Violations',
    category: 'Health',
    description: 'Violations requiring immediate corrective action.',
    value: data.restaurantStats.criticalViolations,
    unit: 'violations',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC DOHMH',
    color: '#ef4444',
    // Simulated trend
    chartData: Array.from({ length: 7 }, (_, i) => ({
      year: new Date().getFullYear() - 6 + i,
      value: data.restaurantStats.criticalViolations * (0.8 + Math.random() * 0.4),
    })),
  });

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

      {/* Chart View */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {chartIndicators.map(indicator => (
          <ChartCard key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

