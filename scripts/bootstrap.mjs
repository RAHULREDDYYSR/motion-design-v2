import { constants, copyFileSync, chmodSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = new URL('../.env', import.meta.url);
if (!existsSync(target)) {
  copyFileSync(new URL('../.env.example', import.meta.url), target, constants.COPYFILE_EXCL);
  chmodSync(target, 0o600);
  console.log('Created .env with empty credential placeholders.');
} else {
  console.log('Existing .env preserved.');
}
const result = spawnSync(process.execPath, ['scripts/sync-assets.mjs'], { cwd: root, stdio: 'inherit' });
process.exitCode = result.status ?? 1;
