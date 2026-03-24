import crypto from "crypto";
import type { CartItem, GuestUser, Result } from "@/lib/domain";
import { FailedResult, getErrorMessage, OkResult } from "@/lib/domain";
import { OrderTypes } from "@/web/src/core/const";
import { CacheKeys, getCacheInfo } from "@/lib/domain";
import type { CommandManager } from "@/lib/cqrs";
import {
  getQueryManager,
  fetchDiscounts,
  checkoutCart,
  upsertGuestUser,
  getCommandManager,
} from "@/lib/cqrs";
import { encode } from "html-entities";
import { getEmailComposer } from "./email-composer";

interface CartCheckoutManager {
  checkoutCart: (
    items: Array<CartItem>,
    guest?: GuestUser,
    userId?: string,
  ) => Promise<Result<string>>;
}

const encodeUserInput = (guest: GuestUser): GuestUser => {
  return {
    id: guest.id,
    fullName: encode(guest.fullName),
    email: encode(guest.email),
    phone: encode(guest.phone),
    companyName: encode(guest.companyName),
    address: encode(guest.address),
    city: encode(guest.city),
    postCode: encode(guest.postCode),
    taxNumber: encode(guest.taxNumber),
    createdAt: guest.createdAt,
    uid: guest.uid,
  } as GuestUser;
};

const saveGuestUser = async (
  commandManager: CommandManager,
  guest: GuestUser,
): Promise<Result<number>> => {
  return await commandManager.mutate<number>(() =>
    upsertGuestUser(encodeUserInput(guest)),
  );
};

const saveCartCheckout = async (
  commandManager: CommandManager,
  items: Array<CartItem>,
  userUid?: string,
  guestUid?: string,
): Promise<Result<number>> => {
  const discounts = await getQueryManager().fetch(
    () => fetchDiscounts(),
    getCacheInfo(CacheKeys.Discounts),
  );

  if (discounts.error !== undefined) {
    return FailedResult(discounts.error);
  }

  return await commandManager.mutate<number>(() =>
    checkoutCart(items, discounts.data ?? [], userUid, guestUid),
  );
};

function getCartCheckoutManager(): CartCheckoutManager {
  const commandManager = getCommandManager();
  const emailComposer = getEmailComposer();
  return {
    checkoutCart: async (
      items: Array<CartItem>,
      guest?: GuestUser,
      userUid?: string,
    ): Promise<Result<string>> => {
      let guestUid: string | undefined = undefined;
      try {
        if (guest) {
          guestUid = crypto.randomUUID();
          guest.uid = guestUid;
          const result = await saveGuestUser(commandManager, guest);
          if (!result.ok) {
            return FailedResult(
              result.error ??
                new Error("Failed to save guest user for checkout"),
            );
          }
        }

        const cartCheckout = await saveCartCheckout(
          commandManager,
          items,
          userUid,
          guestUid,
        );
        if (!cartCheckout.ok || cartCheckout.data === undefined) {
          return FailedResult(
            cartCheckout.error ?? new Error("Failed to complete cart checkout"),
          );
        }

        await emailComposer
          .sendNewOrderEmail(cartCheckout.data)
          .then((result) => {
            if (!result.ok) {
              const errorMessage = `Failed to send new order email, see error details below. ${result.error}`;
              console.error(errorMessage);
              return FailedResult(new Error(errorMessage));
            }
          });

        return OkResult(`${OrderTypes.Web}-${cartCheckout.data}`);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        console.error(errorMessage);
        await emailComposer.sendGeneralEmail(
          `Failed to checkout cart, see the error details below. ${errorMessage}`,
          true,
        );
        return FailedResult<string>(new Error(errorMessage));
      }
    },
  };
}

export { getCartCheckoutManager };
