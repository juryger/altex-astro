import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema/operations/index.ts",
  out: "./drizzle/operations",
  dbCredentials: {
    url: "/Users/iuriig/Sources/altex-astro/db/operations.db",
  },
});
