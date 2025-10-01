'use client';

import { useEducationData } from '@/hooks/useEducationData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import PieChart from './charts/PieChart';
import { Indicator } from '@/types/indicator';

export default function EducationInsights() {
  const { data, loading, error, refetch } = useEducationData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#1f2937] rounded w-1/2 mb-6"></div>
            <div className="h-12 bg-[#1f2937] rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading education data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No education data available</p>
      </div>
    );
  }

  // Convert to Indicator format
  const indicators: Indicator[] = [
    {
      id: 'edu-1',
      title: 'Total Student Enrollment',
      category: 'Education',
      description: 'Total number of students enrolled across all NYC public schools.',
      value: data.stats.totalEnrollment,
      unit: 'students',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#8b5cf6',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: t.enrollment,
      })),
    },
    {
      id: 'edu-2',
      title: 'Students with Disabilities',
      category: 'Education',
      description: 'Percentage of students requiring special education services.',
      value: Math.round(data.stats.disabilitiesPercentage * 10) / 10,
      unit: '%',
      target: 20,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      trend: 'stable',
      color: '#ec4899',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.disabilities / t.enrollment) * 100,
      })),
    },
    {
      id: 'edu-3',
      title: 'English Language Learners',
      category: 'Education',
      description: 'Percentage of students requiring English language support.',
      value: Math.round(data.stats.ellPercentage * 10) / 10,
      unit: '%',
      target: 15,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      trend: 'stable',
      color: '#3b82f6',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.ell / t.enrollment) * 100,
      })),
    },
    {
      id: 'edu-4',
      title: 'Students in Poverty',
      category: 'Education',
      description: 'Percentage of students from economically disadvantaged backgrounds.',
      value: Math.round(data.stats.povertyPercentage * 10) / 10,
      unit: '%',
      target: 60,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      trend: data.stats.povertyPercentage < 70 ? 'down' : 'stable',
      color: '#ef4444',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.poverty / t.enrollment) * 100,
      })),
    },
    {
      id: 'edu-5',
      title: 'Economic Need Index',
      category: 'Education',
      description: 'Average Economic Need Index across all schools (higher = more need).',
      value: Math.round(data.stats.averageEconomicNeedIndex * 10) / 10,
      unit: '%',
      target: 70,
      targetCondition: '<=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      trend: 'stable',
      color: '#f59e0b',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: t.economicNeedIndex,
      })),
    },
    {
      id: 'edu-6',
      title: 'NYC Public Schools',
      category: 'Education',
      description: 'Total number of public schools tracked in the system.',
      value: data.stats.totalSchools,
      unit: 'schools',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#06b6d4',
    },
  ];

  // Calculate demographic percentages
  const totalStudents = data.demographicBreakdown.asian + 
                        data.demographicBreakdown.black + 
                        data.demographicBreakdown.hispanic + 
                        data.demographicBreakdown.white + 
                        data.demographicBreakdown.other;

  const demographicData = [
    {
      label: 'Hispanic',
      value: data.demographicBreakdown.hispanic,
      percentage: (data.demographicBreakdown.hispanic / totalStudents) * 100,
    },
    {
      label: 'Black',
      value: data.demographicBreakdown.black,
      percentage: (data.demographicBreakdown.black / totalStudents) * 100,
    },
    {
      label: 'Asian',
      value: data.demographicBreakdown.asian,
      percentage: (data.demographicBreakdown.asian / totalStudents) * 100,
    },
    {
      label: 'White',
      value: data.demographicBreakdown.white,
      percentage: (data.demographicBreakdown.white / totalStudents) * 100,
    },
    {
      label: 'Other',
      value: data.demographicBreakdown.other,
      percentage: (data.demographicBreakdown.other / totalStudents) * 100,
    },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Header with live data badge and refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {indicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Student Demographics - Pie Chart */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Student Demographics</h3>
            <span className="text-xs text-gray-400 bg-[#1a1f2e] px-3 py-1 rounded-full">
              {totalStudents.toLocaleString()} total students
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Source: NYC DOE Demographic Snapshot (2013-2018)
          </p>
        </div>
        <PieChart
          data={demographicData}
          title=""
          size={500}
        />
      </div>

      {/* Key Metrics Over Time */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Trends Over Time (2013-2018)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enrollment Trend */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Total Enrollment</h4>
            <div className="space-y-2">
              {data.yearlyTrends.map((trend) => (
                <div key={trend.year} className="flex justify-between text-sm">
                  <span className="text-gray-300">{trend.year}</span>
                  <span className="text-cyan-400 font-semibold">{trend.enrollment.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Poverty Trend */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Economic Need Index (Average)</h4>
            <div className="space-y-2">
              {data.yearlyTrends.map((trend) => (
                <div key={trend.year}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{trend.year}</span>
                    <span className="text-orange-400 font-semibold">{trend.economicNeedIndex.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#1f2937] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                      style={{ width: `${trend.economicNeedIndex}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

