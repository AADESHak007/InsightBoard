import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchRestaurantInspections,
  fetchLeadingCausesOfDeath,
  fetchSafetyEvents,
  calculateRestaurantStats,
  calculateMortalityStats,
  calculateSafetyEventsStats,
  getBoroughBreakdown,
} from '@/lib/api/healthData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'HEALTH' }
    });
    
    if (cached) {
      console.log('✓ Returning cached health data from database');
      return NextResponse.json(cached.cachedData);
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
    const boroughBreakdown = getBoroughBreakdown(inspections, safetyEvents);

    const response = {
      restaurantStats,
      mortalityStats,
      safetyEventsStats,
      boroughBreakdown,
      lastUpdated: new Date().toISOString(),
    };

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'HEALTH' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'HEALTH',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached health data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}