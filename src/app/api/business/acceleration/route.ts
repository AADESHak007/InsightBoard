import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchBusinessEstablishments,
  calculateJobsStats,
  calculateNewBusinessStats,
  getJobsBySector,
  getYearlyJobsTrend,
} from '@/lib/api/businessAcceleration';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Note: Business acceleration is not a main category, but we can cache it
    // Let's check if there's cached data in the database
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'BUSINESS' }
    });
    
    // For acceleration data, we'll use memory-based approach or fetch fresh
    // since it's supplementary data to the main business category
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

    console.log('✓ Processed business acceleration data');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business acceleration data' },
      { status: 500 }
    );
  }
}