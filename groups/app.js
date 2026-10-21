const PER_GROUP = 4;
const COLORS = ['#ffe08a', '#b8e6a8', '#a9d8f5', '#d9c2f0']; // one per solved group, in solve order

let groupCount = 3;
let groups = []; // { theme, words: [{ word, emoji }] }
let tiles = []; // { word, emoji, group } for tiles still on the board, in display order
let selected = new Set(); // words
let solvedCount = 0;
let lastThemes = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const emojiFor = (word) => WORDS.find((w) => w.word === word).emoji;

// Pick themes, then 4 words per theme that belong to none of the other chosen
// themes (so "bird" never shows up when both Animals and In the sky are in
// play) and whose pictures are all different.
function makePuzzle() {
  for (let attempt = 0; attempt < 500; attempt++) {
    const themes = shuffle([...THEMES]).slice(0, groupCount);
    // Don't deal the exact same set of themes twice in a row.
    if (themes.every((t) => lastThemes.includes(t))) continue;
    const usedEmoji = new Set();
    const picked = [];
    for (const theme of themes) {
      const others = themes.filter((t) => t !== theme);
      const pool = shuffle(theme.words.filter((w) => !others.some((t) => t.words.includes(w))));
      const words = [];
      for (const word of pool) {
        const emoji = emojiFor(word);
        if (usedEmoji.has(emoji)) continue;
        usedEmoji.add(emoji);
        words.push({ word, emoji });
        if (words.length === PER_GROUP) break;
      }
      if (words.length < PER_GROUP) break;
      picked.push({ theme, words });
    }
    if (picked.length < groupCount) continue;
    lastThemes = themes;
    return picked;
  }
  throw new Error('Could not build a Groups puzzle');
}

function setMessage(text) {
  document.getElementById('message').textContent = text;
}

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  tiles.forEach((tile) => {
    const el = document.createElement('button');
    el.className = 'tile';
    el.classList.toggle('selected', selected.has(tile.word));
    el.setAttribute('aria-pressed', selected.has(tile.word));
    el.innerHTML = `<span class="tile-pic">${tile.emoji}</span><span class="tile-word">${tile.word}</span>`;
    el.addEventListener('click', () => onTileClick(tile));
    tile.el = el;
    board.appendChild(el);
  });
  document.getElementById('check-btn').disabled = selected.size !== PER_GROUP;
}

function onTileClick(tile) {
  if (selected.has(tile.word)) selected.delete(tile.word);
  else if (selected.size < PER_GROUP) selected.add(tile.word);
  else return;
  setMessage('');
  tile.el.classList.toggle('selected', selected.has(tile.word));
  tile.el.setAttribute('aria-pressed', selected.has(tile.word));
  document.getElementById('check-btn').disabled = selected.size !== PER_GROUP;
}

function addSolvedRow(group) {
  const row = document.createElement('div');
  row.className = 'solved-row';
  row.style.background = COLORS[solvedCount];
  row.innerHTML =
    `<div class="solved-label">${group.theme.emoji} ${group.theme.label}</div>` +
    `<div class="solved-words">${group.words.map((w) => `${w.emoji} ${w.word}`).join(' · ')}</div>`;
  document.getElementById('solved').appendChild(row);
}

function check() {
  if (selected.size !== PER_GROUP) return;
  const chosen = tiles.filter((t) => selected.has(t.word));
  const counts = new Map();
  chosen.forEach((t) => counts.set(t.group, (counts.get(t.group) || 0) + 1));
  const best = Math.max(...counts.values());

  if (best === PER_GROUP) {
    const group = chosen[0].group;
    addSolvedRow(group);
    solvedCount++;
    tiles = tiles.filter((t) => t.group !== group);
    selected.clear();
    renderBoard();
    if (solvedCount === groupCount) {
      setMessage('You found them all! 🎉');
      celebrate('🧩');
      document.getElementById('controls').classList.add('hidden');
      document.getElementById('new-btn').classList.remove('hidden');
    } else {
      setMessage(`Yes! ${group.theme.label} ${group.theme.emoji}`);
    }
    return;
  }

  setMessage(best === PER_GROUP - 1 ? 'So close! Just one is in the wrong group.' : 'Not quite. Try again!');
  chosen.forEach((t) => {
    t.el.classList.remove('shake');
    void t.el.offsetWidth; // restart the animation
    t.el.classList.add('shake');
  });
}

// Names a group that's still on the board, and picks one of its tiles to start the kid off.
function hint() {
  const left = groups.filter((g) => tiles.some((t) => t.group === g));
  const group = left[Math.floor(Math.random() * left.length)];
  selected.clear();
  selected.add(group.words[Math.floor(Math.random() * PER_GROUP)].word);
  renderBoard();
  setMessage(`💡 Find 4 for: ${group.theme.label} ${group.theme.emoji}`);
}

function newGame() {
  groups = makePuzzle();
  tiles = shuffle(groups.flatMap((group) => group.words.map((w) => ({ ...w, group }))));
  selected.clear();
  solvedCount = 0;
  document.getElementById('solved').innerHTML = '';
  document.getElementById('controls').classList.remove('hidden');
  document.getElementById('new-btn').classList.add('hidden');
  document.querySelectorAll('.count-chip').forEach((chip) => {
    chip.classList.toggle('active', Number(chip.dataset.groups) === groupCount);
  });
  setMessage('');
  renderBoard();
}

document.addEventListener('DOMContentLoaded', () => {
  newGame();
  document.getElementById('new-btn').addEventListener('click', newGame);
  document.getElementById('skip-btn').addEventListener('click', newGame);
  document.getElementById('check-btn').addEventListener('click', check);
  document.getElementById('clear-btn').addEventListener('click', () => {
    selected.clear();
    setMessage('');
    renderBoard();
  });
  document.getElementById('shuffle-btn').addEventListener('click', () => {
    shuffle(tiles);
    renderBoard();
  });
  document.getElementById('hint-btn').addEventListener('click', hint);
  document.querySelectorAll('.count-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const n = Number(chip.dataset.groups);
      if (n === groupCount && solvedCount < groupCount) return;
      groupCount = n;
      newGame();
    });
  });
});
