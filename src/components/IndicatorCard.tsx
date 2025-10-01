'use client';

import { Indicator } from '@/types/indicator';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface IndicatorCardProps {
  indicator: Indicator;
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const getProgressPercentage = () => {
    if (!indicator.target) return 0;
    
    if (indicator.targetCondition === '<=' || indicator.targetCondition === '<') {
      const range = indicator.target * 2;
      return Math.min(100, Math.max(0, ((range - indicator.value) / range) * 100));
    } else {
      return Math.min(100, (indicator.value / indicator.target) * 100);
    }
  };

  const getProgressColor = () => {
    const progress = getProgressPercentage();
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
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
      <p className="text-sm text-gray-400 mb-4 mt-2">{indicator.description}</p>

      {/* Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span 
            className="text-4xl font-bold" 
            style={{ color: indicator.color || '#06b6d4' }}
          >
            {(indicator.value ?? 0).toLocaleString()}
          </span>
          <span className="text-lg text-gray-400">{indicator.unit}</span>
        </div>

        {/* Progress Bar */}
        {indicator.target && (
          <div>
            <div className="w-full bg-[#1f2937] rounded-full h-2 mb-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor(),
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Target: {indicator.targetCondition} {indicator.target.toLocaleString()} {indicator.unit}</span>
              <span>{Math.round(getProgressPercentage())}%</span>
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
