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

  // Get latest year from data
  const latestYear = data.yearlyTrends.length > 0 ? data.yearlyTrends[data.yearlyTrends.length - 1].year : '2023';
  const earliestYear = data.yearlyTrends.length > 0 ? data.yearlyTrends[0].year : '2013';

  // Calculate percentages using real data
  const demographicData = [
    {
      label: 'Students with Disabilities',
      value: data.stats.studentsWithDisabilities,
      percentage: data.stats.disabilitiesPercentage,
    },
    {
      label: 'English Language Learners',
      value: data.stats.englishLanguageLearners,
      percentage: data.stats.ellPercentage,
    },
    {
      label: 'Students in Poverty',
      value: data.stats.studentsInPoverty,
      percentage: data.stats.povertyPercentage,
    },
    {
      label: 'Students with Economic Need',
      value: Math.round((data.stats.averageEconomicNeedIndex / 100) * data.stats.totalEnrollment),
      percentage: data.stats.averageEconomicNeedIndex,
    },
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60rem]">
        {/* Student Demographics - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={demographicData.map(item => ({
            name: item.label.length > 12 ? item.label.substring(0, 12) + '...' : item.label,
            value: item.value,
            fill: '#3b82f6',
            fullLabel: item.label // Full label for tooltip
          }))}
          title="Student Demographics"
          dataAlert={`Source: NYC DOE Demographic Snapshot (${earliestYear}-${latestYear})`}
          xAxisLabel="Student Categories"
          yAxisLabel="Number of Students"
        />
      </div>

        {/* Enrollment Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.yearlyTrends.map(trend => ({
            name: trend.year,
            value: trend.enrollment,
            fullLabel: `Year ${trend.year}: ${trend.enrollment.toLocaleString()} students`
          }))}
          title="Enrollment Trends"
          dataAlert={`Historical enrollment data from NYC DOE (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="Total Enrollment"
        />
      </div>

        {/* Students with Disabilities Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.yearlyTrends.map(trend => ({
            name: trend.year,
            value: trend.disabilities,
            fullLabel: `Year ${trend.year}: ${trend.disabilities.toLocaleString()} students with disabilities`
          }))}
          title="Students with Disabilities Trend"
          dataAlert={`Students with disabilities over time (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#8b5cf6"
          xAxisLabel="Year"
          yAxisLabel="Number of Students"
        />
      </div>

        {/* English Language Learners Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.yearlyTrends.map(trend => ({
            name: trend.year,
            value: trend.ell,
            fullLabel: `Year ${trend.year}: ${trend.ell.toLocaleString()} English Language Learners`
          }))}
          title="English Language Learners Trend"
          dataAlert={`ELL students over time (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#f59e0b"
          xAxisLabel="Year"
          yAxisLabel="Number of Students"
        />
      </div>

        {/* Students in Poverty Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.yearlyTrends.map(trend => ({
            name: trend.year,
            value: trend.poverty,
            fullLabel: `Year ${trend.year}: ${trend.poverty.toLocaleString()} students in poverty`
          }))}
          title="Students in Poverty Trend"
          dataAlert={`Students living in poverty over time (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#ef4444"
          xAxisLabel="Year"
          yAxisLabel="Number of Students"
        />
      </div>

        {/* Economic Need Index Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.yearlyTrends.map(trend => ({
            name: trend.year,
            value: Math.round(trend.economicNeedIndex * 100) / 100,
            fullLabel: `Year ${trend.year}: Economic Need Index ${Math.round(trend.economicNeedIndex * 100) / 100}`
          }))}
          title="Economic Need Index Trend"
          dataAlert={`Average economic need index over time (${earliestYear}-${latestYear})`}
          showArea={false}
          color="#22c55e"
          xAxisLabel="Year"
          yAxisLabel="Economic Need Index"
        />
      </div>
    </div>
  );
}