type QueryResult<T = any> = {
  data?: T;
  isLoading: boolean;
  error?: Error;
};

export interface QueryManager<T = any> {
  exec: (
    key: string,
    queryFn: () => Promise<T>,
    staleTimeMs?: number,
  ) => QueryResult<T>;
}

export function queryManager<T = any>(): QueryManager<T> {
  return {
    exec: (key: string, queryFn: () => Promise<T>, staleTimeMs?: number) => {
      const result = {
        data: undefined,
        isLoading: false,
        error: undefined,
      };

      // TODO: Before executing queryFn, we need to check if there is a valid cache value.
      //  If there is no cache value or it's invalid, execute queryFn and save result in cache,
      //  otherwise retun cache value.
      // var queryResult = await fetchFn();

      return result;
    },
  };
}
