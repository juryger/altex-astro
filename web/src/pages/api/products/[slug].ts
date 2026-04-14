import type { APIRoute } from "astro";
import { getQueryManager, fetchProductBySlug } from "@/lib/cqrs";
import type { Product } from "@/lib/domain";
import { regexTrue } from "@/lib/domain";

export const prerender = false;

const withTracing = regexTrue.test(import.meta.env.PUBLIC_ENABLE_TRACING);

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  const { slug } = params;
  if (slug === undefined || slug === "undfined") {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  withTracing && console.log("🐾 ~ API-GET:product ~ slug:", slug);
  const result = await getQueryManager().fetch<Product | undefined>(
    () => fetchProductBySlug(slug), // omit caching for individual products
  );
  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  withTracing &&
    console.log("🐾 ~ API-GET:product ~ slug '%s', result: %o", slug, result);
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
