'use client';

import { Indicator } from '@/types/indicator';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CompactMetricCardProps {
  indicator: Indicator;
}

export default function CompactMetricCard({ indicator }: CompactMetricCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActualPercentage = () => {
    if (!indicator.target) return 0;
    return (indicator.value / indicator.target) * 100;
  };

  const getProgressBarWidth = () => {
    return Math.min(100, getActualPercentage());
  };

  const getProgressColor = () => {
    if (!indicator.target) return '#6b7280';
    
    const percentage = (indicator.value / indicator.target) * 100;
    
    if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
      if (percentage <= 50) return '#10b981';
      if (percentage <= 80) return '#22c55e';
      if (percentage <= 100) return '#f59e0b';
      if (percentage <= 120) return '#f97316';
      return '#ef4444';
    } else {
      if (percentage >= 100) return '#10b981';
      if (percentage >= 80) return '#22c55e';
      if (percentage >= 50) return '#f59e0b';
      if (percentage >= 25) return '#f97316';
      return '#ef4444';
    }
  };

  const getStatusIcon = () => {
    if (!indicator.higherIsBetter) return null;
    
    return indicator.higherIsBetter ? (
      <span className="text-green-400 text-xs">↑</span>
    ) : (
      <span className="text-red-400 text-xs">↓</span>
    );
  };

  return (
    <div 
      className={`bg-[#111827] border ${isExpanded ? 'border-cyan-500' : 'border-[#1f2937]'} rounded-lg transition-all duration-200 hover:border-cyan-500/50 cursor-pointer overflow-hidden`}
      onClick={() => setIsExpanded(!isExpanded)}
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
                style={{ color: indicator.color || '#06b6d4' }}
              >
                {(indicator.value ?? 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-400">{indicator.unit}</span>
            </div>
          </div>
          <button 
            className="text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-[#1f2937] pt-3 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Category Badge */}
          <div>
            <span className="inline-block px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
              {indicator.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{indicator.description}</p>

          {/* Explanation and Direction */}
          {(indicator.explanation || indicator.higherIsBetter !== undefined) && (
            <div className="p-2.5 sm:p-3 bg-[#1a1f2e] border border-[#2a3441] rounded-lg space-y-2">
              {indicator.explanation && (
                <div>
                  <p className="text-xs text-cyan-400 font-semibold mb-1">ℹ️ What this shows:</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{indicator.explanation}</p>
                </div>
              )}
              {indicator.higherIsBetter !== undefined && (
                <div className="flex items-center gap-2 text-xs pt-2 border-t border-[#2a3441]">
                  {indicator.higherIsBetter ? (
                    <span className="flex items-center gap-1 text-green-400 font-semibold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Higher is Better
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="w-full bg-[#1f2937] rounded-full h-2 mb-2 overflow-hidden">
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
                <span>
                  {getActualPercentage() > 0 && getActualPercentage() < 1 ? '<1%' : `${Math.round(getActualPercentage())}%`}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#1f2937]">
            <span>Updated: {indicator.lastUpdate}</span>
            <span>{indicator.source}</span>
          </div>

          {/* Disclaimer */}
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-300">
            <span className="font-semibold">⚠️ Note:</span> Data sourced from NYC Open Data. Figures may be estimates or represent sample sizes. Always verify critical decisions with official sources.
          </div>
        </div>
      )}
    </div>
  );
}

