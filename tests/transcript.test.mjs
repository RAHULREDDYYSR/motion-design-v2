import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGeminiTranscript } from '../scripts/lib/transcript.mjs';

const response = annotations => ({
  status: 'completed',
  steps: [{ type: 'model_output', content: [{ type: 'text', annotations }] }],
});
const word = (text, start_offset, end_offset) => ({ type: 'word_info', text, start_offset, end_offset });

test('converts documented duration strings to seconds and preserves zero', () => {
  assert.deepEqual(normalizeGeminiTranscript(response([
    { type: 'citation', text: 'irrelevant' },
    word('Hello', '0s', '0.450s'), word('world', '0.500s', '0.850s'),
  ])), [{ text: 'Hello', start: 0, end: 0.45 }, { text: 'world', start: 0.5, end: 0.85 }]);
});
test('rejects missing timestamps instead of fabricating caption timing', () => {
  assert.throws(() => normalizeGeminiTranscript(response([word('Hello', undefined, '1s')])));
});
test('rejects reversed intervals and unordered word output', () => {
  assert.throws(() => normalizeGeminiTranscript(response([word('Hello', '2s', '1s')])));
  assert.throws(() => normalizeGeminiTranscript(response([word('one', '2s', '3s'), word('two', '1s', '2s')])));
});
test('rejects incomplete responses and plain text without word annotations', () => {
  assert.throws(() => normalizeGeminiTranscript({ status: 'in_progress' }));
  assert.throws(() => normalizeGeminiTranscript(response([])));
});
