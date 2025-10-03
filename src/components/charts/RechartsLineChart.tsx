'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RechartsLineChartProps {
  data: Array<{
    name: string;
    value: number;
    fullLabel?: string; // Full label for tooltip
  }>;
  title?: string;
  dataAlert?: string;
  showArea?: boolean;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function RechartsLineChart({ 
  data, 
  title, 
  dataAlert, 
  showArea = true,
  color = '#10b981',
  xAxisLabel,
  yAxisLabel
}: RechartsLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload?: { fullLabel?: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const fullLabel = payload[0].payload?.fullLabel || label;
      return (
        <div className="bg-[#1f2937] border border-[#374151] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{fullLabel}</p>
          <p className="text-white text-lg font-bold">
            {payload[0].value.toLocaleString()}
          </p>
          <p className="text-cyan-400 text-sm">
            Value: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-sm font-semibold text-white mb-2 px-1">
          {title}
        </h3>
      )}
      
      {dataAlert && (
        <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
          <div className="flex items-center gap-1 text-yellow-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-medium">{dataAlert}</span>
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="80%">
        <ChartComponent
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#6b7280' }}
            tickLine={{ stroke: '#6b7280' }}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#9ca3af' } }}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={{ stroke: '#6b7280' }}
            tickLine={{ stroke: '#6b7280' }}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#9ca3af' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showArea ? (
            <>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 4 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
