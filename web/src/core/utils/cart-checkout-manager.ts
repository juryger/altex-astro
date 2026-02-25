import crypto from "crypto";
import type { CartItem, GuestUser, Result } from "@/lib/domain";
import { getErrorMessage } from "@/lib/domain";
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
import { CompanyInfoKeys } from "@/lib/dal/src";
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
    return { status: "Failed", error: discounts.error };
  }

  return await commandManager.mutate<number>(() =>
    checkoutCart(items, discounts.data ?? [], userUid, guestUid),
  );
};

const sendNewOrderEmail = async (
  emailManager: EmailManager,
  checkoutId: number,
): Promise<Result> => {
  const companyInfo = await getQueryManager().fetch(
    () => fetchCompanyInfo(),
    getCacheInfo(CacheKeys.CompanyInfo),
  );

  if (companyInfo.status !== "Ok") {
    return { status: "Failed", error: companyInfo.error };
  }

  const cartCheckoutData = await getQueryManager().fetch(
    () => fetchCartCheckout(checkoutId),
    getCacheInfo(CacheKeys.CartCheckout),
  );

  if (cartCheckoutData.status !== "Ok") {
    return { status: "Failed", error: cartCheckoutData.error };
  }

  if (!companyInfo.data || !cartCheckoutData.data) {
    return {
      status: "Failed",
      error: new Error(
        `Failed to retrieve company and cart data for checkout ID: ${checkoutId}`,
      ),
    };
  }

  const params = companyInfo.data && {
    orderNo: `${OrderTypes.Web}-${cartCheckoutData.data.root.id}`,
    orderSumValue: cartCheckoutData.data?.items.reduce(
      (acc, curr) => acc + curr.quantity * curr.price,
      0,
    ),
    items: cartCheckoutData.data.items,
    client: cartCheckoutData.data.guest,
  };

  await emailManager.sendNewOrder({
    toCustomer: cartCheckoutData.data?.guest?.email ?? "",
    toBackOffice: companyInfo.data[CompanyInfoKeys.CompanyEmail],
    subject: EmailSubjects.NewOrder,
    templateParams: params,
  });

  return { status: "Ok" };
};

const sendFailureEmail = async (
  emailManager: EmailManager,
  message: string,
): Promise<Result> => {
  const companyInfo = await getQueryManager().fetch(
    () => fetchCompanyInfo(),
    getCacheInfo(CacheKeys.CompanyInfo),
  );

  if (companyInfo.status !== "Ok") {
    return { status: "Failed", error: companyInfo.error };
  }

  if (!companyInfo.data) {
    return {
      status: "Failed",
      error: new Error("Unable to retrieve company data"),
    };
  }

  const emailResult = await emailManager.sendFailure({
    to: companyInfo.data[CompanyInfoKeys.AdminEmail],
    subject: EmailSubjects.Failure,
    templateParams: companyInfo.data && { failureDescription: message },
  });

  return { status: emailResult.status, error: emailResult.error };
};

function getCartCheckoutManager(): CartCheckoutManager {
  const commandManager = getCommandManager();
  const emailManager = getEmailManager({
    rootPath: import.meta.env.EMAIL_TEMPLATES_PATH,
  });
  return {
    checkoutCart: async (
      items: Array<CartItem>,
      guest?: GuestUser,
      userUid?: string,
    ): Promise<Result<string>> => {
      const result: Result<string> = { status: "Ok" };
      try {
        let guestUid: string | undefined = undefined;
        if (guest) {
          guestUid = crypto.randomUUID();
          guest.uid = guestUid;
          const guestResult = await saveGuestUser(commandManager, guest);
          if (guestResult.status !== "Ok") {
            result.status = "Failed";
            result.error = guestResult.error;
            return result;
          }
        }

        const cartCheckoutResult = await saveCartCheckout(
          commandManager,
          items,
          userUid,
          guestUid,
        );
        if (
          cartCheckoutResult.status !== "Ok" ||
          cartCheckoutResult.data === undefined
        ) {
          result.status = "Failed";
          result.error = cartCheckoutResult.error;
          return result;
        }

        const emailResult = await sendNewOrderEmail(
          emailManager,
          cartCheckoutResult.data,
        );
        if (emailResult.status !== "Ok") {
          result.status = "Failed";
          result.error = emailResult.error;
          return result;
        }

        result.data = `${OrderTypes.Web}-${cartCheckoutResult.data}`;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(
          "~ cartManager ~ failed to checkout cart: ",
          errorMessage,
        );
        result.status = "Failed";
        result.error = new Error(errorMessage);
      } finally {
        if (result.status !== "Ok") {
          const emailResult = await sendFailureEmail(
            emailManager,
            `Failed to create new order based on the cart checkout, see details below. ${result.error}`,
          );
          if (emailResult.error !== undefined) console.error(emailResult.error);
        }
      }
      return result;
    },
  };
}

export { getCartCheckoutManager };
