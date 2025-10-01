import { NextResponse } from 'next/server';
import {
  fetchSchoolDemographics,
  calculateEducationStats,
  getDemographicBreakdown,
  getYearlyTrends,
} from '@/lib/api/educationDemographics';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'education-demographics';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached education demographics data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching education demographics from NYC Open Data...');
    
    // Fetch school demographics
    const demographics = await fetchSchoolDemographics();

    if (!demographics || demographics.length === 0) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const stats = calculateEducationStats(demographics);
    const demographicBreakdown = getDemographicBreakdown(demographics);
    const yearlyTrends = getYearlyTrends(demographics);

    const response = {
      stats,
      demographicBreakdown,
      yearlyTrends,
      totalRecords: demographics.length,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached education demographics data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education demographics' },
      { status: 500 }
    );
  }
}

