'use client';

import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { Indicator } from '@/types/indicator';

export default function PublicSafetyInsights() {
  const { data, loading, error, refetch } = usePublicSafetyData();

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
        <p className="text-red-400 mb-2">Error loading public safety data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No public safety data available</p>
      </div>
    );
  }

  const indicators: Indicator[] = [
    {
      id: 'safety-1',
      title: 'Crime Incidents (Recent)',
      category: 'Public Safety',
      description: 'Total crime complaints reported to NYPD (last 10,000 records).',
      value: data.crimeStats.totalCrimes,
      unit: 'incidents',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#ef4444',
      chartData: data.yearlyTrends.map(t => ({
        year: t.year,
        value: t.crimes,
      })),
      higherIsBetter: false,
      explanation: 'Total reported criminal incidents in the city. Lower crime rates indicate safer neighborhoods and improved public safety.',
    },
    {
      id: 'safety-2',
      title: 'Felony Crimes',
      category: 'Public Safety',
      description: 'Serious crimes including murder, assault, robbery, burglary.',
      value: data.crimeStats.felonies,
      unit: 'felonies',
      target: data.crimeStats.totalCrimes * 0.3,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      trend: 'down',
      color: '#dc2626',
      higherIsBetter: false,
      explanation: 'Most serious criminal offenses with severe penalties. Lower counts mean reduced violent crime and enhanced community safety.',
    },
    {
      id: 'safety-3',
      title: 'Traffic Collisions',
      category: 'Public Safety',
      description: 'Motor vehicle crashes reported (last 10,000 records).',
      value: data.collisionStats.totalCollisions,
      unit: 'crashes',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#f59e0b',
      higherIsBetter: false,
      explanation: 'Traffic accidents across NYC streets. Fewer collisions indicate safer road conditions and better traffic safety measures.',
    },
    {
      id: 'safety-4',
      title: 'Traffic Injuries',
      category: 'Public Safety',
      description: 'Total people injured in motor vehicle collisions.',
      value: data.collisionStats.totalInjured,
      unit: 'injuries',
      target: Math.round(data.collisionStats.totalCollisions * 0.6), // 60% of collisions
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      trend: 'down',
      color: '#fb923c',
      higherIsBetter: false,
      explanation: 'People harmed in traffic crashes. Lower injury counts mean safer transportation and effective Vision Zero initiatives.',
    },
    {
      id: 'safety-5',
      title: 'Traffic Fatalities',
      category: 'Public Safety',
      description: 'Lives lost in motor vehicle crashes (Vision Zero target: 0).',
      value: data.collisionStats.totalKilled,
      unit: 'deaths',
      target: 50, // Realistic interim target
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      trend: 'down',
      color: '#dc2626', // Brighter red for visibility
      higherIsBetter: false,
      explanation: 'Lives lost on NYC streets. Every reduction brings us closer to Vision Zero goal of eliminating traffic deaths entirely.',
    },
    {
      id: 'safety-6',
      title: 'Pedestrian Casualties',
      category: 'Public Safety',
      description: 'Pedestrians killed or injured in traffic incidents.',
      value: data.collisionStats.pedestriansInjured + data.collisionStats.pedestriansKilled,
      unit: 'casualties',
      target: Math.round((data.collisionStats.pedestriansInjured + data.collisionStats.pedestriansKilled) * 0.8), // 20% reduction
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      trend: 'down',
      color: '#ec4899',
      higherIsBetter: false,
      explanation: 'Pedestrians harmed in traffic crashes. Lower numbers indicate safer streets and improved pedestrian infrastructure.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Public Safety Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base">Crime statistics and traffic safety indicators</p>
      </div>

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

      {/* Crime Types Distribution */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Crime Severity Breakdown</h3>
          <p className="text-sm text-gray-400 mt-1">
            Source: NYPD Complaint Data
          </p>
        </div>
        <PieChart
          data={[
            {
              label: 'Felonies',
              value: data.crimeStats.felonies,
              percentage: (data.crimeStats.felonies / data.crimeStats.totalCrimes) * 100,
            },
            {
              label: 'Misdemeanors',
              value: data.crimeStats.misdemeanors,
              percentage: (data.crimeStats.misdemeanors / data.crimeStats.totalCrimes) * 100,
            },
            {
              label: 'Violations',
              value: data.crimeStats.violations,
              percentage: (data.crimeStats.violations / data.crimeStats.totalCrimes) * 100,
            },
          ]}
          title=""
          size={450}
        />
      </div>

      {/* Crimes by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={Object.entries(data.crimeStats.crimesByBorough)
            .filter(([borough]) => borough !== 'UNKNOWN')
            .map(([borough, count]) => ({
              label: borough,
              value: count,
              percentage: (count / data.crimeStats.totalCrimes) * 100,
            }))
            .sort((a, b) => b.value - a.value)}
          title="Crime Distribution by Borough"
          height={400}
          color="#ef4444"
          xAxisLabel="Borough"
          yAxisLabel="Number of Incidents"
        />
      </div>
    </div>
  );
}

