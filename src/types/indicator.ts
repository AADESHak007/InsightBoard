export interface Indicator {
  id: string;
  title: string;
  category: string;
  description: string;
  value: number;
  unit: string;
  target?: number;
  targetCondition?: '>=' | '<=' | '=' | '>' | '<';
  lastUpdate: string;
  source: string;
  trend?: 'up' | 'down' | 'stable';
  chartData?: ChartDataPoint[];
  color?: string;
}

export interface ChartDataPoint {
  year: number;
  value: number;
}

export type ViewMode = 'card' | 'chart' | 'table' | 'map';

export type Category = 'All' | 'Public Safety' | 'Transportation' | 'Health' | 'Education' | 'Housing' | 'Environment' | 'Economy' | 'Business';

