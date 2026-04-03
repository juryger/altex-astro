import type { APIRoute } from "astro";
import { getQueryManager, fetchDiscounts } from "@/lib/cqrs";
import { type Discount } from "@/lib/domain";
import { CacheKeys, getCacheInfo } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async (
  {
    /*params, request*/
  },
) => {
  const result = await getQueryManager().fetch<Discount[]>(
    () => fetchDiscounts(),
    getCacheInfo(CacheKeys.Discounts),
  );

  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
