/**
 * Standalone Vanilla JavaScript Module for Chess Mate in One
 * Exposes render(container, onWin) conforming to Platform Official Integration Rule 9.
 */

const PUZZLES = [
  {
    id: 1,
    code: '01-back-rank',
    title: 'Back-Rank Corridor',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solution: { from: 'd1', to: 'd8', san: 'Rd8#' },
    hint: 'Look for Black’s trapped King behind its wall of pawns.',
    explanation: 'Rook sweeps to d8 for a classic back-rank mate.'
  },
  {
    id: 2,
    code: '02-queen-corner',
    title: 'Corner Support',
    fen: '7k/5Q1p/7K/8/8/8/8/8 w - - 0 1',
    solution: { from: 'f7', to: 'g7', san: 'Qg7#' },
    hint: 'White’s King protects the square next to Black’s King.',
    explanation: 'Queen delivers mate on g7, supported by the King.'
  },
  {
    id: 3,
    code: '03-scholars-f7',
    title: 'Weakest Square',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: { from: 'f3', to: 'f7', san: 'Qxf7#' },
    hint: 'The Queen and Bishop target f7.',
    explanation: 'Qxf7# strikes the undefended target.'
  },
  {
    id: 4,
    code: '04-arabian-corner',
    title: 'Arabian Night',
    fen: '7k/3R4/5N2/8/8/8/8/6K1 w - - 0 1',
    solution: { from: 'd7', to: 'h7', san: 'Rh7#' },
    hint: 'The Knight seals g8 and shields the Rook on h7.',
    explanation: 'Rh7# traps the King in the corner.'
  },
  {
    id: 5,
    code: '15-chess-mate',
    title: 'Queen & King Mate',
    fen: '7k/8/6K1/8/8/8/8/7Q w - - 0 1',
    solution: { from: 'h1', to: 'h7', san: 'Qh7#' },
    hint: 'Advance White’s Queen directly into the King’s face.',
    explanation: 'Qh7# traps the King in the corner.'
  }
];

export function render(container, onWin) {
  let currentIdx = 0;
  let startTime = Date.now();
  let selected = null;
  let hintActive = false;

  function parseFen(fen) {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    const parts = fen.split(' ')[0].split('/');
    for (let r = 0; r < 8; r++) {
      const row = parts[r];
      const rank = 7 - r;
      let file = 0;
      for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (c >= '1' && c <= '8') {
          file += parseInt(c, 10);
        } else {
          board[rank][file] = {
            type: c.toLowerCase(),
            color: c === c.toUpperCase() ? 'w' : 'b'
          };
          file++;
        }
      }
    }
    return board;
  }

  let board = parseFen(PUZZLES[currentIdx].fen);

  container.innerHTML = `
    <div id="game-stage">
      <header>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:20px;">♞</span>
          <span style="font-size:12px; font-weight:800; background:#dbeafe; color:#1d4ed8; padding:3px 10px; border-radius:999px;">
            LEVEL ${PUZZLES[currentIdx].id}
          </span>
        </div>
        <button id="btn-restart" class="btn-tactile" style="padding:6px 12px; border-radius:8px; background:#f8fafc; font-weight:bold; font-size:11px;">
          RESET
        </button>
      </header>
      <div class="sub-header">
        <span>${PUZZLES[currentIdx].code}</span>
        <span style="color:#2563eb;">Mate in 1 • White to move ⭐</span>
      </div>
      <div id="canvas-container">
        <canvas id="stage-canvas"></canvas>
      </div>
      <div class="action-card">
        <div style="font-size:13px; font-weight:800;">Find the move that checkmates Black in one.</div>
        <div id="hint-text" style="font-size:11px; opacity:0.9;">It's White's turn — make the winning move to checkmate now.</div>
        <div class="action-buttons">
          <button id="btn-hint" class="action-btn btn-tactile">💡 Hint</button>
          <button id="btn-submit" class="action-btn action-btn-main btn-tactile">Submit Move</button>
          <button id="btn-skip" class="action-btn btn-tactile">Skip</button>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#stage-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const parent = canvas.parentElement;
    const size = Math.min(parent.clientWidth - 20, parent.clientHeight - 20, 420);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    draw(size);
  }

  const observer = new ResizeObserver(() => resize());
  observer.observe(canvas.parentElement);

  function draw(size) {
    ctx.clearRect(0, 0, size, size);
    const sq = size / 8;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const isDark = (r + f) % 2 === 1;
        ctx.fillStyle = isDark ? '#8d5b36' : '#f5efe6';
        ctx.fillRect(f * sq, (7 - r) * sq, sq, sq);

        if (selected && selected.f === f && selected.r === r) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.fillRect(f * sq, (7 - r) * sq, sq, sq);
        }

        const p = board[r][f];
        if (p) {
          const glyphs = {
            w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
            b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
          };
          ctx.font = `${Math.floor(sq * 0.75)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = p.color === 'w' ? '#ffffff' : '#111827';
          ctx.fillText(glyphs[p.color][p.type], (f + 0.5) * sq, (7 - r + 0.5) * sq);
          ctx.strokeStyle = p.color === 'w' ? '#1e293b' : '#f8fafc';
          ctx.lineWidth = 1.5;
          ctx.strokeText(glyphs[p.color][p.type], (f + 0.5) * sq, (7 - r + 0.5) * sq);
        }
      }
    }
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sq = rect.width / 8;
    const f = Math.floor(x / sq);
    const r = 7 - Math.floor(y / sq);

    if (f < 0 || f > 7 || r < 0 || r > 7) return;

    if (selected) {
      const puzzle = PUZZLES[currentIdx];
      const sol = puzzle.solution;
      const fromF = sol.from.charCodeAt(0) - 'a'.charCodeAt(0);
      const fromR = parseInt(sol.from[1], 10) - 1;
      const toF = sol.to.charCodeAt(0) - 'a'.charCodeAt(0);
      const toR = parseInt(sol.to[1], 10) - 1;

      if (selected.f === fromF && selected.r === fromR && f === toF && r === toR) {
        // Winning move!
        board[toR][toF] = board[fromR][fromF];
        board[fromR][fromF] = null;
        selected = null;
        draw(rect.width);

        const time = Math.floor((Date.now() - startTime) / 1000);

        // Official platform victory calls:
        if (typeof onWin === 'function') {
          onWin(time);
        }
        try {
          window.parent.postMessage({ type: 'win', time: time }, '*');
        } catch {}

        setTimeout(() => {
          alert('Checkmate! Level Completed!');
          currentIdx = (currentIdx + 1) % PUZZLES.length;
          board = parseFen(PUZZLES[currentIdx].fen);
          startTime = Date.now();
          draw(rect.width);
        }, 300);
        return;
      }
    }

    const piece = board[r][f];
    if (piece && piece.color === 'w') {
      selected = { f, r };
    } else {
      selected = null;
    }
    draw(rect.width);
  });

  container.querySelector('#btn-hint')?.addEventListener('click', () => {
    hintActive = true;
    container.querySelector('#hint-text').innerText = PUZZLES[currentIdx].hint;
  });

  container.querySelector('#btn-restart')?.addEventListener('click', () => {
    board = parseFen(PUZZLES[currentIdx].fen);
    selected = null;
    draw(canvas.getBoundingClientRect().width);
  });

  container.querySelector('#btn-skip')?.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % PUZZLES.length;
    board = parseFen(PUZZLES[currentIdx].fen);
    selected = null;
    startTime = Date.now();
    draw(canvas.getBoundingClientRect().width);
  });
}
