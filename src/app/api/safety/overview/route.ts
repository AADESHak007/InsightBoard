import { NextResponse } from 'next/server';
import {
  fetchNYPDComplaints,
  fetchVehicleCollisions,
  calculateCrimeStats,
  calculateCollisionStats,
  getYearlyCrimeTrends,
} from '@/lib/api/publicSafetyData';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'public-safety-overview';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached public safety data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching public safety data from NYC Open Data...');
    
    // Fetch both datasets
    const [complaints, collisions] = await Promise.all([
      fetchNYPDComplaints(10000),
      fetchVehicleCollisions(10000),
    ]);

    if ((!complaints || complaints.length === 0) && (!collisions || collisions.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const crimeStats = calculateCrimeStats(complaints);
    const collisionStats = calculateCollisionStats(collisions);
    const yearlyTrends = getYearlyCrimeTrends(complaints);

    const response = {
      crimeStats,
      collisionStats,
      yearlyTrends,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached public safety data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public safety data' },
      { status: 500 }
    );
  }
}

