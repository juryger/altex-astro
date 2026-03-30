import type { APIRoute } from "astro";
import { APISearchParamNames } from "@/web/src/core/const";
import {
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "@/web/src/core/utils/url-parser";
import { getQueryManager, fetchProducts } from "@/lib/cqrs";
import type { Product, PagingResult } from "@/lib/domain";
import {
  CACHE_STALE_TIMEOUT_5MN,
  CacheKeys,
  EnvironmentNames,
  getCacheInfo,
  regexTrue,
  selectEnvironment,
} from "@/lib/domain";

export const prerender = false;

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

export const GET: APIRoute = async ({ /*params, */ request }) => {
  const url = URL.parse(request.url);
  const categorySlug =
    extractUrlParam(url, APISearchParamNames.Category, "string") ?? "";
  const paging = extractUrlPaging(url);
  const sorting = extractUrlSorting(url);
  withTracing &&
    console.log(
      "🐾 ~ API-GET:products ~ cateogry slug: '%s', paging: %o, sorging: %o",
      categorySlug,
      paging,
      sorting,
    );

  const cacheKey = `${CacheKeys.Products}:parent:${categorySlug}:page:${paging.page}:${paging.pageSize}:sort:${sorting.field}:${sorting.order}`;
  const result = await getQueryManager().fetch<PagingResult<Product>>(
    () => fetchProducts(categorySlug, sorting, paging),
    getCacheInfo(cacheKey, CACHE_STALE_TIMEOUT_5MN),
  );

  withTracing &&
    console.log(
      "🐾 ~ API-GET:products ~ cateogry slug: '%s', result %o",
      categorySlug,
      result,
    );
  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  if (!categorySlug) {
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
