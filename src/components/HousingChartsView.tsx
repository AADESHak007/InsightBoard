import React from 'react';
import { useHousingData } from '../hooks/useHousingData';
import BarChart from './charts/BarChart';
import GroupedBarChart from './charts/GroupedBarChart';
import PieChart from './charts/PieChart';

export default function HousingChartsView() {
  const { data, loading, error } = useHousingData();

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
        <p className="text-red-400">Failed to load housing data</p>
      </div>
    );
  }

  // Prepare borough correlation data
  const correlationData = data.correlation.map(c => ({
    label: c.borough,
    value: c.permits,
    percentage: (c.permits / data.permitStats.totalPermits) * 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Housing Insights - Visualize</h2>
          <p className="text-gray-400 mt-1">Comprehensive housing data visualization</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
      </div>

      {/* Core Housing Metrics */}
      {/* Construction Permits by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <BarChart
          data={correlationData}
          title="Construction Permits by Borough"
          height={400}
          color="#3b82f6"
          xAxisLabel="Borough"
          yAxisLabel="Number of Permits"
        />
      </div>

      {/* Derived Insights Section */}
      <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] border border-[#374151] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📊 Derived Insights</h3>
          <p className="text-sm text-gray-400">
            Advanced analysis and trends derived from housing data
          </p>
        </div>

        {/* Permits vs Violations - Grouped Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Permits vs Violations by Borough</h4>
            <p className="text-sm text-gray-400 mt-1">
              Compares construction activity with housing code violations. Lower violations relative to permits = better compliance.
            </p>
          </div>
          <GroupedBarChart
            data={data.correlation.map(c => ({
              label: c.borough,
              value1: c.permits,
              value2: c.violations,
              label1: 'Permits',
              label2: 'Violations',
            }))}
            title=""
            height={450}
            color1="#3b82f6"
            color2="#ef4444"
            xAxisLabel="Borough"
            yAxisLabel="Count"
          />
          
          {/* Ratio Analysis */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {data.correlation.map((borough) => (
              <div key={borough.borough} className="bg-[#1a1f2e] rounded-lg p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">{borough.borough}</div>
                <div className={`text-2xl font-bold ${
                  borough.ratio < 0.5 ? 'text-green-400' : 
                  borough.ratio < 1.0 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {borough.ratio.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">V/P ratio</div>
              </div>
            ))}
          </div>
        </div>

        {/* Violation Severity - Pie Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-white">Violation Severity Distribution</h4>
            <p className="text-sm text-gray-400 mt-1">
              Class A: Non-hazardous • Class B: Hazardous • Class C: Immediately Hazardous
            </p>
          </div>
          <PieChart
            data={[
              {
                label: 'Class A - Non-Hazardous',
                value: data.violationStats.classA,
                percentage: (data.violationStats.classA / data.violationStats.totalViolations) * 100,
              },
              {
                label: 'Class B - Hazardous',
                value: data.violationStats.classB,
                percentage: (data.violationStats.classB / data.violationStats.totalViolations) * 100,
              },
              {
                label: 'Class C - Immediately Hazardous',
                value: data.violationStats.classC,
                percentage: (data.violationStats.classC / data.violationStats.totalViolations) * 100,
              },
            ]}
            title=""
            size={450}
          />
        </div>
      </div>
    </div>
  );
}
