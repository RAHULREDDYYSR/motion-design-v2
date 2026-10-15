# Motion Design Project

## Stack and layout

Use Rive CLI for vector artwork and reusable animation scenes; HyperFrames and
GSAP assemble the final reel. Use Gemini for narration. Do not add Manim or a
tool called MyPython. Node.js 24+ is required for this project's
environment-file and proxy flags).

- `rive/`: Rive CLI projects and their editable sources.
- `video/`: the HyperFrames project, default 1080x1920 at 30 fps.
- `video/assets/`: imported SVGs, rendered Rive scenes, narration, and footage.
- `scripts/`: local setup and media commands.
- `work/`: disposable downloads, caches, and verification artifacts.
- `output/`: final renders, ignored by Git.

## Codex skills and plugin

The official HyperFrames plugin is vendored at `plugins/hyperframes` and registered
in the repository marketplace. Its skills are discoverable through project-local
symlinks in `.agents/skills`; plugin-cache activation is disabled until the Codex
cache is writable, so do not load both copies simultaneously. Read
`plugins/hyperframes/skills/hyperframes/SKILL.md` first for HyperFrames work, then
the relevant domain skills. Follow its plugin launcher and installation rules;
do not install duplicate HyperFrames skills or silently update this
versioned bundle. Its 21 published skills and upstream license are included.

Use `.agents/skills/rive/SKILL.md` for Rive-specific work (community guidance).
Rive's official CLI reference remains authoritative: run `npm run rive -- --help`
and inspect its generated project instructions before writing RML. Never invent
RML schema fields or generate a runtime binary by hand.

## Workflow

Keep Rive source editable. Start with SVG or rendered-clip handoff to HyperFrames.
A `.riv` file is not an SVG and has no automatic HyperFrames timing integration.
Direct runtime integration needs deterministic seeking and a separate test.

Approve narration before timing scenes; transcribe the final audio for captions.
Keep text/word timing in the transcript source. Use paused GSAP timelines, local
assets, and finite composition durations. No wall clocks, unseeded randomness,
or mid-render network requests in compositions.

Run `npm run lint` and `npm run check` after composition edits. Verify a rendered
sample before describing rendering as working. `npm run doctor` reports actual
tool availability and credential presence without showing secrets.

## Credentials and external services

`.env` is local and ignored; `.env.example` contains placeholders. Never print,
commit, or embed Gemini credentials in HTML, browser scripts, MCP config, logs,
or model prompts. Commands load `.env` at runtime. Paid generation requires the
user's key and an actual request; setup checks do not generate paid media.

The optional hosted HyperFrames MCP requires HeyGen OAuth; Rive desktop MCP
requires Rive Desktop on the same Mac/Windows machine. Both are disabled here
until their prerequisites are met. The Rive download host and Gemini API host
must be permitted by the environment network policy. Do not bypass that policy.
