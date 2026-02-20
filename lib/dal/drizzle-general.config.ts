import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/general/index.ts",
  out: "./drizzle/general",
  dbCredentials: {
    url: "/Users/iuriig/Sources/altex-astro/db/general.db",
  },
});
