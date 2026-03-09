import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import {
  fetchAllCategories,
  fetchAllProducts,
  getQueryManager,
} from "@/lib/cqrs";
import { sendFailureEmail } from "../core/utils/failure-manager";
import { SEARCH_RESULTS_LIMIT } from "@/lib/domain";
import Fuse from "fuse.js";

export const searchActions = {
  search: defineAction({
    input: z.object({
      query: z.string(),
    }),
    handler: async (input) => {
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

      const fuse = new Fuse(
        [...(result[0].data ?? []), ...(result[1].data ?? [])],
        {
          threshold: 0.3,
          keys: [
            { name: "title", weight: 1.0 },
            { name: "description", weight: 0.7 },
            { name: "country", weight: 0.3 },
          ],
        },
      );

      const results = fuse.search(input.query);
      return results
        .slice(0, Math.min(results.length, SEARCH_RESULTS_LIMIT))
        .map((x) => x.item);
    },
  }),
};
