'use client';

import { Indicator } from '@/types/indicator';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface IndicatorCardProps {
  indicator: Indicator;
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const getActualPercentage = () => {
    if (!indicator.target) return 0;
    return (indicator.value / indicator.target) * 100;
  };

  const getProgressBarWidth = () => {
    // Cap the visual bar at 100% to prevent overflow
    return Math.min(100, getActualPercentage());
  };

  const getProgressColor = () => {
    if (!indicator.target) return '#6b7280';
    
    const percentage = (indicator.value / indicator.target) * 100;
    
    if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
      // For "lower is better" - we want to be UNDER the target
      if (percentage <= 50) return '#10b981';  // Excellent - way under target
      if (percentage <= 80) return '#22c55e';  // Good - under target
      if (percentage <= 100) return '#f59e0b'; // Warning - approaching target
      if (percentage <= 120) return '#f97316'; // Bad - over target
      return '#ef4444'; // Critical - way over target
    } else {
      // For "higher is better" - we want to be OVER the target
      if (percentage >= 100) return '#10b981'; // Excellent - met or exceeded target
      if (percentage >= 80) return '#22c55e';  // Good - close to target
      if (percentage >= 50) return '#f59e0b';  // Warning - halfway there
      if (percentage >= 25) return '#f97316';  // Bad - far from target
      return '#ef4444'; // Critical - very far from target
    }
  };

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 hover:border-cyan-500/50 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{indicator.title}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
            {indicator.category}
          </span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-3 mt-2">{indicator.description}</p>

      {/* Explanation and Direction */}
      {(indicator.explanation || indicator.higherIsBetter !== undefined) && (
        <div className="mb-4 p-3 bg-[#1a1f2e] border border-[#2a3441] rounded-lg space-y-2">
          {indicator.explanation && (
            <p className="text-xs text-gray-300 leading-relaxed break-words">
              <span className="text-cyan-400 font-semibold">ℹ️ What this shows:</span> {indicator.explanation}
            </p>
          )}
          {indicator.higherIsBetter !== undefined && (
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {indicator.higherIsBetter ? (
                <>
                  <span className="flex items-center gap-1 text-green-400 font-semibold whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Higher is Better
                  </span>
                  <span className="text-gray-500">—</span>
                  <span className="text-gray-400">Growth indicates positive trend</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-red-400 font-semibold whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    Lower is Better
                  </span>
                  <span className="text-gray-500">—</span>
                  <span className="text-gray-400">Reduction indicates positive trend</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3 flex-wrap">
          <span 
            className="text-3xl font-bold break-words" 
            style={{ color: indicator.color || '#06b6d4' }}
          >
            {(indicator.value ?? 0).toLocaleString()}
          </span>
          <span className="text-lg text-gray-400 break-words">{indicator.unit}</span>
        </div>

        {/* Progress Bar */}
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
            <div className="flex justify-between text-xs text-gray-400 flex-wrap gap-1">
              <span className="break-words">Target: {indicator.targetCondition} {indicator.target.toLocaleString()} {indicator.unit}</span>
              <span className="whitespace-nowrap">
            {getActualPercentage() > 0 && getActualPercentage() < 1 ? '<1%' : `${Math.round(getActualPercentage())}%`}
          </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#1f2937]">
        <span>Last update: {indicator.lastUpdate}</span>
        <span>{indicator.source}</span>
      </div>
    </div>
  );
}
