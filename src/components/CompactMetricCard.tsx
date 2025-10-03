'use client';

import { Indicator } from '@/types/indicator';
import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import IndicatorModal from './IndicatorModal';

interface CompactMetricCardProps {
  indicator: Indicator;
}

export default function CompactMetricCard({ indicator }: CompactMetricCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPerformanceColor = () => {
    // If no target is set, use neutral color
    if (!indicator.target) return '#06b6d4'; // cyan
    
    const percentage = (indicator.value / indicator.target) * 100;
    
    // Determine if we're doing well based on context
    const isDoingWell = () => {
      if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
        // For "lower is better" metrics (like AQI, violations, crimes)
        return percentage <= 100; // At or below target is good
      } else {
        // For "higher is better" metrics (like businesses, permits, grades)
        return percentage >= 100; // At or above target is good
      }
    };

    const isModerate = () => {
      if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
        return percentage > 100 && percentage <= 150; // 100-150% of target
      } else {
        return percentage >= 50 && percentage < 100; // 50-100% of target
      }
    };

    if (isDoingWell()) {
      return '#10b981'; // green
    } else if (isModerate()) {
      return '#f59e0b'; // amber
    } else {
      return '#ef4444'; // red
    }
  };

  const getStatusIcon = () => {
    if (!indicator.target) return null;
    
    const percentage = (indicator.value / indicator.target) * 100;
    const isDoingWell = () => {
      if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
        return percentage <= 100;
      } else {
        return percentage >= 100;
      }
    };

    if (isDoingWell()) {
      return <span className="text-green-400 text-xs">✓</span>;
    } else if (percentage > 100 && (indicator.targetCondition === '<=' || indicator.targetCondition === '<')) {
      return <span className="text-red-400 text-xs">⚠</span>;
    } else if (percentage < 100 && (indicator.targetCondition === '>=' || indicator.targetCondition === '>')) {
      return <span className="text-amber-400 text-xs">⚠</span>;
    } else {
      return <span className="text-red-400 text-xs">⚠</span>;
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="bg-[#111827] border rounded-lg transition-all duration-200 hover:border-cyan-500/50 cursor-pointer overflow-hidden"
        style={{ 
          borderColor: indicator.target ? `${getPerformanceColor()}40` : '#1f2937' 
        }}
      >
        {/* Compact View */}
        <div className="p-3 sm:p-4 min-h-[100px] flex items-center">
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-300 leading-tight">{indicator.title}</h3>
                {getStatusIcon()}
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span 
                  className="text-xl sm:text-2xl font-bold leading-none" 
                  style={{ color: getPerformanceColor() }}
                >
                  {(indicator.value ?? 0).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400">{indicator.unit}</span>
              </div>
            </div>
            <button 
              className="text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0 p-1"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              title="View details"
            >
              <InformationCircleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
              {indicator.category}
            </span>
            {indicator.target && (
              <span 
                className="text-xs font-medium"
                style={{ color: getPerformanceColor() }}
              >
                {indicator.targetCondition} {indicator.target.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <IndicatorModal 
        indicator={indicator} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}