import type { APIRoute } from "astro";
import type { Category } from "../../core/models/category";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("🚀 ~ GET ~ request:", URL.parse(request.url));

  // TODO: query database for Categories
  var allItems: Array<Category> = [
    {
      id: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      title: "Замковая фурнитура afdfaf 234",
      description: "Замкки, личинки, проушины и прочее",
      image: "locks.png",
      slug: "locks",
      parentId: undefined,
      parentSlug: undefined,
    },
    {
      id: "a26d33ad-15ee-4cd0-a373-8c045e7ec70d",
      title: "Инструменты",
      description: "Инструменты для сада и хоязяйства",
      image: "tools.png",
      slug: "tools",
      parentId: undefined,
      parentSlug: undefined,
    },
    {
      id: "8532f731-caea-4972-8287-acdb17d4a95d",
      title: "Навесные замки",
      description: "Навесные замки и прочее",
      image: "padlocks.png",
      slug: "padlocks",
      parentId: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      parentSlug: "locks",
    },
    {
      id: "ec75efa3-2bdd-4a5a-a89c-05ee6ab8d708",
      title: "Личинки",
      description: "Заменяемые личинки для замков",
      image: "lock-barrels.png",
      slug: "lock-barrels",
      parentId: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      parentSlug: "locks",
    },
    {
      id: "8a0a01dc-e5f1-4c90-924f-02d227307dd1",
      title: "Проушины",
      description: "Проушины для замков",
      image: "padlock-eyes.png",
      slug: "padlock-eyes",
      parentId: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      parentSlug: "locks",
    },
  ];

  const url = URL.parse(request.url);
  var parentSlug = "";
  if (url?.search && url.searchParams) {
    parentSlug = url.searchParams.get("parent") ?? "";
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
