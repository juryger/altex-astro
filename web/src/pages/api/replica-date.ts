import type { APIRoute } from "astro";
import { ReadReplicaManager } from "@/lib/cqrs";
import { ReadReplicaTypes } from "@/lib/domain";

export const prerender = false;

export const GET: APIRoute = async (
  {
    /*params, request*/
  },
) => {
  const readReplicaManager = ReadReplicaManager.instance();
  return new Response(
    JSON.stringify(
      readReplicaManager.get(ReadReplicaTypes.Catalog).createdAt.toISOString(),
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
