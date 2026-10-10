const STORAGE_KEY = 'kannada-letters-progress-v2';
const HISTORY_LIMIT = 5;
const PROMOTE_STREAK = 5; // correct answers in a row (any letter) to enter phase 2
const DEMOTE_STREAK = 2; // wrong answers in a row (any letter) in phase 2 to fall back to phase 1

let globalPhase = 1;
let progress = loadProgress();
let questionCounter = 0;
let stars = 0;
let streak = 0;
let wrongStreak = 0;
let totalCorrect = 0;
let totalAnswered = 0;
let currentLetter = null;
let currentMode = null; // 'mc' or 'recall'
let appMode = 'adaptive'; // 'mc', 'recall', or 'adaptive'
let canvas, ctx;

function resolveMode() {
  if (appMode === 'mc') return 'mc';
  if (appMode === 'recall') return 'recall';
  return globalPhase === 2 ? 'recall' : 'mc';
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const saved = raw ? JSON.parse(raw) : {};
  const savedLetters = saved.letters || {};
  const state = {};
  for (const letter of LETTERS) {
    state[letter.id] = savedLetters[letter.id] || { history: [], lastSeenIndex: -999 };
  }
  globalPhase = saved.globalPhase || 1;
  return state;
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ letters: progress, globalPhase }));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickNextLetter() {
  const weighted = LETTERS.map((letter) => {
    const p = progress[letter.id];
    const recentWrong = p.history.slice(-3).filter((r) => r === false).length;
    const sinceSeen = questionCounter - p.lastSeenIndex;
    const weight = 1 + recentWrong * 3 + Math.min(sinceSeen / 4, 6);
    return { letter, weight };
  });
  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.letter;
  }
  return weighted[weighted.length - 1].letter;
}

function generateChoices(correct) {
  const others = shuffle(LETTERS.filter((l) => l.id !== correct.id));
  const options = shuffle([correct, ...others.slice(0, 3)]);
  return options;
}

function speakLetter(letter) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(letter.glyph);
  utter.lang = 'kn-IN';
  utter.rate = 0.75;
  const voices = speechSynthesis.getVoices();
  const knVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('kn'));
  if (knVoice) utter.voice = knVoice;
  speechSynthesis.speak(utter);
}

function recordResult(isCorrect) {
  const p = progress[currentLetter.id];
  p.history.push(isCorrect);
  if (p.history.length > HISTORY_LIMIT) p.history.shift();
  p.lastSeenIndex = questionCounter++;
}

function showFeedback(isCorrect) {
  const fb = document.getElementById('feedback');
  totalAnswered++;
  if (isCorrect) {
    totalCorrect++;
    stars++;
    streak++;
    wrongStreak = 0;
    fb.textContent = '⭐ Correct!';
    fb.className = 'good-text';
    if (globalPhase === 1 && streak >= PROMOTE_STREAK) {
      globalPhase = 2;
      streak = 0;
    }
  } else {
    streak = 0;
    wrongStreak++;
    fb.textContent = `It was ${currentLetter.glyph} (${currentLetter.roman})`;
    fb.className = 'bad-text';
    if (globalPhase === 2 && wrongStreak >= DEMOTE_STREAK) {
      globalPhase = 1;
      wrongStreak = 0;
    }
  }
  saveProgress();
  updateHeader();
}

function updateHeader() {
  document.getElementById('stars-count').textContent = stars;
  document.getElementById('streak-count').textContent = streak;
  const accuracy = totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100);
  document.getElementById('accuracy-count').textContent = `${accuracy}%`;
}

function nextQuestion() {
  const fb = document.getElementById('feedback');
  fb.textContent = '';
  fb.className = '';

  currentLetter = pickNextLetter();
  currentMode = resolveMode();
  const phaseLabel =
    appMode === 'adaptive'
      ? currentMode === 'recall'
        ? `Free recall (${wrongStreak}/${DEMOTE_STREAK} wrong)`
        : `Multiple choice (${streak}/${PROMOTE_STREAK} correct)`
      : currentMode === 'recall'
        ? 'Free recall'
        : 'Multiple choice';
  document.getElementById('phase-tag').textContent = phaseLabel;

  if (currentMode === 'mc') {
    showMCQuestion();
  } else {
    showRecallQuestion();
  }
  speakLetter(currentLetter);
}

function showMCQuestion() {
  document.getElementById('mc-screen').classList.remove('hidden');
  document.getElementById('recall-screen').classList.add('hidden');
  const options = generateChoices(currentLetter);
  const container = document.getElementById('choices');
  container.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice-card';
    btn.textContent = opt.glyph;
    btn.addEventListener('click', () => handleMCAnswer(opt, btn));
    container.appendChild(btn);
  });
}

function handleMCAnswer(selected, btnEl) {
  const isCorrect = selected.id === currentLetter.id;
  const buttons = [...document.querySelectorAll('#choices .choice-card')];
  buttons.forEach((b) => (b.disabled = true));
  if (isCorrect) {
    btnEl.classList.add('correct');
  } else {
    btnEl.classList.add('wrong');
    const correctBtn = buttons.find((b) => b.textContent === currentLetter.glyph);
    if (correctBtn) correctBtn.classList.add('correct');
  }
  recordResult(isCorrect);
  showFeedback(isCorrect);
  setTimeout(nextQuestion, isCorrect ? 900 : 1800);
}

function showRecallQuestion() {
  document.getElementById('mc-screen').classList.add('hidden');
  document.getElementById('recall-screen').classList.remove('hidden');
  document.getElementById('reveal-area').classList.add('hidden');
  document.getElementById('self-report').classList.add('hidden');
  document.getElementById('show-answer-btn').classList.remove('hidden');
  clearCanvas();
}

function finishRecall(isCorrect) {
  recordResult(isCorrect);
  showFeedback(isCorrect);
  setTimeout(nextQuestion, isCorrect ? 900 : 1800);
}

function setupCanvas() {
  canvas = document.getElementById('draw-canvas');
  ctx = canvas.getContext('2d');
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#2b2d42';
  let drawingNow = false;

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  canvas.addEventListener('pointerdown', (e) => {
    drawingNow = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawingNow) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });
  window.addEventListener('pointerup', () => (drawingNow = false));
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBrowseScreen() {
  const container = document.getElementById('browse-list');
  container.innerHTML = '';
  LETTERS.forEach((letter) => {
    const row = document.createElement('div');
    row.className = 'browse-row';

    const label = document.createElement('span');
    const glyphSpan = document.createElement('span');
    glyphSpan.className = 'browse-glyph';
    glyphSpan.textContent = letter.glyph;
    const romanSpan = document.createElement('span');
    romanSpan.className = 'browse-roman';
    romanSpan.textContent = letter.roman;
    label.append(glyphSpan, romanSpan);

    const playBtn = document.createElement('button');
    playBtn.className = 'browse-play';
    playBtn.textContent = '🔊';
    playBtn.setAttribute('aria-label', `Play ${letter.roman}`);
    playBtn.addEventListener('click', () => speakLetter(letter));

    row.append(label, playBtn);
    container.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupCanvas();
  updateHeader();

  document.getElementById('browse-btn').addEventListener('click', () => {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('browse-screen').classList.remove('hidden');
    renderBrowseScreen();
  });

  document.getElementById('browse-back-btn').addEventListener('click', () => {
    document.getElementById('browse-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
  });

  document.querySelectorAll('.mode-card').forEach((card) => {
    card.addEventListener('click', () => {
      appMode = card.dataset.mode;
      document.getElementById('home-screen').classList.add('hidden');
      document.getElementById('practice-screen').classList.remove('hidden');
      nextQuestion();
    });
  });

  document.getElementById('replay-btn').addEventListener('click', () => speakLetter(currentLetter));
  document.getElementById('replay-btn-recall').addEventListener('click', () => speakLetter(currentLetter));
  document.getElementById('clear-btn').addEventListener('click', clearCanvas);
  document.getElementById('home-btn').addEventListener('click', () => location.reload());

  document.getElementById('show-answer-btn').addEventListener('click', () => {
    document.getElementById('reveal-glyph').textContent = currentLetter.glyph;
    document.getElementById('reveal-area').classList.remove('hidden');
    document.getElementById('self-report').classList.remove('hidden');
    document.getElementById('show-answer-btn').classList.add('hidden');
  });

  document.getElementById('self-yes').addEventListener('click', () => finishRecall(true));
  document.getElementById('self-no').addEventListener('click', () => finishRecall(false));

  if ('speechSynthesis' in window) {
    // Voices load asynchronously in some browsers; no-op listener just
    // ensures getVoices() is populated by the time we first speak.
    speechSynthesis.onvoiceschanged = () => {};
  }
});
