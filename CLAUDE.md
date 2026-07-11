# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build web app that helps a young child (~6yo) learn to recognize and recall written Kannada letters by sound. Plain HTML/CSS/JS — no framework, no bundler, no package.json, no dependencies.

## Running it

There's no build step. Serve the directory and open it:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly via `file://` mostly works but is not recommended — some browsers restrict `speechSynthesis`/canvas APIs on `file://`, so prefer the local server.

There is no test suite, linter, or build/lint/typecheck command in this repo. Verify changes by loading the page in a browser (or at minimum `node --check app.js` for syntax) and exercising the flow by hand.

## Files

- `data.js` — the single source of truth for content: `LETTERS`, an array of all 49 letters of the modern Kannada alphabet (13 vowels + 2 yogavaahakas + 34 consonants — deliberately excludes the archaic ಱ/ೞ). Each entry is `{ id, glyph, roman }`.
- `app.js` — all app logic (state, question selection, DOM rendering). One file, no modules (loaded as a plain `<script>`, so top-level `const`/`let` are just script-scope, not attached to `window`).
- `index.html` — three screens toggled via a `.hidden` class: `#home-screen`, `#browse-screen`, `#practice-screen` (which itself toggles between `#mc-screen` and `#recall-screen`).
- `style.css` — kid-friendly styling; includes a `@media (max-width: 480px)` block for phones.

## Architecture: the adaptive quiz engine

This is the part that isn't obvious from skimming one file.

**Global phase, not per-letter.** There is exactly one active mode at a time — `globalPhase` (1 = multiple-choice, 2 = free-recall) — driven by *overall* streaks, not by any individual letter's history:
- 5 correct answers in a row (any letters, mixed) → promotes to phase 2.
- 2 wrong answers in a row while in phase 2 → demotes back to phase 1.
- This is intentionally asymmetric: hard to earn free-recall mode, easy to fall out of it.
- The Home screen also lets the user force a fixed mode (`appMode`: `'mc'` | `'recall'` | `'adaptive'`), bypassing `globalPhase` entirely. `resolveMode()` in `app.js` is the single place that reconciles `appMode` + `globalPhase` into the actual `currentMode` for the next question.

**Per-letter state is separate from phase**, and only drives *which letter* to ask next, not *how* (mc vs. recall). Each letter's `progress[id]` tracks `history` (last 5 correct/wrong outcomes) and `lastSeenIndex`. `pickNextLetter()` does weighted-random selection favoring letters answered wrong recently and letters not seen in a while — this is the spaced-repetition layer, independent of the phase state machine above.

**Free-recall mode has no handwriting recognition.** The kid draws on a canvas, taps "Show Answer" to reveal the correct glyph, then self-reports right/wrong (`self-yes`/`self-no`) — same trick Anki uses for cards that can't be auto-graded. Don't try to add real stroke/shape validation; that was a deliberate scope decision.

**Audio is live browser `speechSynthesis`**, not pre-recorded clips (`speakLetter()` in `app.js`), using `lang: 'kn-IN'` and picking any installed voice starting with `kn`. Quality is inconsistent across browsers/OSes and isolated single-character input is where general-purpose TTS engines are weakest (aspirated/retroflex consonants especially). A per-letter pronunciation-tuning UI was built and then deliberately reverted — the project owner wants to stay on default browser TTS until a better sourcing approach (real recordings or a paid neural TTS API) is decided; don't re-add tuning UI speculatively.

**LocalStorage schema** (`kannada-letters-progress-v2`): `{ letters: { [id]: { history: bool[], lastSeenIndex: number } }, globalPhase: 1|2 }`. The key was bumped to `-v2` when `globalPhase` moved from per-letter to global — bump it again if the shape changes, rather than trying to migrate old saved data. Stars/streak/accuracy counters are intentionally *not* persisted and reset on reload.
