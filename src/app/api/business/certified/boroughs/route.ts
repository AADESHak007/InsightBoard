import { NextResponse } from 'next/server';
import {
  fetchCertifiedBusinesses,
  getBoroughBreakdown,
} from '@/lib/api/certifiedBusinesses';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'business-certified-boroughs';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const businesses = await fetchCertifiedBusinesses();

    if (!businesses || businesses.length === 0) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    const boroughBreakdown = getBoroughBreakdown(businesses);

    const response = {
      boroughs: boroughBreakdown,
      total: businesses.length,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400);

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch borough data' },
      { status: 500 }
    );
  }
}

