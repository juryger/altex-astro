import {
  FailedResult,
  getErrorMessage,
  OkResult,
  type CacheInfo,
  type Result,
} from "@/lib/domain";
import { CacheManager } from "./cache-manager";
import type { QueryManager } from "../core";

function getQueryManager(): QueryManager {
  const cacheManager = CacheManager.instance({});
  return {
    fetch: async <T = any>(
      queryFn: () => Promise<T>,
      cacheInfo?: CacheInfo,
    ) => {
      if (cacheInfo !== undefined) {
        const cache = await checkCache(cacheManager, cacheInfo, queryFn);
        return cache;
      }
      try {
        return OkResult(await queryFn());
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("❌ ~ query-manager ~ %s", errorMessage);
        return FailedResult(new Error(errorMessage));
      }
    },
  };
}

const checkCache = async <T = any>(
  cacheManager: CacheManager,
  cacheInfo: CacheInfo,
  queryFn: () => Promise<T>,
): Promise<Result<T>> => {
  const cache = await cacheManager.get(cacheInfo.key);
  if (cache.set !== undefined && cache.clearSetLock !== undefined) {
    try {
      const data = await queryFn();
      cache.set(data, cacheInfo.staleTimeMs);
      return OkResult(data);
    } catch (error) {
      cache.clearSetLock();
      const errorMessage = getErrorMessage(error);
      console.error("❌ ~ query-manager ~ %s", errorMessage);
      return FailedResult(new Error(errorMessage));
    }
  }
  return cache.error === undefined
    ? OkResult(cache.value)
    : FailedResult(cache.error);
};

export { getQueryManager };
