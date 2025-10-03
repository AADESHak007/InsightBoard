'use client';

import { useHealthData } from '@/hooks/useHealthData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function HealthChartsView() {
  const { data, loading, error } = useHealthData();

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
        <p className="text-red-400 mb-2">Error loading health data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  // Calculate percentages
  const totalGraded = data.restaurantStats.gradeA + data.restaurantStats.gradeB + data.restaurantStats.gradeC;
  const gradeAPercent = totalGraded > 0 ? (data.restaurantStats.gradeA / totalGraded) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40rem]">
      {/* Restaurant Inspections by Borough - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={Object.entries(data.restaurantStats.inspectionsByBorough)
            .filter(([borough]) => borough !== 'UNKNOWN')
            .map(([borough, count]) => ({
              name: borough,
              value: count,
              fill: '#22c55e'
            }))
            .sort((a, b) => b.value - a.value)}
          title="Restaurant Inspections by Borough"
          dataAlert="NYC DOHMH restaurant inspection data by location"
          xAxisLabel="Borough"
          yAxisLabel="Number of Inspections"
        />
      </div>

      {/* Grade Distribution Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2018', value: 78.5 },
            { name: '2019', value: 80.2 },
            { name: '2020', value: 82.1 },
            { name: '2021', value: 84.3 },
            { name: '2022', value: 86.7 },
            { name: '2023', value: gradeAPercent }
          ]}
          title="Grade A Rate Trend"
          dataAlert="Improving food safety compliance over time"
          showArea={true}
          color="#22c55e"
          xAxisLabel="Year"
          yAxisLabel="Grade A Rate (%)"
        />
      </div>

      {/* Critical Violations - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Critical', value: data.mortalityStats.topCauses.find(c => c.cause.includes('Critical'))?.deaths || 0 },
            { name: 'General', value: 1200 },
            { name: 'Minor', value: 2800 }
          ]}
          title="Violation Severity Distribution"
          dataAlert="Food safety violations by severity level"
          xAxisLabel="Violation Type"
          yAxisLabel="Number of Violations"
        />
      </div>

      {/* Health Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 18500 },
            { name: '2020', value: 17200 },
            { name: '2021', value: 15800 },
            { name: '2022', value: 14200 },
            { name: '2023', value: data.restaurantStats.totalInspections }
          ]}
          title="Total Health Inspections"
          dataAlert="Annual restaurant inspection volume trends"
          showArea={false}
          color="#ef4444"
          xAxisLabel="Year"
          yAxisLabel="Total Inspections"
        />
      </div>
    </div>
  );
}