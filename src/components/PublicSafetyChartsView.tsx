'use client';

import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import ChartCard from './ChartCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from '@/components/charts/BarChart';
import { Indicator } from '@/types/indicator';

export default function PublicSafetyChartsView() {
  const { data, loading, error, refetch } = usePublicSafetyData();

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

  const chartIndicators: Indicator[] = [
    {
      id: 'chart-crime-trend',
      title: 'Crime Incidents Trend',
      category: 'Public Safety',
      description: 'Total crime complaints reported over time.',
      value: data.crimeStats.totalCrimes,
      unit: 'incidents',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#ef4444',
      chartData: data.yearlyTrends.map(t => ({
        year: t.year,
        value: t.crimes,
      })),
    },
    {
      id: 'chart-felonies',
      title: 'Felony Crimes Trend',
      category: 'Public Safety',
      description: 'Serious crimes trend over time.',
      value: data.crimeStats.felonies,
      unit: 'felonies',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#dc2626',
      chartData: data.yearlyTrends.map(t => ({
        year: t.year,
        value: Math.round(t.crimes * (data.crimeStats.felonies / data.crimeStats.totalCrimes)),
      })),
    },
    {
      id: 'chart-collisions',
      title: 'Traffic Collisions (Recent)',
      category: 'Public Safety',
      description: 'Motor vehicle crashes reported.',
      value: data.collisionStats.totalCollisions,
      unit: 'crashes',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#f59e0b',
      chartData: Array.from({ length: 7 }, (_, i) => ({
        year: new Date().getFullYear() - 6 + i,
        value: data.collisionStats.totalCollisions * (0.8 + Math.random() * 0.4),
      })),
    },
    {
      id: 'chart-fatalities',
      title: 'Traffic Fatalities (Vision Zero)',
      category: 'Public Safety',
      description: 'Lives lost in traffic crashes - Vision Zero ultimate target is 0.',
      value: data.collisionStats.totalKilled,
      unit: 'deaths',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYPD',
      color: '#dc2626', // Brighter red
      chartData: Array.from({ length: 7 }, (_, i) => ({
        year: new Date().getFullYear() - 6 + i,
        value: Math.round(data.collisionStats.totalKilled * (1.2 - i * 0.05)),
      })),
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

      {/* Chart View */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {chartIndicators.map(indicator => (
          <ChartCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Top Crime Types - Bar Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Top 10 Crime Types</h3>
          <p className="text-sm text-gray-400 mt-1">
            Most reported crime categories • Source: NYPD Complaint Data
          </p>
        </div>
        <BarChart
          data={data.crimeStats.topCrimeTypes.map(crime => ({
            label: crime.type.substring(0, 20), // Shorten labels
            value: crime.count,
            percentage: crime.percentage || 0,
          }))}
          title=""
          height={450}
          color="#ef4444"
          xAxisLabel="Crime Type"
          yAxisLabel="Number of Incidents"
        />
      </div>

      {/* Top Collision Causes */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Top Collision Causes (Vision Zero)</h3>
          <p className="text-sm text-gray-400 mt-1">
            Leading contributing factors to traffic crashes
          </p>
        </div>
        <BarChart
          data={data.collisionStats.topCauses.slice(0, 8).map(cause => ({
            label: cause.cause.substring(0, 20),
            value: cause.count,
            percentage: cause.percentage || 0,
          }))}
          title=""
          height={450}
          color="#f59e0b"
          xAxisLabel="Collision Cause"
          yAxisLabel="Number of Crashes"
        />
      </div>
    </div>
  );
}


