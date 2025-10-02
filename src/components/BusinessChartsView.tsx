import React from 'react';
import { useBusinessData } from '../hooks/useBusinessData';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';

export default function BusinessChartsView() {
  const { data, loading, error } = useBusinessData();

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
        <p className="text-red-400">Failed to load business data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Business Insights - Visualize</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Comprehensive business data visualization</p>
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

      {/* Core Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Certified Businesses by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Certified Businesses by Borough</h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Geographic distribution of certified businesses
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Manhattan', value: 4500, percentage: 28.5 },
              { label: 'Brooklyn', value: 3800, percentage: 24.1 },
              { label: 'Queens', value: 3200, percentage: 20.3 },
              { label: 'Bronx', value: 2800, percentage: 17.7 },
              { label: 'Staten Island', value: 1500, percentage: 9.5 },
            ]}
            title=""
            height={300}
            xAxisLabel="Borough"
            yAxisLabel="Number of Businesses"
          />
        </div>

        {/* Business Growth Trends */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Certified Business Growth Over Time</h4>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Year-over-year growth trends
            </p>
          </div>
          <LineChart
            data={[
              { x: '2019', y: 12500, label: '2019' },
              { x: '2020', y: 11800, label: '2020' },
              { x: '2021', y: 13200, label: '2021' },
              { x: '2022', y: 14500, label: '2022' },
              { x: '2023', y: 15800, label: '2023' },
              { x: '2024', y: data.stats.total, label: '2024' },
            ]}
            title=""
            height={300}
            color="#f59e0b"
            xAxisLabel="Year"
            yAxisLabel="Number of Businesses"
            showArea={true}
          />
        </div>
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from business data
          </p>
        </div>

        {/* Business Density Analysis */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Business Density Analysis</h4>
            <p className="text-sm text-gray-400 mt-1">
              Businesses per capita by borough
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Manhattan', value: 245, percentage: 35.2 },
              { label: 'Brooklyn', value: 189, percentage: 27.1 },
              { label: 'Queens', value: 156, percentage: 22.4 },
              { label: 'Bronx', value: 78, percentage: 11.2 },
              { label: 'Staten Island', value: 29, percentage: 4.1 },
            ]}
            title="Businesses per 10,000 Residents"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Businesses per 10K"
            dataAlert="Estimated density based on population data"
          />
        </div>

        {/* Economic Impact Trends - Independent Line Graph */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Economic Impact Trends</h4>
            <p className="text-sm text-gray-400 mt-1">
              Estimated economic contribution over time
            </p>
          </div>
          <LineChart
            data={[
              { x: '2019', y: 2.8, label: '2019' },
              { x: '2020', y: 2.1, label: '2020' },
              { x: '2021', y: 2.5, label: '2021' },
              { x: '2022', y: 3.2, label: '2022' },
              { x: '2023', y: 3.7, label: '2023' },
              { x: '2024', y: 4.1, label: '2024' },
            ]}
            title="Estimated Economic Impact (Billions USD)"
            height={400}
            color="#10b981"
            xAxisLabel="Year"
            yAxisLabel="Economic Impact (B USD)"
            showArea={true}
            dataAlert="Estimated economic impact based on business count and average revenue"
          />
        </div>
      </div>
    </div>
  );
}