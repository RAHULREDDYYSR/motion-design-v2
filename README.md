# motion-design-v2

Rive scene authoring, HyperFrames reel assembly, GSAP animation, and Gemini speech.
The project uses Node.js 24+, npm, FFmpeg/FFprobe, and Chromium.

## Start

```bash
npm ci
npm run setup
npm run doctor
npm run codex
```

The initial dependencies are installed in this checkout. `npm ci` restores the
versions in `package-lock.json`; `setup` preserves an existing `.env`.

`.env` exists locally with an empty `GEMINI_API_KEY`. Add the key there, then run:

```bash
npm run gemini:check
```

This checks authentication/model access without generating paid audio. Credentials
are loaded by Node at runtime and never placed in the browser composition.
The API host `generativelanguage.googleapis.com` must be permitted by the environment.

## Work on a reel

```bash
npm run preview
npm run lint
npm run check
npm run render
```

`video/` is an intentionally blank 1080x1920 composition. `npm run render` writes
`output/reel.mp4`. Its static root has `data-no-timeline`; remove that marker when
adding a seekable animation. GSAP is copied locally from the pinned dependency,
so the composition does not depend on a CDN at render time.

Keep Rive sources in `rive/`, imported scenes and graphics in `video/assets/`,
scratch work in `work/`, and final renders in `output/`. Assets and video source
are versioned; caches, `.env`, node_modules, and final output are ignored.

## Narration and captions

Write a UTF-8 narration file, then run:

```bash
npm run narrate -- script.txt --style "Warm, clear, natural pace"
npm run transcribe:gemini -- video/assets/narration.wav
npm run transcribe -- video/transcript.json
```

The first command uses HyperFrames' bundled Gemini adapter to save WAV audio.
The second sends the audio to Gemini Transcribe in verbatim word-timestamp mode,
then saves HyperFrames-compatible `{text,start,end}` entries to
`video/transcript.json`. Temporary local audio and the uploaded Gemini file are
cleaned up. The third imports that transcript and patches existing caption HTML;
it does not create a caption design in a blank composition. Ask Codex to add a
caption treatment through the HyperFrames skills.

The `.env.example` defaults are `gemini-3.8-flash-lite-tts`, `Kore`, and
`gemini-3.5-transcribe`. Change them for a different supported voice/model.
`npm run narrate -- script.txt --dry-run` validates the input without an API call.
Actual Gemini generation/transcription awaits a real key and has not been
live-tested in this checkout. `npm test` checks timestamp normalization offline.

`npm run transcribe -- media.mp4` instead uses local HyperFrames ASR, which needs
a separately installed Whisper/Parakeet engine and model. Those weights are not
installed here; they are unnecessary for the Gemini transcription route.

## Rive CLI

**Pending:** the managed environment's network policy rejects the official
`releases.rive.app` download host with HTTP 403. No official Rive CLI binary is
installed yet. Enable that host in the environment's network settings before
continuing installation. The downloader is:

```bash
npm run setup:rive:download
```

It saves the official installer to `work/rive-install.sh` without executing it.
Inspect its supported options and choose a project-local installation before
running it. The wrapper uses `.tools/bin/rive`, an exported `RIVE_CLI_PATH`, or
`rive` on PATH. After installing:

```bash
npm run rive -- --version
npm run rive -- create rive/scene
```

Use the CLI-generated RML/project instructions. Export SVG artwork or rendered
scenes into `video/assets/`; direct `.riv` playback requires a custom seek adapter.

Official installation: https://rive.app/downloads

## Codex skills, plugin, and MCP

`AGENTS.md` defines the production workflow. All 21 official HyperFrames skills
are vendored in `plugins/hyperframes/skills` and linked into `.agents/skills`.
A community Rive skill is also installed there. Verify with `npm run skills:list`
or `npm exec -- skills list --agent codex`. Start a new Codex session to discover
the skills; this does not change the tools in an already-running chat.

The official HyperFrames plugin payload and license are included, with source
hashes in `plugins/hyperframes/SOURCE.json`. Its repository marketplace is in
`.agents/plugins/marketplace.json`; `.codex/config.toml` has the project settings.
`npm run codex` supplies the marketplace's current absolute path without changing
your Codex home.

**Plugin-cache activation is pending:** `codex plugin add` cannot create its cache
in this environment's read-only Codex home. Project skill discovery works through
the links instead. In a writable local Codex environment, install the plugin:

```bash
npm run codex -- plugin add hyperframes@motion-design-v2
```

After successful installation, remove only the 21 HyperFrames symlinks from
`.agents/skills` (keep `rive`), enable `hyperframes@motion-design-v2` in
`.codex/config.toml`, and restart Codex. Use one discovery method at a time.
Do not run standalone skill updates over the versioned plugin bundle.

The optional MCP configurations are present but disabled:

- HyperFrames hosted MCP: requires HeyGen OAuth, independently of the Gemini key.
- Rive desktop MCP: requires Rive Desktop on the same Mac/Windows machine;
  the Linux CLI does not expose that desktop endpoint.

Neither MCP is necessary for the local CLI workflow. Enable one only after its
prerequisites are met. See `docs/SETUP-STATUS.md` for the recorded setup status.

## Fibonacci production test

The completed six-scene project is in `videos/fibonacci-nature`. The MP4,
subtitle file, preview sheet, source archive and integration report are in
`output/`. See `docs/FIBONACCI-TEST-REPORT.md` for the actual tool results and
`videos/fibonacci-nature/SOURCES.md` for scientific references and media provenance.

```bash
npm run fibonacci:check
npm run fibonacci:preview
npm run fibonacci:render
```

This reel uses local authored SVGs and Kokoro narration because Rive and Gemini
are unavailable in this environment. The report does not mark those providers
or the optional MCP connections as tested successfully.
