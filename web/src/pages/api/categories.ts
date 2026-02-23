import type { APIRoute } from "astro";
import { APISearchParamNames } from "@/web/src/core/const";
import {
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "@/web/src/core/utils/url-parser";
import { fetchCategories, getQueryManager } from "@/lib/cqrs";
import type { Category, PageResult } from "@/lib/domain";
import {
  CACHE_STALE_TIMEOUT_1HR,
  CACHE_STALE_TIMEOUT_5MN,
  CacheKeys,
  getCacheInfo,
} from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ categories list ~ URL:", URL.parse(request.url));

  const url = URL.parse(request.url);
  const skipParentMatch =
    extractUrlParam(url, APISearchParamNames.SkipParentMatch, "boolean") ??
    true;
  const parentSlug =
    extractUrlParam(url, APISearchParamNames.Parent, "string") ?? "";
  const sorting = extractUrlSorting(url);
  const paging = extractUrlPaging(url);

  let cacheKey = skipParentMatch
    ? CacheKeys.CategoriesAll
    : parentSlug === undefined
      ? CacheKeys.CategoriesRoot
      : `${CacheKeys.CategoriesParent}:${parentSlug}`;
  cacheKey = `${cacheKey}:page:${paging.page}:${paging.pageSize}:sort:${sorting.field}:${sorting.order}`;
  const result = await getQueryManager().fetch<PageResult<Category>>(
    () => fetchCategories(skipParentMatch, parentSlug, sorting, paging),
    getCacheInfo(
      cacheKey,
      parentSlug !== undefined
        ? CACHE_STALE_TIMEOUT_5MN
        : CACHE_STALE_TIMEOUT_1HR,
    ),
  );

  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //console.log("🧪 categories %o", result);
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
