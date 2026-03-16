/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "e2e/"],
    },
    alias: {
      "@/": new URL("..", import.meta.url).pathname,
      "@/web": new URL("../web", import.meta.url).pathname,
      "@/lib/domain": new URL("../lib/domain", import.meta.url).pathname,
      "@/lib/dal": new URL("../lib/dal", import.meta.url).pathname,
      "@/lib/cqrs": new URL("../lib/cqrs", import.meta.url).pathname,
    },
  },
});
