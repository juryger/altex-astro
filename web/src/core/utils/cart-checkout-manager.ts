import crypto from "crypto";
import type { CartItem, GuestUser, Result } from "@/lib/domain";
import {
  FailedResult,
  formatCurrency,
  getErrorMessage,
  OkResult,
} from "@/lib/domain";
import { OrderTypes } from "@/web/src/core/const";
import { getEmailManager, type EmailManager } from "@/lib/email";
import { CacheKeys, getCacheInfo } from "@/lib/domain";
import type { CommandManager } from "@/lib/cqrs";
import {
  getQueryManager,
  fetchDiscounts,
  checkoutCart,
  upsertGuestUser,
  getCommandManager,
  fetchCompanyInfo,
  fetchCartCheckout,
} from "@/lib/cqrs";
import { CompanyInfoKeys } from "@/lib/domain";
import { EmailSubjects } from "../const/messages";

interface CartCheckoutManager {
  checkoutCart: (
    items: Array<CartItem>,
    guest?: GuestUser,
    userId?: string,
  ) => Promise<Result<string>>;
}

const saveGuestUser = async (
  commandManager: CommandManager,
  guest: GuestUser,
): Promise<Result<number>> => {
  return await commandManager.mutate<number>(() => upsertGuestUser(guest));
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

const sendNewOrderEmail = async (
  emailManager: EmailManager,
  checkoutId: number,
): Promise<Result> => {
  return Promise.all([
    getQueryManager().fetch(
      () => fetchCompanyInfo(),
      getCacheInfo(CacheKeys.CompanyInfo),
    ),
    getQueryManager().fetch(() => fetchCartCheckout(checkoutId)),
  ])
    .then(([companyInfo, cartCheckout]) => {
      if (!companyInfo.ok || companyInfo.data === undefined) {
        return FailedResult(
          companyInfo.error ??
            new Error(
              "Could not obtain company info for email placeholders substitution.",
            ),
        );
      }
      if (!cartCheckout.ok || cartCheckout.data === undefined) {
        return FailedResult(
          cartCheckout.error ??
            new Error(
              `Could not obtain cart items for checkout with ID #${checkoutId}.`,
            ),
        );
      }
      const orderNo = `${OrderTypes.Web}-${cartCheckout.data.root.id}`;
      const orderSum = cartCheckout.data?.items.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0,
      );
      const params = {
        orderNo,
        orderSum,
        orderSumLocal: formatCurrency(orderSum),
        items: cartCheckout.data.items,
        client: cartCheckout.data.guest,
      };
      return emailManager.sendNewOrder({
        from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
        toCustomer: cartCheckout.data?.guest?.email ?? "",
        toBackOffice: companyInfo.data[CompanyInfoKeys.CompanyEmail],
        subject: `${EmailSubjects.NewOrder} #${orderNo}`,
        templateParams: { ...companyInfo.data, ...params },
      });
    })
    .then((result) => {
      return !result.ok
        ? FailedResult(
            result.error ?? new Error("Failed to send new order email"),
          )
        : OkResult();
    })
    .catch((err) => FailedResult(err));
};

const sendFailureEmail = async (
  emailManager: EmailManager,
  message: string,
): Promise<Result> => {
  return getQueryManager()
    .fetch(() => fetchCompanyInfo(), getCacheInfo(CacheKeys.CompanyInfo))
    .then((companyInfo) => {
      if (!companyInfo.ok || companyInfo.data === undefined) {
        return FailedResult(
          companyInfo.error ??
            new Error(
              "Could not obtain company info for email placeholders substitution.",
            ),
        );
      }
      return emailManager.sendFailure({
        from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
        to: companyInfo.data[CompanyInfoKeys.AdminEmail],
        subject: EmailSubjects.Failure,
        templateParams: { ...companyInfo.data, failureDescription: message },
      });
    })
    .catch((err) => FailedResult(err));
};

function getCartCheckoutManager(): CartCheckoutManager {
  const commandManager = getCommandManager();
  const emailManager = getEmailManager();
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

        sendNewOrderEmail(emailManager, cartCheckout.data).then((result) => {
          if (!result.ok) {
            const errorMessage = `Failed to send new order email, see error details below. ${result.error}`;
            console.error(errorMessage);
            sendFailureEmail(emailManager, errorMessage);
          }
        });

        return OkResult(`${OrderTypes.Web}-${cartCheckout.data}`);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        console.error(
          "~ cartManager ~ failed to checkout cart: %s",
          errorMessage,
        );
        return FailedResult(new Error(errorMessage));
      }
    },
  };
}

export { getCartCheckoutManager };
