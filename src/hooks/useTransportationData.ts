import { useState, useEffect, useCallback } from 'react';
import { TransportationDataResponse } from '@/types/transportation';
import { clientCache } from '@/lib/cache/clientCache';

export function useTransportationData() {
  const [data, setData] = useState<TransportationDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check client cache first
      if (!skipCache) {
        const cached = clientCache.get<TransportationDataResponse>('transportation-data');
        if (cached) {
          console.log('Using cached transportation data');
          setData(cached);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/transportation/overview');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the data for 24 hours
      clientCache.set('transportation-data', result, 24 * 60 * 60 * 1000);
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching transportation data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // Clear both caches
    clientCache.clear('transportation-data');
    
    // Clear server cache
    try {
      await fetch('/api/cache/clear', { method: 'POST' });
    } catch (err) {
      console.error('Error clearing server cache:', err);
    }
    
    // Fetch fresh data
    await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

