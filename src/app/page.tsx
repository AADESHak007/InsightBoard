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
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            NYC Insights Dashboard
          </h1>
          <p className="text-gray-400">Track and analyze key city development indicators</p>
        </div>

        {/* View Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'card'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'chart'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <ChartBarIcon className="w-5 h-5" />
              Visualize
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <TableCellsIcon className="w-5 h-5" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1f2937]'
              }`}
            >
              <MapIcon className="w-5 h-5" />
              Map View
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
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
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
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1f2937]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Indicator</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Target</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIndicators.map(indicator => (
                    <tr key={indicator.id} className="border-b border-[#1f2937] hover:bg-[#1a1f2e] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{indicator.title}</div>
                        <div className="text-sm text-gray-400">{indicator.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                          {indicator.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-white">
                          {indicator.value.toLocaleString()} {indicator.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">
                        {indicator.target ? `${indicator.targetCondition} ${indicator.target.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
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
