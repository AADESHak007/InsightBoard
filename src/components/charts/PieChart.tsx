'use client';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    percentage: number;
  }>;
  title?: string;
  size?: number;
}

const COLORS = [
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // orange
  '#10b981', // green
  '#ef4444', // red
  '#14b8a6', // teal
];

export default function PieChart({ data, title, size = 400 }: PieChartProps) {
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
      color: COLORS[index % COLORS.length],
      percentage,
      label: item.label,
      value: item.value,
      labelX,
      labelY,
      midAngle,
    };
  });

  return (
    <div className="w-full">
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Pie Chart */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
          {slices.map((slice, index) => (
            <g key={index} className="group cursor-pointer">
              {/* Slice */}
              <path
                d={slice.path}
                fill={slice.color}
                stroke="#0a0e1a"
                strokeWidth="2"
                opacity="0.85"
                className="transition-all duration-300 hover:opacity-100 hover:scale-105"
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
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
            <div key={index} className="flex items-center gap-3 group cursor-pointer hover:bg-[#1a1f2e] p-2 rounded-lg transition-colors">
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
    </div>
  );
}

