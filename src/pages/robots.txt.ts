import type { APIRoute } from 'astro';

// The preview copy (PREVIEW=1) must never appear in Google.
export const GET: APIRoute = ({ site }) => {
  const preview = process.env.PREVIEW === '1';
  const body = preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
