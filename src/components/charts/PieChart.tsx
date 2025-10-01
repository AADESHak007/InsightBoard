'use client';

import { useState, useRef } from 'react';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    percentage: number;
  }>;
  title?: string;
  size?: number;
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

export default function PieChart({ data, title, size = 450, dataAlert }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.min(size, size) * 0.35;

  // Calculate pie slices
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const sliceAngle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // Calculate arc path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    // Calculate label position (middle of slice, outside the pie)
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 1.3;
    const labelX = centerX + labelRadius * Math.cos(midRad);
    const labelY = centerY + labelRadius * Math.sin(midRad);

    currentAngle = endAngle;

    return {
      path,
      color: DISTINCTIVE_COLORS[index % DISTINCTIVE_COLORS.length],
      percentage,
      label: item.label,
      value: item.value,
      labelX,
      labelY,
      midAngle,
    };
  });

  return (
    <div className="w-full relative" ref={chartRef}>
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      
      {/* Data Alert */}
      {dataAlert && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium">{dataAlert}</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Pie Chart */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
          {slices.map((slice, index) => (
            <g key={index} className="group cursor-pointer">
              {/* Gradient definitions */}
              <defs>
                <linearGradient id={`pieGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={slice.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={slice.color} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Slice */}
              <path
                d={slice.path}
                fill={`url(#pieGradient-${index})`}
                stroke="#0a0e1a"
                strokeWidth="2"
                opacity={hoveredIndex === index ? "1" : "0.85"}
                className="transition-all duration-300 hover:opacity-100 hover:scale-105"
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
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

              {/* Percentage label on slice */}
              {slice.percentage > 5 && (
                <text
                  x={centerX + (radius * 0.6) * Math.cos((slice.midAngle * Math.PI) / 180)}
                  y={centerY + (radius * 0.6) * Math.sin((slice.midAngle * Math.PI) / 180)}
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {slice.percentage.toFixed(1)}%
                </text>
              )}
            </g>
          ))}

          {/* Center circle for donut effect */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.5}
            fill="#0a0e1a"
            stroke="#1f2937"
            strokeWidth="2"
          />

          {/* Center text */}
          <text
            x={centerX}
            y={centerY - 10}
            fill="#fff"
            fontSize="24"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {total}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            fill="#6b7280"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Total
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {slices.map((slice, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 group cursor-pointer hover:bg-[#1a1f2e] p-2 rounded-lg transition-colors ${
                hoveredIndex === index ? 'bg-[#1a1f2e]' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{slice.label}</p>
                <p className="text-xs text-gray-400">
                  {slice.value.toLocaleString()} ({slice.percentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
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
            {slices[hoveredIndex].label}
          </div>
          <div className="text-white text-2xl font-bold mb-1">
            {slices[hoveredIndex].value.toLocaleString()}
          </div>
          <div className="text-cyan-400 text-sm">
            Value: {slices[hoveredIndex].percentage.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}

