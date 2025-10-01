import { NextResponse } from 'next/server';
import {
  fetchCertifiedBusinesses,
  calculateBusinessStats,
  getBoroughBreakdown,
  getEthnicityBreakdown,
  getSectorBreakdown,
  getYearlyGrowth,
  calculateGrowthRate,
} from '@/lib/api/certifiedBusinesses';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'business-certified-overview';
    
    // Check cache first (avoids fetching 29MB every time)
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached business data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching fresh business data from NYC Open Data...');
    
    // Fetch all certified businesses
    const businesses = await fetchCertifiedBusinesses();

    if (!businesses || businesses.length === 0) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const stats = calculateBusinessStats(businesses);
    const boroughBreakdown = getBoroughBreakdown(businesses);
    const ethnicityBreakdown = getEthnicityBreakdown(businesses);
    const sectorBreakdown = getSectorBreakdown(businesses, 10);
    const yearlyGrowth = getYearlyGrowth(businesses);
    const growthRate = calculateGrowthRate(yearlyGrowth);

    const response = {
      stats: {
        ...stats,
        growthRate,
      },
      breakdowns: {
        boroughs: boroughBreakdown,
        ethnicity: ethnicityBreakdown,
        sectors: sectorBreakdown,
      },
      growth: yearlyGrowth,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the processed response (much smaller than raw 29MB data)
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached processed business data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data' },
      { status: 500 }
    );
  }
}

