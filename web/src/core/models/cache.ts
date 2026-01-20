type CacheInfo = {
  key: string;
  staleTimeMs: number;
};

interface CacheEntry<T = any> {
  data: T | undefined;
  timestamp: number;
  isLoading: boolean;
  error: Error | undefined;
}

export { type CacheInfo, type CacheEntry };
