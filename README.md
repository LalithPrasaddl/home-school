# Learning Corner

Small learning games for young kids: Kannada letters, plus kid-sized versions of word games like Wordle, Strands and Spelling Bee. Built as a plain static site — no framework, no build step, no dependencies. Phone-first, but works on desktop too.

## Running it

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` and pick a section. (Serving locally is recommended over opening `index.html` directly — some browsers restrict speech/canvas APIs on `file://`.)

## Sections

The home page lists each section as a card with an age badge.

### Kannada Letters (6+)

- **All 49 letters** of the modern Kannada alphabet (13 vowels, 2 yogavaahakas, 34 consonants) are in the practice pool from the start.
- **Three modes**, chosen from the home screen:
  - **Multiple Choice** — hear a letter, pick it from 4 options.
  - **Free Recall** — hear a letter, write it from memory on a canvas, then reveal the answer and self-check.
  - **Adaptive (recommended)** — starts on multiple choice and automatically switches to free recall after 5 correct answers in a row, dropping back to multiple choice after 2 wrong answers in a row.
- **Listen to All Letters** — a browse screen to hear every letter on demand, useful for getting familiar with the alphabet before quizzing.
- Progress (per-letter history, used to prioritize which letters come up more often) is saved in `localStorage`, so it persists across sessions on the same browser.
- Audio uses the browser's built-in `speechSynthesis` (Kannada voice if the browser/OS provides one). Pronunciation quality varies by browser — this is a known limitation, not a bug.

### Word Guess (6+)

A Wordle-style game: guess a hidden 3- or 4-letter word in 6 tries. Tiles turn green (right spot), yellow (in the word) or grey (not in the word). Any guess is accepted, so kids can practise spelling freely. After 3 misses a 💡 shows a picture hint. The on-screen keyboard is QWERTY, like the real Wordle. Sound is off by default (🔇 toggles reading the word aloud).

### Word Hunt (6+)

A Strands-style themed word search: find 4 hidden words (straight across or down) in a 5×5 letter grid. Each word has a clue card showing one blank per letter (no pictures, so kids find words from the theme alone). Drag across letters or tap them in order. Tapping a clue card makes that word's first letter glow. Puzzles are generated fresh each time from themes like animals, food and things that go.

### Busy Bee (6+)

A Spelling Bee-style game: make words from 5 letters arranged as a flower. Every word must use the yellow centre letter and be at least 3 letters long; letters can be reused. Each hidden word has a picture clue card with one blank per letter, and tapping a card reveals its first letter. A bee flies along the top towards a sunflower as words are found. Puzzles are generated from the shared word list, so every answer is a word with a picture.

The word games keep no progress or scores — every round starts fresh.

## Project structure

- `index.html`, `home.css` — the hub page listing all learning sections
- `shared/theme.css` — colors, fonts and game buttons shared by every page
- `shared/words.js` — kid-safe word list (word + emoji) and Word Hunt themes
- `shared/confetti.js` — celebration effect used by the games
- `word-guess/` — Word Guess (Wordle-style)
- `word-hunt/` — Word Hunt (Strands-style)
- `busy-bee/` — Busy Bee (Spelling Bee-style)
- `kannada/` — the Kannada letters section:
  - `data.js` — the 49 letters (glyph + romanization)
  - `app.js` — quiz logic, question selection, and rendering
  - `index.html` — markup for the home/browse/practice screens
  - `style.css` — styling, including mobile-friendly responsive rules

See `CLAUDE.md` for deeper architecture notes if you're working on this with Claude Code.
