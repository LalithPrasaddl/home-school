// Question generators for the Olympiad mock papers, modelled on the Silverzone
// iOM Level 1 (Class 1) paper: 25 questions, 100 marks, 40 minutes, no
// negative marking. Each generator takes a seeded rng and returns
// { prompt, options, answer (index), figure?, html?, why? }. Papers are
// seeded by number, so "Paper 3" is always the same paper and can be retaken.

const EXAM_MINUTES = 40;
const PAPER_COUNT = 20;

// Small seeded PRNG (mulberry32) plus the helpers the generators use.
function makeRng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
  r.sample = (arr, n) => r.shuffle([...arr]).slice(0, n);
  return r;
}

// Builds a question. `wrong` must already be distinct and not the answer.
function mcq(r, prompt, correct, wrong, extra = {}) {
  const opts = [correct, ...wrong.slice(0, 3)];
  if (!extra.keepOrder) r.shuffle(opts);
  return { prompt, options: opts.map(String), answer: opts.indexOf(correct), ...extra };
}

// Three wrong numbers: the given candidates first (in order), then nearby numbers.
function wrongNums(r, ans, cands, min = 0, max = Infinity) {
  const out = [];
  const add = (c) => {
    if (out.length < 3 && Number.isInteger(c) && c >= min && c <= max && c !== ans && !out.includes(c)) out.push(c);
  };
  cands.forEach(add);
  r.shuffle([1, -1, 2, -2, 10, -10, 3, -3, 5]).forEach((d) => add(ans + d));
  return out;
}

// Three wrong picks from a list of strings, without the answer.
const wrongFrom = (r, ans, pool) => r.sample([...new Set(pool)].filter((x) => x !== ans), 3);

// ---------- words ----------
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const numberName = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
const ORDINALS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const NAMES = ['Asha', 'Ravi', 'Meena', 'Arjun', 'Priya', 'Kiran', 'Anu', 'Rohan', 'Divya', 'Nikhil', 'Sneha', 'Varun'];
const THINGS = [
  { one: 'apple', many: 'apples', emoji: '🍎' },
  { one: 'balloon', many: 'balloons', emoji: '🎈' },
  { one: 'pencil', many: 'pencils', emoji: '✏️' },
  { one: 'ball', many: 'balls', emoji: '⚽' },
  { one: 'flower', many: 'flowers', emoji: '🌼' },
  { one: 'mango', many: 'mangoes', emoji: '🥭' },
  { one: 'book', many: 'books', emoji: '📕' },
  { one: 'laddoo', many: 'laddoos', emoji: '🟠' },
];
// Odd-one-out groups. Kept to groups with no overlap (no birds vs animals, no tomato).
const GROUPS = [
  { name: 'fruits', items: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍', '🥭', '🍐'] },
  { name: 'vegetables', items: ['🥕', '🥦', '🌽', '🍆', '🥔', '🧅'] },
  { name: 'vehicles', items: ['🚗', '🚌', '🚲', '🚂', '✈️', '🚀', '🚕'] },
  { name: 'clothes', items: ['👕', '👖', '👗', '🧦', '🧢', '🧥'] },
  { name: 'animals', items: ['🐶', '🐱', '🐮', '🐷', '🐴', '🐑', '🐰', '🦁'] },
  { name: 'things for school', items: ['✏️', '📏', '✂️', '📚', '🖍️', '🎒'] },
];

// ---------- figures (HTML strings; all content is generated here, never user input) ----------
const row = (items, cls = '') => `<div class="fig-row ${cls}">${items.map((i) => `<span>${i}</span>`).join('')}</div>`;
const big = (text) => `<div class="fig-big">${text}</div>`;
const repeat = (s, n) => Array(n).fill(s);

const SHAPE_COLORS = ['#f582ae', '#8bd3dd', '#f2b632', '#7bc47f', '#a78bfa'];
const SHAPE_NAMES = ['circle', 'square', 'triangle', 'rectangle', 'oval'];
// A square is also a rectangle, so a rectangle question never shows squares.
const otherShapes = (target) => SHAPE_NAMES.filter((s) => s !== target && !(target === 'rectangle' && s === 'square'));
function shapeSvg(kind, color) {
  const body = {
    circle: '<circle cx="30" cy="30" r="24"/>',
    square: '<rect x="8" y="8" width="44" height="44"/>',
    rectangle: '<rect x="3" y="16" width="54" height="28"/>',
    triangle: '<polygon points="30,6 56,52 4,52"/>',
    oval: '<ellipse cx="30" cy="30" rx="27" ry="17"/>',
  }[kind];
  return `<svg class="shape" viewBox="0 0 60 60" fill="${color}" stroke="#2b2d42" stroke-width="2.5" stroke-linejoin="round" role="img" aria-label="${kind}">${body}</svg>`;
}

function clockSvg(h, m) {
  const hand = (deg, len, w) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `<line x1="50" y1="50" x2="${(50 + len * Math.cos(a)).toFixed(1)}" y2="${(50 + len * Math.sin(a)).toFixed(1)}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  const nums = Array.from({ length: 12 }, (_, i) => {
    const a = (((i + 1) * 30 - 90) * Math.PI) / 180;
    return `<text x="${(50 + 37 * Math.cos(a)).toFixed(1)}" y="${(50 + 37 * Math.sin(a)).toFixed(1)}">${i + 1}</text>`;
  }).join('');
  return `<svg class="clock" viewBox="0 0 100 100" role="img" aria-label="clock">
    <circle cx="50" cy="50" r="47" fill="#fff" stroke="#2b2d42" stroke-width="3"/>
    <g class="clock-nums">${nums}</g>
    <g stroke="#2b2d42">${hand(((h % 12) + m / 60) * 30, 22, 5)}${hand(m * 6, 34, 3)}</g>
    <circle cx="50" cy="50" r="3" fill="#2b2d42"/></svg>`;
}

// Money as coins and notes; `notes` says which values are drawn as notes.
const money = (values, notes = []) =>
  `<div class="fig-row money">${values
    .map((v, i) => (notes.includes(i) ? `<span class="note">₹${v}</span>` : `<span class="coin">₹${v}</span>`))
    .join('')}</div>`;

// Ribbons labelled A–D, lengths in % of the box width.
const ribbons = (lengths) =>
  `<div class="ribbons">${lengths
    .map((len, i) => `<div class="ribbon-row"><b>${'ABCD'[i]}</b><span class="ribbon" style="width:${len}%"></span></div>`)
    .join('')}</div>`;

// A ribbon lying on n unit squares.
const unitRibbon = (n) =>
  `<div class="units" style="--n:${n}"><span class="ribbon"></span><div class="unit-row">${'<span></span>'.repeat(n)}</div></div>`;

// ---------- Number Sense ----------
function nsNeighbour(r) {
  const n = r.int(11, 98);
  const kind = r.pick(['after', 'before', 'between']);
  if (kind === 'after')
    return mcq(r, `Which number comes just after ${n}?`, n + 1, wrongNums(r, n + 1, [n, n - 1, n + 10]), { why: `${n} + 1 = ${n + 1}` });
  if (kind === 'before')
    return mcq(r, `Which number comes just before ${n}?`, n - 1, wrongNums(r, n - 1, [n, n + 1, n - 10]), { why: `${n} − 1 = ${n - 1}` });
  return mcq(r, `Which number comes between ${n - 1} and ${n + 1}?`, n, wrongNums(r, n, [n + 2, n - 2, n + 10]), {
    why: `${n - 1}, ${n}, ${n + 1}`,
  });
}

function nsCountBack(r) {
  const start = r.int(15, 60);
  const blank = r.int(1, 3);
  const seq = [0, 1, 2, 3].map((i) => (i === blank ? '__' : start - i));
  const ans = start - blank;
  return mcq(r, 'Count backwards. Which number goes in the blank?', ans, wrongNums(r, ans, [ans + 2, ans - 2, ans + 10]), {
    figure: big(seq.join(', ')),
    why: `Counting back by 1: ${[0, 1, 2, 3].map((i) => start - i).join(', ')}`,
  });
}

function nsPlaceValue(r) {
  const t = r.int(1, 9);
  let o = r.int(0, 9);
  if (o === t) o = (o + 3) % 10;
  const n = t * 10 + o;
  const kind = r.pick(['make', 'tens', 'ones']);
  if (kind === 'make')
    return mcq(r, `Which number has ${t} tens and ${o} ones?`, n, wrongNums(r, n, r.shuffle([o * 10 + t, t + o, n + 10, t * 10])), {
      why: `${t} tens = ${t * 10}, and ${t * 10} + ${o} = ${n}`,
    });
  if (kind === 'tens')
    return mcq(r, `How many tens are there in ${n}?`, t, wrongNums(r, t, [o, n, t + 1]), { why: `${n} = ${t} tens and ${o} ones` });
  return mcq(r, `Which digit is in the ones place in ${n}?`, o, wrongNums(r, o, [t, n, o + 1]), { why: `${n} = ${t} tens and ${o} ones` });
}

function nsNames(r) {
  const n = r.int(11, 99);
  const rev = (n % 10) * 10 + Math.floor(n / 10);
  if (r.chance(0.5)) {
    const wrong = wrongNums(r, n, r.shuffle([rev, n + 10, n - 10, n + 1]), 10, 99);
    return mcq(r, `Which number is "${numberName(n)}"?`, n, wrong, { why: `${numberName(n)} = ${n}` });
  }
  const wrong = wrongNums(r, n, r.shuffle([rev, n + 10, n - 10, n + 1]), 10, 99).map(numberName);
  return mcq(r, `How do we write ${n} in words?`, numberName(n), wrong, { small: true });
}

// ---------- Computation Operations ----------
function cAdd(r) {
  const a = r.int(11, 70);
  const b = r.int(3, Math.min(25, 99 - a));
  const ans = a + b;
  const carried = (a % 10) + (b % 10) >= 10;
  return mcq(r, `What is ${a} + ${b}?`, ans, wrongNums(r, ans, r.shuffle([carried ? ans - 10 : ans + 10, ans + 1, ans - 1])), {
    figure: big(`${a} + ${b} = ?`),
  });
}

function cSub(r) {
  const a = r.int(20, 99);
  const b = r.int(3, Math.min(30, a - 5));
  const ans = a - b;
  const borrowed = a % 10 < b % 10;
  return mcq(r, `What is ${a} − ${b}?`, ans, wrongNums(r, ans, r.shuffle([borrowed ? ans + 10 : ans - 10, ans + 1, ans - 1, a + b])), {
    figure: big(`${a} − ${b} = ?`),
  });
}

function cStory(r) {
  const who = r.pick(NAMES);
  const thing = r.pick(THINGS);
  if (r.chance(0.5)) {
    const a = r.int(4, 12);
    const b = r.int(3, 9);
    return mcq(r, `${who} has ${a} ${thing.many}. A friend gives ${b} more. How many ${thing.many} are there now?`, a + b,
      wrongNums(r, a + b, [a - b, a + b + 1, a + b - 1]), { why: `${a} + ${b} = ${a + b}` });
  }
  const a = r.int(10, 20);
  const b = r.int(3, a - 3);
  return mcq(r, `${who} had ${a} ${thing.many}. ${who} gave away ${b}. How many ${thing.many} are left?`, a - b,
    wrongNums(r, a - b, [a + b, a - b + 1, a - b - 1]), { why: `${a} − ${b} = ${a - b}` });
}

function cMissing(r) {
  const a = r.int(2, 15);
  const ans = r.int(2, 12);
  const sum = a + ans;
  return mcq(r, `Which number added to ${a} makes ${sum}?`, ans, wrongNums(r, ans, [sum, a, ans + 1, ans - 1]), {
    figure: big(`${a} + ☐ = ${sum}`),
    why: `${sum} − ${a} = ${ans}`,
  });
}

function cCompare(r) {
  if (r.chance(0.4)) {
    let a = r.int(12, 98);
    let b = r.chance(0.3) ? a : r.chance(0.5) ? (a % 10) * 10 + Math.floor(a / 10) : r.int(12, 98);
    if (b < 10) b += 30;
    const sign = a > b ? '>' : a < b ? '<' : '=';
    const words = { '>': 'is greater than', '<': 'is less than', '=': 'is equal to' };
    return mcq(r, `Which sign goes in the box?`, sign, ['>', '<', '='].filter((s) => s !== sign), {
      figure: big(`${a} ☐ ${b}`),
      why: `${a} ${words[sign]} ${b}`,
    });
  }
  const n = r.int(21, 89);
  const rev = (n % 10) * 10 + Math.floor(n / 10);
  const nums = [...new Set([n, rev, n + r.int(1, 9), n - r.int(1, 9), n + 10, n - 10])].filter((x) => x >= 10 && x <= 99);
  const four = r.sample(nums, 4);
  const greatest = r.chance(0.5);
  const ans = greatest ? Math.max(...four) : Math.min(...four);
  return mcq(r, `Which is the ${greatest ? 'greatest' : 'smallest'} number?`, ans, four.filter((x) => x !== ans));
}

function cPicture(r) {
  const thing = r.pick(THINGS);
  const a = r.int(2, 8);
  const b = r.int(2, 8);
  return mcq(r, `Count and add. How many ${thing.many} are there in all?`, a + b, wrongNums(r, a + b, [a + b + 1, a + b - 1, a * b]), {
    figure: `<div class="fig-sum">${row(repeat(thing.emoji, a), 'tight')}<b>+</b>${row(repeat(thing.emoji, b), 'tight')}</div>`,
    why: `${a} + ${b} = ${a + b}`,
  });
}

// ---------- Patterns ----------
const PATTERN_SETS = [
  ['🔴', '🔵', '🟢', '🟡', '🟣'],
  ['🍎', '🍌', '🍇', '🍊', '🍓'],
  ['🐶', '🐱', '🐭', '🐰', '🐸'],
  ['☀️', '🌙', '⭐', '☁️', '⚡'],
  ['🔺', '⭐', '❤️', '🔷', '⚫'],
];
function pEmoji(r) {
  const shape = r.pick(['AB', 'AAB', 'ABB', 'ABC', 'AABB', 'ABCC']);
  const set = r.sample(r.pick(PATTERN_SETS), 5);
  const kinds = [...new Set(shape)];
  const item = Object.fromEntries(kinds.map((k, i) => [k, set[i]]));
  const len = shape.length * 2 + r.int(0, shape.length - 1);
  const shown = Array.from({ length: len }, (_, i) => item[shape[i % shape.length]]);
  const ans = item[shape[len % shape.length]];
  const wrong = [...kinds.map((k) => item[k]), ...set].filter((x, i, a) => x !== ans && a.indexOf(x) === i).slice(0, 3);
  return mcq(r, 'What comes next in the pattern?', ans, wrong, { figure: row([...shown, '❓'], 'pattern') });
}

function pNumber(r) {
  const step = r.pick([2, 5, 10, 3, -1, -2, -10]);
  const len = 5;
  const start = step > 0 ? r.int(1, 99 - step * (len - 1)) : r.int(-step * (len - 1) + 1, 99);
  const seq = Array.from({ length: len }, (_, i) => start + i * step);
  const blank = r.chance(0.5) ? len - 1 : r.int(1, len - 2);
  const ans = seq[blank];
  const shown = seq.map((n, i) => (i === blank ? '__' : n));
  const by = step > 0 ? `adding ${step}` : `taking away ${-step}`;
  return mcq(r, 'Which number goes in the blank?', ans, wrongNums(r, ans, r.shuffle([ans + 1, ans - 1, ans + 10, ans - 10]), 0), {
    figure: big(shown.join(', ')),
    why: `Each number is found by ${by}: ${seq.join(', ')}`,
  });
}

function pGrow(r) {
  const thing = r.pick(['🔵', '⭐', '🍎', '🟩']);
  const first = r.int(1, 2);
  const step = r.int(1, 2);
  const counts = [0, 1, 2].map((i) => first + i * step);
  const ans = first + 3 * step;
  return mcq(r, `Look at the pattern. How many ${thing} will come in the next group?`, ans, wrongNums(r, ans, [ans + 1, ans - 1, counts[2]]), {
    figure: `<div class="fig-groups">${counts.map((c) => row(repeat(thing, c), 'tight')).join('')}<div class="fig-row"><span>❓</span></div></div>`,
    why: `The groups grow by ${step}: ${[...counts, ans].join(', ')}`,
  });
}

// ---------- Money & Time ----------
function mCount(r) {
  const coins = [1, 2, 5, 10];
  const notes = [10, 20, 50];
  let vals;
  do {
    vals = Array.from({ length: r.int(2, 4) }, () => (r.chance(0.35) ? r.pick(notes) : r.pick(coins)));
  } while (vals.reduce((a, b) => a + b, 0) > 70);
  vals.sort((a, b) => b - a);
  const total = vals.reduce((a, b) => a + b, 0);
  // ₹20 and ₹50 are notes; ₹10 comes as both, so draw some of each.
  const html = money(vals, vals.map((v, i) => (v >= 20 || (v === 10 && i % 2 === 0) ? i : -1)));
  return mcq(r, 'How much money is there in all?', `₹${total}`, wrongNums(r, total, [total + 1, total - 1, total + 5, total - 5], 1).map((n) => `₹${n}`), {
    figure: html,
    why: `${vals.map((v) => `₹${v}`).join(' + ')} = ₹${total}`,
  });
}

function mBuy(r) {
  const who = r.pick(NAMES);
  if (r.chance(0.5)) {
    const [x, y] = r.sample([
      ['a pencil', 2, 9],
      ['an eraser', 2, 6],
      ['a notebook', 10, 30],
      ['a ball', 10, 25],
      ['a chocolate', 5, 20],
      ['a balloon', 3, 8],
    ], 2);
    const px = r.int(x[1], x[2]);
    const py = r.int(y[1], y[2]);
    const ans = px + py;
    return mcq(r, `${x[0][0].toUpperCase() + x[0].slice(1)} costs ₹${px} and ${y[0]} costs ₹${py}. How much do both cost?`, `₹${ans}`,
      wrongNums(r, ans, [ans + 1, ans - 1, ans + 10], 1).map((n) => `₹${n}`), { why: `₹${px} + ₹${py} = ₹${ans}` });
  }
  const have = r.pick([10, 20, 50]);
  const spend = r.int(3, have - 2);
  const ans = have - spend;
  return mcq(r, `${who} has ₹${have} and buys a toy for ₹${spend}. How much money is left?`, `₹${ans}`,
    wrongNums(r, ans, [have + spend, ans + 1, ans - 1, ans + 10], 1).map((n) => `₹${n}`), { why: `₹${have} − ₹${spend} = ₹${ans}` });
}

function mHowMany(r) {
  const coin = r.pick([1, 2, 5, 10]);
  const k = r.int(2, 5);
  const total = coin * k;
  return mcq(r, `How many ₹${coin} coins make ₹${total}?`, k, wrongNums(r, k, [total, k + 1, k - 1, coin]), {
    figure: money(repeat(coin, k)),
    why: `${repeat(`₹${coin}`, k).join(' + ')} = ₹${total}`,
  });
}

const oClock = (h) => `${h} o'clock`;
const halfPast = (h) => `half past ${h}`;
const nextHour = (h) => (h % 12) + 1;
const prevHour = (h) => ((h + 10) % 12) + 1;
function tClock(r) {
  const h = r.int(1, 12);
  const half = r.chance(0.5);
  const ans = half ? halfPast(h) : oClock(h);
  const pool = [oClock(h), halfPast(h), halfPast(prevHour(h)), oClock(nextHour(h)), oClock(prevHour(h)), halfPast(nextHour(h))];
  return mcq(r, 'What time is it on the clock?', ans, wrongFrom(r, ans, pool), {
    figure: clockSvg(h, half ? 30 : 0),
    small: true,
    why: half ? `The long hand is on 6 and the short hand is just after ${h}.` : `The long hand is on 12 and the short hand is on ${h}.`,
  });
}

function tCalendar(r) {
  const months = r.chance(0.4);
  const list = months ? MONTHS : DAYS;
  const i = r.int(0, list.length - 1);
  const n = list.length;
  const kind = r.pick(['after', 'before', 'between']);
  const what = months ? 'month' : 'day';
  if (kind === 'between') {
    const ans = list[i];
    return mcq(r, `Which ${what} comes between ${list[(i + n - 1) % n]} and ${list[(i + 1) % n]}?`, ans,
      wrongFrom(r, ans, [list[(i + 2) % n], list[(i + n - 2) % n], list[(i + 3) % n]]), { small: true });
  }
  const ans = list[(i + (kind === 'after' ? 1 : n - 1)) % n];
  return mcq(r, `Which ${what} comes just ${kind} ${list[i]}?`, ans,
    wrongFrom(r, ans, [list[(i + 1) % n], list[(i + n - 1) % n], list[(i + 2) % n], list[(i + n - 2) % n]]), {
      small: true,
      why: months ? MONTHS.join(', ') : DAYS.join(', '),
    });
}

function tFacts(r) {
  const fact = r.pick([
    ['How many days are there in a week?', 7, [5, 6, 12]],
    ['How many months are there in a year?', 12, [7, 10, 30]],
    ['Which is the first month of the year?', 'January', ['December', 'March', 'June']],
    ['Which is the last month of the year?', 'December', ['January', 'November', 'October']],
  ]);
  return mcq(r, fact[0], fact[1], fact[2], { small: typeof fact[1] === 'string' });
}

// ---------- Length, Weight and Comparison ----------
// Tiers are rough weights. The answer is always at least 2 tiers away from every
// other option, so there's never a "well, a big cat…" argument.
const WEIGHT_TIERS = [['🪶', '🐜', '🍃'], ['🍎', '✏️', '🥚'], ['🐱', '🐔'], ['🐕', '🐐'], ['🐄', '🐎'], ['🐘', '🚌', '🚚']];
const CAPACITY_TIERS = [['🥄'], ['☕', '🥛', '🍼'], ['🫖'], ['🪣'], ['🛁']];
function extremeOf(r, tiers, most) {
  const othersFor = (t) => tiers.filter((_, i) => (most ? i <= t - 2 : i >= t + 2)).flat();
  const t = r.pick(tiers.map((_, i) => i).filter((i) => othersFor(i).length >= 3));
  return { ans: r.pick(tiers[t]), wrong: r.sample(othersFor(t), 3) };
}

function msWeight(r) {
  const heaviest = r.chance(0.5);
  const { ans, wrong } = extremeOf(r, WEIGHT_TIERS, heaviest);
  return mcq(r, `Which one is the ${heaviest ? 'heaviest' : 'lightest'}?`, ans, wrong);
}

function msCapacity(r) {
  const most = r.chance(0.5);
  const { ans, wrong } = extremeOf(r, CAPACITY_TIERS, most);
  return mcq(r, `Which one can hold the ${most ? 'most' : 'least'} water?`, ans, wrong);
}

function msRibbons(r) {
  const lengths = r.sample([25, 40, 55, 70, 85, 100], 4);
  const longest = r.chance(0.5);
  const target = longest ? Math.max(...lengths) : Math.min(...lengths);
  const ans = 'ABCD'[lengths.indexOf(target)];
  return mcq(r, `Which ribbon is the ${longest ? 'longest' : 'shortest'}?`, ans, [...'ABCD'].filter((l) => l !== ans), {
    figure: ribbons(lengths),
    keepOrder: true,
  });
}

function msUnits(r) {
  const n = r.int(3, 9);
  return mcq(r, 'How many small squares long is the ribbon?', n, wrongNums(r, n, [n + 1, n - 1, n + 2], 1), { figure: unitRibbon(n) });
}

// ---------- Geometrical Shapes ----------
function sWhich(r) {
  const colors = r.shuffle([...SHAPE_COLORS]);
  const toSvg = (kind) => shapeSvg(kind, colors[SHAPE_NAMES.indexOf(kind)]);
  if (r.chance(0.25)) {
    return mcq(r, 'Which shape has no corners?', toSvg('circle'), ['square', 'triangle', 'rectangle'].map(toSvg), {
      html: true,
      why: 'A circle is round, so it has no corners.',
    });
  }
  const target = r.pick(SHAPE_NAMES);
  return mcq(r, `Which one is ${target === 'oval' ? 'an' : 'a'} ${target}?`, toSvg(target), r.sample(otherShapes(target), 3).map(toSvg), { html: true });
}

function sFacts(r) {
  const [shape, part, ans] = r.pick([
    ['triangle', 'sides', 3], ['triangle', 'corners', 3], ['square', 'sides', 4],
    ['square', 'corners', 4], ['rectangle', 'sides', 4], ['circle', 'corners', 0],
  ]);
  return mcq(r, `How many ${part} does a ${shape} have?`, ans, wrongNums(r, ans, r.shuffle([0, 2, 3, 4, 5, 6])), {
    figure: shapeSvg(shape, r.pick(SHAPE_COLORS)),
  });
}

function sCount(r) {
  const target = r.pick(SHAPE_NAMES);
  const n = r.int(2, 6);
  const others = otherShapes(target);
  const kinds = r.shuffle([...repeat(target, n), ...Array.from({ length: r.int(4, 10 - n) }, () => r.pick(others))]);
  const figure = `<div class="fig-shapes">${kinds.map((k) => shapeSvg(k, r.pick(SHAPE_COLORS))).join('')}</div>`;
  return mcq(r, `How many ${target}s are there?`, n, wrongNums(r, n, [n + 1, n - 1, kinds.length]), { figure });
}

const SOLIDS = [
  { name: 'a ball (sphere)', items: ['⚽', '🏀', '🌍'] },
  { name: 'a cube', items: ['🎲', '🧊'] },
  { name: 'a cylinder', items: ['🥫', '🔋'] },
  { name: 'a cone', items: ['🍦'] },
  { name: 'a box (cuboid)', items: ['📦', '🧱'] },
];
function sSolids(r) {
  const [target, ...rest] = r.sample(SOLIDS, 4);
  return mcq(r, `Which one has the shape of ${target.name}?`, r.pick(target.items), rest.map((s) => r.pick(s.items)));
}

// ---------- Reasoning and Aptitude ----------
function rOddOne(r) {
  const [main, other] = r.sample(GROUPS, 2);
  const ans = r.pick(other.items);
  return mcq(r, 'Which one is the odd one out?', ans, r.sample(main.items, 3), {
    why: `The others are all ${main.name}.`,
  });
}

function rBelongs(r) {
  const [main, ...others] = r.sample(GROUPS, 4);
  const [ans, ...shown] = r.sample(main.items, 4);
  return mcq(r, 'Which one belongs to this group?', ans, others.map((g) => r.pick(g.items)), {
    figure: row(shown),
    why: `They are all ${main.name}.`,
  });
}

function rLetters(r) {
  const step = r.int(1, 3);
  const start = r.int(0, 25 - step * 4);
  const L = (i) => String.fromCharCode(65 + i);
  const shown = [0, 1, 2, 3].map((i) => L(start + i * step));
  const a = start + 4 * step;
  const ans = L(a);
  const near = [1, -1, 2, -2, step, 3, -3].map((d) => a + d).filter((i) => i >= 0 && i < 26 && i !== a);
  return mcq(r, 'Which letter comes next?', ans, [...new Set(near)].slice(0, 3).map(L), {
    figure: big(`${shown.join(', ')}, ?`),
    why: step === 1 ? 'The letters go in order.' : `Skip ${step - 1} letter${step > 2 ? 's' : ''} each time.`,
  });
}

function rPosition(r) {
  const items = r.sample(['🐶', '🐱', '🐭', '🐰', '🐸', '🐵', '🐼', '🦁', '🐷'], 6);
  const k = r.int(2, 5);
  const fromLeft = r.chance(0.5);
  const idx = fromLeft ? k - 1 : items.length - k;
  const ans = items[idx];
  const mirror = items[fromLeft ? items.length - k : k - 1];
  const pool = [mirror, items[idx - 1], items[idx + 1], ...items].filter((x) => x && x !== ans);
  const wrong = [...new Set(pool)].slice(0, 3);
  return mcq(r, `Which animal is ${ORDINALS[k]} from the ${fromLeft ? 'left' : 'right'}?`, ans, wrong, {
    figure: `<div class="fig-sides"><span>left</span>${row(items)}<span>right</span></div>`,
  });
}

function rCount(r) {
  const [target, ...rest] = r.sample(['🍎', '⭐', '🌼', '🐟', '🎈'], 3);
  const n = r.int(4, 9);
  const items = r.shuffle([...repeat(target, n), ...Array.from({ length: r.int(6, 15 - n) }, () => r.pick(rest))]);
  return mcq(r, `How many ${target} are there?`, n, wrongNums(r, n, [n + 1, n - 1, items.length]), {
    figure: `<div class="fig-grid">${items.map((i) => `<span>${i}</span>`).join('')}</div>`,
  });
}

function rMoreThan(r) {
  const [x, y] = r.sample([['🐟', 'fish'], ['🐢', 'turtles'], ['🦆', 'ducks'], ['🐸', 'frogs'], ['🦋', 'butterflies']], 2);
  const a = r.int(5, 9);
  const b = r.int(2, a - 1);
  return mcq(r, `How many more ${x[1]} than ${y[1]} are there?`, a - b, wrongNums(r, a - b, [a, b, a + b]), {
    figure: `<div class="fig-groups">${row(repeat(x[0], a), 'tight')}${row(repeat(y[0], b), 'tight')}</div>`,
    why: `${a} − ${b} = ${a - b}`,
  });
}

// ---------- Scholar's Zone (higher-order thinking) ----------
function zLegs(r) {
  const [two, twoE] = r.pick([['hens', '🐔'], ['ducks', '🦆']]);
  const [four, fourE] = r.pick([['cows', '🐄'], ['dogs', '🐕'], ['goats', '🐐']]);
  const a = r.int(1, 3);
  const b = r.int(1, 2);
  const ans = a * 2 + b * 4;
  const name = (n, plural) => (n === 1 ? `1 ${plural.replace(/s$/, '')}` : `${n} ${plural}`);
  return mcq(r, `How many legs do ${name(a, two)} and ${name(b, four)} have in all?`, ans, wrongNums(r, ans, [a + b, ans + 2, ans - 2, (a + b) * 4]), {
    figure: row([...repeat(twoE, a), ...repeat(fourE, b)]),
    why: `${a} × 2 legs + ${b} × 4 legs = ${a * 2} + ${b * 4} = ${ans}`,
  });
}

function zHeights(r) {
  const [a, b, c] = r.sample(NAMES, 3); // a > b > c
  const tallest = r.chance(0.5);
  const ans = tallest ? a : c;
  return mcq(r, `${a} is taller than ${b}. ${b} is taller than ${c}. Who is the ${tallest ? 'tallest' : 'shortest'}?`, ans,
    [...[a, b, c].filter((n) => n !== ans), 'Cannot say'], { why: `From tallest to shortest: ${a}, ${b}, ${c}` });
}

function zDays(r) {
  const i = r.int(0, 6);
  const k = r.int(2, 4);
  const later = r.chance(0.6);
  const ans = DAYS[(i + (later ? k : 7 - k)) % 7];
  const prompt = later
    ? `Today is ${DAYS[i]}. What day will it be after ${k} days?`
    : `Today is ${DAYS[i]}. What day was it ${k} days ago?`;
  const near = [-1, 1, -2, 2].map((d) => DAYS[(DAYS.indexOf(ans) + d + 7) % 7]);
  return mcq(r, prompt, ans, wrongFrom(r, ans, [...near, DAYS[i]]), { small: true });
}

function zDigits(r) {
  const [a, b] = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  const biggest = r.chance(0.5);
  const ans = biggest ? hi * 10 + lo : lo * 10 + hi;
  return mcq(r, `Using both digits ${a} and ${b} once, what is the ${biggest ? 'biggest' : 'smallest'} 2-digit number you can make?`, ans,
    [hi * 10 + lo, lo * 10 + hi, hi * 11, lo * 11, a + b].filter((n, i, arr) => n !== ans && arr.indexOf(n) === i).slice(0, 3), {
      why: biggest ? `Put the bigger digit (${hi}) in the tens place.` : `Put the smaller digit (${lo}) in the tens place.`,
    });
}

function zAges(r) {
  const [kid, sib] = r.pick([['Meena', 'brother'], ['Arjun', 'sister'], ['Priya', 'sister'], ['Rohan', 'brother']]);
  const age = r.int(5, 7);
  const diff = r.int(2, 4);
  const later = r.int(1, 3);
  const ans = age + diff + later;
  return mcq(r, `${kid} is ${age} years old. ${kid}'s ${sib} is ${diff} years older. How old will the ${sib} be after ${later} year${later > 1 ? 's' : ''}?`, ans,
    wrongNums(r, ans, [age + diff, age + later, ans + 1]), { why: `Now: ${age} + ${diff} = ${age + diff}. After ${later}: ${age + diff} + ${later} = ${ans}` });
}

function zShare(r) {
  const thing = r.pick(THINGS);
  const kids = r.pick([2, 2, 3]);
  const each = r.int(2, kids === 2 ? 8 : 5);
  const total = kids * each;
  return mcq(r, `${total} ${thing.many} are shared equally by ${kids} children. How many does each child get?`, each,
    wrongNums(r, each, [total, total - kids, each + 1, each - 1], 1), {
      figure: row(repeat(thing.emoji, total), 'tight'),
      why: `${repeat(each, kids).join(' + ')} = ${total}`,
    });
}

function zRiddle(r) {
  if (r.chance(0.5)) {
    const t = r.int(1, 7);
    const d = r.int(1, 2);
    const ans = t * 10 + t + d;
    return mcq(r, `I am a 2-digit number. My tens digit is ${t}. My ones digit is ${d} more than my tens digit. Who am I?`, ans,
      wrongNums(r, ans, [(t + d) * 10 + t, t * 10 + t, t * 10 + d]), { why: `Tens = ${t}, ones = ${t} + ${d} = ${t + d}` });
  }
  const n = r.int(12, 85);
  const [delta, words] = r.pick([[10, '10 more than'], [-10, '10 less than'], [1, '1 more than'], [-1, '1 less than']]);
  const ans = n + delta;
  return mcq(r, `I am ${words} ${n}. Who am I?`, ans, wrongNums(r, ans, [n - delta, n, ans + 1, ans - 1]));
}

// ---------- the paper ----------
const SECTIONS = [
  { title: 'Number Sense', count: 2, marks: 3.5, gens: [nsNeighbour, nsCountBack, nsPlaceValue, nsNames] },
  { title: 'Computation Operations', count: 5, marks: 3.5, gens: [cAdd, cSub, cStory, cMissing, cCompare, cPicture] },
  { title: 'Patterns', count: 2, marks: 3.5, gens: [pEmoji, pNumber, pGrow] },
  // One money and one time question, like the real paper.
  { title: 'Money & Time', count: 2, marks: 3.5, gens: [(r) => r.pick([mCount, mBuy, mHowMany])(r), (r) => r.pick([tClock, tClock, tCalendar, tFacts])(r)] },
  { title: 'Length, Weight & Comparison', count: 2, marks: 3.5, gens: [msWeight, msCapacity, msRibbons, msUnits] },
  { title: 'Geometrical Shapes', count: 2, marks: 3.5, gens: [sWhich, sFacts, sCount, sSolids] },
  { title: 'Reasoning & Aptitude', count: 5, marks: 4.5, gens: [rOddOne, rBelongs, rLetters, rPosition, rCount, rMoreThan] },
  { title: "Scholar's Zone", count: 5, marks: 5, gens: [zLegs, zHeights, zDays, zDigits, zAges, zShare, zRiddle] },
];

function makePaper(number) {
  const r = makeRng(number * 7919 + 17);
  const questions = [];
  const seen = new Set();
  SECTIONS.forEach((section) => {
    const gens = r.shuffle([...section.gens]);
    for (let i = 0; i < section.count; i++) {
      for (let tries = 0; ; tries++) {
        const q = gens[(i + tries) % gens.length](r);
        const key = q.prompt + (q.figure || '');
        if (seen.has(key) && tries < 20) continue;
        seen.add(key);
        questions.push({ ...q, section });
        break;
      }
    }
  });
  return questions;
}
