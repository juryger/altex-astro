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
import { getEmailManager, type EmailManager } from "@/lib/email/src";

interface CartManager {
  checkoutCart: (
    items: Array<CartItem>,
    guest?: GuestUser,
    userId?: string,
  ) => Promise<CommandResult<string>>;
}

const saveGuestUser = async (
  commandManager: CommandManager,
  guest: GuestUser,
): Promise<CommandResult<string>> => {
  return await commandManager.mutate<string>(() => UpsertGuestUser(guest));
};

const saveCartCheckout = async (
  commandManager: CommandManager,
  items: Array<CartItem>,
  userId?: string,
  guestId?: string,
): Promise<CommandResult<number>> => {
  return await commandManager.mutate<number>(() =>
    checkoutCart(items, userId, guestId),
  );
};

const sendNewOrderEmail = async (
  emailManager: EmailManager,
  checkoutId: number | undefined,
): Promise<void> => {
  if (checkoutId === undefined) return;
  throw new Error("sendNewOrderEmail not implemented.");
  //await emailManager.sendNewOrder();
};

const sendFailureEmail = async (
  emailManager: EmailManager,
  message: string,
): Promise<void> => {
  throw new Error("sendFailureEmail not implemented.");
  //await emailManager.sendFailure();
};

function getCartManager(): CartManager {
  const commandManager = getCommandManager();
  const emailManager = getEmailManager({
    rootPath: import.meta.env.EMAIL_TEMPLATES_PATH,
  });
  return {
    checkoutCart: async (
      items: Array<CartItem>,
      guest?: GuestUser,
      userId?: string,
    ): Promise<CommandResult<string>> => {
      const result: CommandResult<string> = {};

      try {
        let guestId: string | undefined = undefined;
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

        await sendNewOrderEmail(emailManager, cartCheckoutResult.data);

        result.data = `${OrderTypes.Web}-${cartCheckoutResult.data}`;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        result.error = new Error(errorMessage);

        await sendFailureEmail(
          emailManager,
          `Failed to create new order, see details below. ${errorMessage}`,
        );

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
