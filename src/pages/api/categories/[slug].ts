import type { APIRoute } from "astro";
import type { Category } from "../../../core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("🚀 ~ GET ~ category ~ params:", params);
  const { slug } = params;

  // TODO: query database for category by slug
  if (!slug || slug !== "locks") {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const item = {
    id: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
    title: "Замковая фурнитура",
    description: "Замкки, личинки, проушины и прочее",
    image: "http://localhost:4321/public/categories/locks.png",
    slug: "locks",
    parentId: undefined,
    parentSlug: undefined,
  } as Category;

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
