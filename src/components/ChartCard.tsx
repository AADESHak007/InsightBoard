'use client';

import { Indicator } from '@/types/indicator';

interface ChartCardProps {
  indicator: Indicator;
}

export default function ChartCard({ indicator }: ChartCardProps) {
  if (!indicator.chartData || indicator.chartData.length === 0) {
    return null;
  }

  const data = indicator.chartData;
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, ...point };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 sm:p-5">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{indicator.title}</h3>
        <p className="text-xs sm:text-sm text-gray-400">{indicator.description}</p>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} className="overflow-visible sm:h-[280px]">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (100 - percent)) / 100;
            const value = minValue + (range * percent) / 100;
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#1f2937"
                  strokeWidth="1"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="#6b7280"
                  fontSize="11"
                  textAnchor="end"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={indicator.color || '#06b6d4'}
            fillOpacity="0.15"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={indicator.color || '#06b6d4'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={indicator.color || '#06b6d4'}
              />
              {/* Year labels */}
              <text
                x={point.x}
                y={height - padding + 20}
                fill="#6b7280"
                fontSize="11"
                textAnchor="middle"
              >
                {point.year}
              </text>
            </g>
          ))}

          {/* Tooltip for last point */}
          {points.length > 0 && (
            <g>
              <rect
                x={points[points.length - 1].x + 8}
                y={points[points.length - 1].y - 30}
                width="90"
                height="35"
                fill="#1f2937"
                rx="4"
              />
              <text
                x={points[points.length - 1].x + 53}
                y={points[points.length - 1].y - 16}
                fill="#fff"
                fontSize="11"
                textAnchor="middle"
                fontWeight="600"
              >
                {points[points.length - 1].year}
              </text>
              <text
                x={points[points.length - 1].x + 53}
                y={points[points.length - 1].y - 4}
                fill={indicator.color || '#06b6d4'}
                fontSize="13"
                textAnchor="middle"
                fontWeight="700"
              >
                {points[points.length - 1].value.toLocaleString()}
              </text>
            </g>
          )}

          {/* Y-Axis Label */}
          <text
            x={15}
            y={height / 2}
            fill="#9ca3af"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            {indicator.unit}
          </text>

          {/* X-Axis Label */}
          <text
            x={width / 2}
            y={height - 5}
            fill="#9ca3af"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            Year
          </text>
        </svg>
      </div>
    </div>
  );
}
