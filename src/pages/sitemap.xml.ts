import type { APIRoute } from 'astro';
import { rooms, roomGroups } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  const pages = ['', 'accommodations-2/', ...roomGroups.map((g) => g.slug + '/'),
    ...rooms.map((r) => `accommodation/${r.slug}/`), 'about/', 'gallery/', 'swimming-pool/',
    'restaurant-and-pool-bar/', 'prices/', 'offers/', 'contact/', 'privacy-policy-2/'];
  const url = (p: string) => new URL('/' + p, site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((p) => ['', 'el/'].map((l) => `  <url><loc>${url(l + p)}</loc><xhtml:link rel="alternate" hreflang="en" href="${url(p)}"/><xhtml:link rel="alternate" hreflang="el" href="${url('el/' + p)}"/></url>`)).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
