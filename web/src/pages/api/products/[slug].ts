import type { APIRoute } from "astro";
import type { Product } from "../../../core/models/product";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  //console.log("🚀 ~ GET ~ product ~ params:", params);
  const { slug } = params;

  // TODO: query database for category by slug

  if (!slug || slug !== "padlock-master-vline") {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const item = {
    id: 1,
    title: "Замок АПЕКС PD-38 перфо-ключ",
    productCode: "1234",
    unit: 0, //"шт",
    quantityInPack: 1,
    minQuantityToBuy: 1,
    price: 97.3,
    whsPrice1: 90.1,
    whsPrice2: 80.03,
    categoryId: 3,
    categorySlug: "padlocks",
    colors: [0, 2, 1, 3],
    image: "padlock-master-vline.png",
    slug: "padlock-master-vline",
  } as Product;

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
