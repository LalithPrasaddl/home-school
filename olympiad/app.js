// Olympiad Practice: pick a paper, take it as a timed mock test (answers at
// the end) or in practice mode (right/wrong straight away), then review.
const STORAGE_KEY = 'olympiad-scores-v1'; // { [paperNumber]: bestScore }
const WARN_SECONDS = 5 * 60; // timer turns red in the last 5 minutes
const PASS_MARK = 80; // confetti at or above this score

let mode = 'mock';
let paperNo = 1;
let questions = [];
let picks = []; // chosen option index per question, or null
let current = 0;
let deadline = 0;
let timerId = null;

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveScore(paper, score) {
  const scores = loadScores();
  if (!(paper in scores) || score > scores[paper]) scores[paper] = score;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Private mode etc.: scores just aren't remembered.
  }
}

function show(id) {
  ['home-screen', 'test-screen', 'result-screen'].forEach((s) => document.getElementById(s).classList.toggle('hidden', s !== id));
  window.scrollTo(0, 0);
}

const fmt = (marks) => String(Math.round(marks * 10) / 10);

// ---------- home ----------
function renderHome() {
  document.querySelectorAll('.mode-btn').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
  const scores = loadScores();
  const box = document.getElementById('papers');
  box.innerHTML = '';
  for (let n = 1; n <= PAPER_COUNT; n++) {
    const btn = document.createElement('button');
    btn.className = 'paper-btn';
    const best = scores[n];
    btn.innerHTML = `<b>${n}</b><small>${best === undefined ? 'new' : `best ${fmt(best)}`}</small>`;
    if (best !== undefined) btn.classList.add(best >= PASS_MARK ? 'great' : 'done');
    btn.setAttribute('aria-label', `Paper ${n}${best === undefined ? '' : `, best score ${fmt(best)}`}`);
    btn.addEventListener('click', () => startPaper(n));
    box.appendChild(btn);
  }
  show('home-screen');
}

// ---------- taking a paper ----------
function startPaper(n) {
  paperNo = n;
  questions = makePaper(n);
  picks = questions.map(() => null);
  current = 0;
  clearInterval(timerId);
  const timer = document.getElementById('timer');
  timer.classList.toggle('hidden', mode !== 'mock');
  if (mode === 'mock') {
    deadline = Date.now() + EXAM_MINUTES * 60 * 1000;
    tick();
    timerId = setInterval(tick, 1000);
  }
  renderPalette();
  renderQuestion();
  show('test-screen');
}

function tick() {
  const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
  const timer = document.getElementById('timer');
  timer.textContent = `⏱ ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  timer.classList.toggle('warn', left <= WARN_SECONDS);
  if (left === 0) finish();
}

function renderPalette() {
  const box = document.getElementById('palette');
  box.innerHTML = '';
  questions.forEach((q, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.textContent = i + 1;
    if (i === current) dot.classList.add('current');
    if (picks[i] !== null) {
      // Practice mode shows right/wrong; a mock test only shows "answered".
      dot.classList.add(mode === 'practice' ? (picks[i] === q.answer ? 'right' : 'wrong') : 'answered');
    }
    dot.addEventListener('click', () => goTo(i));
    box.appendChild(dot);
  });
}

// Options that are only emoji get drawn bigger.
const isPics = (q) => !q.html && q.options.every((o) => /^[\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(o));

function renderOption(btn, q, i) {
  if (q.html) btn.innerHTML = q.options[i];
  else btn.textContent = q.options[i];
}

function renderQuestion() {
  const q = questions[current];
  document.getElementById('q-count').textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById('q-section').textContent = `${q.section.title} · ${fmt(q.section.marks)} marks`;
  document.getElementById('q-prompt').textContent = `${current + 1}. ${q.prompt}`;
  document.getElementById('q-figure').innerHTML = q.figure || '';

  const answered = picks[current] !== null;
  const locked = mode === 'practice' && answered;
  const box = document.getElementById('q-options');
  box.innerHTML = '';
  box.classList.toggle('small', Boolean(q.small));
  box.classList.toggle('shapes', Boolean(q.html));
  box.classList.toggle('pics', isPics(q));
  q.options.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.dataset.letter = 'ABCD'[i];
    renderOption(btn, q, i);
    if (picks[current] === i) btn.classList.add('picked');
    if (locked) {
      if (i === q.answer) btn.classList.add('right');
      else if (i === picks[current]) btn.classList.add('wrong');
      btn.disabled = true;
    }
    btn.addEventListener('click', () => choose(i));
    box.appendChild(btn);
  });

  const fb = document.getElementById('q-feedback');
  fb.textContent = '';
  fb.className = 'q-feedback';
  if (locked) {
    const right = picks[current] === q.answer;
    fb.textContent = right ? `Yes! 🌟${q.why ? ` ${q.why}` : ''}` : `The answer is ${'ABCD'[q.answer]}. ${q.why || ''}`;
    fb.classList.add(right ? 'good' : 'bad');
  }

  document.getElementById('prev-btn').disabled = current === 0;
  const last = current === questions.length - 1;
  const next = document.getElementById('next-btn');
  next.textContent = last ? (mode === 'mock' ? 'Finish ✔' : 'See score ✔') : 'Next ▶';
}

function choose(i) {
  if (mode === 'practice' && picks[current] !== null) return;
  picks[current] = i;
  renderPalette();
  renderQuestion();
}

function goTo(i) {
  current = i;
  window.speechSynthesis?.cancel();
  renderPalette();
  renderQuestion();
}

function onNext() {
  if (current < questions.length - 1) {
    goTo(current + 1);
    return;
  }
  const blank = picks.filter((p) => p === null).length;
  if (blank && !confirm(`${blank} question${blank > 1 ? 's are' : ' is'} not answered yet. Finish anyway?`)) {
    goTo(picks.indexOf(null));
    return;
  }
  finish();
}

function speak() {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const q = questions[current];
  const text = q.prompt.replace(/₹(\d+)/g, '$1 rupees').replace(/−/g, ' minus ').replace(/__/g, ' blank ');
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// ---------- results ----------
function finish() {
  clearInterval(timerId);
  window.speechSynthesis?.cancel();
  let score = 0;
  const rows = new Map();
  questions.forEach((q, i) => {
    const s = rows.get(q.section) || { right: 0, total: 0 };
    s.total++;
    if (picks[i] === q.answer) {
      s.right++;
      score += q.section.marks;
    }
    rows.set(q.section, s);
  });
  saveScore(paperNo, score);

  document.getElementById('result-title').textContent = `Paper ${paperNo}`;
  document.getElementById('score-big').textContent = `${fmt(score)} / 100`;
  const right = questions.filter((q, i) => picks[i] === q.answer).length;
  document.getElementById('score-note').textContent = `${right} of ${questions.length} right ${score >= PASS_MARK ? '🏆' : score >= 50 ? '⭐' : '💪'}`;

  const table = document.getElementById('section-table');
  table.innerHTML = '<tr><th>Section</th><th>Right</th><th>Marks</th></tr>';
  rows.forEach((s, section) => {
    const tr = document.createElement('tr');
    if (s.right < s.total) tr.className = 'weak';
    [section.title, `${s.right} / ${s.total}`, fmt(s.right * section.marks)].forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  renderReview();
  show('result-screen');
  if (score >= PASS_MARK) celebrate('🏆');
}

function renderReview() {
  const box = document.getElementById('review');
  box.innerHTML = '';
  questions.forEach((q, i) => {
    const right = picks[i] === q.answer;
    const card = document.createElement('div');
    card.className = `review-card ${right ? 'right' : 'wrong'}`;
    const head = document.createElement('p');
    head.className = 'q-prompt';
    head.textContent = `${right ? '✅' : '❌'} ${i + 1}. ${q.prompt}`;
    card.appendChild(head);
    if (q.figure) {
      const fig = document.createElement('div');
      fig.className = 'q-figure';
      fig.innerHTML = q.figure;
      card.appendChild(fig);
    }
    const opts = document.createElement('div');
    opts.className = `q-options review-options${q.small ? ' small' : ''}${q.html ? ' shapes' : ''}${isPics(q) ? ' pics' : ''}`;
    q.options.forEach((_, j) => {
      const o = document.createElement('div');
      o.className = 'option';
      o.dataset.letter = 'ABCD'[j];
      renderOption(o, q, j);
      if (j === q.answer) o.classList.add('right');
      else if (j === picks[i]) o.classList.add('wrong');
      opts.appendChild(o);
    });
    card.appendChild(opts);
    const note = document.createElement('p');
    note.className = 'review-note';
    note.textContent = `${picks[i] === null ? 'Not answered. ' : ''}${right ? '' : `Answer: ${'ABCD'[q.answer]}. `}${q.why || ''}`;
    if (note.textContent) card.appendChild(note);
    box.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mode-btn').forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.mode;
      renderHome();
    }),
  );
  document.getElementById('prev-btn').addEventListener('click', () => goTo(current - 1));
  document.getElementById('next-btn').addEventListener('click', onNext);
  document.getElementById('speak-btn').addEventListener('click', speak);
  document.getElementById('quit-btn').addEventListener('click', () => {
    if (!confirm('Stop this paper? Your answers will not be saved.')) return;
    clearInterval(timerId);
    window.speechSynthesis?.cancel();
    renderHome();
  });
  document.getElementById('home-btn').addEventListener('click', renderHome);
  document.getElementById('retake-btn').addEventListener('click', () => startPaper(paperNo));
  document.getElementById('next-paper-btn').addEventListener('click', () => startPaper((paperNo % PAPER_COUNT) + 1));

  // Desktop: A–D or 1–4 pick an option, arrow keys move between questions.
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('test-screen').classList.contains('hidden')) return;
    const k = e.key.toLowerCase();
    const idx = 'abcd'.indexOf(k) !== -1 ? 'abcd'.indexOf(k) : '1234'.indexOf(k);
    if (idx !== -1 && k.length === 1 && idx < questions[current].options.length) choose(idx);
    else if (e.key === 'ArrowRight' && current < questions.length - 1) goTo(current + 1);
    else if (e.key === 'ArrowLeft' && current > 0) goTo(current - 1);
  });

  renderHome();
});
