import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";
import { defaultPaging, type Pagable } from "../../core/models/paging";
import { APISearchParamNames } from "../../core/const";
import { extractUrlParamValue } from "../../core/helpers/url-utils";

export const prerender = false;

export const GET: APIRoute = async ({ /*params, */ request }) => {
  //console.log("🚀 ~ GET ~ products ~ request:", URL.parse(request.url));

  // TODO: query database for Categories
  var allItems: Array<Product> = [
    {
      id: 1,
      title: "Замок АПЕКС PD-38 перфо-ключ",
      productCode: "1234",
      unit: 0,
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 97.3,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      colors: [0, 2, 1, 3],
      image: "padlock-master-vline.png",
      slug: "padlock-master-vline",
    },
    {
      id: 2,
      title: "Product 2",
      productCode: "201",
      unit: 1,
      quantityInPack: 10,
      minQuantityToBuy: 1,
      price: 81.34,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 3,
      categorySlug: "padlocks",
      image: "wtb-padloc-grips.png",
      slug: "wtb-padloc-grips",
    },
    {
      id: 3,
      title: "Product 3",
      productCode: "3101",
      unit: 0,
      quantityInPack: 1,
      minQuantityToBuy: 1,
      price: 120.45,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: 4,
      categorySlug: "locks",
      colors: [0, 2],
      image: "padoc-drive-board.png",
      slug: "padoc-drive-board",
    },
  ];

  const url = URL.parse(request.url);
  const categorySlug = extractUrlParamValue(
    url,
    APISearchParamNames.Category,
    "string"
  );

  var paging: Pagable = { current: 0, limit: 100 };
  const pageNumber = extractUrlParamValue(
    url,
    APISearchParamNames.Page,
    "number"
  );
  paging.current = pageNumber !== -1 ? pageNumber : defaultPaging.current;

  const pageSize = extractUrlParamValue(
    url,
    APISearchParamNames.PageSize,
    "number"
  );
  paging.limit = pageSize !== -1 ? pageSize : defaultPaging.limit;

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
