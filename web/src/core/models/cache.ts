type CacheInfo = {
  key: string;
  staleTimeMs: number;
};

interface CacheEntry<T = any> {
  data?: T;
  isLoading: boolean;
  acquireTimestamp?: number;
  staleTimestamp?: number;
}

interface CacheEvictionStrategy {
  findKey: <T = any>(cache: Map<string, CacheEntry<T>>) => string | undefined;
}

export { type CacheInfo, type CacheEntry, type CacheEvictionStrategy };
