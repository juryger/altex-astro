import type { APIRoute } from "astro";
import type { Category } from "@/web/src/core/models/category";
import { APISearchParamNames } from "../../core/const";
import {
  extractUrlPaging,
  extractUrlParam,
} from "@/web/src/core/utils/url-parser";
import { getCategories } from "@/web/src/core/services/queries/categories";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ categories list ~ URL:", URL.parse(request.url));

  const url = URL.parse(request.url);
  const skipParentMatch =
    extractUrlParam(url, APISearchParamNames.SkipParentMatch, "boolean") ??
    true;
  const parentSlug =
    extractUrlParam(url, APISearchParamNames.Parent, "string") ?? "";
  const paging = extractUrlPaging(url);

  let result: Category[];
  try {
    result = await getCategories(
      paging.page,
      paging.pageSize,
      skipParentMatch,
      parentSlug,
    );
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
