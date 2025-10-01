'use client';

import { useHousingData } from '@/hooks/useHousingData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import GroupedBarChart from './charts/GroupedBarChart';
import PieChart from './charts/PieChart';
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

      {/* Permits vs Violations - Grouped Bar Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">Permits vs Violations by Borough</h3>
          <p className="text-sm text-gray-400">
            Compares construction activity with housing code violations. Lower violations relative to permits = better compliance.
          </p>
        </div>
        <GroupedBarChart
          data={data.correlation.map(c => ({
            label: c.borough,
            value1: c.permits,
            value2: c.violations,
            label1: 'Permits',
            label2: 'Violations',
          }))}
          title=""
          height={450}
          color1="#3b82f6"
          color2="#ef4444"
          xAxisLabel="Borough"
          yAxisLabel="Count"
        />
        
        {/* Ratio Analysis */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.correlation.map((borough) => (
            <div key={borough.borough} className="bg-[#1a1f2e] rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{borough.borough}</div>
              <div className={`text-2xl font-bold ${
                borough.ratio < 0.5 ? 'text-green-400' : 
                borough.ratio < 1.0 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {borough.ratio.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">V/P ratio</div>
            </div>
          ))}
        </div>
      </div>

      {/* Violation Severity - Pie Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Violation Severity Distribution</h3>
          <p className="text-sm text-gray-400 mt-1">
            Class A: Non-hazardous • Class B: Hazardous • Class C: Immediately Hazardous
          </p>
        </div>
        <PieChart
          data={[
            {
              label: 'Class A - Non-Hazardous',
              value: data.violationStats.classA,
              percentage: (data.violationStats.classA / data.violationStats.totalViolations) * 100,
            },
            {
              label: 'Class B - Hazardous',
              value: data.violationStats.classB,
              percentage: (data.violationStats.classB / data.violationStats.totalViolations) * 100,
            },
            {
              label: 'Class C - Immediately Hazardous',
              value: data.violationStats.classC,
              percentage: (data.violationStats.classC / data.violationStats.totalViolations) * 100,
            },
          ]}
          title=""
          size={450}
        />
      </div>
    </div>
  );
}

