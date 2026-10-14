const SIZE = 5;
const WORDS_PER_PUZZLE = 4;
// Filler letters skip rare ones (j, k, q, v, x, y, z) so random runs look
// less like real words and kids aren't distracted by odd letters.
const FILLER = 'aeioubcdfghlmnprstw';
// Filler can accidentally spell things across a row/column; reject those grids.
const BLOCKED = ['ass', 'sex', 'tit', 'cum', 'fag', 'shit', 'damn', 'hell', 'piss', 'dick', 'crap', 'poop'];
const COLORS = 4; // found-word colour classes .found-0 … .found-3

let puzzle = null; // { theme, grid: string[], words: [{ word, cells: number[] }] }
let found = new Set();
let selection = [];
let dragging = false;
let moved = false;
let pendingToggle = false;
let lastTheme = null;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Every left-to-right row and top-to-bottom column as a string, which is
// every direction a kid can select in.
function lines(grid) {
  const out = [];
  for (let i = 0; i < SIZE; i++) {
    let row = '';
    let col = '';
    for (let j = 0; j < SIZE; j++) {
      row += grid[i * SIZE + j];
      col += grid[j * SIZE + i];
    }
    out.push(row, col);
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

// Words go straight across (left→right) or down (top→bottom). Words may cross
// and share a letter, but never run along each other in the same direction.
function placeWord(grid, dirs, word) {
  const letters = [...word];
  const len = letters.length;
  for (let tries = 0; tries < 60; tries++) {
    const across = Math.random() < 0.5;
    const step = across ? 1 : SIZE;
    const r = Math.floor(Math.random() * (across ? SIZE : SIZE - len + 1));
    const c = Math.floor(Math.random() * (across ? SIZE - len + 1 : SIZE));
    const cells = letters.map((_, i) => r * SIZE + c + i * step);
    const fits = cells.every((idx, i) => grid[idx] === null || (grid[idx] === letters[i] && dirs[idx] !== step));
    if (!fits) continue;
    cells.forEach((idx, i) => {
      grid[idx] = letters[i];
      dirs[idx] = step;
    });
    return cells;
  }
  return null;
}

function makePuzzle() {
  for (let attempt = 0; attempt < 500; attempt++) {
    const theme = randomItem(THEMES.filter((t) => t !== lastTheme));
    const chosen = shuffle([...theme.words]).slice(0, WORDS_PER_PUZZLE);
    const grid = Array(SIZE * SIZE).fill(null);
    const dirs = Array(SIZE * SIZE).fill(null);
    const words = [];
    for (const word of chosen) {
      const cells = placeWord(grid, dirs, word);
      if (!cells) break;
      words.push({ word, cells });
    }
    if (words.length < chosen.length) continue;

    for (let i = 0; i < grid.length; i++) if (grid[i] === null) grid[i] = randomItem([...FILLER]);

    const all = lines(grid);
    const clean =
      chosen.every((w) => countIn(all, w) === 1) &&
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

function canExtend(idx) {
  if (!selection.length) return false;
  const last = selection[selection.length - 1];
  const right = last % SIZE < SIZE - 1 ? last + 1 : -1;
  const down = last + SIZE < SIZE * SIZE ? last + SIZE : -1;
  if (selection.length === 1) return idx === right || idx === down;
  return idx === (selection[1] - selection[0] === 1 ? right : down);
}

function checkSelection() {
  const match = puzzle.words.find(
    (w) => !found.has(w.word) && w.cells.length === selection.length && w.cells.every((idx, i) => idx === selection[i]),
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

function cellAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el && el.classList.contains('cell') ? Number(el.dataset.idx) : null;
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

  document.getElementById('theme-title').textContent = puzzle.theme.title;
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
    const slots = document.createElement('span');
    slots.className = 'slots';
    [...w.word].forEach(() => {
      const slot = document.createElement('span');
      slot.className = 'slot';
      slots.appendChild(slot);
    });
    card.append(slots);
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
