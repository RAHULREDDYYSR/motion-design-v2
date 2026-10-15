import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const [label, location] of [
  ['HyperFrames plugin', 'plugins/hyperframes/skills'],
  ['Project skills', '.agents/skills'],
]) {
  console.log(`${label}:`);
  for (const entry of readdirSync(join(root, location), { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(join(root, location, entry.name, 'SKILL.md'))) {
      console.log(`  ${entry.name}`);
    }
  }
}
