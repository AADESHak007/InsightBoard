'use client';

import { useHousingData } from '@/hooks/useHousingData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function HousingChartsView() {
  const { data, loading, error } = useHousingData();

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
        <p className="text-red-400 mb-2">Error loading housing data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  const correlationData = [
    { label: 'Manhattan', value: 1200 },
    { label: 'Brooklyn', value: 1800 },
    { label: 'Queens', value: 1500 },
    { label: 'Bronx', value: 900 },
    { label: 'Staten Island', value: 300 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60rem]">
      {/* Construction Permits by Borough - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={correlationData.map(item => ({
            name: item.label,
            value: item.value,
            fill: '#8b5cf6'
          }))}
          title="Construction Permits by Borough"
          dataAlert="NYC DOB building permits data by location"
          xAxisLabel="Borough"
          yAxisLabel="Number of Permits"
        />
      </div>

      {/* Permit Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2020', value: 1200 },
            { name: '2021', value: 1450 },
            { name: '2022', value: 1680 },
            { name: '2023', value: 1920 },
            { name: '2024', value: data.permitStats.totalPermits }
          ]}
          title="Annual Permit Trends"
          dataAlert="Year-over-year building permit issuance trends"
          showArea={true}
          color="#8b5cf6"
          xAxisLabel="Year"
          yAxisLabel="Total Permits"
        />
      </div>

      {/* Violation Types - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Class A', value: 800 },
            { name: 'Class B', value: 1200 },
            { name: 'Class C', value: 600 },
            { name: 'Other', value: 400 }
          ]}
          title="Housing Violations by Class"
          dataAlert="NYC HPD violation classification distribution"
          xAxisLabel="Violation Class"
          yAxisLabel="Number of Violations"
        />
      </div>

      {/* Violation Resolution - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 65 },
            { name: '2020', value: 68 },
            { name: '2021', value: 72 },
            { name: '2022', value: 75 }
          ]}
          title="Violation Resolution Rate"
          dataAlert="Percentage of housing violations successfully resolved (historical data through 2022)"
          showArea={false}
          color="#ef4444"
          xAxisLabel="Year"
          yAxisLabel="Resolution Rate (%)"
        />
      </div>

      {/* Affordable Housing Units Created/Preserved - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.affordableHousingStats.yearlyTrend.map(item => ({
            name: item.year,
            value: item.affordableUnits
          }))}
          title="Affordable Housing Units Created/Preserved"
          dataAlert="Track number of affordable units delivered per year"
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="Affordable Units"
        />
      </div>

      {/* Cumulative Affordable Housing - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.affordableHousingStats.yearlyTrend.map(item => ({
            name: item.year,
            value: item.cumulativeUnits
          }))}
          title="Cumulative Affordable Housing Units"
          dataAlert="Total affordable units created/preserved since 2016"
          showArea={true}
          color="#22c55e"
          xAxisLabel="Year"
          yAxisLabel="Cumulative Units"
        />
      </div>
    </div>
  );
}