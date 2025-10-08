import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchNYPDComplaints,
  fetchVehicleCollisions,
  calculateCrimeStats,
  calculateCollisionStats,
  getYearlyCrimeTrends,
} from '@/lib/api/publicSafetyData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'PUBLIC_SAFETY' }
    });
    
    if (cached) {
      console.log('✓ Returning cached public safety data from database');
      return NextResponse.json(cached.cachedData);
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

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'PUBLIC_SAFETY' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'PUBLIC_SAFETY',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached public safety data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public safety data' },
      { status: 500 }
    );
  }
}