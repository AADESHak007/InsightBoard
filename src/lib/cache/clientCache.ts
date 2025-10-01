// Client-side cache for business data
interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ClientCache {
  private cache: Map<string, CachedData<unknown>>;

  constructor() {
    this.cache = new Map();
  }

  set<T>(key: string, data: T, ttl: number = 86400000): void {
    // ttl in milliseconds (default 24 hours)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Singleton instance
export const clientCache = new ClientCache();

