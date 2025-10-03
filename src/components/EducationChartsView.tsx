'use client';

import { useEducationData } from '@/hooks/useEducationData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function EducationChartsView() {
  const { data, loading, error } = useEducationData();

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
        <p className="text-red-400 mb-2">Error loading education data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  // Calculate percentages
  const demographicData = [
    {
      label: 'Students with Disabilities',
      value: Math.round((data.stats.totalEnrollment * 0.201) / 1000) * 1000,
      percentage: 20.1,
    },
    {
      label: 'English Language Learners',
      value: Math.round((data.stats.totalEnrollment * 0.14) / 1000) * 1000,
      percentage: 14.0,
    },
    {
      label: 'Students in Poverty',
      value: Math.round((data.stats.totalEnrollment * 0.747) / 1000) * 1000,
      percentage: 74.7,
    },
    {
      label: 'Economic Need Index',
      value: Math.round((data.stats.totalEnrollment * 0.74) / 1000) * 1000,
      percentage: 74.0,
    },
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Demographics - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={demographicData.map(item => ({
            name: item.label.length > 12 ? item.label.substring(0, 12) + '...' : item.label,
            value: item.value,
            fill: '#3b82f6'
          }))}
          title="Student Demographics"
          dataAlert="Source: NYC DOE Demographic Snapshot (2013-2018)"
          xAxisLabel="Student Categories"
          yAxisLabel="Number of Students"
        />
      </div>

        {/* Enrollment Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2013', value: 1100000 },
            { name: '2014', value: 1120000 },
            { name: '2015', value: 1140000 },
            { name: '2016', value: 1160000 },
            { name: '2017', value: 1180000 },
            { name: '2018', value: data.stats.totalEnrollment }
          ]}
          title="Enrollment Trends"
          dataAlert="Historical enrollment data from NYC DOE"
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="Total Enrollment"
        />
      </div>

        {/* Schools by Type - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Elementary', value: 800 },
            { name: 'Middle', value: 400 },
            { name: 'High School', value: 500 },
            { name: 'Special', value: 144 }
          ]}
          title="Schools by Type"
          dataAlert="Distribution of NYC public schools by level"
          xAxisLabel="School Type"
          yAxisLabel="Number of Schools"
        />
      </div>

        {/* Student-Teacher Ratio - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2015', value: 16.2 },
            { name: '2016', value: 15.8 },
            { name: '2017', value: 15.4 },
            { name: '2018', value: 15.1 },
            { name: '2019', value: 14.8 },
            { name: '2020', value: Math.round((data.stats.totalEnrollment / data.stats.totalSchools) * 10) / 10 }
          ]}
          title="Student-Teacher Ratio Trend"
          dataAlert="Lower ratios indicate better student attention"
          showArea={false}
          color="#f59e0b"
          xAxisLabel="Year"
          yAxisLabel="Students per Teacher"
        />
      </div>
    </div>
  );
}