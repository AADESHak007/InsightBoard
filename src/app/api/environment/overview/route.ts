import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
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
  getBoroughBreakdown,
} from '@/lib/api/environmentData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'ENVIRONMENT' }
    });
    
    if (cached) {
      console.log('✓ Returning cached environment data from database');
      return NextResponse.json(cached.cachedData);
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
    const boroughBreakdown = getBoroughBreakdown(trees, dsnyTonnage);

    const response = {
      airQualityStats,
      treeStats,
      ghgEmissionsStats,
      recyclingDiversionStats,
      airQualityTrends,
      pm25YearlyTrend,
      treeDiameterDistribution,
      boroughBreakdown,
      lastUpdated: new Date().toISOString(),
    };

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'ENVIRONMENT' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'ENVIRONMENT',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached environment data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment data' },
      { status: 500 }
    );
  }
}