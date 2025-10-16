import type { APIRoute } from 'astro'

export const prerender = false;

/*
{
  id: number;
  title: string;
  description?: string;
  unit?: string;
  quantityInPack?: number;
  price: number;
  whsPrice1: number;
  whsPrice2: number
  category: string;
  colors: Array<string>;
  image: string;
  slug: string;
}
*/
export const GET: APIRoute = async ({ params, request }) => {
  console.log("🚀 ~ GET ~ products ~ params:", params)
  
  // TODO: query database for Categories
  
  return new Response(
    JSON.stringify([
      {
        id: 1,
        title: "Замок навесной",
        description: 'Product description 1',
        unit: 'шт',
        quantityInPack: 1,
        price: 100,
        whsPrice1: 90,
        whsPrice2: 80,
        category: 'padlocks',
        colors: ['red', 'blue'],
        image: 'padlock-master-vline.png',
        slug: 'padlock-master-vline',
      }, {
        id: 2,
        title: "Product 2",
        description: 'Product description 2',
        unit: 'шт',
        quantityInPack: 10,
        price: 100,
        whsPrice1: 90,
        whsPrice2: 80,
        category: 'locks',
        colors: ['red', 'blue', 'green'],
        image: 'wtb-padloc-grips.png',
        slug: 'wtb-padloc-grips',
      }, {
        id: 3,
        title: "Product 3",
        description: 'Product description 3',
        unit: 'шт',
        quantityInPack: 1,
        price: 100,
        whsPrice1: 90,
        whsPrice2: 80,
        category: 'locks',
        colors: ['brown', 'blue', 'bronze'],
        image: 'padoc-drive-board.png',
        slug: 'padoc-drive-board',
      },
    ]), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}