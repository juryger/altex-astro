import { defineMiddleware } from "astro/middleware";
import { NotFoundError, ServerError } from "./utils/errors";

export const onRequest = defineMiddleware(async (context, next) => {
  try {    
    return await next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return context.rewrite("/404");
    }
    else if (e instanceof ServerError) {
      return context.rewrite("/500");
    }
    throw e;
  }
});