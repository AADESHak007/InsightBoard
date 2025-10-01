'use client';

import { useState, useEffect, useCallback } from 'react';
import { BusinessAccelerationResponse } from '@/types/businessAcceleration';
import { clientCache } from '@/lib/cache/clientCache';

const CACHE_KEY = 'business-acceleration-data';
const CACHE_TTL = 86400000; // 24 hours

export function useBusinessAcceleration() {
  const [data, setData] = useState<BusinessAccelerationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check client-side cache first
      if (!skipCache) {
        const cachedData = clientCache.get<BusinessAccelerationResponse>(CACHE_KEY);
        if (cachedData) {
          console.log('✓ Using cached business acceleration data (client-side)');
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      console.log('⟳ Fetching business acceleration data from API...');
      const response = await fetch('/api/business/acceleration');
      
      if (!response.ok) {
        throw new Error('Failed to fetch business acceleration data');
      }

      const result = await response.json();
      
      // Cache the data client-side
      clientCache.set(CACHE_KEY, result, CACHE_TTL);
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching business acceleration data:', err);
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

