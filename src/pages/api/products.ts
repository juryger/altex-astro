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
      title: "Замок АПЕКС PD-38 перфо-ключ",
      articleNumber: "1234",
      unit: 1, //"шт",
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 97.3,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: ["AB", "CP", "AC", "PB"],
      image: "padlock-master-vline.png",
      slug: "padlock-master-vline",
    },
    {
      id: 2,
      title: "Product 2",
      articleNumber: "201",
      unit: 1, //"шт",
      quantityInPack: 10,
      minQuantityToBuy: 1,
      price: 81.34,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: ["WW", "CP", "PB"],
      image: "wtb-padloc-grips.png",
      slug: "wtb-padloc-grips",
    },
    {
      id: 3,
      title: "Product 3",
      articleNumber: "3101",
      unit: 1, //"шт",
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 120.45,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 1,
      categorySlug: "locks",
      colors: ["AB", "CP"],
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
