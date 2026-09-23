(() => {
  // chess-mate-in-one/src/chess-engine.ts
  function fileToChar(f) {
    return String.fromCharCode("a".charCodeAt(0) + f);
  }
  function coordsToSquare(file, rank) {
    return `${fileToChar(file)}${rank + 1}`;
  }
  var ChessEngine = class {
    
    openRewardedAdModal() {
      sound.playClick();
      if (this.adModalEl) {
        this.adModalEl.remove();
      }
      this.adTimer = 5;
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none";
      this.adModalEl = modal;
      modal.innerHTML = `
      <div class="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-slate-800">
        <!-- Video Header -->
        <div class="w-full h-36 bg-gradient-to-tr from-indigo-900 to-blue-700 p-4 flex flex-col justify-between text-white relative">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
              SPONSORED REWARD
            </span>
            <span id="ad-counter-badge" class="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-md">
              0:05
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl">
              \u{1F4A1}
            </div>
            <div>
              <h4 class="font-black text-sm text-white">Grandmaster Hint</h4>
              <p class="text-[11px] text-blue-100">Unlocks the winning tactical move</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div id="ad-progress-bar" class="h-full bg-amber-400 transition-all duration-1000 ease-linear w-0"></div>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col items-center text-center">
          <p class="text-xs text-slate-500 font-medium mb-5">
            Support the game to reveal the secret piece and mating square for this puzzle.
          </p>

          <button id="btn-claim-hint" disabled class="btn-tactile w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
            <span>WAITING (5s)</span>
          </button>

          <button id="btn-skip-ad" class="mt-3 text-xs font-bold text-slate-400 hover:text-slate-600 py-1 px-3">
            Skip / Close
          </button>
        </div>
      </div>
    `;
      document.body.appendChild(modal);
      const progressBar = modal.querySelector("#ad-progress-bar");
      const badge = modal.querySelector("#ad-counter-badge");
      const claimBtn = modal.querySelector("#btn-claim-hint");
      const skipBtn = modal.querySelector("#btn-skip-ad");
      skipBtn.addEventListener("click", () => {
        this.closeAdModal();
      });
      if (this.adInterval) {
        clearInterval(this.adInterval);
      }
      this.adInterval = window.setInterval(() => {
        this.adTimer--;
        const progressPercent = Math.min(100, Math.floor((5 - this.adTimer) / 5 * 100));
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        if (badge) badge.innerText = `0:0${Math.max(0, this.adTimer)}`;
        if (this.adTimer <= 0) {
          clearInterval(this.adInterval);
          this.adInterval = null;
          claimBtn.disabled = false;
          claimBtn.className = "btn-tactile-primary w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 border border-amber-300 shadow-lg shadow-amber-400/30 cursor-pointer active:scale-95";
          claimBtn.innerHTML = "<span>CLAIM HINT! \u{1F4A1}</span>";
          claimBtn.addEventListener("click", () => {
            this.closeAdModal();
            this.gameState.unlockHint();
          });
        } else {
          claimBtn.innerHTML = `<span>WAITING (${this.adTimer}s)</span>`;
        }
      }, 1e3);
    }
    closeAdModal() {
      if (this.adInterval) {
        clearInterval(this.adInterval);
        this.adInterval = null;
      }
      if (this.adModalEl) {
        this.adModalEl.remove();
        this.adModalEl = null;
      }
    }
    /**
     * Level Select Screen (Section 6.A of manual)
     */
    renderLevelSelect() {
      const save = this.gameState.getSaveData();
      const container = document.createElement("div");
      container.className = "w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden";
      let gridHtml = "";
      const totalDisplayLevels = Math.max(30, save.unlockedLevel + 5);
      for (let idx = 0; idx < totalDisplayLevels; idx++) {
        const p = this.gameState.getPuzzleAtIndex(idx);
        const levelNum = p.id;
        const isUnlocked = levelNum <= save.unlockedLevel;
        const isCompleted = save.completedLevels.includes(levelNum);
        const starsCount = save.stars[levelNum] || (isCompleted ? 3 : 0);
        if (isUnlocked) {
          gridHtml += `
          <button data-level="${idx}" class="btn-tactile p-3 rounded-2xl ${isCompleted ? "bg-slate-800 border-blue-500/50" : "bg-slate-800/80 border-slate-700"} border flex flex-col items-center justify-between text-center relative group active:scale-95 transition-all">
            <div class="w-full flex items-center justify-between text-[10px] text-slate-400">
              <span class="font-extrabold text-blue-400">LV ${levelNum}</span>
              <span>${p.difficulty === "Beginner" ? "\u{1F7E2}" : p.difficulty === "Intermediate" ? "\u{1F7E1}" : "\u{1F534}"}</span>
            </div>
            <div class="my-1.5 text-2xl font-black text-white font-['Outfit']">
              ${levelNum}
            </div>
            <div class="text-[9px] font-bold text-slate-300 truncate w-full mb-1">
              ${p.theme}
            </div>
            <div class="text-xs text-amber-400">
              ${isCompleted ? "\u2B50".repeat(starsCount) : '<span class="text-slate-500">Unplayed</span>'}
            </div>
          </button>
        `;
        } else {
          gridHtml += `
          <div class="p-3 rounded-2xl bg-slate-800/30 border border-slate-800/50 flex flex-col items-center justify-center text-center opacity-40 select-none">
            <span class="text-xl mb-1">\u{1F512}</span>
            <span class="text-xs font-bold text-slate-500">Level ${levelNum}</span>
          </div>
        `;
        }
      }
      container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-levels-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">SELECT LEVEL</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Level Grid -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-5">
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          ${gridHtml}
        </div>
      </div>
    `;
      this.rootEl.appendChild(container);
      container.querySelector("#btn-levels-back")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
      container.querySelectorAll("button[data-level]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const levelIdx = parseInt(target.getAttribute("data-level") || "0", 10);
          this.gameState.initLevel(levelIdx);
          this.setScreen("PLAYING");
        });
      });
    }
    /**
     * How to Play Screen (Section 6.C of manual - 3 didactic cards)
     */
    renderHowToPlay() {
      const container = document.createElement("div");
      container.className = "w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden";
      container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-how-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">HOW TO PLAY</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- 3 Horizontal Tutorial Cards -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        <!-- Card 1 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl shrink-0">
            1\uFE0F\u20E3
          </div>
          <div>
            <h3 class="text-base font-extrabold text-blue-400 mb-1">Spot the Black King</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every puzzle starts with White to move. Locate the Black King and check its surrounding squares: which flight squares are blocked by its own pieces or covered by White?
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
            2\uFE0F\u20E3
          </div>
          <div>
            <h3 class="text-base font-extrabold text-amber-400 mb-1">Find the Single Mating Move</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tap or drag any White piece. Dots indicate legal target squares. Your goal is to find the single move that puts the King in check with ZERO legal replies!
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
            3\uFE0F\u20E3
          </div>
          <div>
            <h3 class="text-base font-extrabold text-emerald-400 mb-1">Immediate Checkmate!</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If Black can escape, capture, or block, it is not mate in 1. When you deliver true checkmate, you unlock the next puzzle, score stars, and celebrate victory!
            </p>
          </div>
        </div>
      </div>

      <!-- Play Now Button -->
      <div class="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <button id="btn-how-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm active:scale-95 shadow-lg shadow-blue-500/20">
          START SOLVING NOW
        </button>
      </div>
    `;
      this.rootEl.appendChild(container);
      container.querySelector("#btn-how-back")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
      container.querySelector("#btn-how-play")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
    }
    /**
     * Progress / Stats Screen
     */
    renderProgressScreen() {
      const save = this.gameState.getSaveData();
      const totalPuzzles = CHESS_PUZZLES.length;
      const solvedCount = save.completedLevels.length;
      const progressPercent = Math.floor(solvedCount / totalPuzzles * 100);
      const container = document.createElement("div");
      container.className = "w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden";
      container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-prog-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">PLAYER STATS</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Stats Content -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        <!-- Progress Bar Card -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Overall Completion</span>
            <span class="text-blue-400 font-extrabold text-sm">${progressPercent}%</span>
          </div>
          <div class="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style="width: ${progressPercent}%"></div>
          </div>
          <span class="text-[11px] text-slate-400 font-medium">${solvedCount} of ${totalPuzzles} tactical puzzles solved</span>
        </div>

        <!-- 2x2 Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">\u{1F3C6}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
            <span class="text-xl font-black text-amber-400">${this.gameState.getTotalScore()}</span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">\u{1F525}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Best Streak</span>
            <span class="text-xl font-black text-orange-400">${save.bestStreak} Puzzles</span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">\u2B50</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Stars</span>
            <span class="text-xl font-black text-amber-400">
              ${Object.values(save.stars).reduce((a, b) => a + b, 0)}
            </span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">\u{1F513}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Current Level</span>
            <span class="text-xl font-black text-blue-400">Level ${save.unlockedLevel}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Play Button -->
      <div class="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <button id="btn-prog-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm active:scale-95 shadow-lg shadow-blue-500/20">
          CONTINUE PLAYING
        </button>
      </div>
    `;
      this.rootEl.appendChild(container);
      container.querySelector("#btn-prog-back")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
      container.querySelector("#btn-prog-play")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
    }
    showWrongMoveToast(msg) {
      const toast = document.getElementById("wrong-move-toast");
      const toastText = document.getElementById("wrong-move-text");
      if (toast && toastText) {
        toastText.innerText = msg;
        toast.classList.remove("-translate-y-16", "opacity-0");
        toast.classList.add("translate-y-0", "opacity-100", "animate-shake");
        setTimeout(() => {
          toast.classList.remove("translate-y-0", "opacity-100", "animate-shake");
          toast.classList.add("-translate-y-16", "opacity-0");
        }, 2500);
      }
    }
    showVictoryModal() {
      const puzzle = this.gameState.getCurrentPuzzle();
      const save = this.gameState.getSaveData();
      const banner = document.getElementById("victory-banner");
      const exp = document.getElementById("victory-explanation");
      const stars = document.getElementById("victory-stars");
      if (exp) exp.innerText = puzzle.explanation;
      if (stars) stars.innerText = "\u2B50".repeat(save.stars[puzzle.id] || 3);
      if (banner) {
        banner.classList.remove("hidden");
        banner.classList.add("flex");
      }
    }
    hideVictoryModal() {
      const banner = document.getElementById("victory-banner");
      if (banner) {
        banner.classList.remove("flex");
        banner.classList.add("hidden");
      }
    }
    updatePlayingHud() {
      const puzzle = this.gameState.getCurrentPuzzle();
      const hintActive = this.gameState.isHintActive();
      const levelBadge = document.getElementById("level-badge");
      if (levelBadge) {
        levelBadge.innerText = `LEVEL ${puzzle.id}`;
      }
      const codeBadge = document.getElementById("puzzle-code-badge");
      if (codeBadge) {
        codeBadge.innerText = puzzle.code;
      }
      const hintText = document.getElementById("tactical-hint-text");
      if (hintText) {
        hintText.innerText = hintActive ? puzzle.hint : "Mate in 1 \u2022 White to move";
      }
      const hintBtn = document.getElementById("btn-game-hint");
      if (hintBtn) {
        if (hintActive) {
          hintBtn.innerHTML = `<span>\u{1F4A1}</span><span class="text-xs font-black">HINT ON</span>`;
          hintBtn.className = "btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all bg-amber-400 text-slate-900 border-amber-500 font-black shadow-xs";
        } else {
          hintBtn.innerHTML = `<span>\u{1F4A1}</span><span class="text-xs font-bold">HINT</span>`;
          hintBtn.className = "btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold";
        }
      }
      const scoreCounter = document.getElementById("score-counter");
      if (scoreCounter) {
        scoreCounter.innerText = String(this.gameState.getTotalScore());
      }
      if (!this.gameState.isCompleted()) {
        this.hideVictoryModal();
      }
    }
  };

  // chess-mate-in-one/src/main.ts
  var ChessGameApp = class {
    constructor() {
      this.displayManager = null;
      this.renderer = null;
      // Pointer drag state
      this.isDragging = false;
      this.dragOrigin = null;
      this.draggedPiece = null;
      const rootEl = document.getElementById("app-root");
      this.gameState = new GameStateManager();
      this.screenController = new ScreenController(rootEl, this.gameState, (screen) => {
        this.handleScreenChange(screen);
      });
      this.setupGameStateCallbacks();
      this.screenController.render();
      this.handleScreenChange(this.screenController.getCurrentScreen());
    }
    setupGameStateCallbacks() {
      this.gameState.setCallbacks({
        onStateChange: () => {
          this.syncRendererState();
          this.screenController.updatePlayingHud();
          this.updateHudMetrics();
        },
        onCheckmateWin: (_puzzle, _seconds, _score) => {
          const checkmateCoords = this.gameState.getCheckmateCoords();
          if (this.renderer && checkmateCoords) {
            this.renderer.spawnCheckmateCelebration(checkmateCoords.file, checkmateCoords.rank);
          }
          this.syncRendererState();
          this.screenController.showVictoryModal();
          this.updateHudMetrics();
        },
        onWrongMove: (msg) => {
          this.screenController.showWrongMoveToast(msg);
        }
      });
    }
    handleScreenChange(screen) {
      if (screen === "PLAYING") {
        setTimeout(() => {
          this.initCanvasAndRenderer();
        }, 20);
      } else {
        if (this.renderer) {
          this.renderer.stopLoop();
          this.renderer = null;
        }
        if (this.displayManager) {
          this.displayManager.destroy();
          this.displayManager = null;
        }
      }
    }
    initCanvasAndRenderer() {
      const canvas = document.getElementById("chess-canvas");
      if (!canvas) return;
      if (this.displayManager) {
        this.displayManager.destroy();
      }
      if (this.renderer) {
        this.renderer.stopLoop();
      }
      const ctx = canvas.getContext("2d");
      this.renderer = new ChessRenderer(ctx, {
        board: this.gameState.getBoard(),
        selectedCoord: this.gameState.getSelectedCoord(),
        validDestinations: this.gameState.getValidDestinations(),
        lastMove: this.gameState.getLastMove(),
        hintPiece: this.gameState.getHintPieceSquare(),
        hintTarget: this.gameState.getHintTargetSquare(),
        draggingPiece: null,
        checkmateCoords: this.gameState.getCheckmateCoords()
      });
      this.displayManager = new DisplayManager(canvas, (w, h) => {
        if (this.renderer) {
          this.renderer.updateDimensions(w, h);
        }
      });
      this.setupCanvasPointerEvents(canvas);
      this.renderer.startLoop();
      this.syncRendererState();
    }
    syncRendererState() {
      if (!this.renderer) return;
      this.renderer.setState({
        board: this.gameState.getBoard(),
        selectedCoord: this.gameState.getSelectedCoord(),
        validDestinations: this.gameState.getValidDestinations(),
        lastMove: this.gameState.getLastMove(),
        hintPiece: this.gameState.getHintPieceSquare(),
        hintTarget: this.gameState.getHintTargetSquare(),
        draggingPiece: this.isDragging && this.draggedPiece && this.dragOrigin ? {
          piece: this.draggedPiece,
          originFile: this.dragOrigin.file,
          originRank: this.dragOrigin.rank,
          currentX: 0,
          currentY: 0
        } : null,
        checkmateCoords: this.gameState.getCheckmateCoords()
      });
    }
    updateHudMetrics() {
      const scoreEl = document.getElementById("score-counter");
      if (scoreEl) {
        scoreEl.innerText = String(this.gameState.getTotalScore());
      }
    }
    setupCanvasPointerEvents(canvas) {
      const handlePointerDown = (clientX, clientY) => {
        if (!this.displayManager || !this.renderer || this.gameState.isCompleted()) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        const square = this.renderer.getSquareAt(coords.x, coords.y);
        if (!square) return;
        const board = this.gameState.getBoard();
        const piece = ChessEngine.getPiece(board, square.file, square.rank);
        const currentSelected = this.gameState.getSelectedCoord();
        const validDests = this.gameState.getValidDestinations();
        if (currentSelected && validDests.some((d) => d.file === square.file && d.rank === square.rank)) {
          this.gameState.executeMove(currentSelected.file, currentSelected.rank, square.file, square.rank);
          return;
        }
        if (piece && piece.color === "w") {
          this.isDragging = true;
          this.dragOrigin = square;
          this.draggedPiece = piece;
          this.gameState.selectSquare(square.file, square.rank);
          this.renderer.setState({
            draggingPiece: {
              piece,
              originFile: square.file,
              originRank: square.rank,
              currentX: coords.x,
              currentY: coords.y
            }
          });
        } else {
          this.gameState.selectSquare(square.file, square.rank);
        }
      };
      const handlePointerMove = (clientX, clientY) => {
        if (!this.isDragging || !this.displayManager || !this.renderer || !this.draggedPiece || !this.dragOrigin) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        this.renderer.setState({
          draggingPiece: {
            piece: this.draggedPiece,
            originFile: this.dragOrigin.file,
            originRank: this.dragOrigin.rank,
            currentX: coords.x,
            currentY: coords.y
          }
        });
      };
      const handlePointerUp = (clientX, clientY) => {
        if (!this.isDragging || !this.displayManager || !this.renderer || !this.dragOrigin) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        const targetSquare = this.renderer.getSquareAt(coords.x, coords.y);
        const origin = this.dragOrigin;
        this.isDragging = false;
        this.dragOrigin = null;
        this.draggedPiece = null;
        this.renderer.setState({ draggingPiece: null });
        if (targetSquare && (targetSquare.file !== origin.file || targetSquare.rank !== origin.rank)) {
          this.gameState.executeMove(origin.file, origin.rank, targetSquare.file, targetSquare.rank);
        }
      };
      canvas.addEventListener("mousedown", (e) => {
        handlePointerDown(e.clientX, e.clientY);
      });
      window.addEventListener("mousemove", (e) => {
        if (this.isDragging) {
          handlePointerMove(e.clientX, e.clientY);
        }
      });
      window.addEventListener("mouseup", (e) => {
        if (this.isDragging) {
          handlePointerUp(e.clientX, e.clientY);
        }
      });
      canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerDown(t.clientX, t.clientY);
        }
      }, { passive: true });
      window.addEventListener("touchmove", (e) => {
        if (this.isDragging && e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerMove(t.clientX, t.clientY);
        }
      }, { passive: true });
      window.addEventListener("touchend", (e) => {
        if (this.isDragging && e.changedTouches.length > 0) {
          const t = e.changedTouches[0];
          handlePointerUp(t.clientX, t.clientY);
        }
      }, { passive: true });
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new ChessGameApp();
  });
})();
