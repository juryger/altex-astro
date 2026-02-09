import type {
  CacheEntry,
  CacheEvictionStrategy,
} from "@/web/src/core/models/cache";

const getLeasRecentEvictionStrategy = (): CacheEvictionStrategy => {
  return {
    findKey: <T = any>(cache: Map<string, CacheEntry<T>>) => {
      if (cache.size === 0) return undefined;

      let resultKey: string | undefined;
      let minTimestamp = new Date().getTime();

      cache.entries().forEach(([key, value]) => {
        if (
          value.staleTimestamp !== undefined &&
          value.staleTimestamp < minTimestamp
        ) {
          minTimestamp = value.staleTimestamp;
          resultKey = key;
        }
      });

      return resultKey;
    },
  };
};

export { getLeasRecentEvictionStrategy };
