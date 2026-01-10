import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/catalog.ts",
  out: "./drizzle/catalog",
  dbCredentials: {
    url: "/Users/iuriig/Sources/altex-astro/db/catalog.db",
  },
});
