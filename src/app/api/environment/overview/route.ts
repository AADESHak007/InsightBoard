import { NextResponse } from 'next/server';
import {
  fetchAirQuality,
  fetchStreetTrees,
  calculateAirQualityStats,
  calculateTreeStats,
  getYearlyAirQualityTrends,
  getTreeDiameterDistribution,
} from '@/lib/api/environmentData';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'environment-overview';
    
    // Check cache first
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.log('✓ Returning cached environment data');
      return NextResponse.json(cached);
    }

    console.log('⟳ Fetching environment data from NYC Open Data...');
    
    // Fetch both datasets
    const [airQuality, trees] = await Promise.all([
      fetchAirQuality(10000),
      fetchStreetTrees(10000),
    ]);

    if ((!airQuality || airQuality.length === 0) && (!trees || trees.length === 0)) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const airQualityStats = calculateAirQualityStats(airQuality);
    const treeStats = calculateTreeStats(trees);
    const airQualityTrends = getYearlyAirQualityTrends(airQuality);
    const treeDiameterDistribution = getTreeDiameterDistribution(trees);

    const response = {
      airQualityStats,
      treeStats,
      airQualityTrends,
      treeDiameterDistribution,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    memoryCache.set(cacheKey, response, 86400); // 24 hours
    console.log('✓ Cached environment data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment data' },
      { status: 500 }
    );
  }
}

