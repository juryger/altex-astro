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
    resolve: {
      alias: {
        "@/": new URL("..", import.meta.url).pathname,
        "@/lib": new URL("../lib", import.meta.url).pathname,
      },
    },
  },
  integrations: [sitemap()],
  experimental: {
    liveContentCollections: true,
  },
});
