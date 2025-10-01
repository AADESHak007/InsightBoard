import { sodaClient } from './sodaClient';
import { getZoneName, getZoneBorough } from '@/lib/data/taxiZones';

// For-Hire Vehicles (FHV) - Active
const FHV_ACTIVE_ENDPOINT = '8wbx-tsch.json';

// 2017 Yellow Taxi Trip Data
const YELLOW_TAXI_ENDPOINT = 'biws-g3hs.json';

export interface FHVRecord {
  active?: string;
  vehicle_license_number?: string;
  name?: string; // Base name
  license_type?: string;
  dmv_license_plate_number?: string;
  vehicle_vin_number?: string;
  wheelchair_accessible?: string;
  certification_date?: string;
  hack_up_date?: string;
  vehicle_year?: string;
  base_number?: string;
  base_name?: string;
  base_type?: string;
  veh?: string;
  base_telephone_number?: string;
  website?: string;
  base_address?: string;
  reason?: string;
  order_date?: string;
  last_date_updated?: string;
  last_time_updated?: string;
  [key: string]: string | undefined;
}

export interface TaxiTripRecord {
  vendorid?: string;
  tpep_pickup_datetime?: string;
  tpep_dropoff_datetime?: string;
  passenger_count?: string;
  trip_distance?: string;
  ratecodeid?: string;
  store_and_fwd_flag?: string;
  pulocationid?: string;
  dolocationid?: string;
  payment_type?: string;
  fare_amount?: string;
  extra?: string;
  mta_tax?: string;
  tip_amount?: string;
  tolls_amount?: string;
  improvement_surcharge?: string;
  total_amount?: string;
  [key: string]: string | undefined;
}

export interface FHVStats {
  totalVehicles: number;
  activeVehicles: number;
  wheelchairAccessible: number;
  vehiclesByType: Record<string, number>;
  vehiclesByYear: Record<string, number>;
  topBases: Array<{ name: string; vehicles: number }>;
}

export interface TaxiStats {
  totalTrips: number;
  totalRevenue: number;
  avgFare: number;
  avgTripDistance: number;
  avgPassengers: number;
  totalTips: number;
  avgTipAmount: number;
  cashPayments: number;
  cardPayments: number;
  tripsByHour: Record<string, number>;
  topPickupZones: Array<{ zone: string; zoneName: string; trips: number }>;
  topDropoffZones: Array<{ zone: string; zoneName: string; trips: number }>;
  tripsByBorough: Record<string, number>;
  shortTrips: number; // < 1 mile
  mediumTrips: number; // 1-5 miles
  longTrips: number; // > 5 miles
}

/**
 * Fetch FHV active vehicles
 */
export async function fetchFHVActive(limit: number = 10000): Promise<FHVRecord[]> {
  try {
    const data = await sodaClient.fetch<FHVRecord>({
      endpoint: FHV_ACTIVE_ENDPOINT,
      limit,
    });
    return data;
  } catch (error) {
    console.error('Error fetching FHV data:', error);
    return [];
  }
}

/**
 * Fetch yellow taxi trips
 */
export async function fetchYellowTaxiTrips(limit: number = 50000): Promise<TaxiTripRecord[]> {
  try {
    const data = await sodaClient.fetch<TaxiTripRecord>({
      endpoint: YELLOW_TAXI_ENDPOINT,
      limit,
    });
    return data;
  } catch (error) {
    console.error('Error fetching taxi trip data:', error);
    return [];
  }
}

/**
 * Calculate FHV statistics
 */
export function calculateFHVStats(vehicles: FHVRecord[]): FHVStats {
  let activeVehicles = 0;
  let wheelchairAccessible = 0;
  const vehiclesByType: Record<string, number> = {};
  const vehiclesByYear: Record<string, number> = {};
  const baseVehicleCounts: Record<string, number> = {};

  vehicles.forEach(vehicle => {
    // Active vehicles
    if ((vehicle.active || '').toUpperCase() === 'YES') {
      activeVehicles++;
    }

    // Wheelchair accessible
    if ((vehicle.wheelchair_accessible || '').toUpperCase() === 'YES') {
      wheelchairAccessible++;
    }

    // By type
    const baseType = vehicle.base_type || 'Unknown';
    vehiclesByType[baseType] = (vehiclesByType[baseType] || 0) + 1;

    // By year
    const year = vehicle.vehicle_year || 'Unknown';
    if (year !== 'Unknown' && year.match(/^\d{4}$/)) {
      vehiclesByYear[year] = (vehiclesByYear[year] || 0) + 1;
    }

    // Count by base
    const baseName = vehicle.base_name || vehicle.name || 'Unknown';
    if (baseName !== 'Unknown') {
      baseVehicleCounts[baseName] = (baseVehicleCounts[baseName] || 0) + 1;
    }
  });

  const topBases = Object.entries(baseVehicleCounts)
    .map(([name, vehicles]) => ({ name, vehicles }))
    .sort((a, b) => b.vehicles - a.vehicles)
    .slice(0, 10);

  return {
    totalVehicles: vehicles.length,
    activeVehicles,
    wheelchairAccessible,
    vehiclesByType,
    vehiclesByYear,
    topBases,
  };
}

/**
 * Calculate taxi trip statistics
 */
export function calculateTaxiStats(trips: TaxiTripRecord[]): TaxiStats {
  let totalRevenue = 0;
  let totalFare = 0;
  let totalDistance = 0;
  let totalPassengers = 0;
  let totalTips = 0;
  let cashPayments = 0;
  let cardPayments = 0;
  let shortTrips = 0;
  let mediumTrips = 0;
  let longTrips = 0;
  let validTripsCount = 0;

  const tripsByHour: Record<string, number> = {};
  const pickupZoneCounts: Record<string, number> = {};
  const dropoffZoneCounts: Record<string, number> = {};
  const tripsByBorough: Record<string, number> = {};

  trips.forEach(trip => {
    const fare = parseFloat(trip.total_amount || '0');
    const distance = parseFloat(trip.trip_distance || '0');
    const passengers = parseInt(trip.passenger_count || '0', 10);
    const tip = parseFloat(trip.tip_amount || '0');
    const paymentType = trip.payment_type || '0';

    if (fare > 0 && distance > 0) {
      validTripsCount++;
      totalRevenue += fare;
      totalFare += parseFloat(trip.fare_amount || '0');
      totalDistance += distance;
      totalPassengers += passengers;
      totalTips += tip;

      // Payment type: 1 = Credit, 2 = Cash
      if (paymentType === '1') cardPayments++;
      else if (paymentType === '2') cashPayments++;

      // Trip distance categories
      if (distance < 1) shortTrips++;
      else if (distance <= 5) mediumTrips++;
      else longTrips++;

      // Pickup hour
      if (trip.tpep_pickup_datetime) {
        const hour = new Date(trip.tpep_pickup_datetime).getHours();
        const hourKey = `${hour}:00`;
        tripsByHour[hourKey] = (tripsByHour[hourKey] || 0) + 1;
      }

      // Zones and boroughs
      const pickupZone = trip.pulocationid || 'Unknown';
      const dropoffZone = trip.dolocationid || 'Unknown';
      pickupZoneCounts[pickupZone] = (pickupZoneCounts[pickupZone] || 0) + 1;
      dropoffZoneCounts[dropoffZone] = (dropoffZoneCounts[dropoffZone] || 0) + 1;

      // Count trips by pickup borough
      const borough = getZoneBorough(pickupZone);
      if (borough !== 'Unknown') {
        tripsByBorough[borough] = (tripsByBorough[borough] || 0) + 1;
      }
    }
  });

  const topPickupZones = Object.entries(pickupZoneCounts)
    .map(([zone, trips]) => ({ 
      zone, 
      zoneName: getZoneName(zone),
      trips 
    }))
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 10);

  const topDropoffZones = Object.entries(dropoffZoneCounts)
    .map(([zone, trips]) => ({ 
      zone, 
      zoneName: getZoneName(zone),
      trips 
    }))
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 10);

  return {
    totalTrips: validTripsCount,
    totalRevenue,
    avgFare: validTripsCount > 0 ? totalFare / validTripsCount : 0,
    avgTripDistance: validTripsCount > 0 ? totalDistance / validTripsCount : 0,
    avgPassengers: validTripsCount > 0 ? totalPassengers / validTripsCount : 0,
    totalTips,
    avgTipAmount: validTripsCount > 0 ? totalTips / validTripsCount : 0,
    cashPayments,
    cardPayments,
    tripsByHour,
    topPickupZones,
    topDropoffZones,
    tripsByBorough,
    shortTrips,
    mediumTrips,
    longTrips,
  };
}

/**
 * Get hourly demand pattern
 */
export function getHourlyDemandPattern(trips: TaxiTripRecord[]): Array<{
  hour: number;
  trips: number;
  avgFare: number;
}> {
  const hourlyData: Record<number, { trips: number; totalFare: number }> = {};

  // Initialize all 24 hours
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { trips: 0, totalFare: 0 };
  }

  trips.forEach(trip => {
    if (trip.tpep_pickup_datetime) {
      const hour = new Date(trip.tpep_pickup_datetime).getHours();
      const fare = parseFloat(trip.fare_amount || '0');
      
      if (fare > 0) {
        hourlyData[hour].trips++;
        hourlyData[hour].totalFare += fare;
      }
    }
  });

  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour, 10),
    trips: data.trips,
    avgFare: data.trips > 0 ? data.totalFare / data.trips : 0,
  }));
}

/**
 * Get payment method breakdown
 */
export function getPaymentMethodBreakdown(trips: TaxiTripRecord[]): Array<{
  method: string;
  count: number;
  percentage: number;
}> {
  const paymentCounts: Record<string, number> = {
    'Credit Card': 0,
    'Cash': 0,
    'No Charge': 0,
    'Dispute': 0,
    'Unknown': 0,
    'Voided': 0,
  };

  trips.forEach(trip => {
    const paymentType = trip.payment_type || '0';
    
    switch (paymentType) {
      case '1':
        paymentCounts['Credit Card']++;
        break;
      case '2':
        paymentCounts['Cash']++;
        break;
      case '3':
        paymentCounts['No Charge']++;
        break;
      case '4':
        paymentCounts['Dispute']++;
        break;
      case '5':
        paymentCounts['Unknown']++;
        break;
      case '6':
        paymentCounts['Voided']++;
        break;
      default:
        paymentCounts['Unknown']++;
    }
  });

  const total = trips.length;
  return Object.entries(paymentCounts)
    .filter(([, count]) => count > 0)
    .map(([method, count]) => ({
      method,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

