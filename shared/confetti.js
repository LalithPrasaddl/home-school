// Emoji confetti burst. Needs an empty <div id="confetti" class="confetti">
// on the page (styles live in shared/theme.css).
function celebrate(extraEmoji) {
  const box = document.getElementById('confetti');
  const pieces = ['🎉', '⭐', '🌟', '🎈', extraEmoji || '🎊'];
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('span');
    piece.textContent = pieces[i % pieces.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    box.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}
