// Gemini word_info annotations -> HyperFrames' seconds-based transcript array.
export function normalizeGeminiTranscript(interaction) {
  if (interaction.status !== 'completed') throw new Error('Transcription did not complete.');
  const words = [];
  for (const step of interaction.steps ?? []) {
    if (step.type !== 'model_output') continue;
    for (const content of step.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        if (annotation.type !== 'word_info') continue;
        const text = annotation.text?.trim();
        const start = seconds(annotation.start_offset);
        const end = seconds(annotation.end_offset);
        if (!text || end < start || (words.length && start < words.at(-1).start)) {
          throw new Error('Invalid or unordered word timestamps; transcript was not saved.');
        }
        words.push({ text, start, end });
      }
    }
  }
  if (!words.length) throw new Error('No word timestamps returned; transcript was not saved.');
  return words;
}

function seconds(value) {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+)?s$/.test(value)) {
    throw new Error('Missing or invalid word timestamp.');
  }
  const result = Number(value.slice(0, -1));
  if (!Number.isFinite(result)) throw new Error('Invalid word timestamp.');
  return result;
}
