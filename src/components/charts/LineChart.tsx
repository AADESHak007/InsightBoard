import React, { useState, useRef } from 'react';

export interface LineChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  title?: string;
  height?: number;
  width?: number;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  dataAlert?: string;
  showArea?: boolean;
  showDots?: boolean;
}


export default function LineChart({
  data,
  title = '',
  height = 220,
  width = 500,
  color = '#3b82f6',
  xAxisLabel = '',
  yAxisLabel = '',
  dataAlert,
  showArea = true,
  showDots = true,
}: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111827] border border-[#1f2937] rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 55, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Convert string dates to numbers for calculation
  const numericData = data.map((point, index) => ({
    ...point,
    x: typeof point.x === 'string' ? index : point.x as number,
  }));

  const minX = Math.min(...numericData.map(d => d.x as number));
  const maxX = Math.max(...numericData.map(d => d.x as number));
  const minY = Math.min(...numericData.map(d => d.y));
  const maxY = Math.max(...numericData.map(d => d.y));

  const xScale = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * chartWidth;
  const yScale = (y: number) => padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;

  // Create path for line
  const linePath = numericData
    .map((point, index) => {
      const x = xScale(point.x as number);
      const y = yScale(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create path for area (if enabled)
  const areaPath = showArea
    ? `${linePath} L ${xScale(numericData[numericData.length - 1].x as number)} ${yScale(minY)} L ${xScale(numericData[0].x as number)} ${yScale(minY)} Z`
    : '';

  // Generate Y-axis ticks
  const yTicks = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const value = minY + (maxY - minY) * (i / tickCount);
    yTicks.push({
      value,
      y: yScale(value),
    });
  }

  // Generate X-axis ticks
  const xTicks = numericData.map((point,) => ({
    value: point.label || point.x.toString(),
    x: xScale(point.x as number),
  }));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find closest data point
    let closestIndex = 0;
    let minDistance = Infinity;

    numericData.forEach((point, index) => {
      const pointX = xScale(point.x as number);
      const distance = Math.abs(mouseX - pointX);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
    setTooltipPosition({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="relative w-full overflow-hidden">
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

      <div className="w-full flex justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="cursor-crosshair max-w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Area under line (if enabled) */}
        {showArea && (
          <path
            d={areaPath}
            fill={`url(#areaGradient)`}
            opacity="0.3"
          />
        )}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          className="transition-all duration-300"
        />

        {/* Data points */}
        {showDots && numericData.map((point, index) => (
          <circle
            key={index}
            cx={xScale(point.x as number)}
            cy={yScale(point.y)}
            r="4"
            fill={color}
            stroke="#0a0e1a"
            strokeWidth="2"
            className="transition-all duration-300 hover:r-6"
          />
        ))}

        {/* Hover indicator line */}
        {hoveredIndex !== null && (
          <line
            x1={xScale(numericData[hoveredIndex].x as number)}
            y1={padding.top}
            x2={xScale(numericData[hoveredIndex].x as number)}
            y2={height - padding.bottom}
            stroke="white"
            strokeWidth="1"
            opacity="0.8"
          />
        )}

        {/* Hover indicator dot */}
        {hoveredIndex !== null && (
          <circle
            cx={xScale(numericData[hoveredIndex].x as number)}
            cy={yScale(numericData[hoveredIndex].y)}
            r="6"
            fill="white"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-200"
          />
        )}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#6b7280"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {yTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={padding.left - 5}
              y1={tick.y}
              x2={padding.left}
              y2={tick.y}
              stroke="#6b7280"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="text-xs fill-gray-400"
            >
              {tick.value >= 1000000 ? `${(tick.value / 1000000).toFixed(1)}M` : 
               tick.value >= 1000 ? `${(tick.value / 1000).toFixed(0)}K` : 
               tick.value.toFixed(0)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((tick, index) => (
          <text
            key={index}
            x={tick.x}
            y={height - padding.bottom + 15}
            textAnchor="end"
            className="text-xs fill-gray-400"
            transform={`rotate(-45, ${tick.x}, ${height - padding.bottom + 15})`}
          >
            {typeof tick.value === 'string' && tick.value.length > 10 ? tick.value.substring(0, 10) : tick.value}
          </text>
        ))}

        {/* Title */}
        {title && (
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            className="text-lg font-semibold fill-white"
          >
            {title}
          </text>
        )}

        {/* Axis labels */}
        {xAxisLabel && (
          <text
            x={width / 2}
            y={height - 3}
            textAnchor="middle"
            className="text-xs fill-gray-400"
          >
            {xAxisLabel}
          </text>
        )}
        {yAxisLabel && (
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            className="text-xs fill-gray-400"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            {yAxisLabel}
          </text>
        )}
      </svg>
      </div>

      {/* Compact Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-20 bg-[#1f2937] border border-[#374151] rounded-lg p-2 shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x - 60,
            top: tooltipPosition.y - 50,
            width: 120
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-white font-medium text-xs">
                {numericData[hoveredIndex].label || numericData[hoveredIndex].x.toString()}
              </span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {numericData[hoveredIndex].y >= 1000000 ? `${(numericData[hoveredIndex].y / 1000000).toFixed(1)}M` : 
               numericData[hoveredIndex].y >= 1000 ? `${(numericData[hoveredIndex].y / 1000).toFixed(0)}K` : 
               numericData[hoveredIndex].y.toFixed(0)}
            </div>
            <div className="text-cyan-400 text-xs">
              Value: {numericData[hoveredIndex].y >= 1000000 ? `${(numericData[hoveredIndex].y / 1000000).toFixed(1)}M` : 
                      numericData[hoveredIndex].y >= 1000 ? `${(numericData[hoveredIndex].y / 1000).toFixed(0)}K` : 
                      numericData[hoveredIndex].y.toFixed(0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
