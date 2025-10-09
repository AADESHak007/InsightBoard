'use client';

import { useState, useEffect } from 'react';
import BoroughMap from './BoroughMap';
import { Category } from '@/types/indicator';

interface CategoryMapViewProps {
  category: Category;
}

interface MetricConfig {
  label: string;
  key: string;
  description: string;
}

const CATEGORY_METRICS: Record<string, MetricConfig[]> = {
  'Health': [
    { label: 'Restaurant Inspections', key: 'restaurantInspections', description: 'Total restaurant inspections by borough' },
    { label: 'Grade A Restaurants', key: 'gradeA', description: 'Restaurants with Grade A' },
    { label: 'Critical Violations', key: 'criticalViolations', description: 'Critical health violations' },
    { label: 'Safety Events', key: 'safetyEvents', description: 'Public safety events' },
  ],
  'Housing': [
    { label: 'Total Permits', key: 'totalPermits', description: 'Building permits issued' },
    { label: 'New Buildings', key: 'newBuilding', description: 'New building permits' },
    { label: 'Total Violations', key: 'totalViolations', description: 'Housing code violations' },
    { label: 'Open Violations', key: 'openViolations', description: 'Unresolved violations' },
  ],
  'Transportation': [
    { label: 'Taxi Pickups', key: 'taxiPickups', description: 'Taxi trip pickups' },
    { label: 'Taxi Dropoffs', key: 'taxiDropoffs', description: 'Taxi trip dropoffs' },
    { label: 'Average Fare', key: 'avgFare', description: 'Average taxi fare' },
    { label: 'Total Revenue', key: 'totalRevenue', description: 'Total taxi revenue' },
  ],
  'Public Safety': [
    { label: 'Total Crimes', key: 'totalCrimes', description: 'Crime complaints' },
    { label: 'Felonies', key: 'felonies', description: 'Felony crimes' },
    { label: 'Traffic Collisions', key: 'totalCollisions', description: 'Vehicle collisions' },
    { label: 'Pedestrian Injuries', key: 'pedestriansInjured', description: 'Pedestrians injured in collisions' },
  ],
  'Environment': [
    { label: 'Total Trees', key: 'totalTrees', description: 'Street trees' },
    { label: 'Healthy Trees', key: 'goodHealthTrees', description: 'Trees in good health' },
    { label: 'Total Waste', key: 'totalWaste', description: 'Waste collected (tons)' },
    { label: 'Recycling Rate', key: 'diversionRate', description: 'Waste diversion rate (%)' },
  ],
  'Business': [
    { label: 'Total Businesses', key: 'totalBusinesses', description: 'Certified businesses' },
    { label: 'MBE Businesses', key: 'mbe', description: 'Minority-owned businesses' },
    { label: 'WBE Businesses', key: 'wbe', description: 'Women-owned businesses' },
  ],
  'Education': [
    { label: 'Total Enrollment', key: 'totalEnrollment', description: 'Student enrollment' },
    { label: 'Schools Count', key: 'schoolsCount', description: 'Number of schools' },
    { label: 'Students with Disabilities', key: 'studentsWithDisabilities', description: 'Special education students' },
    { label: 'English Language Learners', key: 'englishLanguageLearners', description: 'ELL students' },
  ],
};

export default function CategoryMapView({ category }: CategoryMapViewProps) {
  const [metric, setMetric] = useState<string>('');
  const [boroughData, setBoroughData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Get available metrics for the category
  const availableMetrics = CATEGORY_METRICS[category] || [];

  useEffect(() => {
    if (category === 'All' || availableMetrics.length === 0) {
      setLoading(false);
      return;
    }

    // Set first metric as default
    setMetric(availableMetrics[0].key);
    fetchBoroughData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (metric) {
      fetchBoroughData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric]);

  const fetchBoroughData = async () => {
    if (category === 'All' || !metric) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const apiEndpoints: Record<string, string> = {
        'Health': '/api/health/overview',
        'Housing': '/api/housing/overview',
        'Transportation': '/api/transportation/overview',
        'Public Safety': '/api/safety/overview',
        'Environment': '/api/environment/overview',
        'Business': '/api/business/certified/boroughs',
        'Education': '/api/education/demographics',
      };

      const response = await fetch(apiEndpoints[category]);
      const data = await response.json();

      // Extract borough breakdown from response
      let extractedData = null;
      
      if (data.boroughBreakdown) {
        extractedData = data.boroughBreakdown;
      } else if (data.breakdowns?.boroughs) {
        // Education format
        extractedData = data.breakdowns.boroughs;
      } else if (data.boroughs) {
        // Business format
        extractedData = data.boroughs;
      }

      if (extractedData) {
        setBoroughData(extractedData);
      } else {
        setBoroughData({});
      }
    } catch (error) {
      console.error('Error fetching borough data:', error);
      setBoroughData({});
    } finally {
      setLoading(false);
    }
  };

  // Extract metric values from borough data
  const getMetricData = (): Record<string, number> => {
    if (!boroughData || typeof boroughData !== 'object') {
      return {};
    }
    
    const result: Record<string, number> = {};
    
    // Handle array format
    if (Array.isArray(boroughData)) {
      boroughData.forEach((item: Record<string, unknown>) => {
        if (item.borough && item[metric] !== undefined) {
          const boroughName = item.borough as string;
          const value = Number(item[metric]) || 0;
          
          // Only include valid borough names with non-zero values
          if (isValidBoroughName(boroughName) && value > 0) {
            result[boroughName] = value;
          }
        }
      });
    } else {
      // Handle object format
      Object.entries(boroughData).forEach(([borough, data]: [string, unknown]) => {
        if (data && typeof data === 'object' && data !== null && metric in data) {
          const value = Number((data as Record<string, unknown>)[metric]) || 0;
          
          // Only include valid borough names with non-zero values
          if (isValidBoroughName(borough) && value > 0) {
            result[borough] = value;
          }
        }
      });
    }
    
    return result;
  };

  // Helper function to validate borough names
  const isValidBoroughName = (borough: string): boolean => {
    if (!borough || typeof borough !== 'string') return false;
    
    // Remove null/undefined values
    if (borough === '(null)' || borough === 'null' || borough === 'undefined') return false;
    
    // Remove abbreviated names (2-letter codes)
    if (borough.match(/^[A-Z]{2}$/)) return false;
    
    // Ensure it's a full borough name (longer than 2 characters)
    if (borough.length <= 2) return false;
    
    // Valid NYC borough names
    const validBoroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
    return validBoroughs.some(validBorough => 
      borough.toLowerCase().includes(validBorough.toLowerCase()) ||
      validBorough.toLowerCase().includes(borough.toLowerCase())
    );
  };

  const metricData = getMetricData();
  const values = Object.values(metricData);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  const currentMetricConfig = availableMetrics.find(m => m.key === metric) || availableMetrics[0];

  // Show placeholder for "All" category
  if (category === 'All') {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Select a Category</h3>
        <p className="text-gray-400">Choose a specific category to view borough-level data on the map.</p>
      </div>
    );
  }

  // Show placeholder if no metrics available
  if (availableMetrics.length === 0) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Map Data Coming Soon</h3>
        <p className="text-gray-400">Borough-level mapping for {category} will be available soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Header Section */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] border border-[#374151] rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              {category} Analytics
            </h1>
            <p className="text-gray-400 text-sm">
              Borough-level insights and geographic distribution
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Data Points</p>
              <p className="text-lg font-bold text-cyan-400">
                {Object.values(metricData).reduce((sum, val) => sum + val, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Display */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <div className="px-3 py-2 border border-[#374151] rounded-lg bg-[#0f1419] text-gray-200 font-medium text-sm shadow-inner">
                {category}
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 pointer-events-none"></div>
            </div>
          </div>

          {/* Metric Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Metric
            </label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full px-3 py-2 border border-[#374151] rounded-lg bg-[#0f1419] text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 shadow-inner text-sm"
            >
              {availableMetrics.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Legend Compact */}
          {!loading && currentMetricConfig && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Data Scale
              </label>
              <div className="bg-[#0f1419] border border-[#374151] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{minValue.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{maxValue.toLocaleString()}</span>
                </div>
                <div className="flex h-3 rounded overflow-hidden">
                  {['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#1e40af'].map((color, index) => (
                    <div key={index} className="flex-1" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {currentMetricConfig.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-[#111827] border border-[#374151] rounded-lg p-8 text-center shadow-lg h-96 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#374151] border-t-cyan-500"></div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Loading map data...</p>
                  <p className="text-gray-500 text-xs">Fetching latest borough information</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] border border-[#374151] rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Geographic Distribution</h3>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Interactive Map</span>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-[#374151] h-80">
                <BoroughMap
                  metric={currentMetricConfig?.label || ''}
                  data={metricData}
                />
              </div>
            </div>
          )}
        </div>

        {/* Borough Stats - Takes 1 column */}
        <div className="lg:col-span-1">
          {!loading && Object.keys(metricData).length > 0 ? (
            <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] border border-[#374151] rounded-lg p-3 shadow-lg h-full">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#374151]">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center">
                    <svg className="w-3 h-3 mr-1.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Borough Rankings
                  </h2>
                  <p className="text-gray-400 text-xs">
                    NYC performance
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded px-2 py-1">
                  <p className="text-xs text-gray-400">Highest</p>
                  <p className="text-xs font-bold text-green-400">
                    {Math.max(...Object.values(metricData)).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                {Object.entries(metricData)
                  .filter(([borough, value]) => {
                    // Remove entries with invalid borough names or zero values
                    const validBorough = borough && 
                      borough !== '(null)' && 
                      borough !== 'null' && 
                      !borough.match(/^[A-Z]{2}$/) && // Remove abbreviated names like 'BK', 'BX', etc.
                      borough.length > 2; // Ensure full borough names
                    
                    return validBorough && value > 0;
                  })
                  .sort(([, a], [, b]) => b - a)
                  .map(([borough, value], index, filteredArray) => {
                    const isHighest = index === 0;
                    const isLowest = index === filteredArray.length - 1;
                    const percentage = maxValue > 0 ? ((value / maxValue) * 100).toFixed(1) : 0;
                    
                    return (
                      <div
                        key={borough}
                        className={`relative p-2 rounded-md border transition-all duration-200 hover:scale-[1.01] cursor-pointer group ${
                          isHighest 
                            ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/20 hover:border-green-500/40' 
                            : isLowest
                            ? 'bg-gradient-to-r from-red-500/5 to-rose-500/5 border-red-500/20 hover:border-red-500/40'
                            : 'bg-[#0f1419] border-[#374151] hover:border-[#4b5563] hover:bg-[#111827]'
                        }`}
                      >
                        {/* Ranking Badge */}
                        <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                          isHighest 
                            ? 'bg-green-500 text-white' 
                            : isLowest
                            ? 'bg-red-500 text-white'
                            : 'bg-cyan-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {/* Left side - Borough name and value */}
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center space-x-1.5">
                              <h3 className={`font-semibold text-xs truncate ${
                                isHighest ? 'text-green-400' : isLowest ? 'text-red-400' : 'text-gray-200'
                              }`}>
                                {borough}
                              </h3>
                              {isHighest && (
                                <svg className="w-2.5 h-2.5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            
                            <div className="flex items-baseline space-x-1.5 mt-0.5">
                              <p className={`text-sm font-bold ${
                                isHighest ? 'text-green-400' : isLowest ? 'text-red-400' : 'text-cyan-400'
                              }`}>
                                {value.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {percentage}%
                              </p>
                            </div>
                          </div>
                          
                          {/* Right side - Progress bar */}
                          <div className="flex-shrink-0">
                            <div className="w-16 bg-[#374151] rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full transition-all duration-500 ${
                                  isHighest 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : isLowest
                                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                }`}
                                style={{ 
                                  width: `${percentage}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : !loading && Object.keys(metricData).length === 0 ? (
            <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] border border-[#374151] rounded-lg p-6 shadow-lg text-center h-full flex items-center justify-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300">No Data Available</h3>
                <p className="text-gray-500 text-sm">
                  No borough data found for the selected metric.
                </p>
                <div className="flex flex-col space-y-2 mt-4">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Refresh Data
                  </button>
                  <button 
                    onClick={() => setMetric(availableMetrics[0]?.key || '')} 
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Try Different Metric
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
