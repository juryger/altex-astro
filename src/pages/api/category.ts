import type { APIRoute } from 'astro'

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    // TODO: query database for Categories
    JSON.stringify(
      [
        {
          id: 12345,
          title: 'Test 1',
          image: 'https://via.placeholder.com/150',
          slug: 'test-1',
        }, 
        {
          id: 64789,
          title: 'Test 2',
          image: 'https://via.placeholder.com/150',
          slug: 'test-2',
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