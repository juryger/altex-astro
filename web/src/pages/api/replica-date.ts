import type { APIRoute } from "astro";
import { getQueryManager, fetchCurrentReadReplica } from "@/lib/cqrs";
import type { ReadReplica } from "@/lib/domain";
import {
  CACHE_STALE_TIMEOUT_15MN,
  CacheKeys,
  getCacheInfo,
} from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  const result = await getQueryManager().fetch<ReadReplica | undefined>(
    () => fetchCurrentReadReplica(),
    getCacheInfo(CacheKeys.ReadReplica, CACHE_STALE_TIMEOUT_15MN),
  );

  if (result.error) {
    console.error(result.error);
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(result.data?.createdAt.toISOString()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
