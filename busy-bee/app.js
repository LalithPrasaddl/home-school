const HIVE_SIZE = 5; // centre letter + 4 petals
const MIN_LEN = 3;
const MIN_WORDS = 4;
const MAX_WORDS = 8; // keeps the clue cards to 4 rows on a phone
const MAX_TYPED = 8;
const RECENT_LIMIT = 15;
const MESSAGE_MS = 1600;

let puzzles = [];
let puzzle = null; // { center, petals: string[], words: [{ word }] }
let found = new Set();
let typed = [];
let recent = [];
let messageTimer = null;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Find every hive (5 letters + a centre) where 4–8 picture words can be
// spelled using only hive letters and always the centre letter, and where
// every petal is used by at least one answer. Letters are tracked as bitmasks
// over the alphabet the word list actually uses, so this runs in ~10ms.
function buildPuzzles() {
  const alphabet = [...new Set(WORDS.flatMap((w) => [...w.word]))].sort();
  const bit = (ch) => 1 << alphabet.indexOf(ch);
  const words = WORDS.filter((w) => [...w.word].length >= MIN_LEN).map((w) => ({
    ...w,
    mask: [...w.word].reduce((m, ch) => m | bit(ch), 0),
  }));
  const out = [];

  const visit = (start, left, mask) => {
    if (left === 0) {
      const fit = words.filter((w) => (w.mask & mask) === w.mask);
      if (fit.length < MIN_WORDS) return;
      alphabet.forEach((center, i) => {
        if (!(mask & (1 << i))) return;
        const answers = fit.filter((w) => w.mask & (1 << i));
        const used = answers.reduce((m, w) => m | w.mask, 0);
        if (answers.length < MIN_WORDS || answers.length > MAX_WORDS || used !== mask) return;
        out.push({
          key: `${mask}:${center}`,
          center,
          petals: alphabet.filter((ch, j) => j !== i && mask & (1 << j)),
          words: answers.map(({ word }) => ({ word })),
        });
      });
      return;
    }
    for (let i = start; i < alphabet.length; i++) visit(i + 1, left - 1, mask | (1 << i));
  };
  visit(0, HIVE_SIZE, 0);
  return out;
}

function showMessage(text) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => el.classList.remove('show'), MESSAGE_MS);
}

function restartAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function renderWord() {
  const el = document.getElementById('word');
  el.innerHTML = '';
  typed.forEach((ch) => {
    const span = document.createElement('span');
    span.textContent = ch;
    if (ch === puzzle.center) span.className = 'is-center';
    el.appendChild(span);
  });
  const caret = document.createElement('span');
  caret.className = 'caret';
  el.appendChild(caret);
  document.getElementById('enter-btn').classList.toggle('ready', typed.length >= MIN_LEN);
}

function renderFlower() {
  const flower = document.getElementById('flower');
  flower.innerHTML = '';
  const make = (letter, slot) => {
    const btn = document.createElement('button');
    btn.className = `petal petal-${slot}`;
    btn.textContent = letter;
    btn.addEventListener('click', () => addLetter(letter));
    flower.appendChild(btn);
    return btn;
  };
  puzzle.petals.forEach((letter, i) => make(letter, i));
  make(puzzle.center, 'center').id = 'center-petal';
}

function renderTrack() {
  const share = found.size / puzzle.words.length;
  document.getElementById('track-bee').style.left = `calc(${share} * (100% - 2.2rem))`;
}

function addLetter(letter) {
  if (found.size === puzzle.words.length || typed.length >= MAX_TYPED) return;
  typed.push(letter);
  renderWord();
}

function deleteLetter() {
  typed.pop();
  renderWord();
}

function rejectWord(text) {
  showMessage(text);
  restartAnimation(document.getElementById('word'), 'shake');
  setTimeout(() => {
    typed = [];
    renderWord();
  }, 450);
}

function submitWord() {
  if (!typed.length) return;
  const word = typed.join('');
  const card = document.querySelector(`.clue[data-word="${word}"]`);
  if (typed.length < MIN_LEN) return rejectWord(`Use ${MIN_LEN} letters or more!`);
  if (!typed.includes(puzzle.center)) {
    restartAnimation(document.getElementById('center-petal'), 'wiggle');
    return rejectWord('Use the yellow letter!');
  }
  if (found.has(word)) {
    restartAnimation(card, 'wiggle');
    return rejectWord('You found that one! ✓');
  }
  if (!card) return rejectWord('Try another word! 🙂');

  found.add(word);
  typed = [];
  renderWord();
  card.classList.add('found');
  card.querySelectorAll('.slot').forEach((slot, i) => {
    slot.textContent = [...word][i];
    slot.classList.remove('hinted');
  });
  renderTrack();
  if (found.size === puzzle.words.length) {
    showMessage('All done! 🌻');
    celebrate('🐝');
    document.getElementById('new-btn').classList.remove('hidden');
  } else {
    showMessage(randomItem(['Yay! 🐝', 'Great! ⭐', 'Buzz buzz! 🐝', 'You got it! 🎉']));
  }
}

// Tapping a clue card fills in that word's first letter.
function hint(card, w) {
  if (found.has(w.word)) return;
  const first = card.querySelector('.slot');
  first.textContent = [...w.word][0];
  first.classList.add('hinted');
}

function renderClues() {
  const clues = document.getElementById('clues');
  clues.innerHTML = '';
  // Shortest words first, so the easy ones are at the top.
  [...puzzle.words]
    .sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word))
    .forEach((w) => {
      const card = document.createElement('button');
      card.className = 'clue';
      card.dataset.word = w.word;
      card.setAttribute('aria-label', `Hint for a ${w.word.length} letter word`);
      const slots = document.createElement('span');
      slots.className = 'slots';
      [...w.word].forEach(() => {
        const slot = document.createElement('span');
        slot.className = 'slot';
        slots.appendChild(slot);
      });
      card.append(slots);
      card.addEventListener('click', () => hint(card, w));
      clues.appendChild(card);
    });
}

function newPuzzle() {
  const fresh = puzzles.filter((p) => !recent.includes(p.key));
  puzzle = randomItem(fresh.length ? fresh : puzzles);
  recent.push(puzzle.key);
  if (recent.length > RECENT_LIMIT) recent.shift();
  puzzle = { ...puzzle, petals: shuffle([...puzzle.petals]) };

  found = new Set();
  typed = [];
  document.getElementById('new-btn').classList.add('hidden');
  document.getElementById('message').classList.remove('show');
  renderFlower();
  renderWord();
  renderClues();
  renderTrack();
}

document.addEventListener('DOMContentLoaded', () => {
  puzzles = buildPuzzles();
  newPuzzle();

  document.getElementById('back-btn').addEventListener('click', deleteLetter);
  document.getElementById('enter-btn').addEventListener('click', submitWord);
  document.getElementById('shuffle-btn').addEventListener('click', () => {
    shuffle(puzzle.petals);
    renderFlower();
  });
  document.getElementById('new-btn').addEventListener('click', newPuzzle);
  document.getElementById('skip-btn').addEventListener('click', newPuzzle);

  // Physical keyboard support for desktop: only hive letters are accepted.
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if (e.key === 'Enter') {
      e.preventDefault(); // don't also "click" whichever button has focus
      if (found.size === puzzle.words.length) newPuzzle();
      else submitWord();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      deleteLetter();
    } else if (key === puzzle.center || puzzle.petals.includes(key)) {
      addLetter(key);
    }
  });
});
