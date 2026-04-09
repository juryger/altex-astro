import type { APIRoute } from "astro";
import { APISearchParamNames } from "@/web/src/core/const";
import {
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "@/web/src/core/utils/url-parser";
import { fetchCategories, getQueryManager } from "@/lib/cqrs";
import type { Category, PagingResult } from "@/lib/domain";
import {
  CACHE_STALE_TIMEOUT_1HR,
  CACHE_STALE_TIMEOUT_5MN,
  CacheKeys,
  getCacheInfo,
  regexTrue,
} from "@/lib/domain";

export const prerender = false;

const withTracing = regexTrue.test(import.meta.env.PUBLIC_ENABLE_TRACING);

export const GET: APIRoute = async ({ /*params, */ request }) => {
  const url = URL.parse(request.url);
  const skipParentMatch =
    extractUrlParam(url, APISearchParamNames.SkipParentMatch, "boolean") ??
    true;
  const parentSlug =
    extractUrlParam(url, APISearchParamNames.Parent, "string") ?? "";
  const sorting = extractUrlSorting(url);
  const paging = extractUrlPaging(url);

  withTracing &&
    console.log(
      "🐾 ~ API-GET:categories ~ parent slug: '%s', paging: %o, sorting: %o",
      parentSlug,
      paging,
      sorting,
    );

  let cacheKey = skipParentMatch
    ? CacheKeys.CategoriesAll
    : parentSlug === undefined
      ? CacheKeys.CategoriesRoot
      : `${CacheKeys.CategoriesParent}:${parentSlug}`;
  cacheKey = `${cacheKey}:page:${paging.page}:${paging.pageSize}:sort:${sorting.field}:${sorting.order}`;
  const result = await getQueryManager().fetch<PagingResult<Category>>(
    () => fetchCategories(skipParentMatch, parentSlug, sorting, paging),
    getCacheInfo(
      cacheKey,
      parentSlug !== undefined
        ? CACHE_STALE_TIMEOUT_5MN
        : CACHE_STALE_TIMEOUT_1HR,
    ),
  );

  withTracing &&
    console.log(
      "🐾 ~ API-GET:categories ~ parent slug: '%s', result %s",
      parentSlug,
      result.data?.items.length,
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
