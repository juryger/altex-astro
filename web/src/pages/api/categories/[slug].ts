import type { APIRoute } from "astro";
import type { Category } from "../../../core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("📍 ~ API-GET ~ category ~ params:", params);
  const { slug } = params;

  // TODO: query database for category by slug

  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  var item: Category | undefined;
  switch (slug) {
    case "locks":
      item = {
        id: 1,
        title: "Замочная фурнитура",
        description: "Замкки и прочее",
        image: "locks.png",
        slug: "locks",
      };
      break;
    case "tools":
      item = {
        id: 2,
        title: "Инструменты",
        description: "Инструменты для сада и хоязяйства",
        image: "tools.png",
        slug: "tools",
      };
      break;
    case "padlocks":
      item = {
        id: 3,
        title: "Навесные замки",
        description: "Навесные замки и прочее",
        image: "padlocks.png",
        slug: "padlocks",
        parentId: 1,
        parentSlug: "locks",
      };
      break;
    default:
      return new Response(null, {
        status: 404,
        statusText: "Not found",
      });
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
