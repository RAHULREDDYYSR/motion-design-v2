# Setup status — 2026-10-15

- Node packages installed and locked in `package-lock.json`.
- HyperFrames 0.8.161 and GSAP 3.15.0 installed.
- Google Gen AI JavaScript SDK 2.30.0 installed.
- Official HyperFrames plugin bundled locally with 21 published skills, upstream
  license, and a source manifest. Repository marketplace is configured. Actual
  `codex plugin add` failed because this environment's Codex plugin cache is
  read-only. Plugin activation is therefore disabled; the same skills are linked
  into `.agents/skills` for project discovery without duplicate storage. Start a
  fresh Codex session to discover them. After installing the plugin in a writable
  local Codex environment, remove only those 21 links and enable the plugin.
- Community Rive skill 0.6.0 installed under `.agents/skills/rive`.
- Vertical blank HyperFrames composition scaffolded under `video/`.
- `.env` created, populated with the user-supplied Gemini key, ignored by Git,
  owner-only. Contents are never printed.
- Rive CLI download blocked: the environment proxy rejects
  `https://releases.rive.app/cli/install.sh` with HTTP 403. No Rive binary is
  installed and no RML scene has been compiled. Permit that host in the managed
  environment network policy, then inspect and run the official installer using
  a supported project-local installation option. Do not substitute an unrelated
  npm package or claim Rive was installed.
- Gemini key supplied and saved in the ignored, owner-only `.env`. Authentication/model lookup remains unverified: the environment does not permit `generativelanguage.googleapis.com`. No paid audio was generated.
- Gemini narration and cloud transcription commands are wired. Timed transcript
  normalization is tested offline; paid API operations are not yet live-tested.
- Hosted HyperFrames MCP remains disabled pending HeyGen OAuth. Rive desktop MCP
  remains disabled because it needs a local macOS/Windows Rive desktop editor.
- Local Whisper/Parakeet weights are not installed. The HyperFrames transcription
  command is wired; install a supported engine/model before local transcription,
  or use `npm run transcribe:gemini` with the supplied Gemini credential.

Sources:
- https://rive.app/docs/cli/overview
- https://rive.app/downloads
- https://rive.app/docs/editor/ai/mcp
- https://github.com/heygen-com/hyperframes
- https://github.com/uianimation/rive-skill
- https://developers.openai.com/plugins/build/plugins

Verification completed:
- HyperFrames lint: 0 errors, 0 warnings.
- Runtime/layout/motion/contrast check: passed; 9 layout samples and 5/5 text checks.
- Rendered a 6-frame smoke MP4; FFprobe confirmed H.264, 1080x1920, 30 fps.
- Visually inspected the rendered frame.
- Imported a normalized two-word timed transcript through HyperFrames.
- Narration dry-run passed with requestSent=false.
- Offline transcript tests, configuration/lockfile checks, skill-link checks, and
  Git whitespace checks passed.
- npm skill inventory recognizes all 22 skills at project scope for Codex.
- Doctor reports the missing Rive binary. Gemini credential is now present; live validation remains blocked by network policy.

Nonfatal environment limits: HyperFrames cannot persist its user-level telemetry
configuration or history report in the read-only home/cache. The composition
checks and rendering completed despite those administrative warnings. Rendering
uses screenshot capture and software GPU on this machine.

Fibonacci production test completed on 2026-10-15: see
`docs/FIBONACCI-TEST-REPORT.md`. A complete six-scene reel now exercises local
HyperFrames, SVG/GSAP, Kokoro speech, captions, SRT import/export, and MP4 rendering.
Rive, Gemini and live MCP connections remain unavailable as documented. Studio's
state path is now project-local so background preview works in the read-only-home
environment. The existing blank `video/` project is retained.
