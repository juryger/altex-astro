import crypto from "crypto";
import type { CartItem, GuestUser, Result } from "@/lib/domain";
import { FailedResult, getErrorMessage, OkResult } from "@/lib/domain";
import { OrderTypes } from "@/web/src/core/const";
import { CacheKeys, getCacheInfo } from "@/lib/domain";
import type { CommandManager } from "@/lib/cqrs";
import {
  getQueryManager,
  fetchDiscounts,
  checkoutCartTx,
  upsertGuestUserTx,
  getCommandManager,
} from "@/lib/cqrs";
import { encode } from "html-entities";
import { getEmailComposer } from "./email-composer";
import { EmailBody } from "@/lib/email";
import {
  DatabaseType,
  type DatabaseSchema,
  type DatabaseTransaction,
} from "@/lib/dal";

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

const saveCartCheckout = async (
  commandManager: CommandManager,
  items: Array<CartItem>,
  userUid?: string,
  guest?: GuestUser,
): Promise<Result<number>> => {
  const discounts = await getQueryManager().fetch(
    () => fetchDiscounts(),
    getCacheInfo(CacheKeys.Discounts),
  );
  if (discounts.error !== undefined) {
    return FailedResult(discounts.error);
  }
  const commands: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  if (guest !== undefined) {
    commands.push((tx) => upsertGuestUserTx(tx, encodeUserInput(guest)));
  }
  commands.push((tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) =>
    checkoutCartTx(tx, items, discounts.data ?? [], userUid, prevResult),
  );
  const result = commandManager.mutateTransactional(
    DatabaseType.Operatons,
    commands,
  );
  return result;
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
      try {
        if (guest) guest.uid = crypto.randomUUID();
        const cartCheckout = await saveCartCheckout(
          commandManager,
          items,
          userUid,
          guest,
        );
        if (!cartCheckout.ok || cartCheckout.data === undefined) {
          return FailedResult(
            cartCheckout.error ?? new Error("Failed to complete cart checkout"),
          );
        }
        const orderId = `${OrderTypes.Web}-${cartCheckout.data}`;
        const emailResult = await emailComposer.sendNewOrderEmail(
          cartCheckout.data,
        );
        if (!emailResult.ok) {
          const errorMessage = `Failed to send new order email, see error details below. ${emailResult.error}`;
          console.error(errorMessage);
          return FailedResult<string>(new Error(errorMessage), orderId);
        }
        return OkResult(orderId);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        console.error(errorMessage);
        await emailComposer.sendGeneralEmail(
          `${EmailBody.CartCheckouFailure} ${errorMessage}`,
          true,
        );
        return FailedResult<string>(new Error(errorMessage));
      }
    },
  };
}

export { getCartCheckoutManager };
