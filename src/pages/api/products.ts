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
    JSON.stringify(
      [
        {
          id: 1,
          title: "Product 1",
          description: 'Product description 1',
          unit: 'шт',
          quantityInPack: 1,
          price: 100,
          whsPrice1: 90,
          whsPrice2: 80,
          category: 'category-3',
          colors: ['red', 'blue'],
          image: 'https://via.placeholder.com/150',
          slug: 'product-1',
        }, 
        {
          id: 2,
          title: "Product 2",
          description: 'Product description 2',
          unit: 'шт',
          quantityInPack: 10,
          price: 100,
          whsPrice1: 90,
          whsPrice2: 80,
          category: 'category-3',
          colors: ['red', 'blue', 'green'],
          image: 'https://via.placeholder.com/150',
          slug: 'product-2',
        },
        {
          id: 3,
          title: "Product 3",
          description: 'Product description 3',
          unit: 'шт',
          quantityInPack: 1,
          price: 100,
          whsPrice1: 90,
          whsPrice2: 80,
          category: 'category-2',
          colors: ['brown', 'blue', 'bronze'],
          image: 'https://via.placeholder.com/150',
          slug: 'product-3',
        },
      ]
    ), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}