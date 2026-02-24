import { getErrorMessage, type Result } from "@/lib/domain";

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<Result<T>>;
}

function getCommandManager(): CommandManager {
  return {
    mutate: async <T = any>(commandFn: () => Promise<T>) => {
      const result: Result<T> = { status: "Ok" };
      try {
        result.data = await commandFn();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        result.error = new Error(errorMessage);
        result.status = "Failed";
        console.error("~ commandManager ~ %s", errorMessage);
      }
      return result;
    },
  };
}

export type { CommandManager };
export { getCommandManager };
