import { defineMiddleware } from "astro/middleware";
import { NotFoundError, ServerError } from "./core/errors";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // if (context.session) {
    //   console.log("⚙️ ~ middlewear ~ operates on session: %o", context.session);
    //   context.session.set("lastVisit", new Date());
    // }
    return await next();
  } catch (e) {
    console.log("⚙️ ~ middlewear ~ exception occured:", e);
    if (e instanceof NotFoundError) {
      return context.rewrite("/404");
    } else if (e instanceof ServerError) {
      return context.rewrite("/500");
    }
    throw e;
  }
});
