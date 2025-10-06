import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
  return new Response(
    // TODO: query database for Categories
    JSON.stringify(
      [
        {
          id: '12345',
          value: 'Test 1'
        }, 
        {
          id: '64789',
          value: 'Test 2'
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