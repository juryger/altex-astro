import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";
import type { Pagable } from "../../core/models";
import { APISearchParamNames } from "../../core/const";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("🚀 ~ GET ~ products ~ request:", URL.parse(request.url));

  // TODO: query database for Categories
  var allItems: Array<Product> = [
    {
      id: 1,
      title: "Замок навесной",
      description: "Product description 1",
      unit: "шт",
      quantityInPack: 1,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: ["red", "blue"],
      image: "padlock-master-vline.png",
      slug: "padlock-master-vline",
    },
    {
      id: 2,
      title: "Product 2",
      description: "Product description 2",
      unit: "шт",
      quantityInPack: 10,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: ["red", "blue", "green"],
      image: "wtb-padloc-grips.png",
      slug: "wtb-padloc-grips",
    },
    {
      id: 3,
      title: "Product 3",
      description: "Product description 3",
      unit: "шт",
      quantityInPack: 1,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 1,
      categorySlug: "locks",
      colors: ["brown", "blue", "bronze"],
      image: "padoc-drive-board.png",
      slug: "padoc-drive-board",
    },
  ];

  var categorySlug: string | null = null;
  var paging: Pagable = { current: 0, limit: 100 };

  const url = URL.parse(request.url);
  if (url?.search && url.searchParams) {
    if (url.searchParams.has(APISearchParamNames.Category)) {
      categorySlug = url.searchParams.get(APISearchParamNames.Category);
    }

    var checkInt = parseInt(
      url.searchParams.get(APISearchParamNames.Page) ?? "0"
    );
    if (!isNaN(checkInt)) paging.current = checkInt;

    checkInt = parseInt(
      url.searchParams.get(APISearchParamNames.PageSize) ?? "100"
    );
    if (!isNaN(checkInt)) paging.limit = checkInt;
  }

  if (!categorySlug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(
    JSON.stringify(allItems.filter((x) => x.categorySlug === categorySlug)),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
