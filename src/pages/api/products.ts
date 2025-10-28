import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("🚀 ~ GET ~ products ~ params:", params);

  var allItems: Array<Product> = [
    {
      id: "1cbaccdf-eb85-4132-b342-deccc2901f94",
      title: "Замок навесной",
      description: "Product description 1",
      unit: "шт",
      quantityInPack: 1,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: "8532f731-caea-4972-8287-acdb17d4a95d",
      categorySlug: "padlocks",
      colors: ["red", "blue"],
      image: "padlock-master-vline.png",
      slug: "padlock-master-vline",
    },
    {
      id: "b45d0bcd-9790-4839-809a-22f0c8231db1",
      title: "Product 2",
      description: "Product description 2",
      unit: "шт",
      quantityInPack: 10,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      categorySlug: "locks",
      colors: ["red", "blue", "green"],
      image: "wtb-padloc-grips.png",
      slug: "wtb-padloc-grips",
    },
    {
      id: "6025ca4c-61b8-4324-a6f2-52b6b348926c",
      title: "Product 3",
      description: "Product description 3",
      unit: "шт",
      quantityInPack: 1,
      price: 100,
      whsPrice1: 90,
      whsPrice2: 80,
      categoryId: "3b7ef178-3b3d-49a1-9851-5042ec9da1d2",
      categorySlug: "locks",
      colors: ["brown", "blue", "bronze"],
      image: "padoc-drive-board.png",
      slug: "padoc-drive-board",
    },
  ];

  // TODO: query database for Categories
  return new Response(JSON.stringify(allItems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
