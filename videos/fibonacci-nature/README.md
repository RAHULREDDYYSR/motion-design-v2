# Fibonacci reel

A roughly 47-second English reel at 1080×1920 / 30 fps. Six independent editable
HTML compositions use paused GSAP timelines and locally bundled fonts, SVGs,
speech, and music. `SOURCES.md` documents the scientific limits and provenance.

From the repository root:

```bash
npm ci
npm run fibonacci:check
npm run fibonacci:preview
npm run fibonacci:render
```

The finished MP4 and SRT are in the repository's `output/`. The blank `video/`
starter is retained. Caption word timing is in `transcript-aligned.json` and
`audio_meta.json`. Edit `narration.json`, regenerate speech, and rebuild to change
the spoken content; editing text alone does not regenerate its audio.

```bash
npm run fibonacci:build
```

That command rebuilds the scenes, preset captions and root assembly from existing
`timing.json` and audio. It then removes render-time CDN dependencies and adjusts
the caption safe area and contrast. It does not invoke a paid service.

## Optional local speech regeneration

The Python utility is solely for speech and the procedural sound bed; it adds no
Python animation framework. This environment has the dependencies and models in
`work/`, which are intentionally untracked. To reproduce on another machine:

```bash
UV_CACHE_DIR=work/uv-cache uv venv work/speech-venv
UV_CACHE_DIR=work/uv-cache uv pip install --python work/speech-venv/bin/python -r scripts/requirements-fibonacci-audio.txt
mkdir -p work/models/kokoro
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.fp16.onnx -o work/models/kokoro/kokoro-v1.0.fp16.onnx
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin -o work/models/kokoro/voices-v1.0.bin
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=2 work/speech-venv/bin/python scripts/fibonacci-audio.py
npm run fibonacci:build
npm run fibonacci:check
npm run fibonacci:render
```

The current output uses this local fallback because the environment blocks the
Gemini host and Rive CLI download host. It is not a validated Rive → HyperFrames
integration. Optional MCP servers have no live authenticated connection here.

In this managed environment, Chromium's local server connection also requires
the shell tool's network-enabled execution permission. The finished composition
requests only local media and scripts during rendering.
