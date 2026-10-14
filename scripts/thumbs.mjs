// After `astro build`: make small WebP copies of every uploaded photo (used for cards, grids, banners)
// dist/media/x/y.jpg -> dist/_img/480/media/x/y.webp and dist/_img/960/media/x/y.webp
// Also shrinks any oversized original (e.g. a 6000px phone photo uploaded in the editor) to 2400px.
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, dirname, relative, extname } from 'node:path';
import sharp from 'sharp';

const DIST = 'dist';
const MEDIA = join(DIST, 'media');
const WIDTHS = [480, 960];
const MAX_ORIGINAL = 2400;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let n = 0;
for await (const file of walk(MEDIA)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const rel = relative(DIST, file).replace(/\\/g, '/');
  const meta = await sharp(file).metadata();
  for (const w of WIDTHS) {
    const out = join(DIST, '_img', String(w), rel.replace(/\.(jpe?g|png|webp)$/i, '.webp'));
    await mkdir(dirname(out), { recursive: true });
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  }
  if ((meta.width ?? 0) > MAX_ORIGINAL || (meta.height ?? 0) > MAX_ORIGINAL) {
    const buf = await sharp(file).rotate().resize({ width: MAX_ORIGINAL, height: MAX_ORIGINAL, fit: 'inside' })
      .toFormat(extname(file).toLowerCase() === '.png' ? 'png' : 'jpeg', { quality: 82 }).toBuffer();
    await sharp(buf).toFile(file);
  }
  n++;
}
console.log(`thumbs: ${n} photos processed`);
