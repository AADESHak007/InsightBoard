import { NextResponse } from 'next/server';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

/**
 * Clear all cached data
 * Usage: GET /api/cache/clear
 */
export async function GET() {
  try {
    const statsBefore = memoryCache.stats();
    memoryCache.clear();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      clearedKeys: statsBefore.keys,
      clearedCount: statsBefore.size,
    });
  } catch (err) {
    console.error('Cache clear error:', err);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

