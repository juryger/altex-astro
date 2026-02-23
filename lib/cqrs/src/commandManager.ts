import { getErrorMessage } from "@/lib/domain";

type CommandResult<T = any> = {
  data?: T;
  error?: Error;
};

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<CommandResult<T>>;
}

function getCommandManager(): CommandManager {
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

export type { CommandManager, CommandResult };
export { getCommandManager };
