import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('video/assets/', root), { recursive: true });
copyFileSync(
  fileURLToPath(new URL('node_modules/gsap/dist/gsap.min.js', root)),
  fileURLToPath(new URL('video/assets/gsap.min.js', root)),
);
console.log('Local GSAP asset ready.');
