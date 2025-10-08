import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { Category } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * Clear all cached data from database
 * Usage: GET /api/cache/clear?category=EDUCATION (or without category to clear all)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (category) {
      // Clear specific category
      const result = await prisma.categorySnapshot.delete({
        where: { category: category as Category }
      }).catch(() => null);
      
      return NextResponse.json({
        success: true,
        message: `Cache cleared for category: ${category}`,
        cleared: result ? 1 : 0,
      });
    } else {
      // Clear all categories
      const result = await prisma.categorySnapshot.deleteMany({});
      
      return NextResponse.json({
        success: true,
        message: 'All cache cleared successfully',
        clearedCount: result.count,
      });
    }
  } catch (err) {
    console.error('Cache clear error:', err);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

