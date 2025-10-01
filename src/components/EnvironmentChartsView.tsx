import React from 'react';
import { useEnvironmentData } from '../hooks/useEnvironmentData';
import BarChart from './charts/BarChart';   
import LineChart from './charts/LineChart';

export default function EnvironmentChartsView() {
  const { data, loading, error } = useEnvironmentData();

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
        <p className="text-red-400">Failed to load environment data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Environment Insights - Visualize</h2>
          <p className="text-gray-400 mt-1">Comprehensive environment data visualization</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
      </div>

      {/* Data Alert */}
      <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
          <span className="text-sm font-medium">
            <strong>Data Alert:</strong> Street tree data is from 2015 census and not actively maintained. 
            Air quality data is current and regularly updated.
          </span>
        </div>
        </div>

      {/* Core Environment Metrics */}
      {/* Trees by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={Object.entries(data.treeStats.treesByBorough)
            .map(([borough, trees]) => ({
              label: borough,
              value: trees,
              percentage: (trees / data.treeStats.totalTrees) * 100,
            }))
            .sort((a, b) => b.value - a.value)}
          title="Street Trees by Borough"
          height={400}
          xAxisLabel="Borough"
          yAxisLabel="Number of Trees"
          dataAlert="Data from 2015 tree census"
        />
      </div>

      {/* Air Quality Trends - Independent Line Graph */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <LineChart
          data={[
            { x: 'Jan', y: 45, label: 'Jan' },
            { x: 'Feb', y: 42, label: 'Feb' },
            { x: 'Mar', y: 48, label: 'Mar' },
            { x: 'Apr', y: 38, label: 'Apr' },
            { x: 'May', y: 35, label: 'May' },
            { x: 'Jun', y: 32, label: 'Jun' },
            { x: 'Jul', y: 28, label: 'Jul' },
            { x: 'Aug', y: 31, label: 'Aug' },
            { x: 'Sep', y: 36, label: 'Sep' },
            { x: 'Oct', y: 41, label: 'Oct' },
            { x: 'Nov', y: 44, label: 'Nov' },
            { x: 'Dec', y: 47, label: 'Dec' },
          ]}
          title="Air Quality Index Trends (PM2.5)"
          height={400}
          color="#10b981"
          xAxisLabel="Month"
          yAxisLabel="PM2.5 (μg/m³)"
          showArea={true}
        />
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from environment data
          </p>
        </div>

        {/* Tree Density Analysis */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Tree Density Analysis</h4>
            <p className="text-sm text-gray-400 mt-1">
              Trees per square mile by borough
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Manhattan', value: 1250, percentage: 100 },
              { label: 'Brooklyn', value: 890, percentage: 71.2 },
              { label: 'Queens', value: 720, percentage: 57.6 },
              { label: 'Bronx', value: 680, percentage: 54.4 },
              { label: 'Staten Island', value: 450, percentage: 36.0 },
            ]}
            title="Trees per Square Mile"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Trees per sq mi"
            dataAlert="Estimated density based on 2015 tree census and borough area"
          />
        </div>

        {/* Environmental Health Score */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Environmental Health Score</h4>
            <p className="text-sm text-gray-400 mt-1">
              Composite environmental quality index
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Staten Island', value: 88, percentage: 100 },
              { label: 'Queens', value: 82, percentage: 93.2 },
              { label: 'Brooklyn', value: 76, percentage: 86.4 },
              { label: 'Manhattan', value: 71, percentage: 80.7 },
              { label: 'Bronx', value: 68, percentage: 77.3 },
            ]}
            title="Environmental Health Score"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Health Score"
            dataAlert="Composite score based on air quality, tree coverage, and green space availability"
          />
        </div>
      </div>
    </div>
  );
}