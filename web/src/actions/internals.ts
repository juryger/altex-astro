import { defineAction } from "astro:actions";
import { CacheManager } from "@/lib/cqrs/src";

export const internalsActions = {
  revalidateQueryCache: defineAction({
    handler: async () => {
      console.log("🧪 ~ internalsActions ~ query cache revalidate");
      const cacheManager = CacheManager.instance({});
      return cacheManager.containsInvalid() ? cacheManager.revalidate() : false;
    },
  }),
  resetQueryCache: defineAction({
    handler: async () => {
      console.log("🧪 ~ internalsActions ~ query cache reset");
      const cacheManager = CacheManager.instance({});
      cacheManager.reset();
    },
  }),
};
