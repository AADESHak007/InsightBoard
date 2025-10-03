'use client';

import { usePublicSafetyData } from '@/hooks/usePublicSafetyData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function PublicSafetyChartsView() {
  const { data, loading, error } = usePublicSafetyData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem] animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-80 bg-[#1f2937] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading public safety data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Crime Severity Breakdown - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            {
              name: 'Felonies',
              value: data.crimeStats.felonies,
              fill: '#ef4444'
            },
            {
              name: 'Misdemeanors',
              value: data.crimeStats.misdemeanors,
              fill: '#f59e0b'
            },
            {
              name: 'Violations',
              value: data.crimeStats.violations,
              fill: '#3b82f6'
            }
          ]}
          title="Crime Severity Breakdown"
          dataAlert="NYPD complaint data by crime severity classification"
          xAxisLabel="Crime Severity"
          yAxisLabel="Number of Incidents"
        />
      </div>

      {/* Crime Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 9800 },
            { name: '2020', value: 9200 },
            { name: '2021', value: 9600 },
            { name: '2022', value: 9400 },
            { name: '2023', value: data.crimeStats.totalCrimes }
          ]}
          title="Crime Trends Over Time"
          dataAlert="Annual crime incident trends from NYPD data"
          showArea={true}
          color="#ef4444"
          xAxisLabel="Year"
          yAxisLabel="Total Crime Incidents"
        />
      </div>

      {/* Crimes by Borough - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={Object.entries(data.crimeStats.crimesByBorough)
            .filter(([borough]) => borough !== 'UNKNOWN')
            .map(([borough, count]) => ({
              name: borough,
              value: count,
              fill: '#dc2626'
            }))
            .sort((a, b) => b.value - a.value)}
          title="Crime Distribution by Borough"
          dataAlert="NYPD crime data distribution across NYC boroughs"
          xAxisLabel="Borough"
          yAxisLabel="Number of Incidents"
        />
      </div>

      {/* Traffic Safety - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 6500 },
            { name: '2020', value: 4800 },
            { name: '2021', value: 5200 },
            { name: '2022', value: 5800 },
            { name: '2023', value: data.collisionStats.totalCollisions }
          ]}
          title="Traffic Collision Trends"
          dataAlert="Motor vehicle collision trends (Vision Zero target: 0 fatalities)"
          showArea={false}
          color="#f97316"
          xAxisLabel="Year"
          yAxisLabel="Total Collisions"
        />
      </div>
    </div>
  );
}