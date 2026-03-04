import type { CacheEntry, CacheEvictionStrategy } from "@/lib/domain";

const getLeasRecentEvictionStrategy = (): CacheEvictionStrategy => {
  return {
    findKey: <T = any>(cache: Map<string, CacheEntry<T>>) => {
      if (cache.size === 0) return undefined;

      const values = cache.entries().toArray();
      let resultKey = values.at(0)?.[0];
      let minTimestamp =
        values.at(0)?.[1].staleTimestamp ??
        values.at(0)?.[1].acquireTimestamp ??
        0;

      values.forEach(([key, value]) => {
        const currTimeStamp =
          value.staleTimestamp ?? value.acquireTimestamp ?? 0;
        if (currTimeStamp < minTimestamp) {
          minTimestamp = currTimeStamp;
          resultKey = key;
        }
      });
      return resultKey;
    },
  };
};

export { getLeasRecentEvictionStrategy };
