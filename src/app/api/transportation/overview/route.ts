import { NextResponse } from 'next/server';
import {
  fetchFHVActive,
  fetchYellowTaxiTrips,
  fetchMTAPerformance2013_2021,
  fetchMTAPerformance2023_2024,
  fetchMTAPerformance2025,
  calculateFHVStats,
  calculateTaxiStats,
  calculateMTAPerformanceStats,
  getHourlyDemandPattern,
  getPaymentMethodBreakdown,
} from '@/lib/api/transportationData';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'transportation-overview';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached transportation data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching transportation data from NYC Open Data...');
    
    // Fetch all datasets (limit taxi trips to 50k for performance)
    const [fhvVehicles, taxiTrips, mtaPerformance2013_2021, mtaPerformance2023_2024, mtaPerformance2025] = await Promise.all([
      fetchFHVActive(10000),
      fetchYellowTaxiTrips(50000),
      fetchMTAPerformance2013_2021(20000),
      fetchMTAPerformance2023_2024(20000),
      fetchMTAPerformance2025(10000),
    ]);

    if ((!fhvVehicles || fhvVehicles.length === 0) && (!taxiTrips || taxiTrips.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    console.log(`✓ Fetched ${fhvVehicles.length} FHV vehicles, ${taxiTrips.length} taxi trips, and MTA performance data`);

    // Calculate statistics
    const fhvStats = calculateFHVStats(fhvVehicles);
    const taxiStats = calculateTaxiStats(taxiTrips);
    const subwayPerformanceStats = calculateMTAPerformanceStats(
      mtaPerformance2013_2021,
      mtaPerformance2023_2024,
      mtaPerformance2025
    );
    const hourlyDemand = getHourlyDemandPattern(taxiTrips);
    const paymentMethods = getPaymentMethodBreakdown(taxiTrips);

    const response = {
      fhvStats,
      taxiStats,
      subwayPerformanceStats,
      hourlyDemand,
      paymentMethods,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response for 24 hours
    memoryCache.set(cacheKey, response, 86400);
    console.log('✓ Cached transportation data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transportation data' },
      { status: 500 }
    );
  }
}

