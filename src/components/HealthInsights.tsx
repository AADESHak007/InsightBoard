'use client';

import { useHealthData } from '@/hooks/useHealthData';
import CompactMetricCard from './CompactMetricCard';
import RefreshDataButton from './RefreshDataButton';

import { Indicator } from '@/types/indicator';

export default function HealthInsights() {
  const { data, loading, error, refetch } = useHealthData();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  // Safety events data
  const currentYearEvents = data.safetyEventsStats.outreachExpansion.currentYear;
  const previousYearEvents = data.safetyEventsStats.outreachExpansion.previousYear;
  const growthPercent = data.safetyEventsStats.outreachExpansion.growthPercent;
  const topProgram = data.safetyEventsStats.topPrograms[0];

  const indicators: Indicator[] = [
    {
      id: 'health-1',
      title: 'Total Safety Events (Current Year)',
      category: 'Health',
      description: 'Total safety outreach events conducted this year.',
      value: currentYearEvents,
      unit: 'events',
      target: previousYearEvents,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Safety Events',
      trend: growthPercent > 0 ? 'up' : 'stable',
      color: '#10b981',
      chartData: data.safetyEventsStats.eventsByYear.map(y => ({
        year: parseInt(y.year),
        value: y.totalEvents,
      })),
      higherIsBetter: true,
      explanation: 'Show if outreach efforts are expanding or shrinking across administrations. More events indicate increased public safety engagement and community outreach programs.',
    },
    // {
    //   id: 'health-2',
    //   title: 'Safety Events Growth',
    //   category: 'Health',
    //   description: 'Year-over-year growth in safety outreach events.',
    //   value: Math.round(growthPercent * 10) / 10,
    //   unit: '%',
    //   target: 5,
    //   targetCondition: '>=',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC Safety Events',
    //   trend: growthPercent >= 5 ? 'up' : 'stable',
    //   color: '#8b5cf6',
    //   higherIsBetter: true,
    //   explanation: 'Growth in safety outreach programs indicates expanding public safety initiatives and increased community engagement efforts.',
    // },
    {
      id: 'health-3',
      title: 'Top Safety Program',
      category: 'Health',
      description: topProgram ? `Most active program: ${topProgram.program}` : 'Top safety program',
      value: topProgram ? topProgram.count : 0,
      unit: 'events',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC Safety Events',
      color: '#f59e0b',
      higherIsBetter: true,
      explanation: 'Most frequently conducted safety program type, highlighting the city\'s primary focus areas for public safety outreach and education.',
    },
    {
      id: 'health-4',
      title: 'Restaurant Inspections',
      category: 'Health',
      description: 'Total restaurant inspections conducted (last 10,000 records).',
      value: data.restaurantStats.totalInspections,
      unit: 'inspections',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOHMH',
      color: '#3b82f6',
      higherIsBetter: true,
      explanation: 'Number of food safety inspections performed. More inspections mean better oversight and protection of public health.',
    },
    {
      id: 'health-5',
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
      color: '#22c55e',
      higherIsBetter: true,
      explanation: 'Restaurants meeting highest sanitation standards. Higher rates indicate better food safety practices and reduced risk of foodborne illness.',
    },
    {
      id: 'health-6',
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
      higherIsBetter: false,
      explanation: 'Serious health hazards found during inspections. Lower numbers mean safer food handling and reduced public health risks.',
    },
    // {
    //   id: 'health-7',
    //   title: 'Leading Cause of Death',
    //   category: 'Health',
    //   description: data.mortalityStats.topCauses.length > 0
    //     ? `Top mortality cause: ${data.mortalityStats.topCauses[0].cause.substring(0, 30)}...`
    //     : 'Top mortality cause data',
    //   value: data.mortalityStats.topCauses.length > 0 ? data.mortalityStats.topCauses[0].deaths : 0,
    //   unit: 'deaths',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC DOHMH',
    //   color: '#ec4899',
    //   higherIsBetter: false,
    //   explanation: 'Most common cause of mortality in NYC. Lower death counts indicate improving public health outcomes and effective interventions.',
    // },
    // {
    //   id: 'health-8',
    //   title: 'Total Mortality (Recent)',
    //   category: 'Health',
    //   description: 'Total deaths tracked in recent records (last 10,000).',
    //   value: data.mortalityStats.totalDeaths,
    //   unit: 'deaths',
    //   lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    //   source: 'NYC DOHMH',
    //   color: '#8b5cf6',
    //   chartData: data.mortalityStats.deathsByYear.slice(-7).map(y => ({
    //     year: parseInt(y.year),
    //     value: y.deaths,
    //   })),
    //   higherIsBetter: false,
    //   explanation: 'Overall mortality count from recent vital statistics. Tracking trends helps identify public health challenges and measure population health.',
    // },
    {
      id: 'health-9',
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
      higherIsBetter: false,
      explanation: 'Establishments with suboptimal sanitation scores. Lower counts mean more restaurants are maintaining excellent food safety standards.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Health Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">Public health indicators and food safety metrics</p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 items-start">
        {indicators.map((indicator) => (
          <CompactMetricCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

    </div>
  );
}

