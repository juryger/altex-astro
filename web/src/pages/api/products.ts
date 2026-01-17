import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";
import { APISearchParamNames } from "../../core/const";
import { extractUrlPaging, extractUrlParam } from "../../core/utils/url-parser";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  console.log("📍 ~ API-GET ~ products list ~ URL:", URL.parse(request.url));

  // TODO: query database for Categories
  var allItems: Array<Product> = [
    {
      id: 1,
      title: "Замок АПЕКС PD-38 перфо-ключ",
      productCode: "ZAM-1",
      unitId: 0,
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 97.3,
      whsPrice1: 90.1,
      whsPrice2: 80.03,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: [0, 2, 1, 3],
      imageUrl: "padlock-master-vline.png",
      slug: "padlock-master-vline",
    },
    {
      id: 2,
      title: "Product 2",
      productCode: "PRO-2",
      unitId: 1,
      quantityInPack: 10,
      minQuantityToBuy: 1,
      price: 81.34,
      whsPrice1: 90.05,
      whsPrice2: 80.24,
      categoryId: 3,
      categorySlug: "padlocks",
      imageUrl: "wtb-padloc-grips.png",
      slug: "wtb-padloc-grips",
    },
    {
      id: 3,
      title: "Product 3",
      productCode: "PRO-3",
      unitId: 0,
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 120.45,
      whsPrice1: 90.99,
      whsPrice2: 80.75,
      categoryId: 4,
      categorySlug: "locks",
      colors: [0, 2],
      imageUrl: "padoc-drive-board.png",
      slug: "padoc-drive-board",
    },
  ];

  const url = URL.parse(request.url);
  const categorySlug = extractUrlParam(
    url,
    APISearchParamNames.Category,
    "string"
  );

  if (!categorySlug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const paging = extractUrlPaging(url);

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
