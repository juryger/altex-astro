import type { CartItem, GuestUser, Result } from "@/lib/domain";
import { getErrorMessage } from "@/lib/domain";
import { OrderTypes } from "@/web/src/core/const";
import { getEmailManager, TemplateKeys, type EmailManager } from "@/lib/email";
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
): Promise<Result<string>> => {
  return await commandManager.mutate<string>(() => upsertGuestUser(guest));
};

const saveCartCheckout = async (
  commandManager: CommandManager,
  items: Array<CartItem>,
  userId?: string,
  guestId?: string,
): Promise<Result<number>> => {
  const discounts = await getQueryManager().fetch(
    () => fetchDiscounts(),
    getCacheInfo(CacheKeys.Discounts),
  );
  if (discounts.error !== undefined)
    return { status: "Failed", error: discounts.error };

  return await commandManager.mutate<number>(() =>
    checkoutCart(items, discounts.data ?? [], userId, guestId),
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

  if (companyInfo.data === undefined) {
    return {
      status: "Failed",
      error: new Error(
        "Failed to retrieve compnay data for the cart checkout email",
      ),
    };
  }

  const cartCheckoutData = await getQueryManager().fetch(
    () => fetchCartCheckout(checkoutId),
    getCacheInfo(CacheKeys.CartCheckout),
  );

  if (cartCheckoutData.status !== undefined) {
    return { status: "Failed", error: cartCheckoutData.error };
  }

  if (
    cartCheckoutData.data?.guest === undefined &&
    cartCheckoutData.data?.customer === undefined
  ) {
    return {
      status: "Failed",
      error: new Error(
        "Failed to retrieve guest/customer details for the cart checkout email",
      ),
    };
  }

  if (cartCheckoutData.data === undefined) {
    return {
      status: "Failed",
      error: new Error(
        "Failed to retrieve details for the cart checkout email",
      ),
    };
  }

  await emailManager.sendNewOrder({
    toCustomer: cartCheckoutData.data?.guest?.email ?? "",
    toBackOffice: companyInfo.data[CompanyInfoKeys.ContactEmail],
    subject: "New order on the website altexweb.ru",
    templateParams: companyInfo.data && {
        orderNo: `${OrderTypes.Web}-${cartCheckoutData.data.root.id}`,
      } && {
        orderSumValue: cartCheckoutData.data?.items.reduce(
          (acc, curr) => acc + curr.quantity * curr.price,
          0,
        ),
      } && { items: cartCheckoutData.data.items } && {
        client: cartCheckoutData.data.guest,
      },
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

  if (companyInfo.data === undefined) {
    return {
      status: "Failed",
      error: new Error(
        "Failed to retrieve compnay data for the cart checkout email",
      ),
    };
  }

  await emailManager.sendFailure({
    to: companyInfo.data[CompanyInfoKeys.AdminEmail],
    subject: "Server error on the website altexweb.ru",
    templateParams: companyInfo.data && { failureDescription: message },
  });

  return { status: "Ok" };
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
      userId?: string,
    ): Promise<Result<string>> => {
      const result: Result<string> = { status: "Ok" };
      try {
        let guestId: string | undefined = undefined;
        if (guest) {
          const guestResult = await saveGuestUser(commandManager, guest);
          if (guestResult.status !== "Ok")
            return { status: "Failed", error: guestResult.error };
          guestId = guestResult.data;
        }

        const cartCheckoutResult = await saveCartCheckout(
          commandManager,
          items,
          userId,
          guestId,
        );

        if (
          cartCheckoutResult.status !== "Ok" ||
          cartCheckoutResult.data === undefined
        ) {
          return {
            status: "Failed",
            error: cartCheckoutResult.error,
          };
        }

        const emailResult = await sendNewOrderEmail(
          emailManager,
          cartCheckoutResult.data,
        );

        if (emailResult.status !== "Ok") {
          return { status: "Failed", error: emailResult.error };
        }

        result.data = `${OrderTypes.Web}-${cartCheckoutResult.data}`;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        result.error = new Error(errorMessage);

        const emailResult = await sendFailureEmail(
          emailManager,
          `Failed to create new order based on the cart checkout, see details below. ${errorMessage}`,
        );

        if (emailResult.status !== "Ok") {
          console.error(
            "Failed to send admin email regarding failed to place new order based on cart checkout",
            emailResult.error,
          );
        }

        console.error(
          "❌ ~ cartManager ~ failed to checkout cart: ",
          errorMessage,
        );
      }

      return result;
    },
  };
}

export { getCartCheckoutManager };
