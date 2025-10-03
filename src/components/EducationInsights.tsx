'use client';

import { useEducationData } from '@/hooks/useEducationData';
import CompactMetricCard from './CompactMetricCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function EducationInsights() {
  const { data, loading, error, refetch } = useEducationData();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-3 sm:p-4 animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-[#1f2937] rounded w-1/2"></div>
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
      higherIsBetter: true,
      explanation: 'Total children accessing public education. Higher enrollment indicates strong public school system participation and youth population growth.',
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
      explanation: 'Share of students receiving special education services. This metric tracks accessibility and support for students with diverse learning needs.',
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
      explanation: 'Students learning English as a new language. Reflects cultural diversity and the need for language support resources in schools.',
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
      higherIsBetter: false,
      explanation: 'Children living in economic hardship. Lower percentages indicate improving family economic conditions and reduced need for assistance programs.',
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
      higherIsBetter: false,
      explanation: 'Composite measure of student economic disadvantage. Lower index means less poverty, better housing stability, and improved family economic security.',
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
      higherIsBetter: true,
      explanation: 'Total number of public schools serving NYC communities. More schools can mean greater access and neighborhood education options.',
    },
  ];


  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Education Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">Student demographics and educational performance metrics</p>
      </div>

      {/* Header with live data badge and refresh button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Live data from NYC Open Data</span>
          </div>
          <span className="text-gray-500 hidden sm:inline">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
          <span className="text-gray-500 sm:hidden">Updated {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 items-start">
        {indicators.map((indicator) => (
          <CompactMetricCard key={indicator.id} indicator={indicator} />
        ))}
      </div>


    </div>
  );
}

