import type { APIRoute } from "astro";
import type { Category } from "../../core/models/category";
import { defaultPaging, type Pagable } from "../../core/models";
import { APISearchParamNames } from "../../core/const";
import { regexTruePattern } from "../../core/helpers/regex";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("🚀 ~ GET ~ request:", URL.parse(request.url));

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

  var parentSlug: string | null = null;
  var ignoreParent: boolean = false;
  var paging: Pagable = { current: 0, limit: 100 };

  const url = URL.parse(request.url);
  if (url?.search && url.searchParams) {
    if (url.searchParams.has(APISearchParamNames.Parent)) {
      parentSlug = url.searchParams.get(APISearchParamNames.Parent);
    }
    if (url.searchParams.has(APISearchParamNames.IgnoreParent)) {
      ignoreParent = regexTruePattern.test(
        url.searchParams.get(APISearchParamNames.IgnoreParent) ?? "false"
      );
    }

    var checkInt = parseInt(
      url.searchParams.get(APISearchParamNames.Page) ?? ""
    );
    paging.current = !isNaN(checkInt) ? checkInt : defaultPaging.current;

    checkInt = parseInt(
      url.searchParams.get(APISearchParamNames.PageSize) ?? ""
    );
    paging.limit = !isNaN(checkInt) ? checkInt : defaultPaging.limit;
  }

  return new Response(
    JSON.stringify(
      ignoreParent
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
