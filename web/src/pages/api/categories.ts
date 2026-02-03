import type { APIRoute } from "astro";
import { APISearchParamNames } from "@/web/src/core/const";
import {
  extractUrlPaging,
  extractUrlParam,
  extractUrlSorting,
} from "@/web/src/core/utils/url-parser";
import { fetchCategories } from "@/web/src/core/services/queries/categories";
import { queryManager } from "@/web/src/core/services/queryManager";
import type { PageResult } from "@/web/src/core/models/paging";
import type { Category } from "@/web/src/core/models/category";

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

  const result = await queryManager().fetch<PageResult<Category>>(() =>
    fetchCategories(skipParentMatch, parentSlug, sorting, paging),
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
