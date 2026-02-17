import type { CacheInfo } from "@/web/src/core/models/cache";
import { getErrorMessage } from "../utils/error-parser";
import { CacheManager } from "./cache/cacheManager";

type QueryResult<T = any> = {
  data?: T;
  error?: Error;
};

interface QueryManager {
  fetch: <T = any>(
    queryFn: () => Promise<T>,
    cacheInfo?: CacheInfo,
  ) => Promise<QueryResult<T>>;
}

const checkCache = async <T = any>(
  cacheManager: CacheManager,
  cacheInfo: CacheInfo,
  queryFn: () => Promise<T>,
): Promise<QueryResult<T>> => {
  const result: QueryResult<T> = {};
  const cacheResult = await cacheManager.get(cacheInfo.key);

  result.error = cacheResult.error;
  result.data = cacheResult.value;

  if (cacheResult.set !== undefined) {
    try {
      result.data = await queryFn();
      cacheResult.set(result.data, cacheInfo.staleTimeMs);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      result.error = new Error(errorMessage);
      console.error("~ queryManager ~ %s", errorMessage);
    }
  }
  return result;
};

function getQueryManager(): QueryManager {
  const cacheManager = CacheManager.instance({});
  return {
    fetch: async <T = any>(
      queryFn: () => Promise<T>,
      cacheInfo?: CacheInfo,
    ) => {
      let result: QueryResult<T> = {};
      if (cacheInfo !== undefined) {
        result = await checkCache(cacheManager, cacheInfo, queryFn);
      }

      if (result.data === undefined) {
        try {
          result.data = await queryFn();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          result.error = new Error(errorMessage);
          console.error("~ queryManager ~ %s", errorMessage);
        }
      }
      return result;
    },
  };
}

export { type QueryResult, type QueryManager, getQueryManager };
