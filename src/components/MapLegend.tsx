interface MapLegendProps {
  minValue: number;
  maxValue: number;
  metric: string;
}

export default function MapLegend({ minValue, maxValue, metric }: MapLegendProps) {
  const colors = [
    { color: '#dbeafe', label: 'Low', percentage: '0%' },
    { color: '#93c5fd', label: '', percentage: '25%' },
    { color: '#60a5fa', label: 'Medium', percentage: '50%' },
    { color: '#3b82f6', label: '', percentage: '75%' },
    { color: '#1e40af', label: 'High', percentage: '100%' },
  ];

  const range = maxValue - minValue;
  const midValue = minValue + range / 2;
  const quarterValue = minValue + range / 4;
  const threeQuarterValue = minValue + (3 * range) / 4;

  const getLabelForValue = (value: number) => {
    if (value === minValue) return minValue.toLocaleString();
    if (value === maxValue) return maxValue.toLocaleString();
    if (Math.abs(value - midValue) < range * 0.05) return midValue.toLocaleString();
    return '';
  };

  return (
    <div className="bg-[#0f1419] p-6 rounded-xl border border-[#374151] shadow-lg">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-white">{metric}</h3>
          <div className="text-sm text-gray-400">
            {range > 0 ? `${range.toLocaleString()} range` : 'No variation'}
          </div>
        </div>

        {/* Color Scale */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 min-w-[80px] font-mono">
              {minValue.toLocaleString()}
            </span>
            <div className="flex-1 relative">
              <div className="flex h-8 rounded-xl overflow-hidden border border-[#374151] shadow-inner">
                {colors.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 relative group cursor-pointer transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: item.color }}
                    title={`${item.label || item.percentage} - ${item.color}`}
                  >
                    {item.label && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Value markers */}
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <span className="text-xs text-gray-600 font-mono bg-[#0f1419] px-1 rounded">
                  {minValue.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 font-mono bg-[#0f1419] px-1 rounded">
                  {maxValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Scale indicators */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Lowest</span>
            <span>Average: {midValue.toLocaleString()}</span>
            <span>Highest</span>
          </div>
        </div>

        {/* Additional Info */}
        {range > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#374151]">
            <div className="text-center">
              <p className="text-xs text-gray-500">Min</p>
              <p className="text-sm font-bold text-blue-400">{minValue.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Range</p>
              <p className="text-sm font-bold text-cyan-400">{range.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Max</p>
              <p className="text-sm font-bold text-green-400">{maxValue.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
