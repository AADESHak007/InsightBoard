'use client';

import { useState, useEffect, useCallback } from 'react';
import { EnvironmentDataResponse } from '@/types/environment';
import { clientCache } from '@/lib/cache/clientCache';

const CACHE_KEY = 'environment-data';
const CACHE_TTL = 86400000; // 24 hours

export function useEnvironmentData() {
  const [data, setData] = useState<EnvironmentDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check client-side cache first
      if (!skipCache) {
        const cachedData = clientCache.get<EnvironmentDataResponse>(CACHE_KEY);
        if (cachedData) {
          console.log('✓ Using cached environment data (client-side)');
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      console.log('⟳ Fetching environment data from API...');
      const response = await fetch('/api/environment/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch environment data');
      }

      const result = await response.json();
      
      // Cache the data client-side
      clientCache.set(CACHE_KEY, result, CACHE_TTL);
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching environment data:', err);
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

