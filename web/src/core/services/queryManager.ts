import type { CacheInfo } from "@/web/src/core/models/cache";

type QueryResult<T = any> = {
  data?: T;
  isLoading: boolean;
  error?: Error;
};

interface QueryManager<T = any> {
  fetch: (
    queryFn: () => Promise<T>,
    cacheInfo?: CacheInfo,
  ) => Promise<QueryResult<T>>;
}

function queryManager<T = any>(): QueryManager<T> {
  return {
    fetch: async (queryFn: () => Promise<T>, cacheInfo?: CacheInfo) => {
      // TODO: Before executing queryFn, we need to check if there is a valid cache value (via cacheManager).
      //  If there is no cache value or it's invalid, execute queryFn and save result in cache, otherwise retun cache value.
      const result: QueryResult<T> = { isLoading: true };

      try {
        result.data = await queryFn();
      } catch (err) {
        if (err instanceof Error) {
          result.error = err;
        } else {
          result.error = new Error(String(err));
        }
      } finally {
        result.isLoading = false;
      }

      return result;
    },
  };
}

export { type QueryResult, type QueryManager, queryManager };
