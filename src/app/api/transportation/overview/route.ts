import { NextResponse } from 'next/server';
import {
  fetchFHVActive,
  fetchYellowTaxiTrips,
  calculateFHVStats,
  calculateTaxiStats,
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
    
    // Fetch both datasets (limit taxi trips to 50k for performance)
    const [fhvVehicles, taxiTrips] = await Promise.all([
      fetchFHVActive(10000),
      fetchYellowTaxiTrips(50000),
    ]);

    if ((!fhvVehicles || fhvVehicles.length === 0) && (!taxiTrips || taxiTrips.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    console.log(`✓ Fetched ${fhvVehicles.length} FHV vehicles and ${taxiTrips.length} taxi trips`);

    // Calculate statistics
    const fhvStats = calculateFHVStats(fhvVehicles);
    const taxiStats = calculateTaxiStats(taxiTrips);
    const hourlyDemand = getHourlyDemandPattern(taxiTrips);
    const paymentMethods = getPaymentMethodBreakdown(taxiTrips);

    const response = {
      fhvStats,
      taxiStats,
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

