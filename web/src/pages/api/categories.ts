import type { APIRoute } from "astro";
import type { Category } from "../../core/models/category";
import { APISearchParamNames } from "../../core/const";
import { extractUrlPaging, extractUrlParam } from "../../core/utils/url-parser";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ categories list ~ URL:", URL.parse(request.url));

  // TODO: query database for Categories
  const allItems: Category[] = [
    {
      id: 1,
      title: "Замочная фурнитура",
      description: "Замкки и прочее",
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
    {
      id: 6,
      title: "Отвертки",
      description: "Отвертки и прочие товары",
      image: "screwdrivers.png",
      slug: "screwdrivers",
      parentId: 2,
      parentSlug: "tools",
    },
  ];

  const url = URL.parse(request.url);
  const parentSlug = extractUrlParam(url, APISearchParamNames.Parent, "string");

  const skipFilters = extractUrlParam(
    url,
    APISearchParamNames.SkipFilters,
    "boolean"
  );

  // TODO: apply paging
  const paging = extractUrlPaging(url);

  return new Response(
    JSON.stringify(
      skipFilters
        ? allItems
        : !parentSlug
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
