import type { APIRoute } from "astro";
import { getQueryManager, fetchColors } from "@/lib/cqrs";
import type { Color } from "@/lib/domain";
import { CacheKeys, getCacheInfo } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async (
  {
    /*params, request*/
  },
) => {
  const result = await getQueryManager().fetch<Color[]>(
    () => fetchColors(),
    getCacheInfo(CacheKeys.Colors),
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
