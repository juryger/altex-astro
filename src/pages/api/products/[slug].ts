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
  console.log("🚀 ~ GET ~ product ~ params:", params)
  const { slug } = params;

  // TODO: query database for category by slug

  if (!slug || slug !== 'product-1') {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(
    JSON.stringify({
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
      }
    ), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}