import { NextResponse } from 'next/server';
import {
  fetchRestaurantInspections,
  fetchLeadingCausesOfDeath,
  fetchSafetyEvents,
  calculateRestaurantStats,
  calculateMortalityStats,
  calculateSafetyEventsStats,
} from '@/lib/api/healthData';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'health-overview';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached health data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching health data from NYC Open Data...');
    
    // Fetch all datasets
    const [inspections, deathRecords, safetyEvents] = await Promise.all([
      fetchRestaurantInspections(10000),
      fetchLeadingCausesOfDeath(10000),
      fetchSafetyEvents(50000),
    ]);

    if ((!inspections || inspections.length === 0) && (!deathRecords || deathRecords.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const restaurantStats = calculateRestaurantStats(inspections);
    const mortalityStats = calculateMortalityStats(deathRecords);
    const safetyEventsStats = calculateSafetyEventsStats(safetyEvents);

    const response = {
      restaurantStats,
      mortalityStats,
      safetyEventsStats,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached health data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}

