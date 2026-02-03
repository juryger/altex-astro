import type { APIRoute } from "astro";
import { fetchCategoryBySlug } from "@/web/src/core/services/queries/categories";
import { queryManager } from "@/web/src/core/services/queryManager";
import type { Category } from "@/web/src/core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("📍 ~ API-GET ~ category ~ params:", params);
  const { slug } = params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const result = await queryManager().fetch<Category | undefined>(() =>
    fetchCategoryBySlug(slug),
  );
  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //console.log("🧪 category by slug '%s', %o", slug, result);
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
