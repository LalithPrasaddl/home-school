const ROUND_SIZE = 10;
const NEXT_MS = 1500;
const HALANT = '್';
const SIGNS = ['', 'ಾ', 'ಿ', 'ೀ', 'ು', 'ೂ', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ೌ', 'ಂ'];
const CONSONANTS = [...'ಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳ'];
// Everyday letters used to make the wrong choices, so they look plausible.
const COMMON = [...'ಕಗಚಜಟಡಣತದನಪಬಮಯಲವಶಷಸಹಳ'];

const LEVELS = [
  { kind: 'same', title: 'Same letter twice', sample: 'ಅಮ್ಮ' },
  { kind: 'diff', title: 'Two different letters', sample: 'ಪುಸ್ತಕ' },
  { kind: 'ark', title: 'ರ on top (arkavottu)', sample: 'ಸೂರ್ಯ' },
  { kind: 'all', title: 'Mix of everything', sample: 'ನಕ್ಷತ್ರ' },
];

let level = 'all';
let round = []; // questions for this round
let qIndex = 0;
let score = 0;
let missed = false; // has the current question had a wrong try?
let locked = false;
let learnKind = 'same';

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const join = (first, second, rest = '') => first + HALANT + second + rest;
const pair = (a, b) => `${a} + ${b}`;
const isConsonant = (ch) => CONSONANTS.includes(ch);

// "ಕ್ಕು" -> { first: 'ಕ', second: 'ಕ', rest: 'ು', kind: 'same' }. Parts
// without a joined letter (ಬೆ, or a word-final ಸ್) give null.
function splitPart(part) {
  const i = part.indexOf(HALANT);
  if (i < 1 || !isConsonant(part[i + 1])) return null;
  const first = part[i - 1];
  const second = part[i + 1];
  const kind = first === 'ರ' ? 'ark' : first === second ? 'same' : 'diff';
  return { first, second, rest: part.slice(i + 2), kind };
}

// One entry per joined letter in each word; a question asks about one.
const ITEMS = OTTU_WORDS.flatMap((w) => {
  const parts = w.parts.split(' ');
  return parts
    .map((part, at) => ({ ...w, parts, word: parts.join(''), at, ottu: splitPart(part) }))
    .filter((item) => item.ottu);
});

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'kn-IN';
  utter.rate = 0.75;
  const knVoice = speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('kn'));
  if (knVoice) utter.voice = knVoice;
  speechSynthesis.speak(utter);
}

// Two wrong spellings of a joined part: the usual slip (forgetting the
// ottu, or putting the letters the wrong way round) plus a different ottu.
function wrongParts(o) {
  const slips = [o.first + o.rest];
  if (o.kind === 'ark') slips.push(o.second + o.rest);
  if (o.first !== o.second) slips.push(join(o.second, o.first, o.rest));
  const other = randomItem(COMMON.filter((ch) => ch !== o.first && ch !== o.second));
  return [randomItem(slips), join(o.first, other, o.rest)];
}

function wrongPairs(o) {
  const [x, y] = shuffle(COMMON.filter((ch) => ch !== o.first && ch !== o.second));
  const others = shuffle([pair(o.first, x), pair(y, o.second)]);
  return o.first !== o.second ? [pair(o.second, o.first), others[0]] : others;
}

function makeQuestion(item) {
  const o = item.ottu;
  const type = randomItem(['listen', 'fill', 'split']);
  if (type === 'split') {
    return { type, item, answer: pair(o.first, o.second), choices: shuffle([pair(o.first, o.second), ...wrongPairs(o)]) };
  }
  const right = item.parts[item.at];
  const parts = [right, ...wrongParts(o)];
  if (type === 'fill') return { type, item, answer: right, choices: shuffle(parts) };
  const asWord = (part) => item.parts.map((p, i) => (i === item.at ? part : p)).join('');
  return { type, item, answer: item.word, choices: shuffle(parts.map(asWord)) };
}

// Ten questions, each on a different word where the level has enough.
function makeRound() {
  const pool = shuffle(ITEMS.filter((it) => level === 'all' || it.ottu.kind === level));
  const seen = new Set();
  const picked = [];
  pool.forEach((it) => {
    if (picked.length < ROUND_SIZE && !seen.has(it.word)) {
      seen.add(it.word);
      picked.push(it);
    }
  });
  return picked.map(makeQuestion);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('hidden', s.id !== id));
  document.getElementById('menu-btn').classList.toggle('invisible', id === 'menu-screen');
}

function showMessage(text) {
  document.getElementById('message').textContent = text;
}

// The word as spans, so one part can be highlighted or left as a gap.
function wordHtml(item, mode) {
  return item.parts
    .map((p, i) => {
      if (i !== item.at) return `<span>${p}</span>`;
      return mode === 'gap' ? '<span id="gap" class="gap">?</span>' : `<span class="hl">${p}</span>`;
    })
    .join('');
}

// ---- Menu ----
function renderLevels() {
  const box = document.getElementById('levels');
  box.innerHTML = '';
  LEVELS.forEach((lv) => {
    const btn = document.createElement('button');
    btn.className = 'level-card';
    btn.innerHTML = `<span class="level-sample">${lv.sample}</span><span class="level-title">${lv.title}</span>`;
    btn.addEventListener('click', () => {
      level = lv.kind;
      startRound();
    });
    box.appendChild(btn);
  });
}

// ---- Quiz ----
function startRound() {
  round = makeRound();
  qIndex = 0;
  score = 0;
  const pips = document.getElementById('pips');
  pips.innerHTML = round.map(() => '<span class="pip"></span>').join('');
  showScreen('quiz-screen');
  showQuestion();
}

function showQuestion() {
  const q = round[qIndex];
  locked = false;
  missed = false;
  showMessage('');
  document.querySelectorAll('.pip').forEach((p, i) => p.classList.toggle('now', i === qIndex));

  const prompts = {
    listen: 'Which word is it? 🔊',
    fill: 'Fill in the missing part',
    split: 'Which two letters make this?',
  };
  document.getElementById('prompt').textContent = prompts[q.type];

  const card = document.getElementById('card');
  const o = q.item.ottu;
  if (q.type === 'listen') {
    card.innerHTML = `<span class="q-emoji">${q.item.emoji}</span><span id="q-word" class="q-word"></span>`;
  } else if (q.type === 'fill') {
    card.innerHTML = `<span class="q-emoji">${q.item.emoji}</span><span class="q-word">${wordHtml(q.item, 'gap')}</span>`;
  } else {
    card.innerHTML = `<span class="q-big">${join(o.first, o.second)}</span><span class="q-word small">${q.item.emoji} ${wordHtml(q.item, 'hl')}</span>`;
  }
  const say = document.createElement('button');
  say.className = 'icon-btn say-btn';
  say.setAttribute('aria-label', 'Hear the word');
  say.textContent = '🔊';
  say.addEventListener('click', () => speak(q.item.word));
  card.appendChild(say);
  if (q.type === 'listen') speak(q.item.word);

  const choices = document.getElementById('choices');
  choices.innerHTML = '';
  choices.className = `choices ${q.type}`;
  q.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice;
    btn.addEventListener('click', () => pick(btn, choice));
    choices.appendChild(btn);
  });
}

function pick(btn, choice) {
  const q = round[qIndex];
  if (locked || btn.disabled) return;
  if (choice !== q.answer) {
    btn.disabled = true;
    btn.classList.add('wrong');
    missed = true;
    showMessage('Try again! 🙂');
    return;
  }
  locked = true;
  btn.classList.add('right');
  if (!missed) score++;
  document.querySelectorAll('.pip')[qIndex].classList.add(missed ? 'miss' : 'got');
  if (q.type === 'listen') document.getElementById('q-word').innerHTML = wordHtml(q.item, 'hl');
  if (q.type === 'fill') {
    const gap = document.getElementById('gap');
    gap.textContent = q.answer;
    gap.className = 'hl';
  }
  showMessage(`${randomItem(['Yes! ⭐', 'Great! 🎉', 'You got it! 🌟', 'Super! 👏'])}  ${q.item.en}`);
  speak(q.item.word);
  setTimeout(() => {
    qIndex++;
    if (qIndex < round.length) showQuestion();
    else finishRound();
  }, NEXT_MS);
}

function finishRound() {
  const stars = score >= round.length - 1 ? 3 : score >= round.length * 0.6 ? 2 : 1;
  document.getElementById('stars').textContent = '⭐'.repeat(stars);
  document.getElementById('score').textContent = `${score} / ${round.length} right first time`;
  showScreen('done-screen');
  if (stars === 3) celebrate('🌟');
}

// ---- Learn: word cards + build your own ----
function renderBuilder() {
  const first = document.getElementById('first').value;
  const second = document.getElementById('second').value;
  const built = join(first, second);
  document.getElementById('built').textContent = built;
  const row = document.getElementById('kagunita');
  row.innerHTML = '';
  SIGNS.forEach((sign) => {
    const btn = document.createElement('button');
    btn.className = 'kg';
    btn.textContent = built + sign;
    btn.addEventListener('click', () => speak(built + sign));
    row.appendChild(btn);
  });
}

function renderLearn() {
  const tabs = document.getElementById('tabs');
  tabs.innerHTML = '';
  LEVELS.filter((lv) => lv.kind !== 'all').forEach((lv) => {
    const btn = document.createElement('button');
    btn.className = `tab${lv.kind === learnKind ? ' on' : ''}`;
    btn.textContent = lv.sample;
    btn.setAttribute('aria-label', lv.title);
    btn.addEventListener('click', () => {
      learnKind = lv.kind;
      renderLearn();
    });
    tabs.appendChild(btn);
  });

  const list = document.getElementById('word-list');
  list.innerHTML = '';
  ITEMS.filter((it) => it.ottu.kind === learnKind).forEach((it) => {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.innerHTML = `
      <span class="wc-emoji">${it.emoji}</span>
      <span class="wc-word">${wordHtml(it, 'hl')}</span>
      <span class="wc-split">${pair(it.ottu.first, it.ottu.second)} = ${join(it.ottu.first, it.ottu.second)}</span>
      <span class="wc-en">${it.en}</span>`;
    card.addEventListener('click', () => speak(it.word));
    list.appendChild(card);
  });
}

function openLearn() {
  renderLearn();
  renderBuilder();
  showScreen('learn-screen');
}

document.addEventListener('DOMContentLoaded', () => {
  ['first', 'second'].forEach((id) => {
    const select = document.getElementById(id);
    select.innerHTML = CONSONANTS.map((ch) => `<option>${ch}</option>`).join('');
    select.value = 'ಕ';
    select.addEventListener('change', renderBuilder);
  });
  document.getElementById('built').addEventListener('click', (e) => speak(e.currentTarget.textContent));

  renderLevels();
  showScreen('menu-screen');
  document.getElementById('menu-btn').addEventListener('click', () => showScreen('menu-screen'));
  document.getElementById('levels-btn').addEventListener('click', () => showScreen('menu-screen'));
  document.getElementById('again-btn').addEventListener('click', startRound);
  document.getElementById('learn-btn').addEventListener('click', openLearn);

  // Desktop: keys 1–3 pick the choices top to bottom.
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('quiz-screen').classList.contains('hidden')) return;
    const btn = document.querySelectorAll('.choice')[Number(e.key) - 1];
    if (btn) btn.click();
  });

  // Chrome loads voices asynchronously; touching getVoices() early helps.
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
});
