const PAIRS = 8; // 16 cards in a 4×4 grid
const MISMATCH_MS = 1000; // how long two wrong cards stay face-up

let cards = []; // { pairId, kind: 'pic' | 'word', content, el }
let first = null;
let locked = false;
let matched = 0;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Short words only (they must fit on a card), and no two pairs may share a
// picture (e.g. 'tub' and 'bath' are both 🛁).
function pickWords() {
  const picked = [];
  const seen = new Set();
  for (const w of shuffle(WORDS.filter((w) => [...w.word].length <= 4))) {
    if (seen.has(w.emoji)) continue;
    seen.add(w.emoji);
    picked.push(w);
    if (picked.length === PAIRS) break;
  }
  return picked;
}

function flip(card, faceUp) {
  card.el.classList.toggle('flipped', faceUp);
  card.el.setAttribute('aria-label', faceUp ? card.content : 'Hidden card');
}

function onCardClick(card) {
  if (locked || card.matched || card === first) return;
  flip(card, true);
  if (!first) {
    first = card;
    return;
  }
  const second = card;
  if (first.pairId === second.pairId) {
    [first, second].forEach((c) => {
      c.matched = true;
      c.el.classList.add('matched');
    });
    first = null;
    matched++;
    if (matched === PAIRS) {
      celebrate('🧠');
      document.getElementById('new-btn').classList.remove('hidden');
    }
    return;
  }
  locked = true;
  const a = first;
  first = null;
  setTimeout(() => {
    flip(a, false);
    flip(second, false);
    locked = false;
  }, MISMATCH_MS);
}

function newGame() {
  first = null;
  locked = false;
  matched = 0;
  document.getElementById('new-btn').classList.add('hidden');

  cards = shuffle(
    pickWords().flatMap((w, pairId) => [
      { pairId, kind: 'pic', content: w.emoji },
      { pairId, kind: 'word', content: w.word },
    ]),
  );

  const board = document.getElementById('board');
  board.innerHTML = '';
  cards.forEach((card) => {
    const el = document.createElement('button');
    el.className = 'card';
    el.setAttribute('aria-label', 'Hidden card');
    const inner = document.createElement('span');
    inner.className = 'card-inner';
    const back = document.createElement('span');
    back.className = 'card-face card-back';
    back.textContent = '⭐';
    const front = document.createElement('span');
    front.className = `card-face card-front ${card.kind}`;
    front.textContent = card.content;
    inner.append(back, front);
    el.appendChild(inner);
    el.addEventListener('click', () => onCardClick(card));
    card.el = el;
    board.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  newGame();
  document.getElementById('new-btn').addEventListener('click', newGame);
  document.getElementById('skip-btn').addEventListener('click', newGame);
});
