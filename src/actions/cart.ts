import { defineAction } from "astro:actions";
import { CartCheckoutSchema } from "../core/models/cart";

export const cartActions = {
  checkout: defineAction({
    input: CartCheckoutSchema,
    handler: async (input) => {
      return "0";
    },
  }),
};
