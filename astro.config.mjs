// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL is set by the deploy workflow: the preview subdomain or the live domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.anixi-apartments.gr',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
