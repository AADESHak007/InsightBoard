'use client';

import { useHousingData } from '@/hooks/useHousingData';
import CompactMetricCard from './CompactMetricCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function HousingInsights() {
  const { data, loading, error, refetch } = useHousingData();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-3 sm:p-4 animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-[#1f2937] rounded w-1/2"></div>
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

  // Get latest affordable housing data
  const latestAffordableHousingData = data.affordableHousingStats.yearlyTrend[data.affordableHousingStats.yearlyTrend.length - 1];

  // Convert to Indicator format
  const indicators: Indicator[] = [
    {
      id: 'housing-1',
      title: 'Affordable Housing Units Created/Preserved',
      category: 'Housing',
      description: 'Track number of affordable units delivered per year - Mayor\'s housing promise vs. delivery.',
      value: latestAffordableHousingData ? latestAffordableHousingData.affordableUnits : 0,
      unit: 'units',
      target: 20000,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC HPD',
      trend: latestAffordableHousingData && latestAffordableHousingData.affordableUnits >= 20000 ? 'up' : 'stable',
      color: '#10b981',
      chartData: data.affordableHousingStats.yearlyTrend.map(t => ({
        year: parseInt(t.year),
        value: t.affordableUnits,
      })),
      higherIsBetter: true,
      explanation: 'Mayor\'s housing promise vs. delivery. NYC has created/preserved affordable housing units through various programs, demonstrating commitment to housing affordability and addressing the city\'s housing crisis.',
    },
    // {
    //   id: 'housing-2',
    //   title: 'Construction Permits (Recent)',
    //   category: 'Housing',
    //   description: 'Total DOB construction permits issued (last 10,000 records).',
    //   value: data.permitStats.totalPermits,
    //   unit: 'permits',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC DOB',
    //   color: '#3b82f6',
    //   chartData: data.yearlyTrends.map(t => ({
    //     year: t.year,
    //     value: t.permits,
    //   })),
    //   higherIsBetter: true,
    //   explanation: 'Building permits for construction and renovation. More permits indicate active development, property improvements, and housing supply growth.',
    // },
    {
      id: 'housing-3',
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
    // {
    //   id: 'housing-4',
    //   title: 'Housing Violations (Recent)',
    //   category: 'Housing',
    //   description: 'Total housing code violations tracked (last 10,000 records).',
    //   value: data.violationStats.totalViolations,
    //   unit: 'violations',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC HPD',
    //   color: '#ef4444',
    //   higherIsBetter: false,
    //   explanation: 'Code violations affecting housing quality and safety. Lower numbers indicate better maintained properties and improved living conditions.',
    // },
    {
      id: 'housing-5',
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
    // {
    //   id: 'housing-6',
    //   title: 'Violation Closure Rate',
    //   category: 'Housing',
    //   description: 'Percentage of violations that have been resolved.',
    //   value: Math.round(closureRate * 10) / 10,
    //   unit: '%',
    //   target: 70,
    //   targetCondition: '>=',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC HPD',
    //   trend: closureRate >= 70 ? 'up' : 'stable',
    //   color: '#8b5cf6',
    //   higherIsBetter: true,
    //   explanation: 'Efficiency of addressing and fixing housing violations. Higher rates indicate effective enforcement and landlord responsiveness.',
    // },
    {
      id: 'housing-7',
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


  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Housing Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">Housing permits, violations, and safety indicators</p>
      </div>

      {/* Header */}
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

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-start">
        {indicators.map((indicator) => (
          <CompactMetricCard key={indicator.id} indicator={indicator} />
        ))}
      </div>


    </div>
  );
}

