import { NextResponse } from 'next/server';
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
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'housing-overview';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached housing data');
      return NextResponse.json(cached);
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

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached housing data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch housing data' },
      { status: 500 }
    );
  }
}

