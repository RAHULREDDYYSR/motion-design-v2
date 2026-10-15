import { existsSync, mkdirSync } from 'node:fs';
import { join, delimiter } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { invocation } from '../plugins/hyperframes/skills/hyperframes/scripts/plugin-cli.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));
const env = { ...process.env };
env.PATH = `${join(root, 'node_modules/.bin')}${delimiter}${env.PATH ?? ''}`;
env.npm_config_cache ??= join(root, 'work/npm-cache');
env.HYPERFRAMES_MEDIA_HOME ??= join(root, 'work/media');
env.XDG_CACHE_HOME ??= join(root, 'work/cache');
env.XDG_STATE_HOME ??= join(root, 'work/state');
if (!env.HYPERFRAMES_BROWSER_PATH && existsSync('/usr/bin/chromium')) {
  env.HYPERFRAMES_BROWSER_PATH = '/usr/bin/chromium';
}
mkdirSync(join(root, 'work'), { recursive: true });
mkdirSync(join(root, 'output'), { recursive: true });
const command = invocation(process.argv.slice(2), { env });
const result = spawnSync(command.command, command.args, {
  cwd: root, env: command.env, stdio: 'inherit', windowsHide: true,
});
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
