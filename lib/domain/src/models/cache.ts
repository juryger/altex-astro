import { CACHE_STALE_TIMEOUT_1HR } from "../const/cache";

type CacheInfo = {
  key: string;
  staleTimeMs: number;
};

const getCacheInfo = (
  key: string,
  staleTimeMs: number = CACHE_STALE_TIMEOUT_1HR,
): CacheInfo => {
  return { key, staleTimeMs };
};

interface CacheEntry<T = any> {
  data?: T | undefined;
  isLoading: boolean;
  acquireTimestamp?: number | undefined;
  staleTimestamp?: number | undefined;
}

interface CacheEvictionStrategy {
  findKey: <T = any>(cache: Map<string, CacheEntry<T>>) => string | undefined;
}

export {
  type CacheInfo,
  type CacheEntry,
  type CacheEvictionStrategy,
  getCacheInfo,
};
