import { defineAction } from "astro:actions";
import { CartCheckoutRequestSchema } from "@/lib/domain";
import { getCartCheckoutManager } from "../core/utils/cart-checkout-manager";

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
        throw result.error;
      }
      return result.data;
    },
  }),
};
