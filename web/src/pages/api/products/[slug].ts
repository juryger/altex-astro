import type { APIRoute } from "astro";
import { queryManager } from "@/web/src/core/services/queryManager";
import { fetchProductBySlug } from "@/web/src/core/services/queries/products";
import type { Product } from "@/web/src/core/models/product";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("📍 ~ API-GET ~ product ~ params:", params);
  const { slug } = params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const result = await queryManager().fetch<Product | undefined>(() =>
    fetchProductBySlug(slug),
  );

  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //console.log("🧪 product by slug '%s', %o", slug, result);
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
