// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import boot from "@astroscope/boot";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://altexweb.ru",
  adapter: node({
    mode: "standalone",
    experimentalDisableStreaming: true,
  }),
  integrations: [boot()],
  image: {
    domains: ["altexweb.ru", "localhost:4321"],
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Need to keep it, otherwise build is failed
      alias: {
        "@/": new URL("..", import.meta.url).pathname,
        "@/web": new URL("../web", import.meta.url).pathname,
        "@/lib": new URL("../lib", import.meta.url).pathname,
        "@/lib/domain": new URL("../lib/domain", import.meta.url).pathname,
        "@/lib/dal": new URL("../lib/dal", import.meta.url).pathname,
        "@/lib/cqrs": new URL("../lib/cqrs", import.meta.url).pathname,
        "@/lib/email": new URL("../lib/email", import.meta.url).pathname,
      },
    },
  },
  experimental: {
    liveContentCollections: true,
  },
});
