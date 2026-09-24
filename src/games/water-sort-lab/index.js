/**
 * Water Sort Lab - Pure Vanilla JS Game Engine
 */
export function render(container, onWin) {
  let timerSeconds = 0;
  let moves = 0;
  let selectedTubeIdx = null;
  const history = [];

  const COLORS = {
    R: '#EF4444', // Red
    B: '#3B82F6', // Blue
    G: '#10B981', // Green
    Y: '#F59E0B', // Amber
    P: '#8B5CF6'  // Purple
  };

  const COLOR_NAMES = {
    R: 'Vermelho',
    B: 'Azul',
    G: 'Verde',
    Y: 'Amarelo',
    P: 'Roxo'
  };

  // Initial tubes layout: 4 tubes with mixed colors, 2 empty tubes
  let tubes = [
    ['R', 'B', 'G', 'Y'],
    ['B', 'Y', 'R', 'P'],
    ['G', 'P', 'B', 'R'],
    ['P', 'G', 'Y', 'P'],
    [],
    []
  ];

  const timerInterval = setInterval(() => timerSeconds++, 1000);

  container.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white p-4 select-none">
      
      <!-- Top Status Bar -->
      <div class="w-full max-w-xl flex items-center justify-between px-4 py-2 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-md">
        <div class="flex items-center gap-3">
          <span class="text-xs font-black text-cyan-400">🧪 Water Sort</span>
          <span id="ws-moves" class="text-xs font-bold text-slate-300">Moves: 0</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="ws-undo" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-slate-200 transition active:scale-95">
            ↩ Desfazer
          </button>
          <button id="ws-reset" class="px-3 py-1 bg-rose-900/80 hover:bg-rose-800 rounded-lg text-xs font-bold text-rose-200 transition active:scale-95">
            🔄 Reiniciar
          </button>
        </div>
      </div>

      <!-- Instructions Toast -->
      <div id="ws-toast" class="text-xs font-semibold text-cyan-200/90 text-center px-4 py-1.5 bg-cyan-950/40 rounded-full border border-cyan-800/30">
        Toque em um tubo para selecionar e depois no destino para despejar a água
      </div>

      <!-- Test Tubes Rack Area -->
      <div id="ws-tubes-grid" class="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-2xl py-6">
        <!-- Rendered dynamically -->
      </div>

      <!-- Bottom Hint & Tips -->
      <div class="text-[11px] text-slate-500 font-medium text-center">
        Separe todas as cores em tubos únicos para vencer!
      </div>
    </div>
  `;

  const tubesGrid = container.querySelector('#ws-tubes-grid');
  const movesDisplay = container.querySelector('#ws-moves');
  const undoBtn = container.querySelector('#ws-undo');
  const resetBtn = container.querySelector('#ws-reset');
  const toast = container.querySelector('#ws-toast');

  function renderTubes() {
    tubesGrid.innerHTML = '';

    tubes.forEach((tube, idx) => {
      const isSelected = selectedTubeIdx === idx;
      const isComplete = tube.length === 4 && tube.every(c => c === tube[0]);

      const tubeEl = document.createElement('div');
      tubeEl.className = `relative flex flex-col-reverse justify-start items-center w-14 sm:w-16 h-40 sm:h-48 rounded-b-3xl rounded-t-lg border-3 cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-cyan-400 -translate-y-4 shadow-[0_0_20px_rgba(34,211,238,0.4)] bg-cyan-950/20'
          : isComplete
          ? 'border-emerald-400/80 bg-emerald-950/20 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
          : 'border-slate-600 hover:border-slate-400 bg-slate-900/60 shadow-md'
      }`;

      // Glass shine overlay
      const shine = document.createElement('div');
      shine.className = 'absolute top-0 left-1 w-2 h-full bg-white/10 rounded-full pointer-events-none z-10';
      tubeEl.appendChild(shine);

      // Tube rim
      const rim = document.createElement('div');
      rim.className = 'absolute top-0 left-0 right-0 h-3 border-b border-white/20 bg-white/5 pointer-events-none z-10';
      tubeEl.appendChild(rim);

      // Render liquid segments
      tube.forEach((colorCode) => {
        const seg = document.createElement('div');
        seg.className = 'w-full h-1/4 transition-all duration-300 relative';
        seg.style.backgroundColor = COLORS[colorCode] || '#666';
        
        // Liquid meniscus curve effect
        const wave = document.createElement('div');
        wave.className = 'w-full h-1 bg-white/25 absolute top-0';
        seg.appendChild(wave);

        tubeEl.appendChild(seg);
      });

      // Fill remaining empty height
      for (let e = tube.length; e < 4; e++) {
        const emptySeg = document.createElement('div');
        emptySeg.className = 'w-full h-1/4';
        tubeEl.appendChild(emptySeg);
      }

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      tubesGrid.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (selectedTubeIdx === null) {
      if (tubes[idx].length === 0) return;
      selectedTubeIdx = idx;
      renderTubes();
      return;
    }

    if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      renderTubes();
      return;
    }

    // Try to pour from selectedTubeIdx to idx
    const from = tubes[selectedTubeIdx];
    const to = tubes[idx];

    if (canPour(from, to)) {
      // Save history for undo
      history.push(JSON.parse(JSON.stringify(tubes)));

      const topColor = from[from.length - 1];
      while (from.length > 0 && from[from.length - 1] === topColor && to.length < 4) {
        to.push(from.pop());
      }

      moves++;
      movesDisplay.textContent = `Moves: ${moves}`;
      selectedTubeIdx = null;
      renderTubes();

      checkWin();
    } else {
      selectedTubeIdx = null;
      toast.textContent = 'Não é possível despejar! As cores devem coincidir e ter espaço no tubo.';
      setTimeout(() => {
        toast.textContent = 'Toque em um tubo para selecionar e depois no destino para despejar a água';
      }, 2500);
      renderTubes();
    }
  }

  function canPour(from, to) {
    if (from.length === 0) return false;
    if (to.length === 4) return false;
    if (to.length === 0) return true;
    return from[from.length - 1] === to[to.length - 1];
  }

  function checkWin() {
    const isWon = tubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length === 4 && tube.every(c => c === tube[0])) return true;
      return false;
    });

    if (isWon) {
      clearInterval(timerInterval);
      toast.textContent = '🏆 Parabéns! Você completou o Water Sort Lab com sucesso!';
      setTimeout(() => {
        onWin(timerSeconds, 1);
      }, 600);
    }
  }

  undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
      tubes = history.pop();
      selectedTubeIdx = null;
      moves++;
      movesDisplay.textContent = `Moves: ${moves}`;
      renderTubes();
    }
  });

  resetBtn.addEventListener('click', () => {
    tubes = [
      ['R', 'B', 'G', 'Y'],
      ['B', 'Y', 'R', 'P'],
      ['G', 'P', 'B', 'R'],
      ['P', 'G', 'Y', 'P'],
      [],
      []
    ];
    selectedTubeIdx = null;
    moves = 0;
    movesDisplay.textContent = `Moves: 0`;
    renderTubes();
  });

  renderTubes();

  return () => {
    clearInterval(timerInterval);
  };
}
