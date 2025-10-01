'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicSafetyDataResponse } from '@/types/publicSafety';
import { clientCache } from '@/lib/cache/clientCache';

const CACHE_KEY = 'public-safety-data';
const CACHE_TTL = 86400000; // 24 hours

export function usePublicSafetyData() {
  const [data, setData] = useState<PublicSafetyDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check client-side cache first
      if (!skipCache) {
        const cachedData = clientCache.get<PublicSafetyDataResponse>(CACHE_KEY);
        if (cachedData) {
          console.log('✓ Using cached public safety data (client-side)');
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      console.log('⟳ Fetching public safety data from API...');
      const response = await fetch('/api/safety/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch public safety data');
      }

      const result = await response.json();
      
      // Cache the data client-side
      clientCache.set(CACHE_KEY, result, CACHE_TTL);
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching public safety data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data, fetchData]);

  const refetch = useCallback(() => {
    console.log('Manual refetch requested - clearing cache');
    clientCache.clear(CACHE_KEY);
    setData(null);
  }, []);

  return { data, loading, error, refetch };
}

