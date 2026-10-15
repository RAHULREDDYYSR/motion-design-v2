import { GoogleGenAI } from '@google/genai';
import { parseArgs } from 'node:util';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { normalizeGeminiTranscript } from './lib/transcript.mjs';

let client;
let uploaded;
let temporary;
try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      output: { type: 'string', short: 'o', default: 'video/transcript.json' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    console.log('Usage: npm run transcribe:gemini -- media.mp4 [-o video/transcript.json]');
  } else {
    if (positionals.length !== 1 || !existsSync(positionals[0])) throw new Error('Provide one existing audio or video file.');
    if (!process.env.GEMINI_API_KEY?.trim()) throw new Error('Set GEMINI_API_KEY in .env first. No request was sent.');
    mkdirSync('work', { recursive: true });
    temporary = mkdtempSync('work/transcribe-');
    const audio = join(temporary, 'audio.wav');
    // Bound extraction to the API timestamp mode's 30-minute limit; never trim
    // silently. ffprobe also fails early when the source has no readable audio.
    const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', resolve(positionals[0])], { encoding: 'utf8' }).trim());
    if (!Number.isFinite(duration) || duration <= 0 || duration > 1800) throw new Error('Use a recording between 0 and 30 minutes.');
    execFileSync('ffmpeg', ['-v', 'error', '-i', resolve(positionals[0]), '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', audio], { stdio: ['ignore', 'ignore', 'pipe'] });
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 120_000 } });
    uploaded = await client.files.upload({ file: audio, config: { mimeType: 'audio/wav' } });
    if (!uploaded.uri) throw new Error('Gemini audio upload returned no file URI.');
    const interaction = await client.interactions.create({
      model: process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-3.5-transcribe',
      input: [{ type: 'audio', uri: uploaded.uri, mime_type: 'audio/wav' }],
      generation_config: { transcription_config: { mode: { type: 'verbatim', timestamp_granularities: ['word'] } } },
      store: false,
    });
    const words = normalizeGeminiTranscript(interaction);
    const output = resolve(values.output);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(words, null, 2) + '\n');
    console.log(`Saved ${words.length} timed words: ${output}`);
    console.log('Import with: npm run transcribe -- ' + JSON.stringify(output));
  }
} catch (error) {
  const secret = process.env.GEMINI_API_KEY;
  const message = String(error.message ?? error);
  console.error(secret ? message.split(secret).join('[redacted]') : message);
  process.exitCode = 1;
} finally {
  if (uploaded?.name) {
    try { await client.files.delete({ name: uploaded.name }); }
    catch { console.error('Temporary Gemini upload cleanup failed; remove the uploaded file from your Gemini account.'); }
  }
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
