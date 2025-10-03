'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import IndicatorCard from '@/components/IndicatorCard';
import ChartCard from '@/components/ChartCard';
import BusinessInsights from '@/components/BusinessInsights';
import BusinessChartsView from '@/components/BusinessChartsView';
import EducationInsights from '@/components/EducationInsights';
import EducationChartsView from '@/components/EducationChartsView';
import HousingInsights from '@/components/HousingInsights';
import HousingChartsView from '@/components/HousingChartsView';
import HealthInsights from '@/components/HealthInsights';
import HealthChartsView from '@/components/HealthChartsView';
import PublicSafetyInsights from '@/components/PublicSafetyInsights';
import PublicSafetyChartsView from '@/components/PublicSafetyChartsView';
import EnvironmentInsights from '@/components/EnvironmentInsights';
import EnvironmentChartsView from '@/components/EnvironmentChartsView';
import TransportationInsights from '@/components/TransportationInsights';
import TransportationChartsView from '@/components/TransportationChartsView';
import AllInsights from '@/components/AllInsights';
import AllChartsView from '@/components/AllChartsView';
import { dummyIndicators } from '@/data/dummyData';
import { Category, ViewMode } from '@/types/indicator';
import { 
  Squares2X2Icon, 
  ChartBarIcon, 
  TableCellsIcon, 
  MapIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery,] = useState('');

  const filteredIndicators = dummyIndicators.filter(indicator => {
    const matchesCategory = selectedCategory === 'All' || indicator.category === selectedCategory;
    const matchesSearch = indicator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         indicator.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#0a0e1a]">
      <Sidebar 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="flex-1 lg:ml-64 p-3 sm:p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
            NYC Insights Dashboard
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">Track and analyze key city development indicators</p>
        </div>

        {/* View Controls */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                viewMode === 'card'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <Squares2X2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                viewMode === 'chart'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <ChartBarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Visualize</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <TableCellsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Table</span>
              <span className="sm:hidden">Table</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                viewMode === 'map'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Map</span>
              <span className="sm:hidden">Map</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'card' && (
          <>
            {selectedCategory === 'All' ? (
              <AllInsights />
            ) : selectedCategory === 'Business' ? (
              <BusinessInsights />
            ) : selectedCategory === 'Education' ? (
              <EducationInsights />
            ) : selectedCategory === 'Housing' ? (
              <HousingInsights />
            ) : selectedCategory === 'Health' ? (
              <HealthInsights />
            ) : selectedCategory === 'Public Safety' ? (
              <PublicSafetyInsights />
            ) : selectedCategory === 'Environment' ? (
              <EnvironmentInsights />
            ) : selectedCategory === 'Transportation' ? (
              <TransportationInsights />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {filteredIndicators.map(indicator => (
                  <IndicatorCard key={indicator.id} indicator={indicator} />
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === 'chart' && (
          <>
            {selectedCategory === 'All' ? (
              <AllChartsView />
            ) : selectedCategory === 'Business' ? (
              <BusinessChartsView />
            ) : selectedCategory === 'Education' ? (
              <EducationChartsView />
            ) : selectedCategory === 'Housing' ? (
              <HousingChartsView />
            ) : selectedCategory === 'Health' ? (
              <HealthChartsView />
            ) : selectedCategory === 'Public Safety' ? (
              <PublicSafetyChartsView />
            ) : selectedCategory === 'Environment' ? (
              <EnvironmentChartsView />
            ) : selectedCategory === 'Transportation' ? (
              <TransportationChartsView />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {filteredIndicators.map(indicator => (
                  <ChartCard key={indicator.id} indicator={indicator} />
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === 'table' && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] md:min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#1f2937]">
                    <th className="text-left py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-semibold text-gray-400">Indicator</th>
                    <th className="text-left py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-semibold text-gray-400 hidden sm:table-cell">Category</th>
                    <th className="text-right py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-semibold text-gray-400">Value</th>
                    <th className="text-right py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-semibold text-gray-400 hidden md:table-cell">Target</th>
                    <th className="text-left py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-semibold text-gray-400 hidden lg:table-cell">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicators.map(indicator => (
                    <tr key={indicator.id} className="border-b border-[#1f2937] hover:bg-[#1a1f2e] transition-colors">
                      <td className="py-3 px-2 sm:px-4 md:px-6">
                        <div className="font-medium text-white text-sm sm:text-base md:text-lg">{indicator.title}</div>
                        <div className="text-xs sm:text-sm md:text-base text-gray-400">{indicator.description}</div>
                        <div className="sm:hidden mt-1">
                          <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                            {indicator.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 md:px-6 hidden sm:table-cell">
                        <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                          {indicator.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 sm:px-4 md:px-6 text-right">
                        <span className="font-semibold text-white text-sm sm:text-base md:text-lg">
                          {indicator.value.toLocaleString()} {indicator.unit}
                        </span>
                        <div className="md:hidden mt-1 text-xs text-gray-400">
                          {indicator.target ? `Target: ${indicator.targetCondition} ${indicator.target.toLocaleString()}` : 'No target'}
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 md:px-6 text-right text-gray-400 hidden md:table-cell">
                        {indicator.target ? `${indicator.targetCondition} ${indicator.target.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-gray-400 hidden lg:table-cell">
                        {indicator.lastUpdate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-12 text-center">
            <MapIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Map View Coming Soon</h3>
          </div>
        )}

        {filteredIndicators.length === 0 && (
          <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-12 text-center">
            <p className="text-gray-400">No indicators found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
