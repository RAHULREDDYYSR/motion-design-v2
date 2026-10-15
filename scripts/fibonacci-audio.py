"""Local fallback narration and original quiet tonal bed; no cloud credentials.

Run with work/speech-venv/bin/python after installing kokoro-onnx==0.6.0,
soundfile, and the upstream model-files-v1.1 FP16 model and voice archive.
Word boundaries come from model phoneme durations, not guessed reading speed.
This is synthesis alignment, not an independent speech-recognition transcript.
"""
from pathlib import Path
import json
import re
import math
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'videos/fibonacci-nature'
MODEL = ROOT / 'work/models/kokoro'
options = ort.SessionOptions()
options.log_severity_level = 3
options.intra_op_num_threads = 2
options.inter_op_num_threads = 1
session = ort.InferenceSession(str(MODEL / 'kokoro-v1.0.fp16.onnx'), options,
                              providers=['CPUExecutionProvider'])
kokoro = Kokoro.from_session(session, str(MODEL / 'voices-v1.0.bin'))
assert kokoro.has_timings, 'Duration-reporting model required'
scenes = json.loads((PROJECT / 'narration.json').read_text())
meta = {'provider':'kokoro-onnx', 'model':'Kokoro-82M v1.0 FP16',
        'voice':'af_heart', 'alignment':'model phoneme durations; not ASR',
        'voices':[], 'bgm':None, 'sfx':[]}
start = 0.0
for i, scene in enumerate(scenes, 1):
    wav, sr, timings = kokoro.create_timed(scene['text'], voice='af_heart',
        speed=1.04, lang='en-us', sentence_pause=0.19, clause_pause=0.09)
    groups, current = [], []
    for t in timings:
        if t.phoneme.isspace():
            if current:
                groups.append(current)
                current = []
        else:
            current.append(t)
    if current:
        groups.append(current)
    tokens = scene['text'].split()
    assert len(groups) == len(tokens), (scene['id'], len(groups), len(tokens))
    lead = 0.18
    words = []
    for token, phonemes in zip(tokens, groups):
        # Ignore punctuation durations for the spoken-word endpoint.
        spoken = [t for t in phonemes if re.search(r'[^.,!?;:—]',t.phoneme)] or phonemes
        words.append({'text':token, 'start':round(spoken[0].start+lead,4),
                      'end':round(spoken[-1].end+lead,4)})
    duration = math.ceil((len(wav)/sr + lead + 0.35)*30)/30
    if i == len(scenes):
        duration += 0.65
    padded = np.pad(wav, (round(lead*sr), max(0,round(duration*sr)-len(wav)-round(lead*sr))))
    path = f'assets/voice/{scene["id"]}.wav'
    sf.write(PROJECT/path, padded, sr, subtype='PCM_16')
    scene.update(duration=round(duration,6), start=round(start,6), words=words)
    meta['voices'].append({'frame':i,'path':path,'words':words,
                           'duration_s':duration,'provider':'kokoro-local'})
    (PROJECT/f'assets/voice/{scene["id"]}.phonemes.json').write_text(
        json.dumps([vars(t) for t in timings],indent=2))
    start += duration
    print(f'{scene["id"]}: {duration:.2f}s; {len(words)} speech-aligned words', flush=True)

# A sparse pentatonic bell motif over a soft root/fifth. Original procedural score.
sr = 24000
t = np.arange(round(start*sr))/sr
bed = np.zeros(len(t))
for freq, amp in [(130.8128,.018),(196.0,.012),(261.6256,.008)]:
    bed += amp*np.sin(2*np.pi*freq*t) * (0.7+0.3*np.sin(2*np.pi*t/11)**2)
notes = [523.251,659.255,783.991,987.767,783.991,659.255,587.330,523.251]
for k, at in enumerate(np.arange(.6,start-1,1.62)):
    idx = round(at*sr)
    u = np.arange(min(round(3*sr),len(t)-idx))/sr
    env = (1-np.exp(-u*35))*np.exp(-u*2.8)
    bell = np.sin(2*np.pi*notes[k%len(notes)]*u) + .18*np.sin(2*np.pi*notes[k%len(notes)]*2*u)
    bed[idx:idx+len(u)] += .045*env*bell
fade = np.minimum(1,t/1.3)*np.minimum(1,(start-t)/2)
sf.write(PROJECT/'assets/tonal-bed.wav', bed*fade, sr, subtype='PCM_16')
meta['bgm']={'path':'assets/tonal-bed.wav','volume':0.4,'provenance':'original procedural score'}
(PROJECT/'audio_meta.json').write_text(json.dumps(meta,indent=2))
(PROJECT/'timing.json').write_text(json.dumps({'fps':30,'duration':round(start,6),'scenes':scenes},indent=2))
print(f'Total: {start:.2f}s',flush=True)
