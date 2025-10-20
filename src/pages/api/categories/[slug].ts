import type { APIRoute } from 'astro'

export const prerender = false;

export const GET: APIRoute = async ({ params/*, request*/ }) => {
  console.log("🚀 ~ GET ~ category ~ params:", params)
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
        id: 1,
        title: "Замковая фурнитура",
        description: 'Замкки, личинки, проушины и прочее',
        image: 'http://localhost:4321/public/categories/locks.png',
        slug: 'locks',
        parent: null,
      }
    ), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}