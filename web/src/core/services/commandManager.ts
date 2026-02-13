import type { CacheInfo } from "@/web/src/core/models/cache";
import { getErrorMessage } from "../utils/error-parser";

type CommandResult<T = any> = {
  data?: T;
  error?: Error;
};

export interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<void>) => Promise<CommandResult>;
}

export function commandManager(): CommandManager {
  return {
    mutate: async <T = any>(commandFn: () => Promise<T>) => {
      const result: CommandResult<T> = {};
      try {
        result.data = await commandFn();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        result.error = new Error(errorMessage);
        console.error("~ commandManager ~ %s", errorMessage);
      }
      return result;
    },
  };
}
