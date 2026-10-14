// Upload only changed files of dist/ to DNHOST by FTP (lftp), gently, so the host firewall doesn't block us.
//
// A manifest of hashes on the server (.deploy-manifest.json) says what is already there.
// Photos/thumbnails are hashed from their SOURCE file in public/, so the same photo always has the
// same hash no matter which computer built it.
//
// env: FTP_SERVER FTP_USERNAME FTP_PASSWORD FTP_DIR (e.g. /httpdocs/new/)
//      DEPLOY_MODE = deploy (default) | seed  (seed = only write the manifest, after a manual WinSCP upload)
//      MAX_FILES   = refuse to upload more than this many files at once (default 150) – use WinSCP + seed instead
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, posix } from 'node:path';
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';

const { FTP_SERVER, FTP_USERNAME, FTP_PASSWORD } = process.env;
const DIR = (process.env.FTP_DIR || '').replace(/\/?$/, '/');
const MODE = process.env.DEPLOY_MODE || 'deploy';
const MAX_FILES = Number(process.env.MAX_FILES || 150);
if (!FTP_SERVER || !FTP_USERNAME || !FTP_PASSWORD || DIR === '/') {
  console.error('Missing FTP_SERVER / FTP_USERNAME / FTP_PASSWORD / FTP_DIR');
  process.exit(1);
}
const MANIFEST = '.deploy-manifest.json';
const TMP = '.deploy-tmp';

const settings = [
  'set ftp:ssl-force true', 'set ftp:ssl-protect-data true', 'set ssl:verify-certificate no',
  'set ftp:passive-mode true', 'set net:timeout 30', 'set net:max-retries 4', 'set net:reconnect-interval-base 10',
  'set net:connection-limit 1', 'set cmd:fail-exit true',
];
function lftp(cmds, { allowFail = false } = {}) {
  const script = [...settings, `open -u "${FTP_USERNAME}" --env-password ${FTP_SERVER}`, ...cmds, 'bye'].join('\n');
  mkdirSync(TMP, { recursive: true });
  const file = join(TMP, 'cmds.lftp');
  writeFileSync(file, script);
  try {
    return execFileSync('lftp', ['-f', file], {
      stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, LFTP_PASSWORD: FTP_PASSWORD }, timeout: 20 * 60 * 1000,
    }).toString();
  } catch (e) {
    if (allowFail) return null;
    console.error(String(e.stderr || e.message).replaceAll(FTP_PASSWORD, '***'));
    throw new Error('lftp failed');
  }
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

/** Photos & thumbnails: hash of the original in public/media (+ size), not of the built bytes. */
async function hashFor(rel) {
  const m = rel.match(/^_img\/(\d+)\/(media\/.+)\.webp$/);
  if (m) {
    for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG']) {
      const src = join('public', m[2] + ext);
      if (existsSync(src)) return 'src:' + m[1] + ':' + sha1(await readFile(src));
    }
  }
  if (/^media\//.test(rel) && existsSync(join('public', rel))) return 'src:' + sha1(await readFile(join('public', rel)));
  return sha1(await readFile(join('dist', rel)));
}

// 1. local state
const local = {};
for await (const f of walk('dist')) {
  const rel = relative('dist', f).split('\\').join('/');
  local[rel] = await hashFor(rel);
}

if (MODE === 'seed') {
  await mkdir(TMP, { recursive: true });
  await writeFile(join(TMP, MANIFEST), JSON.stringify(local));
  lftp([`put "${TMP}/${MANIFEST}" -o "${DIR}${MANIFEST}"`]);
  console.log(`seed: manifest with ${Object.keys(local).length} files written – server marked as up to date`);
  process.exit(0);
}

// 2. what the server has
await mkdir(TMP, { recursive: true });
lftp([`get -O ${TMP} ${DIR}${MANIFEST}`], { allowFail: true });
const remote = existsSync(join(TMP, MANIFEST)) ? JSON.parse(await readFile(join(TMP, MANIFEST), 'utf8')) : null;
if (!remote) {
  console.error('No manifest on the server. Upload the "site-dist" artifact of this run with WinSCP, then run the workflow with mode "seed".');
  process.exit(1);
}

const changed = Object.keys(local).filter((f) => local[f] !== remote[f]);
const removed = Object.keys(remote).filter((f) => !(f in local));
console.log(`files: ${Object.keys(local).length}, changed/new: ${changed.length}, removed: ${removed.length}`);
for (const f of changed.slice(0, 40)) console.log('  ↑ ' + f);

if (changed.length > MAX_FILES) {
  console.error(`${changed.length} files changed – too many for FTP from GitHub (the host firewall may block us).
Download the "site-dist" artifact of this run, upload it with WinSCP to ${DIR}, then run the workflow with mode "seed".`);
  process.exit(1);
}

// 3. upload, one file at a time with a short pause
if (changed.length) {
  const dirs = [...new Set(changed.map((f) => posix.dirname(f)).filter((d) => d !== '.'))];
  lftp([
    ...dirs.map((d) => `mkdir -p -f "${DIR}${d}"`),
    ...changed.flatMap((f) => [`put "dist/${f}" -o "${DIR}${f}"`, 'sleep 0.4']),
  ]);
  console.log(`uploaded ${changed.length} files`);
}

// 4. delete files that are no longer part of the site (only files we uploaded before)
if (removed.length) {
  lftp(removed.flatMap((f) => [`rm -f "${DIR}${f}"`, 'sleep 0.2']), { allowFail: true });
  console.log(`deleted ${removed.length} old files`);
}

// 5. manifest last, so an interrupted run simply repeats next time
await writeFile(join(TMP, MANIFEST), JSON.stringify(local));
lftp([`put "${TMP}/${MANIFEST}" -o "${DIR}${MANIFEST}"`]);
console.log('deploy complete');
