import type { APIRoute } from "astro";
import { queryManager } from "@/web/src/core/services/queryManager";
import { fetchProductColors } from "@/web/src/core/services/queries/product-colors";
import type { ProductColor } from "@/web/src/core/models/product-color";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ discounts list ~ URL:", URL.parse(request.url));

  const result = await queryManager().fetch<ProductColor[]>(() =>
    fetchProductColors(),
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
