'use client';

import { Category } from '@/types/indicator';
import { 
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  FunnelIcon,
  HeartIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  HomeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import React from 'react';

interface SidebarProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  onSearch: (query: string) => void;
}

const categories: { name: Category; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { name: 'All', icon: FunnelIcon },
  { name: 'Public Safety', icon: ShieldCheckIcon },
  { name: 'Transportation', icon: TruckIcon },
  { name: 'Health', icon: HeartIcon },
  { name: 'Education', icon: AcademicCapIcon },
  { name: 'Housing', icon: HomeIcon },
  { name: 'Environment', icon: GlobeAltIcon },
  { name: 'Business', icon: BriefcaseIcon },
];

export default function Sidebar({ selectedCategory, onCategoryChange, onSearch }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-[#0f1419] border-r border-[#1f2937] flex flex-col fixed left-0 top-0 overflow-hidden">
      {/* Logo/Title */}
      <div className="p-5 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
            NYC
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">NYCInsights</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search indicators..."
            className="w-full bg-[#1a1f2e] border border-[#2a3441] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Add New Button */}
      <div className="px-4 mb-4">
        <button className="w-full bg-transparent border-2 border-cyan-500 text-cyan-400 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-cyan-500/10 transition-colors font-medium text-sm">
          <PlusCircleIcon className="w-5 h-5" />
          Add New Indicator
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => onCategoryChange(category.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    selectedCategory === category.name
                      ? 'bg-[#1e293b] text-cyan-400'
                      : 'text-gray-300 hover:bg-[#1a1f2e]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Mode */}
      <div className="p-4 border-t border-[#1f2937]">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          View Mode
        </p>
      </div>
    </div>
  );
}
