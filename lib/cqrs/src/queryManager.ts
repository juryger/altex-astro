import { getErrorMessage, type CacheInfo, type Result } from "@/lib/domain";
import { CacheManager } from "./cacheManager";

interface QueryManager {
  fetch: <T = any>(
    queryFn: () => Promise<T>,
    cacheInfo?: CacheInfo,
  ) => Promise<Result<T>>;
}

const checkCache = async <T = any>(
  cacheManager: CacheManager,
  cacheInfo: CacheInfo,
  queryFn: () => Promise<T>,
): Promise<Result<T>> => {
  const cacheResult = await cacheManager.get(cacheInfo.key);
  const result: Result<T> = {
    status: cacheResult.error === undefined ? "Ok" : "Failed",
    data: cacheResult.value,
    error: cacheResult.error,
  };

  if (cacheResult.set !== undefined) {
    try {
      result.data = await queryFn();
      cacheResult.set(result.data, cacheInfo.staleTimeMs);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      result.error = new Error(errorMessage);
      result.status = "Failed";
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
      let result: Result<T> = { status: "Ok" };
      if (cacheInfo !== undefined) {
        result = await checkCache(cacheManager, cacheInfo, queryFn);
        if (result.status !== "Ok") return result;
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

export type { QueryManager };
export { getQueryManager };
