'use client';

import { useState, useEffect, useCallback } from 'react';
import { BusinessOverviewResponse } from '@/types/business';
import { clientCache } from '@/lib/cache/clientCache';

const CACHE_KEY = 'business-data';
const CACHE_TTL = 86400000; // 24 hours in milliseconds

export function useBusinessData() {
  const [data, setData] = useState<BusinessOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check client-side cache first (unless explicitly skipping)
      if (!skipCache) {
        const cachedData = clientCache.get<BusinessOverviewResponse>(CACHE_KEY);
        if (cachedData) {
          console.log('✓ Using cached business data (client-side)');
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      console.log('⟳ Fetching business data from API...');
      const response = await fetch('/api/business/certified/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }

      const result = await response.json();
      
      // Cache the data client-side for 24 hours
      clientCache.set(CACHE_KEY, result, CACHE_TTL);
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching business data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have data
    if (!data) {
      fetchData();
    }
  }, [data, fetchData]);

  // Refetch function to manually reload data (clears cache)
  const refetch = useCallback(() => {
    console.log('Manual refetch requested - clearing cache');
    clientCache.clear(CACHE_KEY);
    setData(null); // Reset data to trigger useEffect
  }, []);

  return { data, loading, error, refetch };
}
