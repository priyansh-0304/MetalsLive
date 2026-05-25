/**
 * useMetal.js
 *
 * Custom hook that independently manages loading / data / error state
 * for a single metal tile. Each tile gets its own loader, matching the
 * requirement that "each of the displayed prices must be fetched using
 * a different loader."
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchMetalPrice } from '../services/MetalsService';

export function useMetal(metal) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMetalPrice(metal);
      setData(result);
    } catch (e) {
      setError(e.message ?? 'Could not load price.');
    } finally {
      setLoading(false);
    }
  }, [metal.id]);

  useEffect(() => {
    fetch();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetch, 60_000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { data, loading, error, refresh: fetch };
}
