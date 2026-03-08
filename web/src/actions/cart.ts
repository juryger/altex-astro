import { defineAction } from "astro:actions";
import { CartCheckoutRequestSchema } from "@/lib/domain";
import { getCartCheckoutManager } from "../core/utils/cart-checkout-manager";
import { sendFailureEmail } from "../core/utils/failure-manager";

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
