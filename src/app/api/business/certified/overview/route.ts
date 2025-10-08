import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchCertifiedBusinesses,
  calculateBusinessStats,
  getBoroughBreakdown,
  getEthnicityBreakdown,
  getSectorBreakdown,
  getYearlyGrowth,
  calculateGrowthRate,
} from '@/lib/api/certifiedBusinesses';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'BUSINESS' }
    });
    
    if (cached) {
      console.log('✓ Returning cached business data from database');
      return NextResponse.json(cached.cachedData);
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

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'BUSINESS' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'BUSINESS',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached business data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data' },
      { status: 500 }
    );
  }
}