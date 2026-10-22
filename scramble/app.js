// A round is 10 words that get longer as it goes: 2 of 3 letters, 6 of 4, 2 of 5.
const ROUND_PLAN = [3, 3, 4, 4, 4, 4, 4, 4, 5, 5];
const NEXT_MS = 1300; // pause on a solved word before the next one
const WRONG_MS = 900; // how long a wrong answer stays before the letters go back

// Any real word, so a different word made from the same letters (ARE for EAR)
// gets a "that's a word too" instead of a plain "try again".
const REAL_WORDS = new Set([...DICTIONARY, ...WORDS.map((w) => w.word)]);

let round = []; // WORDS entries
let index = 0;
let target = []; // letters of the current word
let tiles = []; // { letter, used }
let slots = []; // tile index or null, one per letter
let hinted = 0; // the first `hinted` slots are locked in by 💡
let busy = false; // true while a solved/wrong answer is on show

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Distinct pictures within a round, so two words never look the same.
function pickRound() {
  const seen = new Set();
  return ROUND_PLAN.map((len) => {
    const w = shuffle(WORDS.filter((w) => [...w.word].length === len && !seen.has(w.emoji)))[0];
    seen.add(w.emoji);
    return w;
  });
}

// Shuffle until the letters aren't already in the right order.
function scramble(letters) {
  if (new Set(letters).size === 1) return [...letters];
  let out;
  do out = shuffle([...letters]);
  while (out.join('') === letters.join(''));
  return out;
}

function setMsg(text) {
  document.getElementById('msg').textContent = text;
}

function renderDots() {
  const box = document.getElementById('dots');
  box.innerHTML = '';
  round.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot' + (i < index ? ' done' : i === index ? ' now' : '');
    box.appendChild(d);
  });
}

function render() {
  const slotBox = document.getElementById('slots');
  slotBox.innerHTML = '';
  slots.forEach((t, i) => {
    const el = document.createElement('button');
    el.className = 'slot' + (t !== null ? ' filled' : '') + (i < hinted ? ' hinted' : '');
    el.textContent = t !== null ? tiles[t].letter : '';
    el.setAttribute('aria-label', t !== null ? tiles[t].letter : 'Empty');
    el.addEventListener('click', () => onSlotClick(i));
    slotBox.appendChild(el);
  });

  const tileBox = document.getElementById('tiles');
  tileBox.innerHTML = '';
  tiles.forEach((tile, i) => {
    const el = document.createElement('button');
    el.className = 'tile' + (tile.used ? ' used' : '');
    el.textContent = tile.letter;
    el.disabled = tile.used;
    el.addEventListener('click', () => onTileClick(i));
    tileBox.appendChild(el);
  });
}

function onTileClick(i) {
  if (busy || tiles[i].used) return;
  const slot = slots.indexOf(null);
  if (slot === -1) return;
  tiles[i].used = true;
  slots[slot] = i;
  render();
  if (!slots.includes(null)) check();
}

// Tapping a placed letter sends it back down (except 💡 letters).
function onSlotClick(i) {
  if (busy || i < hinted || slots[i] === null) return;
  tiles[slots[i]].used = false;
  slots[i] = null;
  render();
}

function clearSlots() {
  for (let i = hinted; i < slots.length; i++) {
    if (slots[i] !== null) tiles[slots[i]].used = false;
    slots[i] = null;
  }
}

function check() {
  const guess = slots.map((t) => tiles[t].letter).join('');
  const slotBox = document.getElementById('slots');
  busy = true;
  if (guess === target.join('')) {
    slotBox.classList.add('win');
    setMsg(['Yay! 🎉', 'Great job! ⭐', 'You got it! 🙌', 'Super! 🌟'][Math.floor(Math.random() * 4)]);
    setTimeout(nextWord, NEXT_MS);
    return;
  }
  setMsg(REAL_WORDS.has(guess)
    ? `${guess.toUpperCase()} is a word too, but not this picture! 🤔`
    : 'Not quite, try again!');
  slotBox.classList.add('shake');
  setTimeout(() => {
    slotBox.classList.remove('shake');
    clearSlots();
    busy = false;
    render();
  }, WRONG_MS);
}

// 💡 locks in the next letter from the start (never the last one).
function hint() {
  if (busy || hinted >= target.length - 1) return;
  clearSlots();
  const t = tiles.findIndex((tile) => !tile.used && tile.letter === target[hinted]);
  tiles[t].used = true;
  slots[hinted] = t;
  hinted++;
  setMsg('Here’s a letter to help!');
  render();
}

function showWord() {
  const w = round[index];
  target = [...w.word];
  tiles = scramble(target).map((letter) => ({ letter, used: false }));
  slots = target.map(() => null);
  hinted = 0;
  busy = false;
  document.getElementById('picture').textContent = w.emoji;
  document.getElementById('slots').classList.remove('win', 'shake');
  setMsg('Tap the letters to fix the word!');
  renderDots();
  render();
}

function nextWord() {
  index++;
  if (index < round.length) {
    showWord();
    return;
  }
  renderDots();
  document.getElementById('play').classList.add('hidden');
  document.getElementById('done').classList.remove('hidden');
  celebrate('🔤');
}

function newRound() {
  round = pickRound();
  index = 0;
  document.getElementById('play').classList.remove('hidden');
  document.getElementById('done').classList.add('hidden');
  showWord();
}

document.addEventListener('DOMContentLoaded', () => {
  newRound();
  document.getElementById('hint-btn').addEventListener('click', hint);
  document.getElementById('restart-btn').addEventListener('click', newRound);
  document.getElementById('new-btn').addEventListener('click', newRound);
});
