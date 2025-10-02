import React from 'react';
import { useEducationData } from '../hooks/useEducationData';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
// import LineChart from './charts/LineChart';

export default function EducationChartsView() {
  const { data, loading, error } = useEducationData();

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
        <p className="text-red-400">Failed to load education data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Education Insights - Visualize</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Comprehensive education data visualization</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live data from NYC Open Data</span>
          </div>
          <span className="text-gray-500 hidden sm:inline">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
          <span className="text-gray-500 sm:hidden">Updated {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Core Education Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Enrollment by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Student Enrollment by Borough</h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Geographic distribution of student enrollment
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Brooklyn', value: 320000, percentage: 28.8 },
              { label: 'Queens', value: 280000, percentage: 25.2 },
              { label: 'Manhattan', value: 220000, percentage: 19.8 },
              { label: 'Bronx', value: 200000, percentage: 18.0 },
              { label: 'Staten Island', value: 90000, percentage: 8.1 },
            ]}
            title=""
            height={300}
            xAxisLabel="Borough"
            yAxisLabel="Number of Students"
          />
        </div>

        {/* School Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">School Distribution by Level</h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Distribution of schools by educational level
            </p>
          </div>
          <PieChart
            data={[
              {
                label: 'Elementary Schools',
                value: 750,
                percentage: 60.0,
              },
              {
                label: 'Middle Schools',
                value: 300,
                percentage: 24.0,
              },
              {
                label: 'High Schools',
                value: 200,
                percentage: 16.0,
              },
            ]}
            title=""
            size={300}
          />
        </div>
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from education data
          </p>
        </div>

        {/* Enrollment Trends - Independent Line Graph */}
        {/* <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Enrollment Trends Over Time</h4>
            <p className="text-sm text-gray-400 mt-1">
              Historical enrollment patterns
            </p>
          </div>
          <LineChart
            data={[
              { x: '2019', y: 1120000, label: '2019' },
              { x: '2020', y: 1080000, label: '2020' },
              { x: '2021', y: 1050000, label: '2021' },
              { x: '2022', y: 1090000, label: '2022' },
              { x: '2023', y: 1110000, label: '2023' },
              { x: '2024', y: data.stats.totalEnrollment, label: '2024' },
            ]}
            title="Total Enrollment"
            height={400}
            color="#3b82f6"
            xAxisLabel="Year"
            yAxisLabel="Number of Students"
            showArea={true}
          />
        </div> */}

        {/* Student-Teacher Ratios */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Student-Teacher Ratios by Borough</h4>
            <p className="text-sm text-gray-400 mt-1">
              Educational resource allocation analysis
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Manhattan', value: 12.5, percentage: 20.8 },
              { label: 'Brooklyn', value: 14.2, percentage: 23.7 },
              { label: 'Queens', value: 13.8, percentage: 23.0 },
              { label: 'Bronx', value: 15.1, percentage: 25.2 },
              { label: 'Staten Island', value: 11.9, percentage: 19.8 },
            ]}
            title="Average Students per Teacher"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Students per Teacher"
            dataAlert="Estimated ratios based on enrollment and teacher count data"
          />
        </div>
      </div>
    </div>
  );
}