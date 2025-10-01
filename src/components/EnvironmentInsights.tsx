'use client';

import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function EnvironmentInsights() {
  const { data, loading, error, refetch } = useEnvironmentData();

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
        <p className="text-red-400 mb-2">Error loading environment data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No environment data available</p>
      </div>
    );
  }

  const treeHealthPercent = data.treeStats.totalTrees > 0
    ? (data.treeStats.goodHealth / data.treeStats.totalTrees) * 100
    : 0;

  const indicators: Indicator[] = [
    {
      id: 'env-1',
      title: 'PM2.5 Level (Fine Particles)',
      category: 'Environment',
      description: 'Average fine particulate matter concentration (lower is better).',
      value: Math.round(data.airQualityStats.avgPM25 * 10) / 10,
      unit: 'mcg/m³',
      target: 10,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DEP',
      trend: data.airQualityStats.avgPM25 < 10 ? 'down' : 'stable',
      color: '#10b981',
    },
    {
      id: 'env-2',
      title: 'NO₂ Level (Nitrogen Dioxide)',
      category: 'Environment',
      description: 'Average nitrogen dioxide concentration (air pollutant).',
      value: Math.round(data.airQualityStats.avgNO2 * 10) / 10,
      unit: 'ppb',
      target: 15,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DEP',
      trend: 'stable',
      color: '#3b82f6',
    },
    {
      id: 'env-3',
      title: 'O₃ Level (Ozone)',
      category: 'Environment',
      description: 'Average ground-level ozone concentration.',
      value: Math.round(data.airQualityStats.avgOzone * 10) / 10,
      unit: 'ppb',
      target: 35,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DEP',
      trend: 'stable',
      color: '#06b6d4',
    },
    {
      id: 'env-4',
      title: 'Street Trees',
      category: 'Environment',
      description: 'Total street trees tracked in NYC census (sampled).',
      value: data.treeStats.totalTrees,
      unit: 'trees',
      lastUpdate: '2015-08-01',
      source: 'NYC Parks',
      color: '#22c55e',
    },
    {
      id: 'env-5',
      title: 'Tree Health (Good)',
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
    },
    {
      id: 'env-6',
      title: 'Air Quality Measurements',
      category: 'Environment',
      description: 'Total air quality measurements recorded across NYC.',
      value: data.airQualityStats.totalMeasurements,
      unit: 'measurements',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DEP',
      color: '#8b5cf6',
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

    </div>
  );
}

