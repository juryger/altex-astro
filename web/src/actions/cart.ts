import { defineAction } from "astro:actions";
import { CartCheckoutRequestSchema } from "../core/models/cart";
import { getCartManager } from "../core/services/cart/cartManager";

export const cartActions = {
  checkout: defineAction({
    input: CartCheckoutRequestSchema,
    handler: async (input) => {
      const result = await getCartManager().checkoutCart(
        input.cartContent,
        input.guestUser,
        input.userId,
      );

      if (result.error !== undefined) {
        // * Generate email for Admin in case of any exceptions
        throw result.error;
      }

      return result.data;
    },
  }),
};
