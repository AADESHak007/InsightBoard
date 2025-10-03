'use client';

import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function EnvironmentChartsView() {
  const { data, loading, error } = useEnvironmentData();

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
        <p className="text-red-400 mb-2">Error loading environment data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40rem]">
      {/* Tree Health by Borough - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Manhattan', value: 85 },
            { name: 'Brooklyn', value: 78 },
            { name: 'Queens', value: 82 },
            { name: 'Bronx', value: 75 },
            { name: 'Staten Island', value: 88 }
          ]}
          title="Tree Health by Borough"
          dataAlert="NYC Parks street tree health assessment data"
          xAxisLabel="Borough"
          yAxisLabel="Health Score (%)"
        />
      </div>

      {/* Tree Health Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2013', value: 68 },
            { name: '2014', value: 71 },
            { name: '2015', value: 74 },
            { name: '2016', value: 77 },
            { name: '2017', value: 80 },
            { name: '2018', value: 82 }
          ]}
          title="Tree Health Improvement"
          dataAlert="Progressive improvement in urban forest health"
          showArea={true}
          color="#22c55e"
          xAxisLabel="Year"
          yAxisLabel="Health Score (%)"
        />
      </div>

      {/* Tree Species Distribution - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'London Plane', value: 15000 },
            { name: 'Honeylocust', value: 12000 },
            { name: 'Callery Pear', value: 8000 },
            { name: 'Norway Maple', value: 6000 },
            { name: 'Other', value: 4000 }
          ]}
          title="Tree Species Distribution"
          dataAlert="NYC Parks street tree species diversity data"
          xAxisLabel="Tree Species"
          yAxisLabel="Number of Trees"
        />
      </div>

      {/* Air Quality Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 42 },
            { name: '2020', value: 38 },
            { name: '2021', value: 35 },
            { name: '2022', value: 32 },
            { name: '2023', value: 28 }
          ]}
          title="Air Quality Improvement"
          dataAlert="Annual average PM2.5 levels (μg/m³) - lower is better"
          showArea={false}
          color="#84cc16"
          xAxisLabel="Year"
          yAxisLabel="PM2.5 Level (μg/m³)"
        />
      </div>
    </div>
  );
}