'use client';

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
}

export default function BarChart({ 
  data, 
  title, 
  height = 400, 
  color = '#06b6d4',
  xAxisLabel = '',
  yAxisLabel = 'Count'
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 800;
  const padding = { top: 40, right: 40, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length * 0.7;
  const gap = chartWidth / data.length * 0.3;

  return (
    <div className="w-full">
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
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

          return (
            <g key={item.label} className="group">
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                opacity="0.8"
                className="transition-all duration-300 hover:opacity-100 cursor-pointer"
              />
              
              {/* Value on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 8}
                fill="#fff"
                fontSize="14"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.value}
              </text>

              {/* Percentage below value */}
              <text
                x={x + barWidth / 2}
                y={y - 24}
                fill="#06b6d4"
                fontSize="12"
                fontWeight="500"
                textAnchor="middle"
              >
                {item.percentage.toFixed(1)}%
              </text>

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                fill="#9ca3af"
                fontSize="12"
                fontWeight="500"
                textAnchor="middle"
                transform={`rotate(-45, ${x + barWidth / 2}, ${height - padding.bottom + 20})`}
              >
                {item.label}
              </text>

              {/* Hover effect */}
              <rect
                x={x}
                y={padding.top}
                width={barWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
              />
            </g>
          );
        })}

        {/* Title */}
        {title && (
          <text
            x={width / 2}
            y={20}
            fill="#fff"
            fontSize="16"
            fontWeight="600"
            textAnchor="middle"
          >
            {title}
          </text>
        )}

        {/* Y-Axis Label */}
        {yAxisLabel && (
          <text
            x={15}
            y={height / 2}
            fill="#9ca3af"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
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
      </svg>
    </div>
  );
}

