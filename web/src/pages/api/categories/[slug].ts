import type { APIRoute } from "astro";
import { fetchCategoryBySlug, getQueryManager } from "@/lib/cqrs";
import type { Category } from "@/lib/domain";
import {
  CACHE_STALE_TIMEOUT_1MN,
  CacheKeys,
  getCacheInfo,
  regexTrue,
} from "@/lib/domain";

export const prerender = false;

const withTracing = regexTrue.test(import.meta.env.PUBLIC_ENABLE_TRACING);

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  const { slug } = params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  withTracing && console.log("🐾 ~ API-GET:category ~ slug:", slug);
  const result = await getQueryManager().fetch<Category | undefined>(
    () => fetchCategoryBySlug(slug),
    getCacheInfo(`${CacheKeys.CategoryItem}:${slug}`, CACHE_STALE_TIMEOUT_1MN),
  );
  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 500,
      statusText: "Server error",
    });
  }
  withTracing &&
    console.log("🐾 ~ API-GET:category ~ slug: '%s', result: %o", slug, result);
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
