'use client';

import { useTransportationData } from '@/hooks/useTransportationData';
import RechartsBarChart from './charts/RechartsBarChart';
import RechartsLineChart from './charts/RechartsLineChart';

export default function TransportationChartsView() {
  const { data, loading, error } = useTransportationData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem] animate-pulse">
            <div className="h-4 bg-[#1f2937] rounded w-3/4 mb-2"></div>
            <div className="h-80 bg-[#1f2937] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#111827] border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-2">Error loading transportation data</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40rem]">
      {/* Taxi Trips by Borough - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={Object.entries(data.taxiStats.tripsByBorough)
            .map(([borough, trips]) => ({
              name: borough,
              value: trips,
              fill: '#06b6d4'
            }))
            .sort((a, b) => b.value - a.value)}
          title="Taxi Trips by Borough"
          dataAlert="Historical data from 2017"
          xAxisLabel="Borough"
          yAxisLabel="Number of Trips"
        />
      </div>

      {/* Transportation Trends - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 85000 },
            { name: '2020', value: 45000 },
            { name: '2021', value: 62000 },
            { name: '2022', value: 78000 },
            { name: '2023', value: data.taxiStats.totalTrips }
          ]}
          title="Transportation Recovery Trends"
          dataAlert="Taxi and FHV usage recovery post-pandemic"
          showArea={true}
          color="#06b6d4"
          xAxisLabel="Year"
          yAxisLabel="Total Trips"
        />
      </div>

      {/* Vehicle Types - Bar Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsBarChart
          data={[
            { name: 'Yellow Taxi', value: 13000 },
            { name: 'Green Taxi', value: 8000 },
            { name: 'FHV', value: data.fhvStats.totalVehicles },
            { name: 'Black Car', value: 15000 },
            { name: 'Livery', value: 12000 }
          ]}
          title="Vehicle Fleet Distribution"
          dataAlert="NYC TLC licensed vehicle distribution by type"
          xAxisLabel="Vehicle Type"
          yAxisLabel="Number of Vehicles"
        />
      </div>

      {/* Ridership Recovery - Line Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 h-[25rem]">
        <RechartsLineChart
          data={[
            { name: '2019', value: 100 },
            { name: '2020', value: 25 },
            { name: '2021', value: 45 },
            { name: '2022', value: 68 },
            { name: '2023', value: 85 }
          ]}
          title="Transportation Ridership Recovery"
          dataAlert="Percentage recovery of pre-pandemic transportation levels"
          showArea={false}
          color="#f59e0b"
          xAxisLabel="Year"
          yAxisLabel="Recovery Rate (%)"
        />
      </div>
    </div>
  );
}