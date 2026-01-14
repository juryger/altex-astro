import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const userActions = {
  getLastVisitDate: defineAction({
    input: undefined,
    handler: async (input, context) => {
      const result = await context.session?.get("lastVisit");
      console.log("🛠️ ~ userActions ~ get user last visit date:", result);
      return result;
    },
  }),
  setLastVisitDate: defineAction({
    input: z.object({
      value: z.date(),
    }),
    handler: async (input, context) => {
      console.log("🛠️ ~ userActions ~ set user last visit date:", input.value);
      context.session?.set("lastVisit", input.value);
      return input.value;
    },
  }),
};
