'use client';

import { Category } from '@/types/indicator';
import { 
  FunnelIcon,
  HeartIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  HomeIcon,
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface SidebarProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
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

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryChange = (category: Category) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false); // Close mobile menu when category is selected
  };

  return (
    <>
      {/* Mobile Menu Button - Only show hamburger when closed */}
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111827] border border-[#1f2937] rounded-lg text-white hover:bg-[#1a1f2e] transition-all duration-300"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        w-64 h-screen bg-[#0f1419] border-r border-[#1f2937] flex flex-col fixed left-0 top-0 overflow-hidden z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo/Title */}
        <div className="p-4 sm:p-5 border-b border-[#1f2937] relative">
          {/* Close Button - Only show on mobile when sidebar is open */}
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 bg-[#111827] border border-[#1f2937] rounded-lg text-white hover:bg-[#1a1f2e] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
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

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 pb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
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
    </>
  );
}
