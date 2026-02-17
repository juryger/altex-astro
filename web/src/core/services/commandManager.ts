import { getErrorMessage } from "../utils/error-parser";

type CommandResult<T = any> = {
  data?: T;
  error?: Error;
};

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<CommandResult<T>>;
}
/*
const cartCheckout = () => { db.update(cartItems: Array<CartItem>)}
commandManager().mutate(cartCheckout);

*/
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

export { type CommandManager, type CommandResult, getCommandManager };
