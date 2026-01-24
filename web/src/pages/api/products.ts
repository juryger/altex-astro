import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";
import { APISearchParamNames } from "../../core/const";
import {
  extractUrlFiltering,
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "../../core/utils/url-parser";
import { queryManager } from "@/web/src/core/services/queryManager";
import { fetchProducts } from "@/web/src/core/services/queries/products";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ products list ~ URL:", URL.parse(request.url));

  const url = URL.parse(request.url);
  const categorySlug =
    extractUrlParam(url, APISearchParamNames.Category, "string") ?? "";
  const paging = extractUrlPaging(url);
  const sorting = extractUrlSorting(url);

  const result = await queryManager().fetch(() =>
    fetchProducts(categorySlug, sorting, paging),
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
