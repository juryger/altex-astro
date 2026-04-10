import { defineMiddleware } from "astro/middleware";
import { NotFoundError, ServerError } from "./core/errors";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const response = await next();

    // Set CORS headers
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://www.altexweb.ru",
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    // Handle preflight requests
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: response.headers,
      });
    }

    return response;
  } catch (e) {
    console.error("⚙️ ~ middlewear ~ exception occured:", e);
    if (e instanceof NotFoundError) {
      return context.rewrite("/404");
    } else if (e instanceof ServerError) {
      return context.rewrite("/500");
    }
    throw e;
  }
});
