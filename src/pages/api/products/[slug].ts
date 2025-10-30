import type { APIRoute } from "astro";
import type { Product } from "../../../core/models/product";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("🚀 ~ GET ~ product ~ params:", params);
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
  } as Product;

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
