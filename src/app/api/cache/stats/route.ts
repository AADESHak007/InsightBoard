import { NextResponse } from 'next/server';
import { memoryCache } from '@/lib/cache/memoryCache';

export const dynamic = 'force-dynamic';

/**
 * Get cache statistics
 * Usage: GET /api/cache/stats
 */
export async function GET() {
  try {
    const stats = memoryCache.stats();
    
    return NextResponse.json({
      cacheSize: stats.size,
      cachedKeys: stats.keys,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cache stats error:', err);
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}

