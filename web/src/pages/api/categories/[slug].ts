import type { APIRoute } from "astro";
import { fetchCategoryBySlug, getQueryManager } from "@/lib/cqrs";
import type { Category } from "@/lib/domain";
import { CACHE_STALE_TIMEOUT_1MN, CacheKeys, getCacheInfo } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  //console.log("📍 ~ API-GET ~ category ~ params:", params);
  const { slug } = params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const result = await getQueryManager().fetch<Category | undefined>(
    () => fetchCategoryBySlug(slug),
    getCacheInfo(`${CacheKeys.CategoryItem}:${slug}`, CACHE_STALE_TIMEOUT_1MN),
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
