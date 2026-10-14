// Preview in a sub-folder (e.g. https://www.anixi-apartments.gr/new/):
// when BASE_PATH is set, prefix every root-relative link/photo/video in the built HTML with it
// and replace .htaccess with a minimal one (the old-address redirects belong to the live root only).
// With no BASE_PATH (live site) this script does nothing.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
if (!BASE) process.exit(0);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const ATTR = /(\s(?:href|src|poster|action|data-hd|data-sd|data-full|data-mid)=["'])\/(?!\/)/g;
const CSSURL = /(url\(\s*['"]?)\/(?!\/)/g;
let n = 0;
for await (const f of walk('dist')) {
  if (!f.endsWith('.html')) continue;
  const html = await readFile(f, 'utf8');
  const out = html.replace(ATTR, `$1${BASE}/`).replace(CSSURL, `$1${BASE}/`);
  if (out !== html) { await writeFile(f, out); n++; }
}

await writeFile('dist/.htaccess', `# Preview copy under ${BASE}/ – no PHP, hidden from search engines
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 ${BASE}/404.html
<Files ".deploy-manifest.json">
  Require all denied
</Files>
<FilesMatch "\\.(php|phtml|phar|php\\d)$">
  Require all denied
</FilesMatch>
<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow"
  # pages: always ask the server for the latest version (edits show without a hard refresh)
  <FilesMatch "\\.(html|xml|txt)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  # build files have a unique name per version, so they can be kept for a year
  <If "%{REQUEST_URI} =~ m#/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
</IfModule>
`);
console.log(`base-path: prefixed ${BASE} in ${n} pages`);
