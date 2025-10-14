import type { APIRoute } from 'astro'

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  console.log("🚀 ~ GET ~ params:", params)
  
  // TODO: query database for Categories
  
  return new Response(
    JSON.stringify(
      [
        {
          id: 123,
          //title: "Test 1",
          //description: 'Description 1',
          //image: 'https://via.placeholder.com/150',
          slug: 'test-1',
          //parent: '',
        }, 
        {
          "id": 456,
          //title: "Test 2",
          //description: 'Description 2',
          //image: 'https://via.placeholder.com/150',
          slug: 'test-2',
          //parent: '',
        }
      ]
    ), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}