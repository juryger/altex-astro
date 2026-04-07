import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { CacheManager } from "@/lib/cqrs";
import { getEmailComposer } from "../core/utils/email-composer";

const emailComposer = getEmailComposer();

export const internalsActions = {
  revalidateQueryCache: defineAction({
    handler: async () => {
      const cacheManager = CacheManager.instance({});
      return cacheManager.containsInvalid() ? cacheManager.revalidate() : false;
    },
  }),
  resetQueryCache: defineAction({
    handler: async () => {
      const cacheManager = CacheManager.instance({});
      cacheManager.reset();
    },
  }),
  resendNewOrderEmail: defineAction({
    input: z.number(),
    handler: async (input) => {
      const emailResult = await emailComposer.sendNewOrderEmail(input);
      if (!emailResult.ok) {
        const errorMessage = `Failed to send new order email, see error details below. ${emailResult.error}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
  }),
};
