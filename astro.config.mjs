// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: set `site` once the domain is confirmed (needed for canonical URLs and sitemap)
  vite: {
    plugins: [tailwindcss()],
  },
});
