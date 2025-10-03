'use client';

import { Indicator } from '@/types/indicator';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface IndicatorModalProps {
  indicator: Indicator | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IndicatorModal({ indicator, isOpen, onClose }: IndicatorModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !indicator) return null;

  const getActualPercentage = () => {
    if (!indicator.target) return 0;
    return (indicator.value / indicator.target) * 100;
  };

  const getProgressBarWidth = () => {
    return Math.min(100, getActualPercentage());
  };

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

  const getProgressColor = () => {
    return getPerformanceColor();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#111827] border border-[#1f2937] rounded-xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getPerformanceColor() }}
            />
            <h2 className="text-xl font-bold text-white">{indicator.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Main Metric */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: getPerformanceColor() }}>
              {(indicator.value ?? 0).toLocaleString()}
            </div>
            <div className="text-base text-gray-400">{indicator.unit}</div>
            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                {indicator.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 mb-1">Description</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{indicator.description}</p>
          </div>

          {/* Explanation and Direction */}
          {(indicator.explanation || indicator.higherIsBetter !== undefined) && (
            <div className="p-3 bg-[#1a1f2e] border border-[#2a3441] rounded-lg">
              {indicator.explanation && (
                <div className="mb-2">
                  <h4 className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What this shows:
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{indicator.explanation}</p>
                </div>
              )}
              {indicator.higherIsBetter !== undefined && (
                <div className="flex items-center gap-1 text-xs pt-2 border-t border-[#2a3441]">
                  {indicator.higherIsBetter ? (
                    <span className="flex items-center gap-1 text-green-400 font-semibold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Higher is Better
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      Lower is Better
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Progress Bar with Target */}
          {indicator.target && (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 mb-2">Progress Towards Target</h3>
              <div className="space-y-2">
                <div className="w-full bg-[#1f2937] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${getProgressBarWidth()}%`,
                      backgroundColor: getProgressColor(),
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Target: {indicator.targetCondition} {indicator.target.toLocaleString()}</span>
                  <span className="font-semibold">
                    {getActualPercentage() > 0 && getActualPercentage() < 1 ? '<1%' : `${Math.round(getActualPercentage())}%`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chart Data */}
          {indicator.chartData && indicator.chartData.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 mb-2">Historical Data</h3>
              <div className="bg-[#1a1f2e] border border-[#2a3441] rounded-lg p-2">
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {indicator.chartData.slice(-6).map((data, index) => (
                    <div key={index} className="flex justify-between text-gray-400">
                      <span>{data.year}:</span>
                      <span className="font-medium">{data.value?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#1f2937]">
            <span>Updated: {indicator.lastUpdate}</span>
            <span>Source: {indicator.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
