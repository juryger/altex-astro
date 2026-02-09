// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://altexweb.ru",
  adapter: node({
    mode: "standalone",
    experimentalDisableStreaming: true,
  }),
  image: {
    domains: ["altexweb.ru", "localhost:4321"],
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
    test: {
      globals: true, // Makes describe, it, expect available globally
      environment: "jsdom",
      setupFiles: ["./src/test-setup.ts"],
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
    },
  },
  integrations: [sitemap()],
  experimental: {
    liveContentCollections: true,
  },
});
