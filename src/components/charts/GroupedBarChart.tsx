'use client';

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
}

export default function GroupedBarChart({ 
  data, 
  title, 
  height = 400, 
  color1 = '#3b82f6',
  color2 = '#ef4444',
  xAxisLabel = '',
  yAxisLabel = 'Count'
}: GroupedBarChartProps) {
  const maxValue = Math.max(
    ...data.flatMap(d => [d.value1, d.value2])
  );
  
  const width = 900;
  const padding = { top: 60, right: 60, bottom: 100, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const groupWidth = chartWidth / data.length;
  const barWidth = groupWidth * 0.35;
  const gap = groupWidth * 0.1;

  return (
    <div className="w-full">
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
              {/* Bar 1 */}
              <rect
                x={groupX + gap}
                y={bar1Y}
                width={barWidth}
                height={bar1Height}
                fill={color1}
                opacity="0.85"
                className="hover:opacity-100 transition-opacity cursor-pointer"
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
                fill={color2}
                opacity="0.85"
                className="hover:opacity-100 transition-opacity cursor-pointer"
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
                y={height - padding.bottom + 25}
                fill="#9ca3af"
                fontSize="13"
                fontWeight="500"
                textAnchor="middle"
              >
                {item.label}
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
        <g transform={`translate(${width / 2 - 100}, ${height - 20})`}>
          <rect x={0} y={0} width={20} height={12} fill={color1} opacity="0.85" />
          <text x={25} y={10} fill="#9ca3af" fontSize="12" fontWeight="500">
            {data[0]?.label1 || 'Value 1'}
          </text>
          
          <rect x={120} y={0} width={20} height={12} fill={color2} opacity="0.85" />
          <text x={145} y={10} fill="#9ca3af" fontSize="12" fontWeight="500">
            {data[0]?.label2 || 'Value 2'}
          </text>
        </g>

        {/* Y-Axis Label */}
        {yAxisLabel && (
          <text
            x={20}
            y={height / 2}
            fill="#9ca3af"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            {yAxisLabel}
          </text>
        )}

        {/* X-Axis Label */}
        {xAxisLabel && (
          <text
            x={width / 2}
            y={height - 35}
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

