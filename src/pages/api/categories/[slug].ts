import type { APIRoute } from 'astro'

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  console.log("🚀 ~ GET ~ params:", params)
  const { slug } = params;

  // TODO: query database for category by slug

  if (!slug || slug !== 'test-1') {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(
    JSON.stringify({
        id: 123,
        //title: "Test 1",
        //description: 'Description 1',
        //image: 'https://via.placeholder.com/150',
        slug: 'test-1',
        //parent: '',
      }
    ), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}