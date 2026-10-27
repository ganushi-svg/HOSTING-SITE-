// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // TODO: set `site` once the domain is confirmed (needed for canonical URLs and sitemap)
  // Pages stay static; only routes that opt out of prerendering (the enquiry API) run on Vercel.
  adapter: vercel(),
  env: {
    schema: {
      // Read at runtime on the server only. Set both in Vercel → Project → Settings → Environment Variables.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Must be an address on a domain verified in Resend, e.g. "Segments Cloud <website@segments.ae>".
      RESEND_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
