import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  fetchSchoolDemographics,
  calculateDemographicsStats,
  getRaceEthnicityBreakdown,
  getGenderBreakdown,
  getEconomicNeedBreakdown,
  getYearlyTrends,
  getEnrollmentTrends,
  getBoroughBreakdown,
} from '@/lib/api/educationDemographics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database cache first
    const cached = await prisma.categorySnapshot.findUnique({
      where: { category: 'EDUCATION' }
    });
    
    if (cached) {
      console.log('✓ Returning cached education data from database');
      return NextResponse.json(cached.cachedData);
    }

    console.log('⟳ Fetching education demographics from NYC Open Data...');
    
    // Fetch school demographics
    const schoolData = await fetchSchoolDemographics(50000);

    if (!schoolData || schoolData.length === 0) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const stats = calculateDemographicsStats(schoolData);
    const raceEthnicity = getRaceEthnicityBreakdown(schoolData);
    const gender = getGenderBreakdown(schoolData);
    const economicNeed = getEconomicNeedBreakdown(schoolData);
    const yearlyTrends = getYearlyTrends(schoolData); // Has enrollment, disabilities, ell, poverty
    const enrollmentTrends = getEnrollmentTrends(schoolData); // Has totalEnrollment, schoolsCount
    const boroughBreakdown = getBoroughBreakdown(schoolData);

    const response = {
      stats,
      breakdowns: {
        raceEthnicity,
        gender,
        economicNeed,
        boroughs: boroughBreakdown,
      },
      demographicBreakdown: raceEthnicity, // Legacy field name for component compatibility
      yearlyTrends, // Used by EducationInsights component
      enrollmentTrends, // Additional trend data
      lastUpdated: new Date().toISOString(),
    };

    // Store in database cache
    await prisma.categorySnapshot.upsert({
      where: { category: 'EDUCATION' },
      update: {
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      },
      create: {
        category: 'EDUCATION',
        cachedData: JSON.parse(JSON.stringify(response)),
        lastUpdated: new Date()
      }
    });
    console.log('✓ Cached education data in database');

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education data' },
      { status: 500 }
    );
  }
}