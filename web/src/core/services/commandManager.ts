import type { CacheInfo } from "@/web/src/core/models/cache";

export interface CommandManager<T = any> {
  mutate: (commandFn: () => Promise<T>, cacheInfo?: CacheInfo) => void;
}

export function commandManager<T = any>(): CommandManager<T> {
  return {
    mutate: (mutateFn: () => Promise<T>, cacheInfo?: CacheInfo) => {
      const result = {
        data: undefined,
        error: undefined,
        isExecuting: false,
      };

      // TODO: After executing mutateFn we need to clear cache value in case related cacheInfo is provided.
      // var mutateResult = await mutateFn();

      return result;
    },
  };
}
