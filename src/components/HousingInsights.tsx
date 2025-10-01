'use client';

import { useHousingData } from '@/hooks/useHousingData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import { Indicator } from '@/types/indicator';

export default function HousingInsights() {
  const { data, loading, error, refetch } = useHousingData();

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
        <p className="text-red-400 mb-2">Error loading housing data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No housing data available</p>
      </div>
    );
  }

  // Calculate closure rate
  const closureRate = data.violationStats.totalViolations > 0
    ? (data.violationStats.closedViolations / data.violationStats.totalViolations) * 100
    : 0;

  // Convert to Indicator format
  const indicators: Indicator[] = [
    {
      id: 'housing-1',
      title: 'Construction Permits (Recent)',
      category: 'Housing',
      description: 'Total DOB construction permits issued (last 10,000 records).',
      value: data.permitStats.totalPermits,
      unit: 'permits',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOB',
      color: '#3b82f6',
      chartData: data.yearlyTrends.map(t => ({
        year: t.year,
        value: t.permits,
      })),
      higherIsBetter: true,
      explanation: 'Building permits for construction and renovation. More permits indicate active development, property improvements, and housing supply growth.',
    },
    {
      id: 'housing-2',
      title: 'New Building Permits',
      category: 'Housing',
      description: 'Permits issued for new building construction.',
      value: data.permitStats.newBuilding,
      unit: 'permits',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOB',
      trend: 'up',
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'New construction activity creating additional housing units. Higher values mean increased housing supply to address demand.',
    },
    {
      id: 'housing-3',
      title: 'Housing Violations (Recent)',
      category: 'Housing',
      description: 'Total housing code violations tracked (last 10,000 records).',
      value: data.violationStats.totalViolations,
      unit: 'violations',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC HPD',
      color: '#ef4444',
      higherIsBetter: false,
      explanation: 'Code violations affecting housing quality and safety. Lower numbers indicate better maintained properties and improved living conditions.',
    },
    {
      id: 'housing-4',
      title: 'Open Violations',
      category: 'Housing',
      description: 'Housing violations currently open and requiring attention.',
      value: data.violationStats.openViolations,
      unit: 'open',
      target: data.violationStats.totalViolations * 0.3,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC HPD',
      trend: 'down',
      color: '#f59e0b',
      higherIsBetter: false,
      explanation: 'Unresolved housing issues currently impacting residents. Fewer open violations mean faster resolution and better tenant protection.',
    },
    {
      id: 'housing-5',
      title: 'Violation Closure Rate',
      category: 'Housing',
      description: 'Percentage of violations that have been resolved.',
      value: Math.round(closureRate * 10) / 10,
      unit: '%',
      target: 70,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC HPD',
      trend: closureRate >= 70 ? 'up' : 'stable',
      color: '#8b5cf6',
      higherIsBetter: true,
      explanation: 'Efficiency of addressing and fixing housing violations. Higher rates indicate effective enforcement and landlord responsiveness.',
    },
    {
      id: 'housing-6',
      title: 'Class C Violations (Hazardous)',
      category: 'Housing',
      description: 'Immediately hazardous violations requiring urgent attention.',
      value: data.violationStats.classC,
      unit: 'violations',
      target: data.violationStats.totalViolations * 0.1,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC HPD',
      trend: 'down',
      color: '#ec4899',
      higherIsBetter: false,
      explanation: 'Critical safety hazards posing immediate danger to residents. Lower counts mean fewer life-threatening housing conditions.',
    },
  ];

  // Prepare borough correlation data
  const correlationData = data.correlation.map(c => ({
    label: c.borough,
    value: c.permits,
    percentage: (c.permits / data.permitStats.totalPermits) * 100,
  }));

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

      {/* Permits by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={correlationData}
          title="Construction Permits by Borough"
          height={400}
          color="#3b82f6"
          xAxisLabel="Borough"
          yAxisLabel="Number of Permits"
        />
      </div>

    </div>
  );
}

