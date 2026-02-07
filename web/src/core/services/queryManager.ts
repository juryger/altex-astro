import type { CacheInfo } from "@/web/src/core/models/cache";

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

function queryManager(): QueryManager {
  return {
    fetch: async <T = any>(
      queryFn: () => Promise<T>,
      cacheInfo?: CacheInfo,
    ) => {
      // TODO: Before executing queryFn, we need to check if there is a valid cache value (via cacheManager).
      //  If there is no cache value or it's invalid, execute queryFn and save result in cache, otherwise retun cache value.
      // cache.isLoading = true;

      const result: QueryResult<T> = {};
      try {
        result.data = await queryFn();
      } catch (err) {
        if (err instanceof Error) {
          result.error = err;
        } else {
          result.error = new Error(String(err));
        }
      } finally {
        // cache.isLoading = false;
      }

      return result;
    },
  };
}

export { type QueryResult, type QueryManager, queryManager };
