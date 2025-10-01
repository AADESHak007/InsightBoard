'use client';

import { useEnvironmentData } from '@/hooks/useEnvironmentData';
import BarChart from './charts/BarChart';   
import PieChart from './charts/PieChart';
import RefreshDataButton from './RefreshDataButton';

export default function EnvironmentChartsView() {
  const { data, loading, error, refetch } = useEnvironmentData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-[400px] bg-[#1f2937] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading environment data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No environment data available</p>
      </div>
    );
  }

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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        
        {/* Air Quality Trends Over Time */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 2xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Air Quality Trends Over Time</h3>
            <p className="text-sm text-gray-400 mt-1">
              Source: NYC DEP Air Quality Monitoring • PM2.5 (mcg/m³), NO₂ & O₃ (ppb)
            </p>
          </div>
          {data.airQualityTrends && data.airQualityTrends.length > 0 ? (
            <div className="h-[450px] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 1200 450">
                {/* Chart background */}
                <rect width="1200" height="450" fill="transparent" />
                
                {/* Calculate dimensions */}
                {(() => {
                  const padding = { left: 80, right: 40, top: 40, bottom: 80 };
                  const chartWidth = 1200 - padding.left - padding.right;
                  const chartHeight = 450 - padding.top - padding.bottom;
                  
                  const maxPM25 = Math.max(...data.airQualityTrends.map(d => d.pm25));
                  const maxNO2 = Math.max(...data.airQualityTrends.map(d => d.no2));
                  const maxOzone = Math.max(...data.airQualityTrends.map(d => d.ozone));
                  const maxValue = Math.max(maxPM25, maxNO2, maxOzone);
                  
                  const xStep = chartWidth / (data.airQualityTrends.length - 1 || 1);
                  
                  // Generate line paths
                  const pm25Path = data.airQualityTrends.map((d, i) => {
                    const x = padding.left + i * xStep;
                    const y = padding.top + chartHeight - (d.pm25 / maxValue) * chartHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ');
                  
                  const no2Path = data.airQualityTrends.map((d, i) => {
                    const x = padding.left + i * xStep;
                    const y = padding.top + chartHeight - (d.no2 / maxValue) * chartHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ');
                  
                  const ozonePath = data.airQualityTrends.map((d, i) => {
                    const x = padding.left + i * xStep;
                    const y = padding.top + chartHeight - (d.ozone / maxValue) * chartHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ');
                  
                  return (
                    <>
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => (
                        <g key={i}>
                          <line
                            x1={padding.left}
                            y1={padding.top + chartHeight * (1 - factor)}
                            x2={padding.left + chartWidth}
                            y2={padding.top + chartHeight * (1 - factor)}
                            stroke="#374151"
                            strokeWidth="1"
                            strokeDasharray="4"
                          />
                          <text
                            x={padding.left - 10}
                            y={padding.top + chartHeight * (1 - factor)}
                            fill="#9ca3af"
                            fontSize="12"
                            textAnchor="end"
                            dominantBaseline="middle"
                          >
                            {(maxValue * factor).toFixed(1)}
                          </text>
                        </g>
                      ))}
                      
                      {/* PM2.5 Line */}
                      <path d={pm25Path} fill="none" stroke="#10b981" strokeWidth="3" />
                      
                      {/* NO2 Line */}
                      <path d={no2Path} fill="none" stroke="#3b82f6" strokeWidth="3" />
                      
                      {/* Ozone Line */}
                      <path d={ozonePath} fill="none" stroke="#06b6d4" strokeWidth="3" />
                      
                      {/* X-axis labels - show every 2-3 years */}
                      {data.airQualityTrends.map((d, i) => {
                        const showLabel = i === 0 || 
                                         i === data.airQualityTrends.length - 1 || 
                                         i % Math.max(2, Math.floor(data.airQualityTrends.length / 6)) === 0;
                        if (showLabel) {
                          return (
                            <text
                              key={i}
                              x={padding.left + i * xStep}
                              y={padding.top + chartHeight + 25}
                              fill="#9ca3af"
                              fontSize="13"
                              fontWeight="500"
                              textAnchor="middle"
                            >
                              {d.year}
                            </text>
                          );
                        }
                        return null;
                      })}
                      
                      {/* Axis labels */}
                      <text
                        x={padding.left / 2}
                        y={padding.top + chartHeight / 2}
                        fill="#9ca3af"
                        fontSize="14"
                        fontWeight="600"
                        textAnchor="middle"
                        transform={`rotate(-90, ${padding.left / 2}, ${padding.top + chartHeight / 2})`}
                      >
                        Concentration
                      </text>
                      
                      <text
                        x={padding.left + chartWidth / 2}
                        y={padding.top + chartHeight + 60}
                        fill="#9ca3af"
                        fontSize="14"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        Year
                      </text>
                      
                      {/* Legend */}
                      <g transform={`translate(${padding.left + chartWidth - 250}, ${padding.top + 10})`}>
                        <rect width="240" height="80" fill="#1f2937" rx="4" />
                        
                        <line x1="15" y1="25" x2="45" y2="25" stroke="#10b981" strokeWidth="3" />
                        <text x="55" y="28" fill="#fff" fontSize="13">PM2.5 (Fine Particles)</text>
                        
                        <line x1="15" y1="45" x2="45" y2="45" stroke="#3b82f6" strokeWidth="3" />
                        <text x="55" y="48" fill="#fff" fontSize="13">NO₂ (Nitrogen Dioxide)</text>
                        
                        <line x1="15" y1="65" x2="45" y2="65" stroke="#06b6d4" strokeWidth="3" />
                        <text x="55" y="68" fill="#fff" fontSize="13">O₃ (Ozone)</text>
                      </g>
                    </>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No trend data available</p>
          )}
        </div>

        {/* Pollutants by Borough - Grouped Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">PM2.5 Levels by Borough</h3>
            <p className="text-sm text-gray-400 mt-1">
              Average fine particulate matter concentration (mcg/m³)
            </p>
          </div>
          <BarChart
            data={Object.entries(data.airQualityStats.pollutantsByBorough)
              .filter(([borough]) => borough !== 'UNKNOWN' && borough !== 'NYC-wide')
              .map(([borough, pollutants]) => ({
                label: borough,
                value: Math.round(pollutants.pm25 * 10) / 10,
                percentage: 0,
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)} // Limit to top 5
            title=""
            height={400}
            color="#10b981"
            xAxisLabel="Borough"
            yAxisLabel="PM2.5 (mcg/m³)"
          />
        </div>

        {/* NO2 by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">NO₂ Levels by Borough</h3>
            <p className="text-sm text-gray-400 mt-1">
              Average nitrogen dioxide concentration (ppb)
            </p>
          </div>
          <BarChart
            data={Object.entries(data.airQualityStats.pollutantsByBorough)
              .filter(([borough]) => borough !== 'UNKNOWN' && borough !== 'NYC-wide')
              .map(([borough, pollutants]) => ({
                label: borough,
                value: Math.round(pollutants.no2 * 10) / 10,
                percentage: 0,
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)} // Limit to top 5
            title=""
            height={400}
            color="#3b82f6"
            xAxisLabel="Borough"
            yAxisLabel="NO₂ (ppb)"
          />
        </div>

        {/* Tree Health Distribution - Pie Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Street Tree Health Status</h3>
            <p className="text-sm text-gray-400 mt-1">
              Distribution of tree health conditions (2015 Census)
            </p>
          </div>
          <PieChart
            data={[
              {
                label: 'Good Health',
                value: data.treeStats.goodHealth,
                percentage: (data.treeStats.goodHealth / data.treeStats.totalTrees) * 100,
              },
              {
                label: 'Fair Health',
                value: data.treeStats.fairHealth,
                percentage: (data.treeStats.fairHealth / data.treeStats.totalTrees) * 100,
              },
              {
                label: 'Poor Health',
                value: data.treeStats.poorHealth,
                percentage: (data.treeStats.poorHealth / data.treeStats.totalTrees) * 100,
              },
            ]}
            title=""
            size={450}
          />
        </div>

        {/* Tree Diameter Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Tree Size Distribution</h3>
            <p className="text-sm text-gray-400 mt-1">
              Trees grouped by trunk diameter (inches)
            </p>
          </div>
          <BarChart
            data={data.treeDiameterDistribution.map(d => ({
              label: d.range,
              value: d.count,
              percentage: d.percentage,
            }))}
            title=""
            height={400}
            color="#84cc16"
            xAxisLabel="Diameter Range"
            yAxisLabel="Number of Trees"
          />
        </div>

        {/* Top 10 Tree Species */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Top 10 Street Tree Species</h3>
            <p className="text-sm text-gray-400 mt-1">
              Most common tree species across NYC
            </p>
          </div>
          <BarChart
            data={data.treeStats.topSpecies.map(species => ({
              label: species.species.substring(0, 20),
              value: species.count,
              percentage: species.percentage || 0,
            }))}
            title=""
            height={450}
            color="#22c55e"
            xAxisLabel="Tree Species"
            yAxisLabel="Number of Trees"
          />
        </div>

        {/* Trees by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Street Trees by Borough</h3>
            <p className="text-sm text-gray-400 mt-1">
              Tree distribution across NYC boroughs
            </p>
          </div>
          <BarChart
            data={Object.entries(data.treeStats.treesByBorough)
              .filter(([borough]) => borough !== 'UNKNOWN')
              .map(([borough, count]) => ({
                label: borough,
                value: count,
                percentage: (count / data.treeStats.totalTrees) * 100,
              }))
              .sort((a, b) => b.value - a.value)}
            title=""
            height={450}
            color="#84cc16"
            xAxisLabel="Borough"
            yAxisLabel="Number of Trees"
          />
        </div>

        {/* Ozone Levels by Borough */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">O₃ (Ozone) Levels by Borough</h3>
            <p className="text-sm text-gray-400 mt-1">
              Average ground-level ozone concentration (ppb)
            </p>
          </div>
          <BarChart
            data={Object.entries(data.airQualityStats.pollutantsByBorough)
              .filter(([borough]) => borough !== 'UNKNOWN' && borough !== 'NYC-wide')
              .map(([borough, pollutants]) => ({
                label: borough,
                value: Math.round(pollutants.ozone * 10) / 10,
                percentage: 0,
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)} // Limit to top 5
            title=""
            height={400}
            color="#06b6d4"
            xAxisLabel="Borough"
            yAxisLabel="O₃ (ppb)"
          />
        </div>

      </div>
    </div>
  );
}

