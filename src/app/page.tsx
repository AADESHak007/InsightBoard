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
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            NYC Insights Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Track and analyze key city development indicators</p>
        </div>

        {/* View Controls */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium transition-all text-sm sm:text-base md:text-lg ${
                viewMode === 'card'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium transition-all text-sm sm:text-base md:text-lg ${
                viewMode === 'chart'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Visualize</span>
              <span className="sm:hidden">Charts</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium transition-all text-sm sm:text-base md:text-lg ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <TableCellsIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Table View</span>
              <span className="sm:hidden">Table</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium transition-all text-sm sm:text-base md:text-lg ${
                viewMode === 'map'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Map View</span>
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
