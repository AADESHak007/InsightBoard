'use client';

import { useState, useRef } from 'react';

interface GroupedBarChartProps {
  data: Array<{
    label: string;
    value1: number;
    value2: number;
    label1: string;
    label2: string;
  }>;
  title?: string;
  height?: number;
  color1?: string;
  color2?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  dataAlert?: string;
}

export default function GroupedBarChart({ 
  data, 
  title, 
  height = 300, 
  color1 = '#3b82f6',
  color2 = '#ef4444',
  xAxisLabel = '',
  yAxisLabel = 'Count',
  dataAlert
}: GroupedBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<'bar1' | 'bar2' | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
  const maxValue = Math.max(
    ...data.flatMap(d => [d.value1, d.value2])
  );
  
  const width = 700;
  const padding = { top: 40, right: 30, bottom: 70, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const groupWidth = chartWidth / data.length;
  const barWidth = groupWidth * 0.35;
  const gap = groupWidth * 0.1;

  return (
    <div className="w-full relative overflow-hidden" ref={chartRef}>
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
      
      <div className="w-full flex justify-center">
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
              <text x={padding.left - 10} y={y + 4} fill="#6b7280" fontSize="12" textAnchor="end">
                {value}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#374151" strokeWidth="2" />
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#374151" strokeWidth="2" />

        {/* Grouped Bars */}
        {data.map((item, index) => {
          const groupX = padding.left + index * groupWidth;
          
          const bar1Height = (item.value1 / maxValue) * chartHeight;
          const bar1Y = height - padding.bottom - bar1Height;
          
          const bar2Height = (item.value2 / maxValue) * chartHeight;
          const bar2Y = height - padding.bottom - bar2Height;

          return (
            <g key={item.label}>
              {/* Gradient definitions */}
              <defs>
                <linearGradient id={`groupedBar1Gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color1} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color1} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id={`groupedBar2Gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color2} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color2} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Bar 1 */}
              <rect
                x={groupX + gap}
                y={bar1Y}
                width={barWidth}
                height={bar1Height}
                fill={`url(#groupedBar1Gradient-${index})`}
                opacity={hoveredIndex === index && hoveredBar === 'bar1' ? "1" : "0.85"}
                className="hover:opacity-100 transition-opacity cursor-pointer"
                rx="4"
                ry="4"
                onMouseMove={(e) => {
                  if (!chartRef.current) return;
                  
                  setHoveredIndex(index);
                  setHoveredBar('bar1');
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
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setHoveredBar(null);
                }}
              />
              <text
                x={groupX + gap + barWidth / 2}
                y={bar1Y - 5}
                fill={color1}
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.value1.toLocaleString()}
              </text>

              {/* Bar 2 */}
              <rect
                x={groupX + gap + barWidth + gap}
                y={bar2Y}
                width={barWidth}
                height={bar2Height}
                fill={`url(#groupedBar2Gradient-${index})`}
                opacity={hoveredIndex === index && hoveredBar === 'bar2' ? "1" : "0.85"}
                className="hover:opacity-100 transition-opacity cursor-pointer"
                rx="4"
                ry="4"
                onMouseMove={(e) => {
                  if (!chartRef.current) return;
                  
                  setHoveredIndex(index);
                  setHoveredBar('bar2');
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
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setHoveredBar(null);
                }}
              />
              <text
                x={groupX + gap + barWidth + gap + barWidth / 2}
                y={bar2Y - 5}
                fill={color2}
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.value2.toLocaleString()}
              </text>

              {/* Label */}
              <text
                x={groupX + groupWidth / 2}
                y={height - padding.bottom + 20}
                fill="#9ca3af"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {item.label.length > 12 ? item.label.substring(0, 12) : item.label}
              </text>
            </g>
          );
        })}

        {/* Title */}
        {title && (
          <text x={width / 2} y={25} fill="#fff" fontSize="18" fontWeight="700" textAnchor="middle">
            {title}
          </text>
        )}

        {/* Legend */}
        <g transform={`translate(${width / 2 - 80}, ${height - 15})`}>
          <rect x={0} y={0} width={16} height={10} fill={color1} opacity="0.85" />
          <text x={20} y={9} fill="#9ca3af" fontSize="10" fontWeight="500">
            {data[0]?.label1 || 'Value 1'}
          </text>
          
          <rect x={100} y={0} width={16} height={10} fill={color2} opacity="0.85" />
          <text x={120} y={9} fill="#9ca3af" fontSize="10" fontWeight="500">
            {data[0]?.label2 || 'Value 2'}
          </text>
        </g>

        {/* Y-Axis Label */}
        {yAxisLabel && (
          <text
            x={18}
            y={height / 2}
            fill="#9ca3af"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 18, ${height / 2})`}
          >
            {yAxisLabel}
          </text>
        )}

        {/* X-Axis Label */}
        {xAxisLabel && (
          <text
            x={width / 2}
            y={height - 25}
            fill="#9ca3af"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
        )}
      </svg>
      </div>
      
      {/* Tooltip */}
      {hoveredIndex !== null && hoveredBar && (
        <div
          className="absolute z-50 bg-[#1f2937] border border-[#374151] rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            minWidth: "180px",
          }}
        >
          <div className="text-white font-bold text-lg mb-2">
            {hoveredBar === 'bar1' ? data[hoveredIndex].label1 : data[hoveredIndex].label2}
          </div>
          <div className="text-white text-2xl font-bold mb-1">
            {hoveredBar === 'bar1' ? data[hoveredIndex].value1.toLocaleString() : data[hoveredIndex].value2.toLocaleString()}
          </div>
          <div className="text-cyan-400 text-sm">
            {data[hoveredIndex].label}
          </div>
        </div>
      )}
    </div>
  );
}

