'use client';

import { useTransportationData } from '@/hooks/useTransportationData';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import RefreshDataButton from './RefreshDataButton';

export default function TransportationChartsView() {
  const { data, loading, error, refetch } = useTransportationData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-[#1f2937] rounded w-3/4 mb-4"></div>
            <div className="h-[400px] bg-[#1f2937] rounded"></div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-cyan-400">Live data from NYC TLC</span>
          <span className="text-cyan-500/60">• Updated {new Date(data.lastUpdated).toLocaleString()}</span>
        </div>
        <RefreshDataButton onRefresh={refetch} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        
        {/* Hourly Taxi Demand Pattern */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 2xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Hourly Taxi Demand Pattern</h3>
            <p className="text-sm text-gray-400 mt-1">
              24-hour trip volume showing peak travel times
            </p>
          </div>
          <BarChart
            data={data.hourlyDemand.map(h => ({
              label: `${h.hour}:00`,
              value: h.trips,
              percentage: 0,
            }))}
            title=""
            height={450}
            color="#eab308"
            xAxisLabel="Hour of Day"
            yAxisLabel="Number of Trips"
          />
        </div>

        {/* Trip Distance Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Trip Distance Distribution</h3>
            <p className="text-sm text-gray-400 mt-1">
              Trips categorized by distance traveled
            </p>
          </div>
          <PieChart
            data={[
              {
                label: 'Short Trips (< 1 mi)',
                value: data.taxiStats.shortTrips,
                percentage: (data.taxiStats.shortTrips / data.taxiStats.totalTrips) * 100,
              },
              {
                label: 'Medium Trips (1-5 mi)',
                value: data.taxiStats.mediumTrips,
                percentage: (data.taxiStats.mediumTrips / data.taxiStats.totalTrips) * 100,
              },
              {
                label: 'Long Trips (> 5 mi)',
                value: data.taxiStats.longTrips,
                percentage: (data.taxiStats.longTrips / data.taxiStats.totalTrips) * 100,
              },
            ]}
            title=""
            size={450}
          />
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
            <p className="text-sm text-gray-400 mt-1">
              How passengers pay for taxi rides
            </p>
          </div>
          <PieChart
            data={data.paymentMethods.slice(0, 5).map(pm => ({
              label: pm.method,
              value: pm.count,
              percentage: pm.percentage,
            }))}
            title=""
            size={450}
          />
        </div>

        {/* Top Pickup Locations */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Top 10 Pickup Locations</h3>
            <p className="text-sm text-gray-400 mt-1">
              Most popular taxi pickup neighborhoods
            </p>
          </div>
          <BarChart
            data={data.taxiStats.topPickupZones.map(zone => ({
              label: zone.zoneName.length > 18 ? zone.zoneName.substring(0, 18) + '...' : zone.zoneName,
              value: zone.trips,
              percentage: (zone.trips / data.taxiStats.totalTrips) * 100,
            }))}
            title=""
            height={450}
            color="#10b981"
            xAxisLabel="Location"
            yAxisLabel="Number of Pickups"
          />
        </div>

        {/* Top Dropoff Locations */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Top 10 Dropoff Locations</h3>
            <p className="text-sm text-gray-400 mt-1">
              Most popular taxi dropoff neighborhoods
            </p>
          </div>
          <BarChart
            data={data.taxiStats.topDropoffZones.map(zone => ({
              label: zone.zoneName.length > 18 ? zone.zoneName.substring(0, 18) + '...' : zone.zoneName,
              value: zone.trips,
              percentage: (zone.trips / data.taxiStats.totalTrips) * 100,
            }))}
            title=""
            height={450}
            color="#3b82f6"
            xAxisLabel="Location"
            yAxisLabel="Number of Dropoffs"
          />
        </div>

        {/* FHV Vehicle Type Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">FHV Fleet by Base Type</h3>
            <p className="text-sm text-gray-400 mt-1">
              Distribution of for-hire vehicles by service type
            </p>
          </div>
          <PieChart
            data={Object.entries(data.fhvStats.vehiclesByType)
              .filter(([type]) => type !== 'Unknown')
              .map(([type, count]) => ({
                label: type,
                value: count,
                percentage: (count / data.fhvStats.totalVehicles) * 100,
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)}
            title=""
            size={450}
          />
        </div>

        {/* Top FHV Bases */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Top 10 FHV Base Companies</h3>
            <p className="text-sm text-gray-400 mt-1">
              Largest for-hire vehicle base operators in NYC
            </p>
          </div>
          <BarChart
            data={data.fhvStats.topBases.map(base => ({
              label: base.name.substring(0, 20),
              value: base.vehicles,
              percentage: (base.vehicles / data.fhvStats.totalVehicles) * 100,
            }))}
            title=""
            height={450}
            color="#f59e0b"
            xAxisLabel="Base Company"
            yAxisLabel="Number of Vehicles"
          />
        </div>

        {/* FHV Fleet Age Distribution */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">FHV Fleet by Vehicle Year</h3>
            <p className="text-sm text-gray-400 mt-1">
              Age distribution of for-hire vehicles
            </p>
          </div>
          <BarChart
            data={Object.entries(data.fhvStats.vehiclesByYear)
              .map(([year, count]) => ({
                label: year,
                value: count,
                percentage: (count / data.fhvStats.totalVehicles) * 100,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
              .filter(d => parseInt(d.label) >= 2010)} // Show only 2010+
            title=""
            height={450}
            color="#06b6d4"
            xAxisLabel="Model Year"
            yAxisLabel="Number of Vehicles"
          />
        </div>

        {/* Average Fare by Hour */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 2xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Average Fare by Hour of Day</h3>
            <p className="text-sm text-gray-400 mt-1">
              How taxi fares vary throughout the day
            </p>
          </div>
          <BarChart
            data={data.hourlyDemand
              .filter(h => h.avgFare > 0)
              .map(h => ({
                label: `${h.hour}:00`,
                value: Math.round(h.avgFare * 100) / 100,
                percentage: 0,
              }))}
            title=""
            height={450}
            color="#22c55e"
            xAxisLabel="Hour of Day"
            yAxisLabel="Average Fare ($)"
          />
        </div>

      </div>
    </div>
  );
}

