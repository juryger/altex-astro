import type { APIRoute } from "astro";
import { getQueryManager, fetchProductColors } from "@/lib/cqrs";
import type { ProductColor } from "@/lib/domain";
import { CacheKeys, getCacheInfo } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ discounts list ~ URL:", URL.parse(request.url));

  const result = await getQueryManager().fetch<ProductColor[]>(
    () => fetchProductColors(),
    getCacheInfo(CacheKeys.ProductColors),
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
