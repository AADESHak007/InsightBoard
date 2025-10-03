'use client';

import { useTransportationData } from '@/hooks/useTransportationData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function TransportationChartsView() {
  const { data, loading, error } = useTransportationData();

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
        <p className="text-red-400 mb-2">Error loading transportation data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  // Get data period for subway performance
  const earliestYear = data.subwayPerformanceStats.yearlyTrend[0]?.year || '2013';
  const latestYear = data.subwayPerformanceStats.yearlyTrend[data.subwayPerformanceStats.yearlyTrend.length - 1]?.year || '2025';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[80rem]">
      {/* Subway On-Time Performance Trend */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.subwayPerformanceStats.yearlyTrend.map(t => ({
            name: t.year,
            value: t.onTimePerformance
          }))}
          title="Subway On-Time Performance Trend"
          dataAlert={`MTA subway performance data (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="On-Time Performance (%)"
        />
      </div>

      {/* Subway Performance by Division */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={data.subwayPerformanceStats.performanceByDivision.map(d => ({
            name: d.division,
            value: d.performance,
            fill: '#3b82f6'
          }))}
          title="Subway Performance by Division"
          dataAlert={`MTA division performance (${latestYear} data)`}
          xAxisLabel="Division"
          yAxisLabel="On-Time Performance (%)"
        />
      </div>

      {/* Best vs Worst Performance Years */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: `Best: ${data.subwayPerformanceStats.bestYear.year}`, value: data.subwayPerformanceStats.bestYear.performance, fill: '#10b981' },
            { name: `Worst: ${data.subwayPerformanceStats.worstYear.year}`, value: data.subwayPerformanceStats.worstYear.performance, fill: '#ef4444' },
            { name: `Average`, value: data.subwayPerformanceStats.averagePerformance, fill: '#6b7280' },
            { name: `Current`, value: data.subwayPerformanceStats.currentYearPerformance, fill: '#3b82f6' }
          ]}
          title="Subway Performance Comparison"
          dataAlert="Best, worst, average, and current year performance"
          xAxisLabel="Performance Category"
          yAxisLabel="On-Time Performance (%)"
        />
      </div>

      {/* Top Performing Subway Lines */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={data.subwayPerformanceStats.performanceByLine.slice(0, 8).map(l => ({
            name: `Line ${l.line}`,
            value: l.performance,
            fill: '#8b5cf6'
          }))}
          title="Top Performing Subway Lines"
          dataAlert={`Best performing lines by on-time performance (${latestYear} data)`}
          xAxisLabel="Subway Line"
          yAxisLabel="On-Time Performance (%)"
        />
      </div>

      {/* Performance Improvement Trend */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.subwayPerformanceStats.yearlyTrend.map((t, index) => ({
            name: t.year,
            value: index === 0 ? 0 : ((t.onTimePerformance - data.subwayPerformanceStats.yearlyTrend[0].onTimePerformance) / data.subwayPerformanceStats.yearlyTrend[0].onTimePerformance) * 100
          }))}
          title="Subway Performance Improvement"
          dataAlert="Percentage improvement from baseline year"
          showArea={false}
          color="#f59e0b"
          xAxisLabel="Year"
          yAxisLabel="Improvement (%)"
        />
      </div>

      {/* Total Trips vs On-Time Trips */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={data.subwayPerformanceStats.yearlyTrend.map(t => ({
            name: t.year,
            value: t.totalTrips
          }))}
          title="Total Subway Trips by Year"
          dataAlert={`Total scheduled trips (${earliestYear}-${latestYear})`}
          showArea={true}
          color="#06b6d4"
          xAxisLabel="Year"
          yAxisLabel="Total Trips"
        />
      </div>
    </div>
  );
}