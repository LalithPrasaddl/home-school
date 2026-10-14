const NEXT_MS = 1300; // pause on a right answer before the next pattern
const CONFETTI_EVERY = 5; // a confetti burst every N right answers in a row
const NUMBER_SHARE = 0.3; // share of rounds that are counting patterns

// Emoji sets for repeating patterns. Each set needs at least 4 items so a
// 3-part pattern still has a spare item to use as a wrong choice.
const SETS = [
  ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'],
  ['🍎', '🍌', '🍇', '🍊', '🍓'],
  ['🐶', '🐱', '🐭', '🐰', '🐸'],
  ['❤️', '💙', '💚', '💛', '💜'],
  ['☀️', '🌙', '⭐', '☁️'],
  ['🚗', '🚌', '🚲', '✈️'],
  ['🔺', '⭐', '❤️', '🔷', '⚫'],
];
// Pattern shapes, easiest first. Each letter is one item from a set.
const SHAPES = ['AB', 'AB', 'AAB', 'ABB', 'ABC', 'AABB', 'ABAC'];
const STEPS = [1, 1, 2, 5, 10]; // counting by 1s is most common
const MAX_SHOWN = 8; // keeps the whole pattern on one row, even on small phones

let answer = null;
let streak = 0;
let locked = false;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// e.g. shape 'AAB' with 🔴🔵 → 🔴🔴🔵🔴🔴🔵🔴 ❓ (answer 🔴). Always shows at
// least two full repeats so the pattern is visible, and at most MAX_SHOWN.
function makeEmojiRound() {
  const shape = randomItem(SHAPES);
  const kinds = [...new Set(shape)];
  const set = shuffle([...randomItem(SETS)]);
  const items = Object.fromEntries(kinds.map((k, i) => [k, set[i]]));
  const length = shape.length * 2 + randomInt(0, Math.min(shape.length - 1, MAX_SHOWN - shape.length * 2));
  const shown = Array.from({ length }, (_, i) => items[shape[i % shape.length]]);
  const correct = items[shape[length % shape.length]];
  const wrong = shuffle(set.filter((x) => x !== correct)).slice(0, 2);
  // Prefer wrong choices that appear in the pattern, so guessing is harder.
  const inPattern = Object.values(items).filter((x) => x !== correct);
  const choices = [...new Set([...inPattern, ...wrong])].slice(0, 2);
  return { shown, correct, choices: shuffle([correct, ...choices]), numbers: false };
}

// e.g. counting by 2s: 4, 6, 8, 10, ❓ (answer 12).
function makeNumberRound() {
  const step = randomItem(STEPS);
  const start = step * randomInt(step === 1 ? 1 : 0, step === 1 ? 10 : 4) || step;
  const shown = Array.from({ length: 4 }, (_, i) => start + i * step);
  const correct = start + 4 * step;
  const near = [correct + step, correct + 1, correct - 1, correct + 2, correct + step + 1, correct + 10].filter(
    (n) => n > 0 && n !== correct && !shown.includes(n),
  );
  const choices = shuffle([...new Set(near)]).slice(0, 2);
  return { shown, correct, choices: shuffle([correct, ...choices]), numbers: true };
}

function showMessage(text) {
  document.getElementById('message').textContent = text;
}

function newRound() {
  locked = false;
  showMessage('');
  const round = Math.random() < NUMBER_SHARE ? makeNumberRound() : makeEmojiRound();
  answer = round.correct;

  const seq = document.getElementById('sequence');
  seq.innerHTML = '';
  seq.classList.toggle('numbers', round.numbers);
  seq.style.setProperty('--n', round.shown.length + 1);
  round.shown.forEach((item, i) => {
    const span = document.createElement('span');
    span.className = 'item';
    span.textContent = item;
    span.style.animationDelay = `${i * 0.05}s`;
    seq.appendChild(span);
  });
  const slot = document.createElement('span');
  slot.id = 'slot';
  slot.className = 'item slot';
  slot.textContent = '?';
  seq.appendChild(slot);

  const choices = document.getElementById('choices');
  choices.innerHTML = '';
  choices.classList.toggle('numbers', round.numbers);
  round.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice;
    btn.addEventListener('click', () => pick(btn, choice));
    choices.appendChild(btn);
  });
}

function pick(btn, choice) {
  if (locked || btn.disabled) return;
  if (choice !== answer) {
    btn.disabled = true;
    btn.classList.add('wrong');
    streak = 0;
    showMessage('Try again! 🙂');
    return;
  }
  locked = true;
  streak++;
  btn.classList.add('right');
  const slot = document.getElementById('slot');
  slot.textContent = answer;
  slot.classList.add('filled');
  showMessage(randomItem(['Yes! ⭐', 'Great! 🎉', 'You got it! 🌟', 'Super! 👏']));
  if (streak % CONFETTI_EVERY === 0) celebrate('🌟');
  setTimeout(newRound, NEXT_MS);
}

document.addEventListener('DOMContentLoaded', () => {
  newRound();
  document.getElementById('skip-btn').addEventListener('click', () => {
    streak = 0;
    newRound();
  });

  // Desktop: keys 1–3 pick the choices left to right.
  document.addEventListener('keydown', (e) => {
    const btn = document.querySelectorAll('.choice')[Number(e.key) - 1];
    if (btn) btn.click();
  });
});
