import { NextResponse } from 'next/server';
import {
  fetchBusinessEstablishments,
  calculateJobsStats,
  calculateNewBusinessStats,
  getJobsBySector,
  getYearlyJobsTrend,
} from '@/lib/api/businessAcceleration';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'business-acceleration';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached business acceleration data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching business acceleration data from NYC Open Data...');
    
    // Fetch business establishments
    const businesses = await fetchBusinessEstablishments();

    if (!businesses || businesses.length === 0) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const jobsStats = calculateJobsStats(businesses);
    const newBusinessStats = calculateNewBusinessStats(businesses);
    const sectorJobs = getJobsBySector(businesses, 10);
    const yearlyJobsTrend = getYearlyJobsTrend(businesses);

    const response = {
      jobsStats,
      newBusinessStats,
      sectorJobs,
      yearlyJobsTrend,
      totalBusinesses: businesses.length,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached business acceleration data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business acceleration data' },
      { status: 500 }
    );
  }
}

