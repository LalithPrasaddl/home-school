// Kid-safe word list shared by the word games (and THEMES at the bottom). Every word must be something
// a ~6yo knows and has an unambiguous emoji (used as the picture hint).
// Word length is derived from `word`; games split it with [...word], so a
// future Kannada list of plain letters (e.g. 'ಕಮಲ') works the same way.
const WORDS = [
  // 3 letters
  { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶' }, { word: 'cow', emoji: '🐮' },
  { word: 'pig', emoji: '🐷' }, { word: 'hen', emoji: '🐔' }, { word: 'fox', emoji: '🦊' },
  { word: 'bat', emoji: '🦇' }, { word: 'bee', emoji: '🐝' }, { word: 'ant', emoji: '🐜' },
  { word: 'owl', emoji: '🦉' }, { word: 'ram', emoji: '🐏' }, { word: 'ape', emoji: '🦍' },
  { word: 'bug', emoji: '🐛' }, { word: 'rat', emoji: '🐀' }, { word: 'fly', emoji: '🪰' },
  { word: 'sun', emoji: '☀️' }, { word: 'hat', emoji: '👒' }, { word: 'cap', emoji: '🧢' },
  { word: 'bus', emoji: '🚌' }, { word: 'car', emoji: '🚗' }, { word: 'van', emoji: '🚐' },
  { word: 'cup', emoji: '🥤' }, { word: 'bed', emoji: '🛏️' }, { word: 'pen', emoji: '🖊️' },
  { word: 'box', emoji: '📦' }, { word: 'bag', emoji: '👜' }, { word: 'egg', emoji: '🥚' },
  { word: 'pie', emoji: '🥧' }, { word: 'nut', emoji: '🥜' }, { word: 'key', emoji: '🔑' },
  { word: 'log', emoji: '🪵' }, { word: 'map', emoji: '🗺️' }, { word: 'net', emoji: '🥅' },
  { word: 'pan', emoji: '🍳' }, { word: 'toy', emoji: '🧸' }, { word: 'web', emoji: '🕸️' },
  { word: 'ice', emoji: '🧊' }, { word: 'sea', emoji: '🌊' }, { word: 'leg', emoji: '🦵' },
  { word: 'arm', emoji: '💪' }, { word: 'ear', emoji: '👂' }, { word: 'eye', emoji: '👁️' },
  { word: 'lip', emoji: '👄' }, { word: 'hug', emoji: '🤗' }, { word: 'run', emoji: '🏃' },
  { word: 'tea', emoji: '🍵' }, { word: 'six', emoji: '6️⃣' }, { word: 'ten', emoji: '🔟' },
  { word: 'two', emoji: '2️⃣' }, { word: 'one', emoji: '1️⃣' }, { word: 'red', emoji: '🔴' },
  { word: 'mom', emoji: '👩' }, { word: 'dad', emoji: '👨' }, { word: 'saw', emoji: '🪚' },
  { word: 'axe', emoji: '🪓' }, { word: 'tub', emoji: '🛁' }, { word: 'jar', emoji: '🫙' },
  { word: 'boy', emoji: '👦' }, { word: 'kid', emoji: '🧒' }, { word: 'gem', emoji: '💎' },
  { word: 'pin', emoji: '📌' },

  // 4 letters
  { word: 'frog', emoji: '🐸' }, { word: 'fish', emoji: '🐟' }, { word: 'bird', emoji: '🐦' },
  { word: 'duck', emoji: '🦆' }, { word: 'goat', emoji: '🐐' }, { word: 'lion', emoji: '🦁' },
  { word: 'bear', emoji: '🐻' }, { word: 'deer', emoji: '🦌' }, { word: 'crab', emoji: '🦀' },
  { word: 'seal', emoji: '🦭' }, { word: 'swan', emoji: '🦢' }, { word: 'wolf', emoji: '🐺' },
  { word: 'worm', emoji: '🪱' }, { word: 'cake', emoji: '🎂' }, { word: 'milk', emoji: '🥛' },
  { word: 'corn', emoji: '🌽' }, { word: 'rice', emoji: '🍚' }, { word: 'pear', emoji: '🍐' },
  { word: 'kiwi', emoji: '🥝' }, { word: 'soup', emoji: '🍲' }, { word: 'taco', emoji: '🌮' },
  { word: 'ball', emoji: '⚽' }, { word: 'kite', emoji: '🪁' }, { word: 'drum', emoji: '🥁' },
  { word: 'bell', emoji: '🔔' }, { word: 'book', emoji: '📖' }, { word: 'boat', emoji: '⛵' },
  { word: 'ship', emoji: '🚢' }, { word: 'bike', emoji: '🚲' }, { word: 'taxi', emoji: '🚕' },
  { word: 'tree', emoji: '🌳' }, { word: 'leaf', emoji: '🍃' }, { word: 'rose', emoji: '🌹' },
  { word: 'star', emoji: '⭐' }, { word: 'moon', emoji: '🌙' }, { word: 'rain', emoji: '🌧️' },
  { word: 'snow', emoji: '❄️' }, { word: 'fire', emoji: '🔥' }, { word: 'rock', emoji: '🪨' },
  { word: 'hand', emoji: '✋' }, { word: 'foot', emoji: '🦶' }, { word: 'nose', emoji: '👃' },
  { word: 'king', emoji: '🤴' }, { word: 'lock', emoji: '🔒' }, { word: 'sock', emoji: '🧦' },
  { word: 'shoe', emoji: '👟' }, { word: 'coat', emoji: '🧥' }, { word: 'ring', emoji: '💍' },
  { word: 'gift', emoji: '🎁' }, { word: 'home', emoji: '🏠' }, { word: 'door', emoji: '🚪' },
  { word: 'tent', emoji: '⛺' }, { word: 'baby', emoji: '👶' }, { word: 'girl', emoji: '👧' },
  { word: 'swim', emoji: '🏊' }, { word: 'bath', emoji: '🛁' }, { word: 'bowl', emoji: '🥣' },
  { word: 'fork', emoji: '🍴' },

  // 5 letters (Word Hunt only; Word Guess sticks to 3–4)
  { word: 'horse', emoji: '🐴' }, { word: 'sheep', emoji: '🐑' }, { word: 'mouse', emoji: '🐭' },
  { word: 'tiger', emoji: '🐯' }, { word: 'zebra', emoji: '🦓' }, { word: 'snake', emoji: '🐍' },
  { word: 'whale', emoji: '🐳' }, { word: 'shark', emoji: '🦈' }, { word: 'apple', emoji: '🍎' },
  { word: 'mango', emoji: '🥭' }, { word: 'bread', emoji: '🍞' }, { word: 'pizza', emoji: '🍕' },
  { word: 'grape', emoji: '🍇' }, { word: 'lemon', emoji: '🍋' }, { word: 'cloud', emoji: '☁️' },
  { word: 'train', emoji: '🚂' }, { word: 'truck', emoji: '🚚' }, { word: 'shirt', emoji: '👕' },
  { word: 'dress', emoji: '👗' }, { word: 'clock', emoji: '⏰' }, { word: 'chair', emoji: '🪑' },
];

// Themed groups for Word Hunt and Groups. Every word here must exist in WORDS
// above (so it's kid-safe) and be at most 5 letters. List a word under every
// theme it fits (a whale is an animal too): Groups never deals a word that
// belongs to two of its groups, so a missing entry makes a puzzle ambiguous.
const THEMES = [
  { title: 'Find the animals!', label: 'Animals', emoji: '🐾', words: ['cat', 'dog', 'cow', 'pig', 'hen', 'fox', 'owl', 'bee', 'ant', 'bat', 'ram', 'ape', 'bug', 'rat', 'fly', 'duck', 'goat', 'lion', 'bear', 'deer', 'frog', 'fish', 'bird', 'wolf', 'crab', 'seal', 'swan', 'worm', 'horse', 'sheep', 'mouse', 'tiger', 'zebra', 'snake', 'whale', 'shark'] },
  { title: 'Find the food!', label: 'Food', emoji: '🍽️', words: ['egg', 'pie', 'nut', 'tea', 'cake', 'milk', 'corn', 'rice', 'pear', 'kiwi', 'soup', 'taco', 'apple', 'mango', 'bread', 'pizza', 'grape', 'lemon'] },
  { title: 'Find body parts!', label: 'Body parts', emoji: '🧍', words: ['leg', 'arm', 'ear', 'eye', 'lip', 'hand', 'foot', 'nose'] },
  { title: 'Look up in the sky!', label: 'In the sky', emoji: '🌤️', words: ['sun', 'star', 'moon', 'rain', 'snow', 'cloud', 'bird', 'bee', 'kite', 'bat'] },
  { title: 'Things that go!', label: 'Things that go', emoji: '🚦', words: ['bus', 'car', 'van', 'ship', 'boat', 'bike', 'taxi', 'train', 'truck'] },
  { title: 'Things you wear!', label: 'Things you wear', emoji: '👕', words: ['hat', 'cap', 'sock', 'shoe', 'coat', 'ring', 'shirt', 'dress'] },
  { title: 'Things at home!', label: 'Things at home', emoji: '🏠', words: ['bed', 'box', 'cup', 'key', 'door', 'bowl', 'fork', 'clock', 'chair', 'tub', 'pan'] },
  { title: 'Under the sea!', label: 'Under the sea', emoji: '🌊', words: ['fish', 'crab', 'seal', 'whale', 'shark', 'boat', 'ship'] },
];
