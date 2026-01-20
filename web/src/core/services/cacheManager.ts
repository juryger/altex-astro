import type { CacheEntry } from "@/web/src/core/models/cache";

export interface CacheManager<T = any> {
  get: (key: string) => CacheEntry;
  set: (key: string, value: T, staleTimeMs: number) => void;
}

export function cacheManager<T = any>(): CacheManager<T> {
  return {
    get: (key) => {
      // TODO: check nanao-store for the entry by it key. If does not contains return immedeately, otherwise
      // check for expiration, loading and error states. Stale entry can be removed, in loading state must be retried again
      // and in error state return it.

      return <CacheEntry>{
        data: undefined,
        timestamp: 0,
        isLoading: false,
        error: undefined,
      };
    },
    set: (key, value, staleTimeMs) => {
      // TODO: before adding new entry to store, check there is space availabe. If available save imediately, otherwise
      // get first stale entry and replace it with new one. If there is still no free slots, evict the first one with minimal expire time.
    },
  };
}
