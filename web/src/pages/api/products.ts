import type { APIRoute } from "astro";
import type { Product } from "@/web/src/core/models/product";
import { APISearchParamNames } from "@/web/src/core/const";
import {
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "@/web/src/core/utils/url-parser";
import { getQueryManager } from "@/web/src/core/services/queryManager";
import { fetchProducts } from "@/web/src/core/services/queries/products";
import type { PageResult } from "@/web/src/core/models/paging";
import { CACHE_STALE_TIMEOUT_5MN, CacheKeys } from "@/web/src/core/const/cache";
import { getCacheInfo } from "@/web/src/core/models/cache";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ products list ~ URL:", URL.parse(request.url));

  const url = URL.parse(request.url);
  const categorySlug =
    extractUrlParam(url, APISearchParamNames.Category, "string") ?? "";
  const paging = extractUrlPaging(url);
  const sorting = extractUrlSorting(url);

  const cacheKey = `${CacheKeys.Products}:parent:${categorySlug}:page:${paging.page}:${paging.pageSize}:sort:${sorting.field}:${sorting.order}`;
  const result = await getQueryManager().fetch<PageResult<Product>>(
    () => fetchProducts(categorySlug, sorting, paging),
    getCacheInfo(cacheKey, CACHE_STALE_TIMEOUT_5MN),
  );

  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //console.log("🧪 products %o", result);
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
