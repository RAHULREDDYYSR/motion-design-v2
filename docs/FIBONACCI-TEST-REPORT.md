# Fibonacci reel: integration test

Date: 2026-10-15. This is a completed local HyperFrames production with disclosed
fallbacks. It does **not** establish that Rive, Gemini, or the optional MCP servers
work end to end in this environment.

## Delivered

- `output/fibonacci-reel.mp4`: approximately 47 seconds, vertical 1080×1920,
  30 fps, H.264, AAC stereo 48 kHz; six scenes, narration, captions, original music.
- `output/fibonacci-reel.srt`: 108 source words imported and exported by the
  actual HyperFrames `transcribe` tool in transcript-import mode.
- `output/fibonacci-preview.jpg`: six-frame visual overview.
- `output/fibonacci-source.zip`: editable project, vector/audio assets,
  narration/timing, reproducibility scripts, and package manifests. No `.env`,
  credentials, model weights, node_modules, or caches are included.

## Actual results

| Component | Result | Evidence / limits |
| --- | --- | --- |
| HyperFrames CLI 0.8.161 | PASS | Created and assembled six independent sub-compositions using the bundled workflow scripts. |
| Official HyperFrames skills | PASS for project discovery and use | Used the vendored `faceless-explainer`, core, animation, CLI, editorial-forest preset, captions, and assembly. Codex plugin cache activation remains unavailable; discovering skills is not a live MCP connection. |
| Static lint | PASS | Eight HTML files; 0 errors, 0 warnings. |
| Runtime and local assets | PASS | Browser ran; 0 runtime errors or failed asset requests at 2, 7, 12, 22, 30, 44 seconds. No render-time remote assets. |
| Layout | PASS | 0 errors, warnings, or informational findings at those six timeline samples. |
| Contrast | PASS | All 66 checked text samples pass; 0 findings. |
| Motion | Visual verification | Inspected a midpoint in every mounted scene. No custom motion-assertion sidecars were supplied; the empty motion-assertion result is not represented as a separate motion test. Paused GSAP timelines rendered correctly. |
| Local speech | PASS | Kokoro-ONNX 0.6.0, v1.0 FP16, af_heart; six WAVs generated. Model-derived phoneme boundaries map to all 108 words with count assertions. |
| Caption import/export | PASS | `hyperframes transcribe transcript-aligned.json --to srt` returned `ok:true`, `wordCount:108`. Embedded captions use the same alignment. |
| Whisper recognition | UNAVAILABLE | Actual audio transcription attempted with tiny.en, both runtime installation allowed and disallowed. CLI returned `ok:false`, `skipped:true`, `reason:whisper_unavailable`. No independent ASR transcript was produced. |
| Gemini | BLOCKED | Credential is saved locally, ignored and owner-only. API/model check fails because the managed proxy blocks the Gemini host. Credential validity and Gemini generation remain unverified. No paid Gemini media request completed. |
| Rive CLI | UNAVAILABLE | Version probe cannot execute a Rive binary. Official download host remains blocked. No RML was compiled and no `.riv` output was fabricated. This reel uses locally authored SVGs instead. |
| Rive desktop MCP | UNAVAILABLE | No server listening on local port 9791; this Linux environment has no supported local Rive desktop editor. |
| Hosted HyperFrames MCP | BLOCKED / UNAUTHENTICATED | Configured disabled; no HeyGen OAuth login. Endpoint probe failed with proxy HTTP 403. No live MCP tool calls could be made. |
| Subscription usage | UNKNOWN | `hyperframes usage --json` returned `reason:no_subscription_login`; no allowance or cost was inferred. |
| Local rendering | PASS | Actual 1,407-frame production render completed in 119.7 seconds; screenshot capture, software GPU, one worker. |
| Encoded media | PASS | FFprobe confirms H.264 1080×1920 / 30 fps and AAC stereo 48 kHz. Full FFmpeg decode completed; no black intervals were detected. A decoded scene was compared with the preview. |
| Audio delivery | PASS | Two-pass loudness normalization targets −16 LUFS / −1.5 dBTP. Final decoded-audio analysis confirms these levels. |
| Studio preview | PASS | Persistent Studio starts successfully using project-local XDG state; status confirms it is running, and its HTTP route returns 200. |
| Existing transcript tests | PASS | `npm test` passes. These test transcript normalization, not live service availability. |
| Credential handling | PASS | No credential appears in HTML or media. `.env` stays outside the deliverables. |

## Reproduce

```bash
npm run fibonacci:check
npm run fibonacci:preview
npm run fibonacci:render
```

Project: `videos/fibonacci-nature`. Source generation and local voice regeneration
are documented in its README. The original blank `video/` starter is intact.
The final render command includes two-pass audio normalization.

The managed environment requires network-enabled shell execution for Chromium's
local server connection. The initial browser startup failure in a network-isolated
shell was resolved that way. Administrative user-level telemetry/history writes
remain unavailable, without preventing local checks or rendering.

## Editorial accuracy

The reel explicitly limits Fibonacci claims to some natural patterns. It does not
claim all animals, humans, DNA, Earth, or galaxies obey Fibonacci. The sunflower
count pair and galaxy are labeled schematic/illustrative. Scientific references
and asset provenance are in `videos/fibonacci-nature/SOURCES.md`.

The requested Rive → HyperFrames integration and live MCP operations still need
a supported Rive installation, an allowed network policy, and the relevant MCP
authentication/desktop prerequisites before they can receive a PASS.
