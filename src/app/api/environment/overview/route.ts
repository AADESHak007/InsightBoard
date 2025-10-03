import { NextResponse } from 'next/server';
import {
  fetchAirQuality,
  fetchStreetTrees,
  fetchGHGEmissions,
  fetchDSNYTonnage,
  calculateAirQualityStats,
  calculateTreeStats,
  calculateGHGEmissionsStats,
  calculateRecyclingDiversionStats,
  getYearlyAirQualityTrends,
  getPM25YearlyTrend,
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
    
    // Fetch all datasets
    const [airQuality, trees, ghgEmissions, dsnyTonnage] = await Promise.all([
      fetchAirQuality(10000),
      fetchStreetTrees(10000),
      fetchGHGEmissions(10000),
      fetchDSNYTonnage(50000),
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
    const ghgEmissionsStats = calculateGHGEmissionsStats(ghgEmissions);
    const recyclingDiversionStats = calculateRecyclingDiversionStats(dsnyTonnage);
    const airQualityTrends = getYearlyAirQualityTrends(airQuality);
    const pm25YearlyTrend = getPM25YearlyTrend(airQuality);
    const treeDiameterDistribution = getTreeDiameterDistribution(trees);

    const response = {
      airQualityStats,
      treeStats,
      ghgEmissionsStats,
      recyclingDiversionStats,
      airQualityTrends,
      pm25YearlyTrend,
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

