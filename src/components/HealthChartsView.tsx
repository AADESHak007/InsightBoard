import React from 'react';
import { useHealthData } from '../hooks/useHealthData';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';

export default function HealthChartsView() {
  const { data, loading, error } = useHealthData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <p className="text-red-400">Failed to load health data</p>
      </div>
    );
  }

  const totalGraded = data.restaurantStats.gradeA + data.restaurantStats.gradeB + data.restaurantStats.gradeC;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Health Insights - Visualize</h2>
          <p className="text-gray-400 mt-1">Comprehensive health data visualization</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
      </div>

      {/* Core Health Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Restaurant Grades Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Restaurant Food Safety Grades</h3>
            <p className="text-sm text-gray-400 mt-1">
              Grade distribution from recent inspections • Source: NYC DOHMH Restaurant Inspections
            </p>
          </div>
          <PieChart
            data={[
              {
                label: 'Grade A - Excellent',
                value: data.restaurantStats.gradeA,
                percentage: (data.restaurantStats.gradeA / totalGraded) * 100,
              },
              {
                label: 'Grade B - Good',
                value: data.restaurantStats.gradeB,
                percentage: (data.restaurantStats.gradeB / totalGraded) * 100,
              },
              {
                label: 'Grade C - Needs Improvement',
                value: data.restaurantStats.gradeC,
                percentage: (data.restaurantStats.gradeC / totalGraded) * 100,
              },
            ]}
            title=""
            size={450}
          />
        </div>

        {/* Inspections by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <BarChart
            data={Object.entries(data.restaurantStats.inspectionsByBorough)
              .filter(([borough]) => borough !== 'UNKNOWN')
              .map(([borough, count]) => ({
                label: borough,
                value: count,
                percentage: (count / data.restaurantStats.totalInspections) * 100,
              }))
              .sort((a, b) => b.value - a.value)}
            title="Restaurant Inspections by Borough"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Number of Inspections"
          />
        </div>
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from health data
          </p>
        </div>

        {/* Top Causes of Death - Bar Graph */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Top 10 Leading Causes of Death</h4>
              <span className="text-xs text-gray-400 bg-[#1a1f2e] px-3 py-1 rounded-full">
                {data.mortalityStats.topCauses.reduce((sum, c) => sum + c.deaths, 0).toLocaleString()} total deaths
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Source: NYC DOHMH Vital Statistics
            </p>
          </div>
          <BarChart
            data={data.mortalityStats.topCauses
              .filter(c => c.deaths > 0)
              .map((cause, index) => {
                const totalDeaths = data.mortalityStats.topCauses.reduce((sum, c) => sum + c.deaths, 0);
                const percentage = (cause.deaths / totalDeaths) * 100;
                return {
                  label: `#${index + 1} ${cause.cause.length > 25 ? cause.cause.substring(0, 25) + '...' : cause.cause}`,
                  value: cause.deaths,
                  percentage: percentage
                };
              })}
            title="Deaths by Cause"
            height={600}
            xAxisLabel="Cause of Death"
            yAxisLabel="Number of Deaths"
            dataAlert="Data from NYC DOHMH Vital Statistics"
          />
        </div>

        {/* Health Trends Over Time - Independent Line Graph */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Health Trends Over Time</h4>
            <p className="text-sm text-gray-400 mt-1">
              Simulated trend data for demonstration
            </p>
          </div>
          <LineChart
            data={[
              { x: '2019', y: 85.2, label: '2019' },
              { x: '2020', y: 78.5, label: '2020' },
              { x: '2021', y: 82.1, label: '2021' },
              { x: '2022', y: 87.3, label: '2022' },
              { x: '2023', y: 89.7, label: '2023' },
              { x: '2024', y: 91.2, label: '2024' },
            ]}
            title="Restaurant Grade A Percentage Over Time"
            height={400}
            color="#10b981"
            xAxisLabel="Year"
            yAxisLabel="Grade A Percentage"
            dataAlert="Simulated trend data for demonstration purposes"
          />
        </div>
      </div>
    </div>
  );
}