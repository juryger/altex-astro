import type { APIRoute } from 'astro'

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  console.log("🚀 ~ GET ~ categories ~ params:", params)
  
  // TODO: query database for Categories
  
  return new Response(
    JSON.stringify(
      [
        {
          id: 1,
          title: "Замки",
          description: 'Замкковая фурнитура',
          image: 'http://localhost:4321/public/categories/locks.png',
          slug: 'locks',
          parent: null,
        }, 
        {
          id: 2,
          title: "Category 2",
          description: 'Category description 2',
          image: 'https://via.placeholder.com/150',
          slug: 'category-2',
          parent: null,
        },
        {
          id: 3,
          title: "Sub-category 1.1 of Category 1",
          description: 'Category description 3',
          image: 'https://via.placeholder.com/150',
          slug: 'category-3',
          parent: 'category-1',
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