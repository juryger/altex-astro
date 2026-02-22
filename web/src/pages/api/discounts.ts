import type { APIRoute } from "astro";
import { getQueryManager } from "@/web/src/core/services/queryManager";
import { fetchDiscounts } from "@/web/src/core/services/queries/discounts";
import { type Discount } from "@/lib/domain/";
import { CacheKeys, getCacheInfo } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ discounts list ~ URL:", URL.parse(request.url));

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
