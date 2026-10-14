const MAX_GUESSES = 6;
const HINT_AFTER = 3; // wrong guesses before the 💡 picture hint appears
const RECENT_LIMIT = 10; // don't repeat any of the last N target words
const STEP_MS = 280; // delay between tiles flipping
const FLIP_MS = 420;
// QWERTY, laid out like Wordle: ✓ bottom-left, ⌫ bottom-right.
const KEY_ROWS = [
  [...'qwertyuiop'],
  [...'asdfghjkl'],
  ['enter', ...'zxcvbnm', 'back'],
];
const STATE_RANK = { absent: 1, present: 2, correct: 3 };

let wordLength = 3;
let target = null;
let guesses = [];
let current = [];
let over = false;
let revealing = false;
let muted = true; // sound starts off; 🔇/🔊 button turns word read-outs on
let recent = [];
let keyStates = {};

function speak(text) {
  if (muted || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  const voice = speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith('en'));
  if (voice) utter.voice = voice;
  speechSynthesis.speak(utter);
}

function pickTarget() {
  const pool = WORDS.filter((w) => [...w.word].length === wordLength);
  const fresh = pool.filter((w) => !recent.includes(w.word));
  const choices = fresh.length ? fresh : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  recent.push(pick.word);
  if (recent.length > RECENT_LIMIT) recent.shift();
  return pick;
}

// Standard Wordle scoring: exact matches first, then "present" only for
// letters the target still has unclaimed (so duplicates aren't over-counted).
function evaluate(guess, answer) {
  const result = guess.map(() => 'absent');
  const remaining = {};
  answer.forEach((ch, i) => {
    if (guess[i] === ch) result[i] = 'correct';
    else remaining[ch] = (remaining[ch] || 0) + 1;
  });
  guess.forEach((ch, i) => {
    if (result[i] !== 'correct' && remaining[ch] > 0) {
      result[i] = 'present';
      remaining[ch]--;
    }
  });
  return result;
}

function rowTiles(rowIdx) {
  return [...document.querySelectorAll('.board-row')[rowIdx].children];
}

function buildBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.style.setProperty('--len', wordLength);
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement('div');
    row.className = 'board-row';
    for (let c = 0; c < wordLength; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function buildKeyboard() {
  const kb = document.getElementById('keyboard');
  kb.innerHTML = '';
  KEY_ROWS.forEach((keys) => {
    const row = document.createElement('div');
    row.className = 'key-row';
    keys.forEach((key) => addKey(row, key));
    kb.appendChild(row);
  });
}

function addKey(row, key) {
  const btn = document.createElement('button');
  btn.className = 'key';
  btn.dataset.key = key;
  if (key === 'back') {
    btn.textContent = '⌫';
    btn.classList.add('key-back');
    btn.setAttribute('aria-label', 'Delete letter');
  } else if (key === 'enter') {
    btn.textContent = '✓';
    btn.classList.add('key-enter');
    btn.setAttribute('aria-label', 'Check word');
  } else {
    btn.textContent = key;
  }
  btn.addEventListener('click', () => handleKey(key));
  row.appendChild(btn);
}

function updateKeyboard() {
  document.querySelectorAll('.key').forEach((btn) => {
    const state = keyStates[btn.dataset.key];
    btn.classList.remove('correct', 'present', 'absent');
    if (state) btn.classList.add(state);
  });
  const enter = document.querySelector('.key-enter');
  if (enter) enter.classList.toggle('ready', current.length === wordLength);
}

function renderCurrentRow() {
  const tiles = rowTiles(guesses.length);
  tiles.forEach((tile, i) => {
    tile.textContent = current[i] || '';
    tile.classList.toggle('filled', Boolean(current[i]));
  });
  updateKeyboard();
}

function handleKey(key) {
  if (over || revealing) return;
  if (key === 'back') {
    current.pop();
    renderCurrentRow();
  } else if (key === 'enter') {
    submitGuess();
  } else if (current.length < wordLength) {
    current.push(key);
    renderCurrentRow();
  }
}

function shakeRow(rowIdx) {
  const row = document.querySelectorAll('.board-row')[rowIdx];
  row.classList.remove('shake');
  void row.offsetWidth; // restart the animation if it's already applied
  row.classList.add('shake');
}

function submitGuess() {
  if (current.length < wordLength) {
    shakeRow(guesses.length);
    return;
  }
  const answer = [...target.word];
  const guess = current;
  const result = evaluate(guess, answer);
  const rowIdx = guesses.length;
  guesses.push(guess);
  current = [];
  revealing = true;

  const tiles = rowTiles(rowIdx);
  result.forEach((state, i) => {
    setTimeout(() => {
      tiles[i].classList.add('flip');
      setTimeout(() => tiles[i].classList.add(state), FLIP_MS / 2);
    }, i * STEP_MS);
  });

  setTimeout(() => {
    revealing = false;
    guess.forEach((ch, i) => {
      if (!keyStates[ch] || STATE_RANK[result[i]] > STATE_RANK[keyStates[ch]]) {
        keyStates[ch] = result[i];
      }
    });
    updateKeyboard();

    const won = result.every((s) => s === 'correct');
    if (won) {
      document.querySelectorAll('.board-row')[rowIdx].classList.add('win');
      celebrate(target.emoji);
      endGame(true);
    } else if (guesses.length >= MAX_GUESSES) {
      endGame(false);
    } else if (guesses.length >= HINT_AFTER && document.getElementById('hint-picture').classList.contains('hidden')) {
      document.getElementById('hint-btn').classList.remove('hidden');
    }
  }, (wordLength - 1) * STEP_MS + FLIP_MS);
}

function endGame(won) {
  over = true;
  document.getElementById('hint-btn').classList.add('hidden');
  document.getElementById('hint-picture').classList.add('hidden');
  document.getElementById('result-emoji').textContent = target.emoji;
  document.getElementById('result-word').textContent = target.word;
  document.getElementById('result-text').textContent = won ? '🎉 You got it!' : 'The word was';
  setTimeout(() => {
    document.getElementById('keyboard').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    speak(won ? `Yay! ${target.word}!` : `The word was ${target.word}`);
  }, won ? 900 : 400);
}

function newGame() {
  target = pickTarget();
  guesses = [];
  current = [];
  over = false;
  revealing = false;
  keyStates = {};
  document.querySelectorAll('.len-chip').forEach((chip) => {
    chip.classList.toggle('active', Number(chip.dataset.len) === wordLength);
  });
  document.getElementById('hint-btn').classList.add('hidden');
  document.getElementById('hint-picture').classList.add('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('keyboard').classList.remove('hidden');
  buildBoard();
  updateKeyboard();
}

document.addEventListener('DOMContentLoaded', () => {
  buildKeyboard();
  newGame();

  document.querySelectorAll('.len-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const len = Number(chip.dataset.len);
      if (len === wordLength && !over) return;
      wordLength = len;
      newGame();
    });
  });

  document.getElementById('hint-btn').addEventListener('click', () => {
    document.getElementById('hint-btn').classList.add('hidden');
    const pic = document.getElementById('hint-picture');
    pic.textContent = target.emoji;
    pic.classList.remove('hidden');
    speak(target.word);
  });
  document.getElementById('hint-picture').addEventListener('click', () => speak(target.word));
  document.getElementById('result-emoji').addEventListener('click', () => speak(target.word));
  document.getElementById('new-btn').addEventListener('click', newGame);

  document.getElementById('mute-btn').addEventListener('click', (e) => {
    muted = !muted;
    if (muted && 'speechSynthesis' in window) speechSynthesis.cancel();
    e.currentTarget.textContent = muted ? '🔇' : '🔊';
    e.currentTarget.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
  });

  // Physical keyboard support for desktop.
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Enter') {
      e.preventDefault(); // don't also "click" whichever button has focus
      if (over) newGame();
      else handleKey('enter');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleKey('back');
    } else if (/^[a-z]$/i.test(e.key)) {
      handleKey(e.key.toLowerCase());
    }
  });

  if ('speechSynthesis' in window) {
    // Voices load asynchronously in some browsers; no-op listener just
    // ensures getVoices() is populated by the time we first speak.
    speechSynthesis.onvoiceschanged = () => {};
  }
});
