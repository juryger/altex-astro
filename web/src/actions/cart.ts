import { defineAction } from "astro:actions";
import {
  CacheKeys,
  CartCheckoutRequestSchema,
  CompanyInfoKeys,
  FailedResult,
  getCacheInfo,
  type Result,
} from "@/lib/domain";
import { getCartCheckoutManager } from "../core/utils/cart-checkout-manager";
import { fetchCompanyInfo, getQueryManager } from "@/lib/cqrs/src";
import { getEmailManager } from "@/lib/email/src";
import { EmailSubjects } from "../core/const/messages";

const sendFailureEmail = async (message: string): Promise<Result> => {
  return getQueryManager()
    .fetch(() => fetchCompanyInfo(), getCacheInfo(CacheKeys.CompanyInfo))
    .then((companyInfo) => {
      if (!companyInfo.ok || companyInfo.data === undefined) {
        return FailedResult(
          companyInfo.error ??
            new Error(
              "Could not obtain company info for email placeholders substitution",
            ),
        );
      }
      return getEmailManager().sendFailure({
        from: companyInfo.data[CompanyInfoKeys.CompanyEmail],
        to: companyInfo.data[CompanyInfoKeys.AdminEmail],
        subject: EmailSubjects.Failure,
        templateParams: { ...companyInfo.data, failureDescription: message },
      });
    })
    .catch((error) => FailedResult(error));
};

export const cartActions = {
  checkout: defineAction({
    input: CartCheckoutRequestSchema,
    handler: async (input) => {
      const result = await getCartCheckoutManager().checkoutCart(
        input.cartContent,
        input.guestUser,
        input.userId,
      );
      if (!result.ok) {
        sendFailureEmail(
          `Failed to checkout cart, see the error details below. ${result.error}`,
        ).then((email) => {
          if (!email.ok) console.error(email.error);
        });
        throw result.error;
      }
      return result.data;
    },
  }),
};
