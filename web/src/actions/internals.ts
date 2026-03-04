import { defineAction } from "astro:actions";
import { CacheManager } from "@/lib/cqrs/src";

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
};
