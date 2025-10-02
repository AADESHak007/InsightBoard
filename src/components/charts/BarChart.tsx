'use client';

import { useState, useRef } from 'react';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    percentage: number;
  }>;
  title?: string;
  height?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  dataAlert?: string;
}

const DISTINCTIVE_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
];

export default function BarChart({ 
  data, 
  title, 
  height = 300, 
  xAxisLabel = '',
  yAxisLabel = 'Count',
  dataAlert
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 700;
  const padding = { top: 30, right: 30, bottom: 80, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length * 0.7;
  const gap = chartWidth / data.length * 0.3;

  return (
    <div className="w-full relative" ref={chartRef}>
      {title && <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{title}</h3>}
      
      {/* Data Alert */}
      {dataAlert && (
        <div className="mb-3 sm:mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">{dataAlert}</span>
          </div>
        </div>
      )}
      
      <div className="w-full flex justify-center overflow-hidden">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = padding.top + (chartHeight * (100 - percent)) / 100;
          const value = Math.round((maxValue * percent) / 100);
          return (
            <g key={percent}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#1f2937"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fill="#6b7280"
                fontSize="12"
                textAnchor="end"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* X and Y axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding.left + (index * (barWidth + gap)) + gap / 2;
          const y = height - padding.bottom - barHeight;
          const barColor = DISTINCTIVE_COLORS[index % DISTINCTIVE_COLORS.length];

          return (
            <g key={item.label} className="group">
              {/* Bar with gradient */}
              <defs>
                <linearGradient id={`barGradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={barColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={barColor} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={`url(#barGradient-${index})`}
                opacity={hoveredIndex === index ? "1" : "0.85"}
                className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                rx="4"
                ry="4"
                onMouseEnter={(e) => {
                  setHoveredIndex(index);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10
                  });
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* Value on top of bar - only show if bar is tall enough */}
              {barHeight > 40 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  className="drop-shadow-sm"
                >
                  {item.value.toLocaleString()}
                </text>
              )}

              {/* Percentage below value - only show if bar is tall enough */}
              {barHeight > 60 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 24}
                  fill={barColor}
                  fontSize="10"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {item.percentage.toFixed(1)}%
                </text>
              )}

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                fill="#9ca3af"
                fontSize="10"
                fontWeight="500"
                textAnchor="end"
                transform={`rotate(-45, ${x + barWidth / 2}, ${height - padding.bottom + 20})`}
              >
                {item.label.length > 20 ? item.label.substring(0, 20) + '...' : item.label}
              </text>

              {/* Hover effect */}
              <rect
                x={x}
                y={padding.top}
                width={barWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseMove={(e) => {
                  if (!chartRef.current) return;
                  
                  setHoveredIndex(index);
                  const chartRect = chartRef.current.getBoundingClientRect();
                  const tooltipWidth = 180;
                  const tooltipHeight = 80;
                  const offset = 12;

                  let tooltipX = e.clientX - chartRect.left + offset;
                  let tooltipY = e.clientY - chartRect.top + offset;

                  // Check if tooltip would overflow right edge
                  if (tooltipX + tooltipWidth > chartRect.width) {
                    tooltipX = e.clientX - chartRect.left - tooltipWidth - offset;
                  }

                  // Check if tooltip would overflow bottom edge
                  if (tooltipY + tooltipHeight > chartRect.height) {
                    tooltipY = e.clientY - chartRect.top - tooltipHeight - offset;
                  }

                  // Ensure tooltip doesn't go off left edge
                  if (tooltipX < 0) {
                    tooltipX = offset;
                  }

                  // Ensure tooltip doesn't go off top edge
                  if (tooltipY < 0) {
                    tooltipY = offset;
                  }

                  setTooltipPosition({ x: tooltipX, y: tooltipY });
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}


        {/* Y-Axis Label */}
        {yAxisLabel && (
          <text
            x={25}
            y={height / 2}
            fill="#9ca3af"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 25, ${height / 2})`}
          >
            {yAxisLabel}
          </text>
        )}

        {/* X-Axis Label */}
        {xAxisLabel && (
          <text
            x={width / 2}
            y={height - 10}
            fill="#9ca3af"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
        )}

        {/* Vertical indicator line for hover */}
        {hoveredIndex !== null && (
          <line
            x1={padding.left + (hoveredIndex * barWidth) + (barWidth / 2)}
            y1={padding.top}
            x2={padding.left + (hoveredIndex * barWidth) + (barWidth / 2)}
            y2={height - padding.bottom}
            stroke="white"
            strokeWidth="1"
            opacity="0.8"
          />
        )}
      </svg>
      </div>
      
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-50 bg-[#1f2937] border border-[#374151] rounded-lg p-3 shadow-lg pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              minWidth: "180px",
            }}
          >
            <div className="text-white font-bold text-lg mb-2">
              {data[hoveredIndex].label}
            </div>
            <div className="text-white text-2xl font-bold mb-1">
              {data[hoveredIndex].value.toLocaleString()}
            </div>
            <div className="text-cyan-400 text-sm">
              Value: {data[hoveredIndex].percentage.toFixed(1)}%
            </div>
          </div>
        )}
    </div>
  );
}

