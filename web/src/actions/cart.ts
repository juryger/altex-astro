import { defineAction } from "astro:actions";
import { CartCheckoutRequestSchema } from "../core/models/cart";
import { getCartManager } from "../core/services/cart/cartManager";

export const cartActions = {
  checkout: defineAction({
    input: CartCheckoutRequestSchema,
    handler: async (input) => {
      return await getCartManager().checkoutCart(
        input.cartContent,
        input.guestUser,
        input.userId,
      );
    },
  }),
};
