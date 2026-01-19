import type { APIRoute } from "astro";
import { getCategoryBySlug } from "@/web/src/core/services/queries/categories";
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

  let result: Category | undefined = undefined;
  try {
    result = await getCategoryBySlug(slug);
    console.log("🧪 category by slug '%s', %o", slug, result);
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
