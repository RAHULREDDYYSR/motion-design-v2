import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY?.trim()) {
  console.error('Set GEMINI_API_KEY in .env first. No request was sent.');
  process.exitCode = 1;
} else {
  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';
    await client.models.get({ model });
    console.log(`Gemini authentication and model lookup succeeded: ${model}`);
  } catch (error) {
    console.error(`Gemini model lookup failed${Number.isInteger(error.status) ? ` (HTTP ${error.status})` : ''}. Check the key, model access, and network policy. No audio was generated.`);
    process.exitCode = 1;
  }
}
