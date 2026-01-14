import { defineAction } from "astro:actions";
import { CartCheckoutSchema } from "../core/models/cart";
//import { dbCatalog, type Colors } from "@/lib/dal";

export const cartActions = {
  checkout: defineAction({
    input: CartCheckoutSchema,
    handler: async (input) => {
      //const colors = (await dbCatalog.query.colors.findMany()) as Colors[];
      return "ONLINE-123";
    },
  }),
};
