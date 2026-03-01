import {
  FailedResult,
  getErrorMessage,
  OkResult,
  type Result,
} from "@/lib/domain";

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<Result<T>>;
}

function getCommandManager(): CommandManager {
  return {
    mutate: async <T = any>(commandFn: () => Promise<T>) => {
      try {
        return OkResult(await commandFn());
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "~ commandManager ~ Failed to execute command against database, see deatils below.",
          errorMessage,
        );
        return FailedResult(new Error(errorMessage));
      }
    },
  };
}

export { type CommandManager, getCommandManager };
