import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { synthesizeGemini } from '../plugins/hyperframes/skills/media-use/audio/scripts/lib/gemini-tts.mjs';

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      output: { type: 'string', short: 'o', default: 'video/assets/narration.wav' },
      style: { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    console.log('Usage: npm run narrate -- script.txt [-o video/assets/narration.wav] [--style "Warm, clear"] [--dry-run]');
  } else {
    if (positionals.length !== 1) throw new Error('Provide exactly one narration text file. Use --help for usage.');
    const text = readFileSync(positionals[0], 'utf8').trim();
    if (!text) throw new Error('The narration script is empty.');
    const model = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';
    const voiceId = process.env.GEMINI_VOICE || 'Kore';
    const wavAbs = resolve(values.output);
    if (values['dry-run']) {
      console.log(JSON.stringify({ model, voice: voiceId, characters: text.length, output: wavAbs, requestSent: false }, null, 2));
    } else {
      if (!process.env.GEMINI_API_KEY?.trim()) throw new Error('Set GEMINI_API_KEY in .env before generating narration.');
      const result = await synthesizeGemini({ text, model, voiceId, style: values.style, wavAbs });
      if (!result.ok) throw new Error(result.error);
      console.log(`Saved narration: ${wavAbs}`);
    }
  }
} catch (error) {
  const secret = process.env.GEMINI_API_KEY;
  const message = String(error.message ?? error);
  console.error(secret ? message.split(secret).join('[redacted]') : message);
  process.exitCode = 1;
}
