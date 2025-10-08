import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchDOBPermits,
  fetchHousingViolations,
  fetchHousingNewYork,
  calculatePermitStats,
  calculateViolationStats,
  calculateAffordableHousingStats,
  getYearlyPermitTrends,
  getPermitViolationCorrelation,
} from '@/lib/api/housingData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'HOUSING' }
    });
    
    if (cached) {
      console.log('✓ Returning cached housing data from database');
      return NextResponse.json(cached.cachedData);
    }

    console.log('⟳ Fetching housing data from NYC Open Data...');
    
    // Fetch all datasets
    const [permits, violations, housingNewYork] = await Promise.all([
      fetchDOBPermits(10000),
      fetchHousingViolations(10000),
      fetchHousingNewYork(50000),
    ]);

    if ((!permits || permits.length === 0) && (!violations || violations.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const permitStats = calculatePermitStats(permits);
    const violationStats = calculateViolationStats(violations);
    const affordableHousingStats = calculateAffordableHousingStats(housingNewYork);
    const yearlyTrends = getYearlyPermitTrends(permits);
    const correlation = getPermitViolationCorrelation(permits, violations);

    const response = {
      permitStats,
      violationStats,
      affordableHousingStats,
      yearlyTrends,
      correlation,
      lastUpdated: new Date().toISOString(),
    };

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'HOUSING' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'HOUSING',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached housing data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch housing data' },
      { status: 500 }
    );
  }
}

