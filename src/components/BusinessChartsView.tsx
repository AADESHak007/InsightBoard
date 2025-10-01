'use client';

import { useBusinessData } from '@/hooks/useBusinessData';
import { useBusinessAcceleration } from '@/hooks/useBusinessAcceleration';
import ChartCard from './ChartCard';
import RefreshDataButton from './RefreshDataButton';
import { Indicator } from '@/types/indicator';

export default function BusinessChartsView() {
  const { data, loading, error, refetch } = useBusinessData();
  const { data: accelData, loading: accelLoading } = useBusinessAcceleration();

  if (loading || accelLoading) {
    return (
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse h-96">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-[#1f2937] rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading business data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data || !accelData) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No business data available</p>
      </div>
    );
  }

  // Create chart indicators for all Business metrics
  const chartIndicators: Indicator[] = [];

  // 1. Total Certified Businesses - Cumulative Growth
  chartIndicators.push({
    id: 'chart-total-certified',
    title: 'Total Certified Businesses Growth',
    category: 'Business',
    description: 'Cumulative growth of M/WBE certified businesses over time.',
    value: data.stats.total,
    unit: 'businesses',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC SBS',
    color: '#8b5cf6',
    chartData: data.growth.map(g => ({
      year: g.year,
      value: g.cumulative,
    })),
  });

  // 2. MBE - Minority Business Enterprises Trend
  const mbeByYear = data.growth.map(g => ({
    year: g.year,
    value: Math.round(g.cumulative * (data.stats.mbe / data.stats.total)), // Estimate MBE proportion
  }));
  
  chartIndicators.push({
    id: 'chart-mbe',
    title: 'Minority Business Enterprises (MBE)',
    category: 'Business',
    description: 'Growth trend of certified minority-owned businesses.',
    value: data.stats.mbe,
    unit: 'MBE',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC SBS',
    color: '#14b8a6',
    chartData: mbeByYear,
  });

  // 3. WBE - Women Business Enterprises Trend
  const wbeByYear = data.growth.map(g => ({
    year: g.year,
    value: Math.round(g.cumulative * (data.stats.wbe / data.stats.total)), // Estimate WBE proportion
  }));
  
  chartIndicators.push({
    id: 'chart-wbe',
    title: 'Women Business Enterprises (WBE)',
    category: 'Business',
    description: 'Growth trend of certified women-owned businesses.',
    value: data.stats.wbe,
    unit: 'WBE',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC SBS',
    color: '#f59e0b',
    chartData: wbeByYear,
  });

  // 4. Business Growth Rate - New Certifications Per Year
  chartIndicators.push({
    id: 'chart-growth-rate',
    title: 'New Certifications Per Year',
    category: 'Business',
    description: 'Annual new business certifications granted.',
    value: data.growth[data.growth.length - 1]?.count || 0,
    unit: 'per year',
    lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
    source: 'NYC SBS',
    color: '#06b6d4',
    chartData: data.growth.map(g => ({
      year: g.year,
      value: g.count,
    })),
  });

  // 5. Jobs Created Trend (if available)
  if (accelData) {
    chartIndicators.push({
      id: 'chart-jobs',
      title: 'Jobs Created by New Businesses (2012-2019)',
      category: 'Business',
      description: 'Annual job creation from businesses in acceleration program.',
      value: accelData.jobsStats.totalJobs,
      unit: 'total jobs',
      lastUpdate: '2019-08-08',
      source: 'NYC Business Acceleration',
      color: '#10b981',
      chartData: accelData.yearlyJobsTrend.filter(y => y.year >= 2012 && y.year <= 2019).map(y => ({
        year: y.year,
        value: y.jobs,
      })),
    });

    // 6. New Businesses Trend
    chartIndicators.push({
      id: 'chart-new-businesses',
      title: 'Businesses Opened Annually (2012-2019)',
      category: 'Business',
      description: 'New businesses opened each year in acceleration program.',
      value: accelData.totalBusinesses,
      unit: 'total',
      lastUpdate: '2019-08-08',
      source: 'NYC Business Acceleration',
      color: '#f59e0b',
      chartData: accelData.yearlyJobsTrend.filter(y => y.year >= 2012 && y.year <= 2019).map(y => ({
        year: y.year,
        value: y.businesses,
      })),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Live data from NYC Open Data</span>
          <span className="text-gray-500">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Chart View */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {chartIndicators.map(indicator => (
          <ChartCard key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

