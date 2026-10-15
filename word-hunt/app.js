const SIZE = 5;
const WORDS_PER_PUZZLE = 4;
// Filler letters skip rare ones (j, k, q, v, x, y, z) so random runs look
// less like real words and kids aren't distracted by odd letters.
const FILLER = 'aeioubcdfghlmnprstw';
// Filler can accidentally spell things across a row/column; reject those grids.
const BLOCKED = ['ass', 'sex', 'tit', 'cum', 'fag', 'shit', 'damn', 'hell', 'piss', 'dick', 'crap', 'poop'];
const COLORS = 4; // found-word colour classes .found-0 … .found-3
// [rowStep, colStep] for the 4 line directions; each word also may run backwards.
const AXES = [[0, 1], [1, 0], [1, 1], [1, -1]];

let puzzle = null; // { theme, grid: string[], words: [{ word, emoji, cells: number[] }] }
let found = new Set();
let selection = [];
let dragging = false;
let moved = false;
let pendingToggle = false;
let lastTheme = null;

const emojiFor = (word) => WORDS.find((w) => w.word === word).emoji;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const inGrid = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

// Every row, column and diagonal as a string, both forwards and backwards,
// which is every direction a kid can select in.
function lines(grid) {
  const out = [];
  for (const [dr, dc] of AXES) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (inGrid(r - dr, c - dc)) continue; // only start at the line's edge
        let line = '';
        for (let rr = r, cc = c; inGrid(rr, cc); rr += dr, cc += dc) line += grid[rr * SIZE + cc];
        if (line.length > 1) out.push(line, [...line].reverse().join(''));
      }
    }
  }
  return out;
}

function countIn(lineList, word) {
  let n = 0;
  for (const line of lineList) {
    for (let i = line.indexOf(word); i !== -1; i = line.indexOf(word, i + 1)) n++;
  }
  return n;
}

// Words go across, down or diagonally, forwards or backwards. Words may cross
// and share a letter, but never run along each other on the same line axis.
// `cells` stays in reading order, so cells[0] is always the word's first letter.
function placeWord(grid, axes, word) {
  const letters = [...word];
  const len = letters.length;
  for (let tries = 0; tries < 100; tries++) {
    const axis = Math.floor(Math.random() * AXES.length);
    const sign = Math.random() < 0.5 ? 1 : -1;
    const [dr, dc] = AXES[axis].map((d) => d * sign);
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!inGrid(r + dr * (len - 1), c + dc * (len - 1))) continue;
    const cells = letters.map((_, i) => (r + dr * i) * SIZE + c + dc * i);
    const fits = cells.every((idx, i) => grid[idx] === null || (grid[idx] === letters[i] && axes[idx] !== axis));
    if (!fits) continue;
    cells.forEach((idx, i) => {
      grid[idx] = letters[i];
      axes[idx] = axis;
    });
    return cells;
  }
  return null;
}

// A palindrome (e.g. "eye") reads the same both ways, so its one placement shows up twice.
const isPalindrome = (w) => w === [...w].reverse().join('');

function makePuzzle() {
  for (let attempt = 0; attempt < 500; attempt++) {
    const theme = randomItem(THEMES.filter((t) => t !== lastTheme));
    const chosen = shuffle([...theme.words]).slice(0, WORDS_PER_PUZZLE);
    const grid = Array(SIZE * SIZE).fill(null);
    const axes = Array(SIZE * SIZE).fill(null);
    const words = [];
    for (const word of chosen) {
      const cells = placeWord(grid, axes, word);
      if (!cells) break;
      words.push({ word, emoji: emojiFor(word), cells });
    }
    if (words.length < chosen.length) continue;

    for (let i = 0; i < grid.length; i++) if (grid[i] === null) grid[i] = randomItem([...FILLER]);

    const all = lines(grid);
    const clean =
      chosen.every((w) => countIn(all, w) === (isPalindrome(w) ? 2 : 1)) &&
      theme.words.filter((w) => !chosen.includes(w)).every((w) => countIn(all, w) === 0) &&
      BLOCKED.every((w) => countIn(all, w) === 0);
    if (!clean) continue;

    lastTheme = theme;
    return { theme, grid, words };
  }
  throw new Error('Could not build a Word Hunt puzzle');
}

function cellEls() {
  return [...document.querySelectorAll('.cell')];
}

function render() {
  const els = cellEls();
  els.forEach((el) => el.classList.remove('selected'));
  selection.forEach((idx) => els[idx].classList.add('selected'));
}

const stepBetween = (a, b) => [Math.floor(b / SIZE) - Math.floor(a / SIZE), (b % SIZE) - (a % SIZE)];

// The next letter must touch the last one (any of 8 neighbours), then keep
// going the same way as the first step.
function canExtend(idx) {
  if (!selection.length) return false;
  const [dr, dc] = stepBetween(selection[selection.length - 1], idx);
  if (selection.length === 1) return Math.max(Math.abs(dr), Math.abs(dc)) === 1;
  const [r0, c0] = stepBetween(selection[0], selection[1]);
  return dr === r0 && dc === c0;
}

// A word counts whichever end the kid starts from.
function checkSelection() {
  const n = selection.length;
  const match = puzzle.words.find(
    (w) =>
      !found.has(w.word) &&
      w.cells.length === n &&
      (w.cells.every((idx, i) => idx === selection[i]) || w.cells.every((idx, i) => idx === selection[n - 1 - i])),
  );
  if (match) markFound(match);
  return Boolean(match);
}

function markFound(w) {
  const colorIdx = found.size % COLORS;
  found.add(w.word);
  selection = [];
  const els = cellEls();
  w.cells.forEach((idx, i) => {
    const el = els[idx];
    el.classList.remove('hint', ...Array.from({ length: COLORS }, (_, k) => `found-${k}`));
    el.classList.add('found', `found-${colorIdx}`);
    el.style.animationDelay = `${i * 0.06}s`;
  });
  const card = document.querySelector(`.clue[data-word="${w.word}"]`);
  card.classList.add('found', `found-${colorIdx}`);
  [...card.querySelectorAll('.slot')].forEach((slot, i) => (slot.textContent = [...w.word][i]));
  render();

  if (found.size === puzzle.words.length) {
    celebrate(puzzle.theme.emoji);
    document.getElementById('new-btn').classList.remove('hidden');
  }
}

function rejectSelection() {
  const els = cellEls();
  selection.forEach((idx) => {
    els[idx].classList.remove('nope');
    void els[idx].offsetWidth; // restart the animation
    els[idx].classList.add('nope');
  });
  selection = [];
  render();
}

// Only count the round middle of a cell, so a diagonal drag that clips the
// corner of a neighbouring cell doesn't pick it up.
function cellAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el || !el.classList.contains('cell')) return null;
  const box = el.getBoundingClientRect();
  const dx = x - (box.left + box.width / 2);
  const dy = y - (box.top + box.height / 2);
  return Math.hypot(dx, dy) <= box.width * 0.45 ? Number(el.dataset.idx) : null;
}

function onPointerDown(e) {
  const idx = cellAt(e.clientX, e.clientY);
  if (idx === null) return;
  e.preventDefault();
  dragging = true;
  moved = false;
  pendingToggle = false;
  if (canExtend(idx)) selection.push(idx);
  else if (selection[selection.length - 1] === idx) pendingToggle = true;
  else selection = [idx];
  render();
  checkSelection();
}

function onPointerMove(e) {
  if (!dragging) return;
  const idx = cellAt(e.clientX, e.clientY);
  if (idx === null || idx === selection[selection.length - 1]) return;
  if (selection.length >= 2 && idx === selection[selection.length - 2]) {
    selection.pop(); // dragged back a step
  } else if (canExtend(idx)) {
    selection.push(idx);
  } else {
    return;
  }
  moved = true;
  pendingToggle = false;
  render();
  checkSelection();
}

function onPointerUp() {
  if (!dragging) return;
  dragging = false;
  if (pendingToggle && !moved) {
    selection.pop(); // tapped the last letter again: un-pick it
    render();
  } else if (moved && selection.length > 1) {
    rejectSelection(); // a finished drag that didn't spell a word
  }
}

// Tapping a clue card makes the first letter of that word glow.
function hint(w) {
  if (found.has(w.word)) return;
  const el = cellEls()[w.cells[0]];
  el.classList.remove('hint');
  void el.offsetWidth;
  el.classList.add('hint');
}

function newPuzzle() {
  puzzle = makePuzzle();
  found = new Set();
  selection = [];

  document.getElementById('theme-title').textContent = `${puzzle.theme.emoji} ${puzzle.theme.title}`;
  document.getElementById('new-btn').classList.add('hidden');

  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  puzzle.grid.forEach((letter, idx) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = idx;
    cell.textContent = letter;
    grid.appendChild(cell);
  });

  const clues = document.getElementById('clues');
  clues.innerHTML = '';
  puzzle.words.forEach((w) => {
    const card = document.createElement('button');
    card.className = 'clue';
    card.dataset.word = w.word;
    card.setAttribute('aria-label', `Hint for a ${w.word.length} letter word`);
    const pic = document.createElement('span');
    pic.className = 'clue-emoji';
    pic.textContent = w.emoji;
    const slots = document.createElement('span');
    slots.className = 'slots';
    [...w.word].forEach(() => {
      const slot = document.createElement('span');
      slot.className = 'slot';
      slots.appendChild(slot);
    });
    card.append(pic, slots);
    card.addEventListener('click', () => hint(w));
    clues.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  newPuzzle();

  const grid = document.getElementById('grid');
  grid.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  document.getElementById('new-btn').addEventListener('click', newPuzzle);
  document.getElementById('skip-btn').addEventListener('click', newPuzzle);
});
