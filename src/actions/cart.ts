import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { CartDictionary } from "../core/models/cart";

export const cartActions = {
  addToCart: defineAction({
    input: z.object({
      id: z.number(),
      color: z.number().optional(),
      quantity: z.number(),
    }),
    handler: async (input, context) => {
      /*
        const existingEntry = $cartItems.get()[itemKey];
      
        $cartItems.setKey(
          itemKey,
          existingEntry !== undefined
            ? {
                ...existingEntry,
                quantity: existingEntry.quantity + value.quantity,
              }
            : { ...value }
        );
      */

      const itemKey =
        input.color !== undefined
          ? `${input.id}-${input.color}`
          : input.id.toString();

      const lastVisit = (await context.session?.get("lastVisit")) as
        | Date
        | undefined;
      console.log("🚀 ~ cartActions ~ add to cart:", lastVisit);
      const cartItems = (await context.session?.get("cart")) as
        | CartDictionary
        | undefined;
      console.log("🚀 ~ cartActions ~ add to cart:", cartItems);

      return input.quantity;
    },
  }),
  updateCart: defineAction({
    input: z.object({
      id: z.number(),
      color: z.number().optional(),
      quantity: z.number(),
    }),
    handler: async (input, context) => {
      /*
      const itemKey = color !== undefined ? `${id}-${color}` : id.toString();
      const existingEntry = $cartItems.get()[itemKey];
      
      if (!existingEntry) {
        console.error(
          "~ cart-store ~ cannot update the product in the cart as it's not found:",
          itemKey
        );
        return;
      }
    
      $cartItems.setKey(itemKey, {
        ...existingEntry,
        quantity: quantity,
        color,
      });
      */

      console.log("🚀 ~ cartActions ~ update cart:", input);
      //context.session?.set("lastVisit", input.value);
      return input.quantity;
    },
  }),
  removeFromCart: defineAction({
    input: z.object({
      id: z.number(),
      color: z.number().optional(),
    }),
    handler: async (input, context) => {
      /*
      const itemKey = color !== undefined ? `${id}-${color}` : id.toString();
      const existingEntry = $cartItems.get()[itemKey];
    
      if (!existingEntry) {
        console.error(
          "~ cart-store ~ cannot remove product from the cart as it's not found:",
          itemKey
        );
        return;
      }
    
      $cartItems.setKey(itemKey, undefined);
      */
      console.log("🚀 ~ cartActions ~ remove from cart:", input);
      //context.session?.set("lastVisit", input.value);
      return 0;
    },
  }),
};
