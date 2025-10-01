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
      higherIsBetter: false,
      explanation: 'Microscopic airborne particles that penetrate lungs and bloodstream. Lower levels mean cleaner air and reduced respiratory health risks.',
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
      higherIsBetter: false,
      explanation: 'Toxic gas primarily from vehicle emissions and power plants. Lower concentrations indicate better air quality and reduced asthma triggers.',
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
      higherIsBetter: false,
      explanation: 'Harmful pollutant formed by sunlight and emissions. Lower levels mean healthier air, especially for vulnerable populations.',
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
      higherIsBetter: true,
      explanation: 'Urban forest canopy providing shade, air filtration, and cooling. More trees mean improved air quality and neighborhood livability.',
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
      higherIsBetter: true,
      explanation: 'Vitality of urban tree canopy. Healthy trees maximize environmental benefits like carbon capture and heat reduction.',
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
      higherIsBetter: true,
      explanation: 'Volume of air quality monitoring data collected. More measurements mean better understanding and tracking of environmental conditions.',
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

      {/* Data Alert for Tree Data */}
      <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">
            <strong>Data Alert:</strong> Street tree data is from 2015 census and not actively maintained. 
            Air quality data is current and regularly updated.
          </span>
        </div>
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

