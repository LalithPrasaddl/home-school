const HIVE_SIZE = 5; // centre letter + 4 petals
const MIN_LEN = 3;
const MIN_WORDS = 6;
const MAX_WORDS = 12; // keeps the clue cards to 6 rows on a phone
const MAX_TYPED = 8;
const MAX_TRIES = 500;
const RECENT_LIMIT = 15;
const MESSAGE_MS = 1600;

let index = null; // { bit, byMask: Map<mask, string[]>, seeds: { word, mask }[] }
let bonusWords = null; // Set of BONUS words: accepted, but no clue card
let puzzle = null; // { center, petals: string[], words: [{ word }] }
let found = new Set();
let foundBonus = [];
let revealed = new Map(); // word -> how many letters a hint has shown
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

// Every real word counts, not just the picture-list ones, so the answers are
// all DICTIONARY (+ WORDS) entries that fit the hive. Words are grouped by
// the bitmask of letters they use; a hive's answers are then just the groups
// for each subset of its 5 letters that includes the centre.
function buildIndex() {
  const all = [...new Set([...DICTIONARY, ...WORDS.map((w) => w.word)])].filter((w) => {
    const len = [...w].length;
    return len >= MIN_LEN && len <= MAX_TYPED;
  });
  const alphabet = [...new Set(all.flatMap((w) => [...w]))].sort();
  const bit = (ch) => 1 << alphabet.indexOf(ch);
  const byMask = new Map();
  const seeds = [];
  all.forEach((word) => {
    const mask = [...word].reduce((m, ch) => m | bit(ch), 0);
    const size = new Set(word).size;
    if (size > HIVE_SIZE) return;
    if (!byMask.has(mask)) byMask.set(mask, []);
    byMask.get(mask).push(word);
    if (size === HIVE_SIZE) seeds.push({ word, mask });
  });
  return { bit, byMask, seeds };
}

// Seed each hive from a word using exactly 5 different letters, so there's
// always a "whole flower" word and every petal is used by some answer.
function pickHive() {
  for (let tries = 0; ; tries++) {
    const seed = randomItem(index.seeds);
    const letters = [...new Set(seed.word)];
    const center = randomItem(letters);
    const key = `${seed.mask}:${center}`;
    if (recent.includes(key) && tries < MAX_TRIES) continue;
    const centerBit = index.bit(center);
    const words = [];
    for (let sub = seed.mask; sub; sub = (sub - 1) & seed.mask) {
      if (sub & centerBit) words.push(...(index.byMask.get(sub) || []));
    }
    if ((words.length < MIN_WORDS || words.length > MAX_WORDS) && tries < MAX_TRIES) continue;
    return {
      key,
      center,
      petals: letters.filter((ch) => ch !== center),
      words: words.map((word) => ({ word })),
    };
  }
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
  if (!card && foundBonus.includes(word)) return rejectWord('You found that one! ✓');
  if (!card && bonusWords.has(word)) return addBonus(word);
  if (!card) return rejectWord('Not in my word list! 🙂');

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
  } else if (new Set(word).size === HIVE_SIZE) {
    showMessage('Whole flower! 🌻');
  } else {
    showMessage(randomItem(['Yay! 🐝', 'Great! ⭐', 'Buzz buzz! 🐝', 'You got it! 🎉']));
  }
}

// A real word that isn't one of the clue cards: cheer it and list it under
// the cards, but it doesn't move the bee along.
function addBonus(word) {
  foundBonus.push(word);
  typed = [];
  renderWord();
  renderBonus();
  showMessage(new Set(word).size === HIVE_SIZE ? 'Whole flower bonus! 🌻⭐' : 'Bonus word! ⭐');
}

function renderBonus() {
  const el = document.getElementById('bonus');
  el.classList.toggle('hidden', !foundBonus.length);
  el.textContent = `⭐ Bonus words: ${foundBonus.join(', ')}`;
}

// A hint shows one more letter of a word, but never the last one, so the
// kid still has to finish it. Returns false if that word has no hints left.
function hint(card, word) {
  const letters = [...word];
  const shown = revealed.get(word) || 0;
  if (found.has(word) || shown >= letters.length - 1) return false;
  revealed.set(word, shown + 1);
  const slot = card.querySelectorAll('.slot')[shown];
  slot.textContent = letters[shown];
  slot.classList.add('hinted');
  restartAnimation(card, 'wiggle');
  return true;
}

// The 💡 button hints the word with the fewest letters shown so far
// (shortest first, matching the card order), so first letters come before
// second letters.
function hintNext() {
  const cards = [...document.querySelectorAll('.clue:not(.found)')];
  if (!cards.length) return;
  const byShown = cards.sort((a, b) => (revealed.get(a.dataset.word) || 0) - (revealed.get(b.dataset.word) || 0));
  if (!byShown.some((card) => hint(card, card.dataset.word))) showMessage('No more hints! 🙂');
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
      card.addEventListener('click', () => hint(card, w.word));
      clues.appendChild(card);
    });
}

function newPuzzle() {
  puzzle = pickHive();
  recent.push(puzzle.key);
  if (recent.length > RECENT_LIMIT) recent.shift();
  puzzle = { ...puzzle, petals: shuffle([...puzzle.petals]) };

  found = new Set();
  foundBonus = [];
  revealed = new Map();
  typed = [];
  document.getElementById('new-btn').classList.add('hidden');
  document.getElementById('message').classList.remove('show');
  renderFlower();
  renderWord();
  renderClues();
  renderBonus();
  renderTrack();
}

document.addEventListener('DOMContentLoaded', () => {
  index = buildIndex();
  bonusWords = new Set(BONUS);
  newPuzzle();

  document.getElementById('back-btn').addEventListener('click', deleteLetter);
  document.getElementById('enter-btn').addEventListener('click', submitWord);
  document.getElementById('hint-btn').addEventListener('click', hintNext);
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
