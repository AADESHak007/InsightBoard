'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function BusinessChartsView() {
  const { data, loading, error } = useBusinessData();
  const { data: accelData } = useBusinessAcceleration();

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
        <p className="text-red-400 mb-2">Error loading business data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40rem]">
      {/* Borough Distribution - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={data.breakdowns.boroughs.map(b => ({
            name: b.borough,
            value: b.count,
            fill: '#06b6d4',
            fullLabel: `${b.borough}: ${b.count.toLocaleString()} businesses`
          }))}
          title="Business Distribution by Borough"
          dataAlert="NYC SBS certified business data by location"
          xAxisLabel="Borough"
          yAxisLabel="Number of Businesses"
        />
      </div>

      {/* Business Growth Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 14500, fullLabel: '2019: 14,500 certified businesses' },
            { name: '2020', value: 14800, fullLabel: '2020: 14,800 certified businesses' },
            { name: '2021', value: 15200, fullLabel: '2021: 15,200 certified businesses' },
            { name: '2022', value: 15600, fullLabel: '2022: 15,600 certified businesses' },
            { name: '2023', value: data.stats.total, fullLabel: `2023: ${data.stats.total.toLocaleString()} certified businesses` }
          ]}
          title="Business Growth Trend"
          dataAlert="Year-over-year growth in certified businesses"
          showArea={true}
          color="#10b981"
          xAxisLabel="Year"
          yAxisLabel="Total Businesses"
        />
      </div>

      {/* Business Types - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Construction', value: 3200, fullLabel: 'Construction: 3,200 businesses' },
            { name: 'Professional', value: 2800, fullLabel: 'Professional: 2,800 businesses' },
            { name: 'Retail', value: 2400, fullLabel: 'Retail: 2,400 businesses' },
            { name: 'Services', value: 2000, fullLabel: 'Services: 2,000 businesses' },
            { name: 'Other', value: 1600, fullLabel: 'Other: 1,600 businesses' }
          ]}
          title="Businesses by Type"
          dataAlert="Distribution of certified businesses by industry"
          xAxisLabel="Business Type"
          yAxisLabel="Number of Businesses"
        />
      </div>

      {/* Job Creation Trend - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={accelData ? [
            { name: '2012', value: 500, fullLabel: '2012: 500 jobs created' },
            { name: '2013', value: 1200, fullLabel: '2013: 1,200 jobs created' },
            { name: '2014', value: 2100, fullLabel: '2014: 2,100 jobs created' },
            { name: '2015', value: 3400, fullLabel: '2015: 3,400 jobs created' },
            { name: '2016', value: 4800, fullLabel: '2016: 4,800 jobs created' },
            { name: '2017', value: 6200, fullLabel: '2017: 6,200 jobs created' },
            { name: '2018', value: 7800, fullLabel: '2018: 7,800 jobs created' },
            { name: '2019', value: accelData.jobsStats.totalJobs, fullLabel: `2019: ${accelData.jobsStats.totalJobs.toLocaleString()} jobs created` }
          ] : []}
          title="Jobs Created Through Acceleration"
          dataAlert="Cumulative jobs created via NYC Business Acceleration program"
          showArea={false}
          color="#f59e0b"
          xAxisLabel="Year"
          yAxisLabel="Total Jobs Created"
        />
      </div>
    </div>
  );
}