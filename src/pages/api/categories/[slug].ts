import type { APIRoute } from "astro";
import type { Category } from "../../../core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("🚀 ~ GET ~ category ~ params:", params);
  const { slug } = params;

  // TODO: query database for category by slug

  if (!slug || (slug !== "locks" && slug !== "padlocks")) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const item: Category =
    slug === "locks"
      ? {
          id: 1,
          title: "Замковая фурнитура",
          description: "Замкки, личинки, проушины и прочее",
          image: "locks.png",
          slug: "locks",
        }
      : {
          id: 3,
          title: "Навесные замки",
          description: "Навесные замки и прочее",
          image: "padlocks.png",
          slug: "padlocks",
          parentId: 1,
          parentSlug: "locks",
        };

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
