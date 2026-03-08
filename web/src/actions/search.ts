import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import {
  fetchAllCategories,
  fetchAllProducts,
  getQueryManager,
} from "@/lib/cqrs";
import { sendFailureEmail } from "../core/utils/failure-manager";

export const searchActions = {
  search: defineAction({
    input: z.object({
      query: z.string(),
    }),
    handler: async (input) => {
      console.log("🧪 ~ searchAction ~ query:", input.query);
      const queryManager = getQueryManager();

      const result = await Promise.all([
        queryManager.fetch(() => fetchAllCategories()),
        queryManager.fetch(() => fetchAllProducts()),
      ]);

      if (!result[0].ok || !result[1].ok) {
        sendFailureEmail(
          `Failed to checkout cart, see the error details below. ${result[0].error ?? result[1].error}`,
        ).then((email) => {
          if (!email.ok) console.error(email.error);
        });
        throw result[0].error ?? result[1].error;
      }

      return [...(result[0].data ?? []), ...(result[1].data ?? [])];
    },
  }),
};
