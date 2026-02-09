import type { CacheInfo } from "@/web/src/core/models/cache";

type CommandResult<T = any> = {
  data?: T;
  error?: Error;
};

export interface CommandManager {
  mutate: <T = any>(
    commandFn: () => Promise<void>,
    cacheInfo?: CacheInfo,
  ) => Promise<CommandResult>;
}

export function commandManager(): CommandManager {
  return {
    mutate: async <T = any>(
      mutateFn: () => Promise<T>,
      cacheInfo?: CacheInfo,
    ) => {
      const result: CommandResult<T> = {};
      try {
        // TODO: After executing mutateFn we need to clear cache value in case related cacheInfo is provided.
        result.data = await mutateFn();
      } catch (err) {
        if (err instanceof Error) {
          result.error = err;
        } else {
          result.error = new Error(String(err));
        }
      }

      return result;
    },
  };
}
