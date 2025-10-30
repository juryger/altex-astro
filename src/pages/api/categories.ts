import type { APIRoute } from "astro";
import type { Category } from "../../core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("🚀 ~ GET ~ request:", URL.parse(request.url));

  // TODO: query database for Categories
  const allItems: Category[] = [
    {
      id: 1,
      title: "Замковая фурнитура afdfaf 234",
      description: "Замкки, личинки, проушины и прочее",
      image: "locks.png",
      slug: "locks",
    },
    {
      id: 2,
      title: "Инструменты",
      description: "Инструменты для сада и хоязяйства",
      image: "tools.png",
      slug: "tools",
    },
    {
      id: 3,
      title: "Навесные замки",
      description: "Навесные замки и прочее",
      image: "padlocks.png",
      slug: "padlocks",
      parentId: 1,
      parentSlug: "locks",
    },
    {
      id: 4,
      title: "Личинки",
      description: "Заменяемые личинки для замков",
      image: "lock-barrels.png",
      slug: "lock-barrels",
      parentId: 1,
      parentSlug: "locks",
    },
    {
      id: 5,
      title: "Проушины",
      description: "Проушины для замков",
      image: "padlock-eyes.png",
      slug: "padlock-eyes",
      parentId: 1,
      parentSlug: "locks",
    },
  ];

  const url = URL.parse(request.url);
  var parentSlug: string | null = null;
  if (url?.search && url.searchParams && url.searchParams.has("parent")) {
    parentSlug = url.searchParams.get("parent");
  }

  return new Response(
    JSON.stringify(
      !parentSlug
        ? allItems.filter((x) => !x.parentId)
        : allItems.filter((x) => x.parentSlug === parentSlug)
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
