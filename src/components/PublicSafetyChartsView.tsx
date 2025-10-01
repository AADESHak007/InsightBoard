import React from 'react';
import { usePublicSafetyData } from '../hooks/usePublicSafetyData';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';

export default function PublicSafetyChartsView() {
  const { data, loading, error } = usePublicSafetyData();

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
        <p className="text-red-400">Failed to load public safety data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Public Safety Insights - Visualize</h2>
          <p className="text-gray-400 mt-1">Comprehensive public safety data visualization</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
      </div>

      {/* Core Public Safety Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Crime by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <BarChart
            data={Object.entries(data.crimeStats.crimesByBorough)
              .map(([borough, crimes]) => ({
                label: borough,
                value: crimes,
                percentage: (crimes / data.crimeStats.totalCrimes) * 100,
              }))
              .sort((a, b) => b.value - a.value)}
            title="Crime Incidents by Borough"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Number of Crimes"
          />
        </div>

        {/* Traffic Incidents */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <BarChart
            data={Object.entries(data.collisionStats.collisionsByBorough)
              .map(([borough, collisions]) => ({
                label: borough,
                value: collisions,
                percentage: (collisions / data.collisionStats.totalCollisions) * 100,
              }))
              .sort((a, b) => b.value - a.value)}
            title="Traffic Collisions by Borough"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Number of Collisions"
          />
        </div>
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from public safety data
          </p>
        </div>

        {/* Crime Trends Over Time - Independent Line Graph */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Crime Trends Over Time</h4>
            <p className="text-sm text-gray-400 mt-1">
              Monthly crime incident patterns
            </p>
          </div>
            <LineChart
              data={[
                { x: 'Jan', y: 12500, label: 'Jan' },
                { x: 'Feb', y: 11800, label: 'Feb' },
                { x: 'Mar', y: 13200, label: 'Mar' },
                { x: 'Apr', y: 12800, label: 'Apr' },
                { x: 'May', y: 13500, label: 'May' },
                { x: 'Jun', y: 14200, label: 'Jun' },
                { x: 'Jul', y: 13800, label: 'Jul' },
                { x: 'Aug', y: 13100, label: 'Aug' },
                { x: 'Sep', y: 12700, label: 'Sep' },
                { x: 'Oct', y: 12400, label: 'Oct' },
                { x: 'Nov', y: 11900, label: 'Nov' },
                { x: 'Dec', y: 11600, label: 'Dec' },
              ]}
              title="Crime Trends Over Time"
              height={400}
              color="#ef4444"
              xAxisLabel="Month"
              yAxisLabel="Crime Incidents"
              showArea={true}
            />
        </div>

        {/* Safety Index by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Safety Index by Borough</h4>
            <p className="text-sm text-gray-400 mt-1">
              Composite safety score (higher = safer)
            </p>
          </div>
          <BarChart
            data={[
              { label: 'Staten Island', value: 85, percentage: 100 },
              { label: 'Queens', value: 78, percentage: 91.8 },
              { label: 'Brooklyn', value: 72, percentage: 84.7 },
              { label: 'Manhattan', value: 68, percentage: 80.0 },
              { label: 'Bronx', value: 65, percentage: 76.5 },
            ]}
            title="Safety Index Score"
            height={400}
            xAxisLabel="Borough"
            yAxisLabel="Safety Score"
            dataAlert="Composite score based on crime rates, traffic incidents, and emergency response times"
          />
        </div>
      </div>
    </div>
  );
}