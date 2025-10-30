import type { APIRoute } from "astro";
import type { Product } from "../../core/models/product";

export const prerender = false;

export const GET: APIRoute = async ({ params /*, request*/ }) => {
  console.log("🚀 ~ GET ~ products ~ params:", params);

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

  // TODO: query database for Categories
  return new Response(JSON.stringify(allItems), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
