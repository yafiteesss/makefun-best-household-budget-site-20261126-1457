// Dompet Keluarga — entry "best household budget site" (Node 22, standard
// library only). The site is this directory's app/ folder: plain static files
// a browser opens at app/index.html (ES modules, CSS, no build step), with all
// its content held in its own files — nothing it runs, styles or shows loads
// over the network. This program hands it in: it copies app/ and screenshots/
// from beside this file to /output and writes /output/dossier.json, the summary
// the judge reads (the screenshots, the first load's files and bytes, and the
// source), using the vendored make.fun library. vendor/makefun-frontend.ts is
// left exactly as the kit shipped it: the scorer requires dossier.json to be
// byte for byte what its own copy of that library writes.
//
// The site itself is a household budget planner for an Indonesian family
// (Keluarga Santoso, November 2026, all figures in Rupiah): a dashboard, a
// per-category budget page, a transaction ledger with a working add form,
// a bills page with payable check-boxes, savings goals with deposits, a
// six-month report with SVG charts, budget calculators, and a savings guide.
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// A one-line build summary on stdout, so a local run shows what was handed in
// without opening the output folder.
function countFiles(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    total += statSync(path).isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

console.log(
  `Dompet Keluarga: ${countFiles(join(out, 'app'))} app files, ` +
    `${readdirSync(join(out, 'screenshots')).length} screenshots -> ${out}/dossier.json`,
);
