'use client';

import { useTransportationData } from '@/hooks/useTransportationData';
import IndicatorCard from './IndicatorCard';
import RefreshDataButton from './RefreshDataButton';
import BarChart from './charts/BarChart';
import { Indicator } from '@/types/indicator';

export default function TransportationInsights() {
  const { data, loading, error, refetch } = useTransportationData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-[#1f2937] rounded w-1/2 mb-6"></div>
            <div className="h-12 bg-[#1f2937] rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading transportation data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center">
        <p className="text-gray-400">No transportation data available</p>
      </div>
    );
  }

  const accessibilityPercent = data.fhvStats.totalVehicles > 0
    ? (data.fhvStats.wheelchairAccessible / data.fhvStats.totalVehicles) * 100
    : 0;

  const activePercent = data.fhvStats.totalVehicles > 0
    ? (data.fhvStats.activeVehicles / data.fhvStats.totalVehicles) * 100
    : 0;

  const cardPaymentPercent = data.taxiStats.totalTrips > 0
    ? (data.taxiStats.cardPayments / data.taxiStats.totalTrips) * 100
    : 0;

  const tipPercent = data.taxiStats.avgFare > 0
    ? (data.taxiStats.avgTipAmount / data.taxiStats.avgFare) * 100
    : 0;

  const indicators: Indicator[] = [
    {
      id: 'trans-1',
      title: 'Total For-Hire Vehicles',
      category: 'Transportation',
      description: 'Total TLC-licensed FHVs (Uber, Lyft, livery, etc.) registered in NYC.',
      value: data.fhvStats.totalVehicles,
      unit: 'vehicles',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC TLC',
      color: '#f59e0b',
      higherIsBetter: true,
      explanation: 'Size of the for-hire vehicle fleet serving NYC. Larger fleet means greater transportation availability and accessibility.',
    },
    {
      id: 'trans-2',
      title: 'Active FHV Fleet',
      category: 'Transportation',
      description: 'Percentage of FHV vehicles currently active and operational.',
      value: Math.round(activePercent * 10) / 10,
      unit: '%',
      target: 85,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC TLC',
      trend: activePercent >= 85 ? 'up' : 'stable',
      color: '#10b981',
      higherIsBetter: true,
      explanation: 'Share of registered vehicles actively providing rides. Higher rates indicate efficient fleet utilization and service availability.',
    },
    {
      id: 'trans-3',
      title: 'Wheelchair Accessible',
      category: 'Transportation',
      description: 'Percentage of FHV fleet that is wheelchair accessible.',
      value: Math.round(accessibilityPercent * 10) / 10,
      unit: '%',
      target: 20,
      targetCondition: '>=',
      lastUpdate: new Date(data.lastUpdated).toISOString().split('T')[0],
      source: 'NYC TLC',
      trend: accessibilityPercent >= 20 ? 'up' : 'down',
      color: '#06b6d4',
      higherIsBetter: true,
      explanation: 'Vehicles equipped for wheelchair users. Higher percentages mean better accessibility and inclusion for disabled residents.',
    },
    {
      id: 'trans-4',
      title: 'Yellow Taxi Trips (Sample)',
      category: 'Transportation',
      description: 'Sample of yellow taxi trips from 2017 dataset (50k records).',
      value: data.taxiStats.totalTrips,
      unit: 'trips',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      color: '#eab308',
      higherIsBetter: true,
      explanation: 'Volume of taxi rides taken across NYC. Higher trip counts indicate strong demand and robust transportation network usage.',
    },
    {
      id: 'trans-5',
      title: 'Average Trip Fare',
      category: 'Transportation',
      description: 'Average fare per yellow taxi trip (base fare only).',
      value: Math.round(data.taxiStats.avgFare * 100) / 100,
      unit: '$',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      color: '#22c55e',
      explanation: 'Typical cost per taxi ride. This metric reflects pricing for transportation accessibility and trip economics.',
    },
    {
      id: 'trans-6',
      title: 'Average Trip Distance',
      category: 'Transportation',
      description: 'Average distance traveled per yellow taxi trip.',
      value: Math.round(data.taxiStats.avgTripDistance * 100) / 100,
      unit: 'miles',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      color: '#3b82f6',
      explanation: 'Typical length of taxi rides. Shows urban mobility patterns and how far people typically travel within the city.',
    },
    {
      id: 'trans-7',
      title: 'Card Payment Rate',
      category: 'Transportation',
      description: 'Percentage of taxi trips paid with credit/debit card.',
      value: Math.round(cardPaymentPercent * 10) / 10,
      unit: '%',
      target: 70,
      targetCondition: '>=',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      trend: cardPaymentPercent >= 70 ? 'up' : 'stable',
      color: '#8b5cf6',
      higherIsBetter: true,
      explanation: 'Digital payment adoption rate. Higher rates indicate modernized payment systems and improved convenience for riders.',
    },
    {
      id: 'trans-8',
      title: 'Average Tip Rate',
      category: 'Transportation',
      description: 'Average tip amount as percentage of base fare.',
      value: Math.round(tipPercent * 10) / 10,
      unit: '%',
      target: 15,
      targetCondition: '>=',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      trend: tipPercent >= 15 ? 'up' : 'stable',
      color: '#ec4899',
      higherIsBetter: true,
      explanation: 'How much riders tip drivers on average. Higher tips suggest good service quality and driver earnings.',
    },
    {
      id: 'trans-9',
      title: 'Total Revenue (Sample)',
      category: 'Transportation',
      description: 'Total revenue from sampled yellow taxi trips.',
      value: Math.round(data.taxiStats.totalRevenue),
      unit: '$',
      lastUpdate: '2017-01-09',
      source: 'NYC TLC',
      color: '#f59e0b',
      higherIsBetter: true,
      explanation: 'Economic value generated by taxi operations. Higher revenue indicates thriving transportation economy and driver livelihood.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Transportation Sector</h2>
        <p className="text-gray-400 text-sm sm:text-base">Taxi operations, accessibility, and mobility metrics</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400">Live data from NYC TLC</span>
          <span className="text-cyan-500/60">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Data Source Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">
            <strong>Data Alert:</strong> Yellow taxi data is from 2017 historical records (sample of 50,000 trips). 
            FHV data reflects current registered vehicles in NYC.
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {indicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {/* Taxi Trips by Borough */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Yellow Taxi Trips by Borough</h3>
          <p className="text-sm text-gray-400 mt-1">
            Distribution of taxi pickups across NYC boroughs (2017 sample data)
          </p>
        </div>
        <BarChart
          data={Object.entries(data.taxiStats.tripsByBorough)
            .map(([borough, trips]) => ({
              label: borough,
              value: trips,
              percentage: (trips / data.taxiStats.totalTrips) * 100,
            }))
            .sort((a, b) => b.value - a.value)}
          title=""
          height={400}
          color="#06b6d4"
          xAxisLabel="Borough"
          yAxisLabel="Number of Trips"
          dataAlert="Historical data from 2017 - may not reflect current patterns"
        />
      </div>
    </div>
  );
}

