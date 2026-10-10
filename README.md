# ಕನ್ನಡ ಅಕ್ಷರಗಳು — Learn Kannada Letters

A small web app to help a young child learn to recognize and recall written Kannada letters by sound. Built as a plain static site — no framework, no build step, no dependencies.

## Running it

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` and pick a section. (Serving locally is recommended over opening `index.html` directly — some browsers restrict speech/canvas APIs on `file://`.)

## How it works

- **All 49 letters** of the modern Kannada alphabet (13 vowels, 2 yogavaahakas, 34 consonants) are in the practice pool from the start.
- **Three modes**, chosen from the home screen:
  - **Multiple Choice** — hear a letter, pick it from 4 options.
  - **Free Recall** — hear a letter, write it from memory on a canvas, then reveal the answer and self-check.
  - **Adaptive (recommended)** — starts on multiple choice and automatically switches to free recall after 5 correct answers in a row, dropping back to multiple choice after 2 wrong answers in a row.
- **Listen to All Letters** — a browse screen to hear every letter on demand, useful for getting familiar with the alphabet before quizzing.
- Progress (per-letter history, used to prioritize which letters come up more often) is saved in `localStorage`, so it persists across sessions on the same browser.
- Audio uses the browser's built-in `speechSynthesis` (Kannada voice if the browser/OS provides one). Pronunciation quality varies by browser — this is a known limitation, not a bug.

## Project structure

- `index.html`, `home.css` — the hub page listing all learning sections
- `shared/theme.css` — colors/fonts shared by every page
- `shared/words.js` — kid-safe word list (word + emoji) used by the word games
- `word-guess/` — Wordle-style word game for kids (3/4-letter words, picture hints)
- `kannada/` — the Kannada letters section:
  - `data.js` — the 49 letters (glyph + romanization)
  - `app.js` — quiz logic, question selection, and rendering
  - `index.html` — markup for the home/browse/practice screens
  - `style.css` — styling, including mobile-friendly responsive rules

See `CLAUDE.md` for deeper architecture notes if you're working on this with Claude Code.
