// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://altexweb.ru',
  adapter: node({
    mode: 'standalone',
    experimentalDisableStreaming: true,
  }),
  image: {
    domains: ["altexweb.ru", "localhost:4321"],
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  experimental: {
    liveContentCollections: true,
  },
});