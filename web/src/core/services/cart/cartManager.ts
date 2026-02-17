import type { CartCheckoutRequest, CartItem } from "@/web/src/core/models/cart";
import type { GuestUser } from "@/web/src/core/models/guest-user";
import {
  getCommandManager,
  type CommandManager,
  type CommandResult,
} from "../commandManager";
import { UpsertGuestUser } from "../commands/guest-user";
import { getErrorMessage } from "../../utils/error-parser";
import { checkoutCart } from "../commands/cart-checkout";
import { OrderTypes } from "@/web/src/core/const";

interface CartManager {
  checkoutCart: (
    items: Array<CartItem>,
    guest?: GuestUser,
    userId?: number,
  ) => Promise<CommandResult<string>>;
}

const saveGuestUser = async (
  commandManager: CommandManager,
  guest: GuestUser,
): Promise<CommandResult<number>> => {
  return await commandManager.mutate<number>(() => UpsertGuestUser(guest));
};

const saveCartCheckout = async (
  commandManager: CommandManager,
  items: Array<CartItem>,
  userId?: number,
  guestId?: number,
): Promise<CommandResult<number>> => {
  return await commandManager.mutate<number>(() =>
    checkoutCart(items, userId, guestId),
  );
};

function getCartManager(): CartManager {
  const commandManager = getCommandManager();
  return {
    checkoutCart: async (
      items: Array<CartItem>,
      guest?: GuestUser,
      userId?: number,
    ): Promise<CommandResult<string>> => {
      const result: CommandResult<string> = {};

      try {
        let guestId: number | undefined = undefined;
        if (guest) {
          const guestResult = await saveGuestUser(commandManager, guest);
          guestId = guestResult.data;
          result.error = guestResult.error;
          if (result.error !== undefined) return result;
        }

        const cartCheckoutResult = await saveCartCheckout(
          commandManager,
          items,
          userId,
          guestId,
        );
        result.error = cartCheckoutResult.error;
        if (result.error !== undefined) return result;

        result.data = `${OrderTypes.Web}-${cartCheckoutResult.data}`;
        // * Generate email for Customer with order items and customer details
        // * Generate email for Store with attached xml file containing order items and customer details
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        result.error = new Error(errorMessage);
        console.error(
          "❌ ~ cartManager ~ failed to checkout cart: ",
          errorMessage,
        );
      }

      return result;
    },
  };
}

export { getCartManager };
