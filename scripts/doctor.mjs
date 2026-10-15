import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
let failures = 0;
function report(name, ready, detail, required = true) {
  console.log(`${ready ? 'OK' : required ? 'MISSING' : 'PENDING'} ${name}: ${detail}`);
  if (!ready && required) failures++;
}
function executable(name, command, args, required = true) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 15_000 });
  report(name, result.status === 0, result.status === 0 ? 'available' : 'not executable', required);
}
report('Node', Number(process.versions.node.split('.')[0]) >= 24, process.version);
for (const name of ['hyperframes', 'gsap', 'skills', '@google/genai']) {
  const path = join(root, 'node_modules', name, 'package.json');
  report(name, existsSync(path), existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')).version : 'run npm ci');
}
executable('FFmpeg', 'ffmpeg', ['-version']);
executable('FFprobe', 'ffprobe', ['-version']);
const browser = process.env.HYPERFRAMES_BROWSER_PATH || '/usr/bin/chromium';
executable('Chromium', browser, ['--version']);
const localRive = join(root, '.tools/bin/rive');
executable('Rive CLI', process.env.RIVE_CLI_PATH || (existsSync(localRive) ? localRive : 'rive'), ['--version']);
const skills = readdirSync(join(root, 'plugins/hyperframes/skills'), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(join(root, 'plugins/hyperframes/skills', entry.name, 'SKILL.md')));
report('HyperFrames bundle', skills.length === 21, `${skills.length} skills; project links installed, plugin-cache activation pending`);
report('Rive skill', existsSync(join(root, '.agents/skills/rive/SKILL.md')), 'community skill');
report('Composition', existsSync(join(root, 'video/index.html')), 'video/index.html');
const envPath = join(root, '.env');
report('.env', existsSync(envPath), existsSync(envPath) ? 'exists; contents hidden' : 'copy .env.example');
const ignored = spawnSync('git', ['check-ignore', '--quiet', '.env'], { cwd: root });
report('.env ignored', ignored.status === 0, ignored.status === 0 ? 'yes' : 'check .gitignore');
if (existsSync(envPath) && process.platform !== 'win32') {
  report('.env permissions', (statSync(envPath).mode & 0o077) === 0, 'owner-only access');
}
report('Gemini credential', Boolean(process.env.GEMINI_API_KEY?.trim()), process.env.GEMINI_API_KEY?.trim() ? 'present; not validated' : 'awaiting key', false);
console.log('Optional hosted MCP: requires HeyGen OAuth. Desktop Rive MCP: requires local Rive Desktop.');
process.exitCode = failures ? 1 : 0;
