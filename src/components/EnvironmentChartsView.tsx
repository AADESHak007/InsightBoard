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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[80rem]">
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
          data={data.pm25YearlyTrend.map(item => ({
            name: item.year,
            value: Math.round(item.pm25 * 10) / 10
          }))}
          title="Air Quality Improvement (PM2.5)"
          dataAlert="Annual average PM2.5 levels (μg/m³) - lower is better"
          showArea={true}
          color="#84cc16"
          xAxisLabel="Year"
          yAxisLabel="PM2.5 Level (μg/m³)"
        />
      </div>

      {/* GHG Emissions Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.ghgEmissionsStats.yearlyTrend.map(item => ({
            name: item.year,
            value: item.emissions
          }))}
          title="Greenhouse Gas Emissions Reduction"
          dataAlert="Citywide CO2e emissions (thousands of tons) - showing climate action progress"
          showArea={true}
          color="#06b6d4"
          xAxisLabel="Year"
          yAxisLabel="Emissions (1,000 tons CO2e)"
        />
      </div>

      {/* GHG Emissions Reduction - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: '2005', value: data.ghgEmissionsStats.totalEmissions2005 },
            { name: '2023', value: data.ghgEmissionsStats.totalEmissions2023 }
          ]}
          title="GHG Emissions: 2005 vs 2023"
          dataAlert={`${data.ghgEmissionsStats.reductionPercent}% reduction achieved through climate policies`}
          xAxisLabel="Year"
          yAxisLabel="Emissions (1,000 tons CO2e)"
        />
      </div>

      {/* Recycling Diversion Rate - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.recyclingDiversionStats.yearlyTrend.map(item => ({
            name: item.year,
            value: Math.round(item.diversionRate * 10) / 10
          }))}
          title="Recycling Diversion Rate"
          dataAlert="Percentage of waste diverted from landfills through recycling and composting"
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="Diversion Rate (%)"
        />
      </div>

      {/* Waste Collection Trends - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: '2012', value: data.recyclingDiversionStats.yearlyTrend.find(d => d.year === '2012')?.diversionRate || 0 },
            { name: data.recyclingDiversionStats.yearlyTrend[data.recyclingDiversionStats.yearlyTrend.length - 1]?.year || 'Latest', value: data.recyclingDiversionStats.currentDiversionRate }
          ]}
          title={`Recycling Progress: 2012 vs ${data.recyclingDiversionStats.yearlyTrend[data.recyclingDiversionStats.yearlyTrend.length - 1]?.year || 'Latest'}`}
          dataAlert={`${data.recyclingDiversionStats.improvementPercent}% improvement in diversion rate`}
          xAxisLabel="Year"
          yAxisLabel="Diversion Rate (%)"
        />
      </div>
    </div>
  );
}