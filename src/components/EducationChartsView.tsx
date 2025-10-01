'use client';

import { useEducationData } from '@/hooks/useEducationData';
import ChartCard from './ChartCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function EducationChartsView() {
  const { data, loading, error, refetch } = useEducationData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse h-96">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-[#1f2937] rounded w-full"></div>
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

  // Create chart indicators
  const chartIndicators: Indicator[] = [
    {
      id: 'chart-enrollment',
      title: 'Total Student Enrollment (2013-2018)',
      category: 'Education',
      description: 'Trend in total student enrollment across NYC public schools.',
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
      id: 'chart-disabilities',
      title: 'Students with Disabilities % (2013-2018)',
      category: 'Education',
      description: 'Percentage of students requiring special education services over time.',
      value: Math.round(data.stats.disabilitiesPercentage * 10) / 10,
      unit: '%',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#ec4899',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.disabilities / t.enrollment) * 100,
      })),
    },
    {
      id: 'chart-ell',
      title: 'English Language Learners % (2013-2018)',
      category: 'Education',
      description: 'Percentage of students requiring English language support.',
      value: Math.round(data.stats.ellPercentage * 10) / 10,
      unit: '%',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#3b82f6',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.ell / t.enrollment) * 100,
      })),
    },
    {
      id: 'chart-poverty',
      title: 'Students in Poverty % (2013-2018)',
      category: 'Education',
      description: 'Percentage of students from economically disadvantaged backgrounds.',
      value: Math.round(data.stats.povertyPercentage * 10) / 10,
      unit: '%',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#ef4444',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: (t.poverty / t.enrollment) * 100,
      })),
    },
    {
      id: 'chart-eni',
      title: 'Economic Need Index (2013-2018)',
      category: 'Education',
      description: 'Average Economic Need Index across all NYC schools.',
      value: Math.round(data.stats.averageEconomicNeedIndex * 10) / 10,
      unit: '%',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC DOE',
      color: '#f59e0b',
      chartData: data.yearlyTrends.map(t => ({
        year: parseInt(t.year.split('-')[0]),
        value: t.economicNeedIndex,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Chart View */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {chartIndicators.map(indicator => (
          <ChartCard key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

