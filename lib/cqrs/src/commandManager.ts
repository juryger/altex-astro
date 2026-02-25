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
        console.error(
          "~ commandManager ~ Failed to execute command against database, see deatils below.",
          errorMessage,
        );
        result.status = "Failed";
        result.error = new Error(errorMessage);
      }
      return result;
    },
  };
}

export type { CommandManager };
export { getCommandManager };
