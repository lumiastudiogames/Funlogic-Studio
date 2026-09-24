(() => {
  // src/games/chess-mate-in-one/src/chess-engine.ts
  function fileToChar(f) {
    return String.fromCharCode("a".charCodeAt(0) + f);
  }
  function coordsToSquare(file, rank) {
    return `${fileToChar(file)}${rank + 1}`;
  }
  var ChessEngine = class {
    /**
     * Parse a FEN string (piece placement part) into an 8x8 BoardArray
     */
    static parseFen(fen) {
      const board = Array.from({ length: 8 }, () => Array(8).fill(null));
      const parts = fen.trim().split(" ");
      const rows = parts[0].split("/");
      for (let rIndex = 0; rIndex < 8; rIndex++) {
        const fenRow = rows[rIndex];
        const rank = 7 - rIndex;
        let file = 0;
        for (let i = 0; i < fenRow.length; i++) {
          const char = fenRow[i];
          if (char >= "1" && char <= "8") {
            file += parseInt(char, 10);
          } else {
            const color = char === char.toUpperCase() ? "w" : "b";
            const type = char.toLowerCase();
            board[rank][file] = { type, color };
            file++;
          }
        }
      }
      return board;
    }
    static cloneBoard(board) {
      return board.map((row) => row.map((cell) => cell ? { ...cell } : null));
    }
    static getPiece(board, file, rank) {
      if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
      return board[rank][file];
    }
    /**
     * Returns all pseudo-legal moves for a piece at given coordinates
     */
    static getPseudoMoves(board, file, rank) {
      const piece = this.getPiece(board, file, rank);
      if (!piece) return [];
      const moves = [];
      const color = piece.color;
      const enemyColor = color === "w" ? "b" : "w";
      const addMove = (tF, tR, promo) => {
        if (tF >= 0 && tF <= 7 && tR >= 0 && tR <= 7) {
          const target = board[tR][tF];
          if (!target || target.color === enemyColor) {
            moves.push({ fromFile: file, fromRank: rank, toFile: tF, toRank: tR, promotion: promo });
          }
        }
      };
      if (piece.type === "p") {
        const dir = color === "w" ? 1 : -1;
        const startRank = color === "w" ? 1 : 6;
        const promoRank = color === "w" ? 7 : 0;
        const f1Rank = rank + dir;
        if (f1Rank >= 0 && f1Rank <= 7 && !board[f1Rank][file]) {
          if (f1Rank === promoRank) {
            ["q", "r", "b", "n"].forEach((p) => addMove(file, f1Rank, p));
          } else {
            addMove(file, f1Rank);
          }
          const f2Rank = rank + 2 * dir;
          if (rank === startRank && !board[f2Rank][file]) {
            addMove(file, f2Rank);
          }
        }
        [-1, 1].forEach((dFile) => {
          const cFile = file + dFile;
          const cRank = rank + dir;
          if (cFile >= 0 && cFile <= 7 && cRank >= 0 && cRank <= 7) {
            const target = board[cRank][cFile];
            if (target && target.color === enemyColor) {
              if (cRank === promoRank) {
                ["q", "r", "b", "n"].forEach((p) => addMove(cFile, cRank, p));
              } else {
                addMove(cFile, cRank);
              }
            }
          }
        });
      } else if (piece.type === "n") {
        const offsets = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1]
        ];
        offsets.forEach(([dF, dR]) => addMove(file + dF, rank + dR));
      } else if (piece.type === "b" || piece.type === "r" || piece.type === "q") {
        const directions = [];
        if (piece.type === "b" || piece.type === "q") {
          directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
        }
        if (piece.type === "r" || piece.type === "q") {
          directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
        }
        directions.forEach(([dF, dR]) => {
          let curF = file + dF;
          let curR = rank + dR;
          while (curF >= 0 && curF <= 7 && curR >= 0 && curR <= 7) {
            const target = board[curR][curF];
            if (!target) {
              moves.push({ fromFile: file, fromRank: rank, toFile: curF, toRank: curR });
            } else {
              if (target.color === enemyColor) {
                moves.push({ fromFile: file, fromRank: rank, toFile: curF, toRank: curR });
              }
              break;
            }
            curF += dF;
            curR += dR;
          }
        });
      } else if (piece.type === "k") {
        for (let dF = -1; dF <= 1; dF++) {
          for (let dR = -1; dR <= 1; dR++) {
            if (dF === 0 && dR === 0) continue;
            addMove(file + dF, rank + dR);
          }
        }
      }
      return moves;
    }
    /**
     * Applies move on board and returns new board
     */
    static makeMove(board, move) {
      const nextBoard = this.cloneBoard(board);
      const piece = nextBoard[move.fromRank][move.fromFile];
      if (!piece) return nextBoard;
      nextBoard[move.fromRank][move.fromFile] = null;
      if (move.promotion) {
        nextBoard[move.toRank][move.toFile] = { type: move.promotion, color: piece.color };
      } else {
        nextBoard[move.toRank][move.toFile] = piece;
      }
      return nextBoard;
    }
    /**
     * Find king of given color
     */
    static findKing(board, color) {
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const p = board[r][f];
          if (p && p.type === "k" && p.color === color) {
            return { file: f, rank: r };
          }
        }
      }
      return null;
    }
    /**
     * Checks if square (sqF, sqR) is attacked by opponent of defendingColor
     */
    static isSquareAttacked(board, sqF, sqR, defendingColor) {
      const attackerColor = defendingColor === "w" ? "b" : "w";
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const p = board[r][f];
          if (!p || p.color !== attackerColor) continue;
          if (p.type === "p") {
            const dir = attackerColor === "w" ? 1 : -1;
            if (sqR === r + dir && (sqF === f - 1 || sqF === f + 1)) {
              return true;
            }
            continue;
          }
          const moves = this.getPseudoMoves(board, f, r);
          if (moves.some((m) => m.toFile === sqF && m.toRank === sqR)) {
            return true;
          }
        }
      }
      return false;
    }
    /**
     * Check if the King of given color is currently in check
     */
    static isKingInCheck(board, color) {
      const kingPos = this.findKing(board, color);
      if (!kingPos) return false;
      return this.isSquareAttacked(board, kingPos.file, kingPos.rank, color);
    }
    /**
     * Generates strictly legal moves for a given color
     */
    static getLegalMoves(board, color) {
      const legalMoves = [];
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const p = board[r][f];
          if (!p || p.color !== color) continue;
          const pseudoMoves = this.getPseudoMoves(board, f, r);
          for (const m of pseudoMoves) {
            const testBoard = this.makeMove(board, m);
            if (!this.isKingInCheck(testBoard, color)) {
              legalMoves.push(m);
            }
          }
        }
      }
      return legalMoves;
    }
    /**
     * Tests if the given color is in checkmate
     */
    static isCheckmate(board, color) {
      if (!this.isKingInCheck(board, color)) {
        return false;
      }
      const legalMoves = this.getLegalMoves(board, color);
      return legalMoves.length === 0;
    }
    /**
     * Validates if user's move leads to Checkmate against Black
     */
    static isWinningCheckmate(board, move) {
      const piece = this.getPiece(board, move.fromFile, move.fromRank);
      if (!piece || piece.color !== "w") return false;
      const testBoard = this.makeMove(board, move);
      if (this.isKingInCheck(testBoard, "w")) {
        return false;
      }
      return this.isCheckmate(testBoard, "b");
    }
  };

  // src/games/chess-mate-in-one/src/display.ts
  var DisplayManager = class {
    constructor(canvas, onResize) {
      this.dpr = 1;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onResizeCallback = onResize;
      this.observer = new ResizeObserver(() => this.resize());
      if (this.canvas.parentElement) {
        this.observer.observe(this.canvas.parentElement);
      }
      setTimeout(() => this.resize(), 10);
    }
    setResizeCallback(cb) {
      this.onResizeCallback = cb;
    }
    resize() {
      if (!this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.max(parentRect.width, 240);
      const cssHeight = Math.max(parentRect.height, 240);
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.canvas.style.width = `${cssWidth}px`;
      this.canvas.style.height = `${cssHeight}px`;
      this.ctx.scale(this.dpr, this.dpr);
      if (this.onResizeCallback) {
        this.onResizeCallback(cssWidth, cssHeight);
      }
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    getContext() {
      return this.ctx;
    }
    getDpr() {
      return this.dpr;
    }
    destroy() {
      this.observer.disconnect();
    }
  };

  // src/games/chess-mate-in-one/src/audio.ts
  var SoundSystem = class {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      const saved = localStorage.getItem("chess_sound_enabled");
      if (saved !== null) {
        this.enabled = saved === "true";
      }
    }
    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    isEnabled() {
      return this.enabled;
    }
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem("chess_sound_enabled", String(this.enabled));
      if (this.enabled) {
        this.playClick();
      }
      return this.enabled;
    }
    setEnabled(val) {
      this.enabled = val;
      localStorage.setItem("chess_sound_enabled", String(this.enabled));
    }
    /**
     * Subtle UI tactile click
     */
    playClick() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch {
      }
    }
    /**
     * Organic wooden chess piece placement
     */
    playMove() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.07);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.08);
        const bufferSize = this.ctx.sampleRate * 0.03;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(2.5, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.03);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        noise.start(now);
      } catch {
      }
    }
    /**
     * Heavy capture sound with physical resonance
     */
    playCapture() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        setTimeout(() => {
          this.playMove();
        }, 25);
      } catch {
      }
    }
    /**
     * Tense Check bell
     */
    playCheck() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 783.99].forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        });
      } catch {
      }
    }
    /**
     * Glorious royal checkmate fanfare chord
     */
    playCheckmate() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [
          { freq: 523.25, time: 0, dur: 0.6 },
          // C5
          { freq: 659.25, time: 0.08, dur: 0.6 },
          // E5
          { freq: 783.99, time: 0.16, dur: 0.7 },
          // G5
          { freq: 1046.5, time: 0.24, dur: 1.2 }
          // C6
        ];
        notes.forEach(({ freq, time, dur }) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + time);
          gain.gain.setValueAtTime(1e-3, now + time);
          gain.gain.linearRampToValueAtTime(0.35, now + time + 0.02);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + time);
          osc.stop(now + time + dur);
        });
      } catch {
      }
    }
    /**
     * Wrong move buzzer
     */
    playError() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch {
      }
    }
    /**
     * Magical shimmer when hint is unlocked
     */
    playHint() {
      if (!this.enabled) return;
      try {
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [880, 1174.66, 1318.51, 1760].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(1e-3, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.01);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + idx * 0.06 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.35);
        });
      } catch {
      }
    }
  };
  var sound = new SoundSystem();

  // src/games/chess-mate-in-one/src/procedural-puzzles.ts
  var ProceduralChessGenerator = class {
    /**
     * Generates a sound, verified mate-in-1 chess puzzle.
     * If any generation attempt fails strict verification, it falls back to a curated mathematical archetype.
     */
    static generatePuzzle(levelIndex) {
      const puzzleId = levelIndex + 1;
      const themes = [
        { name: "Back-Rank Execution", code: "back-rank", diff: "Beginner" },
        { name: "Queen & King Net", code: "queen-box", diff: "Beginner" },
        { name: "Arabian Night Hook", code: "arabian", diff: "Intermediate" },
        { name: "Anastasia Corridor", code: "anastasia", diff: "Intermediate" },
        { name: "Smothered Suffocation", code: "smothered", diff: "Master" },
        { name: "Boden Crossfire Bishops", code: "boden", diff: "Master" },
        { name: "Dovetail Kiss", code: "dovetail", diff: "Intermediate" },
        { name: "Pawn Phalanx Coronation", code: "pawn-promo", diff: "Master" },
        { name: "Battery Skewer", code: "battery", diff: "Intermediate" },
        { name: "Corner Trapping Corridor", code: "corner-trap", diff: "Beginner" }
      ];
      const archetype = themes[levelIndex % themes.length];
      for (let attempt = 0; attempt < 8; attempt++) {
        const generated = this.attemptGenerateArchetype(puzzleId, levelIndex * 13 + attempt, archetype);
        if (generated) {
          return generated;
        }
      }
      return this.createCuratedProcedural(puzzleId, levelIndex, archetype);
    }
    static attemptGenerateArchetype(id, seed, archetype) {
      const board = Array.from({ length: 8 }, () => Array(8).fill(null));
      const rand = (min, max) => {
        seed = (seed * 9301 + 49297) % 233280;
        const rnd = seed / 233280;
        return Math.floor(min + rnd * (max - min + 1));
      };
      let solutionFrom = "";
      let solutionTo = "";
      let hint = "";
      let explanation = "";
      if (archetype.code === "back-rank") {
        const kingFile = rand(5, 7);
        board[7][kingFile] = { type: "k", color: "b" };
        if (kingFile - 1 >= 0) board[6][kingFile - 1] = { type: "p", color: "b" };
        board[6][kingFile] = { type: "p", color: "b" };
        if (kingFile + 1 <= 7) board[6][kingFile + 1] = { type: "p", color: "b" };
        board[0][rand(1, 2)] = { type: "k", color: "w" };
        const rookFile = kingFile === 7 ? rand(0, 4) : 0;
        const rookStartRank = rand(0, 2);
        board[rookStartRank][rookFile] = { type: "r", color: "w" };
        board[1][rand(5, 6)] = { type: "p", color: "w" };
        solutionFrom = coordsToSquare(rookFile, rookStartRank);
        solutionTo = coordsToSquare(rookFile, 7);
        hint = `Deliver a swift corridor strike along the 8th rank to exploit Black's trapped King.`;
        explanation = `The White Rook invades the back rank. Black's own pawns obstruct all flight squares.`;
      } else if (archetype.code === "queen-box") {
        const kingCorner = rand(0, 1);
        const bFile = kingCorner === 0 ? 7 : 0;
        const bRank = 7;
        board[bRank][bFile] = { type: "k", color: "b" };
        const wKingFile = kingCorner === 0 ? 6 : 1;
        board[5][wKingFile] = { type: "k", color: "w" };
        const qStartFile = kingCorner === 0 ? rand(1, 3) : rand(4, 6);
        board[1][qStartFile] = { type: "q", color: "w" };
        const mateFile = kingCorner === 0 ? 6 : 1;
        solutionFrom = coordsToSquare(qStartFile, 1);
        solutionTo = coordsToSquare(mateFile, 6);
        hint = `Advance White's Queen into close quarters, protected by the White King.`;
        explanation = `The Queen steps directly into the adjacent square with White King support for mate.`;
      } else if (archetype.code === "arabian") {
        board[7][7] = { type: "k", color: "b" };
        board[5][5] = { type: "n", color: "w" };
        board[0][1] = { type: "k", color: "w" };
        const rookFile = rand(0, 3);
        board[6][rookFile] = { type: "r", color: "w" };
        solutionFrom = coordsToSquare(rookFile, 6);
        solutionTo = coordsToSquare(7, 6);
        hint = `Combine the Rook and Knight: the Knight guards flight squares and shields the Rook.`;
        explanation = `Rook delivers mate supported by the f6 Knight controlling g8 and h7.`;
      } else {
        board[7][7] = { type: "k", color: "b" };
        board[7][6] = { type: "r", color: "b" };
        board[6][7] = { type: "p", color: "b" };
        board[6][6] = { type: "p", color: "b" };
        board[0][0] = { type: "k", color: "w" };
        board[2][rand(2, 4)] = { type: "q", color: "w" };
        board[4][4] = { type: "n", color: "w" };
        solutionFrom = coordsToSquare(4, 4);
        solutionTo = coordsToSquare(5, 6);
        hint = `The Black King is suffocated by its own friendly defenders.`;
        explanation = `The Knight leaps over friendly lines to deliver an inescapable smothered mate.`;
      }
      const fen = this.boardToFen(board);
      const isValid = this.verifySingleMateInOne(fen, solutionFrom, solutionTo);
      if (isValid) {
        return {
          id,
          code: `${String(id).padStart(2, "0")}-${archetype.code}`,
          title: `${archetype.name} #${id}`,
          theme: archetype.name,
          difficulty: archetype.diff,
          fen,
          solution: {
            from: solutionFrom,
            to: solutionTo,
            san: "Mate#"
          },
          hint,
          explanation
        };
      }
      return null;
    }
    static createCuratedProcedural(id, levelIndex, archetype) {
      const templates = [
        {
          fen: "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
          from: "d1",
          to: "d8",
          hint: "Look for Black\u2019s trapped King behind its wall of pawns.",
          exp: "White Rook invades the 8th rank with zero legal escapes."
        },
        {
          fen: "7k/5Q1p/7K/8/8/8/8/8 w - - 0 1",
          from: "f7",
          to: "g7",
          hint: "White\u2019s King on h6 protects the mating square next to Black\u2019s King.",
          exp: "Queen delivers mate on g7, backed firmly by White King."
        },
        {
          fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
          from: "f3",
          to: "f7",
          hint: "Queen and Bishop synchronize assault against f7.",
          exp: "Qxf7# strikes the focal weakness guarded by Bishop."
        },
        {
          fen: "7k/3R4/5N2/8/8/8/8/6K1 w - - 0 1",
          from: "d7",
          to: "h7",
          hint: "The Knight seals g8 and shields the Rook on h7.",
          exp: "Rh7# locks the King into an Arabian corner tomb."
        },
        {
          fen: "6k1/4Nppp/8/8/8/8/8/4R1K1 w - - 0 1",
          from: "e1",
          to: "e8",
          hint: "Knight guards escape while Rook drives down the open e-file.",
          exp: "Re8# traps the King on the back rank."
        },
        {
          fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1",
          from: "h1",
          to: "h8",
          hint: "The White King dominates the a-file while Rook sweeps to rank 8.",
          exp: "Rh8# delivers back-rank mate with White King sealing all escapes."
        },
        {
          fen: "5rk1/5ppp/8/8/8/8/1B6/4R1K1 w - - 0 1",
          from: "e1",
          to: "e8",
          hint: "Infiltrate the 8th rank to pin down the black rook.",
          exp: "Re8# pins and skewers Black on the back rank."
        },
        {
          fen: "8/6pk/4N3/R7/8/8/8/6K1 w - - 0 1",
          from: "a5",
          to: "h5",
          hint: "Knight controls g7 and g5. Swing your rook to the edge.",
          exp: "Rh5# delivers the decisive edge checkmate."
        },
        {
          fen: "6k1/5N1R/6P1/8/8/8/8/6K1 w - - 0 1",
          from: "h7",
          to: "h8",
          hint: "Interlocking hook chain: Pawn defends Knight, Knight defends Rook.",
          exp: "Rh8# locks down the monarch."
        },
        {
          fen: "2k5/1p1p4/B7/8/5B2/8/8/4K3 w - - 0 1",
          from: "f4",
          to: "c7",
          hint: "Dark-square bishop guards b7/b8. Finish with light-square bishop.",
          exp: "Bc7# delivers Boden\u2019s criss-cross mate."
        },
        {
          fen: "k7/1R6/8/8/8/8/8/2R4K w - - 0 1",
          from: "c1",
          to: "a1",
          hint: "One Rook walls off the b-file. The second rook strikes.",
          exp: "Ra1# cuts off the cornered monarch."
        },
        {
          fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
          from: "e1",
          to: "e8",
          hint: "Exploit the open central corridor.",
          exp: "Re8# terminates the match on rank 8."
        },
        {
          fen: "7k/8/6K1/8/8/8/8/7Q w - - 0 1",
          from: "h1",
          to: "h7",
          hint: "Advance Queen directly into the King\u2019s face.",
          exp: "Qh7# traps the King in the corner under King support."
        },
        {
          fen: "k7/8/NK6/8/8/8/8/8 w - - 0 1",
          from: "a6",
          to: "c7",
          hint: "Hop the Knight into c7 while the King guards the perimeter.",
          exp: "Nc7# strikes the cornered King."
        },
        {
          fen: "k7/p7/K7/8/8/8/8/1Q6 w - - 0 1",
          from: "b1",
          to: "b7",
          hint: "Slide Queen to b7 right in front of the enemy King.",
          exp: "Qb7# finishes the game supported by White King."
        },
        {
          fen: "k7/8/K7/8/8/8/8/7Q w - - 0 1",
          from: "h1",
          to: "a8",
          hint: "Fire Queen across the board directly into a8.",
          exp: "Qa8# reaches Black\u2019s sanctuary with no escape."
        },
        {
          fen: "k7/8/1KB5/8/8/8/8/2B5 w - - 0 1",
          from: "c1",
          to: "f4",
          hint: "Activate dark-square bishop along the diagonal.",
          exp: "Bf4# sweeps the open diagonal while Bc6 and Kb6 seal all exits."
        },
        {
          fen: "7k/R7/5N2/8/8/8/8/6K1 w - - 0 1",
          from: "a7",
          to: "h7",
          hint: "Arabian mate on h7 supported by f6 Knight.",
          exp: "Rh7# traps Black against the edge."
        }
      ];
      const pick = templates[levelIndex % templates.length];
      return {
        id,
        code: `${String(id).padStart(2, "0")}-${archetype.code}`,
        title: `${archetype.name} \u2022 Stage ${id}`,
        theme: archetype.name,
        difficulty: archetype.diff,
        fen: pick.fen,
        solution: {
          from: pick.from,
          to: pick.to,
          san: "Mate#"
        },
        hint: pick.hint,
        explanation: pick.exp
      };
    }
    static boardToFen(board) {
      const rows = [];
      for (let r = 7; r >= 0; r--) {
        let emptyCount = 0;
        let rowStr = "";
        for (let f = 0; f < 8; f++) {
          const piece = board[r][f];
          if (!piece) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              rowStr += emptyCount;
              emptyCount = 0;
            }
            const char = piece.type;
            rowStr += piece.color === "w" ? char.toUpperCase() : char.toLowerCase();
          }
        }
        if (emptyCount > 0) {
          rowStr += emptyCount;
        }
        rows.push(rowStr);
      }
      return `${rows.join("/")} w - - 0 1`;
    }
    static verifySingleMateInOne(fen, fromSq, toSq) {
      const board = ChessEngine.parseFen(fen);
      const fromF = fromSq.charCodeAt(0) - "a".charCodeAt(0);
      const fromR = parseInt(fromSq[1], 10) - 1;
      const toF = toSq.charCodeAt(0) - "a".charCodeAt(0);
      const toR = parseInt(toSq[1], 10) - 1;
      const move = {
        fromFile: fromF,
        fromRank: fromR,
        toFile: toF,
        toRank: toR
      };
      return ChessEngine.isWinningCheckmate(board, move);
    }
  };

  // src/games/chess-mate-in-one/src/puzzles.ts
  var CHESS_PUZZLES = [
    {
      id: 1,
      code: "01-back-rank",
      title: "Back-Rank Corridor",
      theme: "Back-Rank Mate",
      difficulty: "Beginner",
      fen: "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
      solution: {
        from: "d1",
        to: "d8",
        san: "Rd8#"
      },
      hint: "Look for Black\u2019s trapped King behind its wall of pawns.",
      explanation: "Rook sweeps down to d8. Black\u2019s King cannot escape because f7, g7, and h7 are blocked by its own pawns."
    },
    {
      id: 2,
      code: "02-queen-corner",
      title: "Corner Support",
      theme: "King & Queen Mate",
      difficulty: "Beginner",
      fen: "7k/5Q1p/7K/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "f7",
        to: "g7",
        san: "Qg7#"
      },
      hint: "White\u2019s King on h6 protects the mating square right next to Black\u2019s King.",
      explanation: "Queen delivers mate on g7, shielded by the White King. Black has zero legal flight squares."
    },
    {
      id: 3,
      code: "03-scholars-f7",
      title: "Weakest Square",
      theme: "Battery on f7",
      difficulty: "Beginner",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
      solution: {
        from: "f3",
        to: "f7",
        san: "Qxf7#"
      },
      hint: "The Queen and Bishop team up against the vulnerable f7 square.",
      explanation: "Qxf7# strikes the undefended target, protected by the Bishop on c4."
    },
    {
      id: 4,
      code: "04-arabian-corner",
      title: "Arabian Night",
      theme: "Arabian Mate",
      difficulty: "Intermediate",
      fen: "7k/3R4/5N2/8/8/8/8/6K1 w - - 0 1",
      solution: {
        from: "d7",
        to: "h7",
        san: "Rh7#"
      },
      hint: "The Knight on f6 seals the exit on g8 and defends the corner rook strike.",
      explanation: "Rh7# traps the King in the corner. The Knight covers g8 and defends the Rook on h7."
    },
    {
      id: 5,
      code: "05-anastasias-mate",
      title: "Anastasia Corridor",
      theme: "Anastasia Mate",
      difficulty: "Intermediate",
      fen: "8/6pk/4N3/R7/8/8/8/6K1 w - - 0 1",
      solution: {
        from: "a5",
        to: "h5",
        san: "Rh5#"
      },
      hint: "The Knight on e6 controls g7 and g5. Swing your Rook over!",
      explanation: "Rh5# delivers the check along the h-file while the Knight covers g7 and g5."
    },
    {
      id: 6,
      code: "06-opera-box",
      title: "Morphy\u2019s Opera",
      theme: "Opera Mate",
      difficulty: "Intermediate",
      fen: "4k3/3b1ppp/8/6B1/8/8/8/3R2K1 w - - 0 1",
      solution: {
        from: "d1",
        to: "d8",
        san: "Rd8#"
      },
      hint: "The Bishop on g5 slices through e7. Send your Rook to the back rank.",
      explanation: "Rd8# is supported diagonally by the Bishop on g5, preventing any escape to e7."
    },
    {
      id: 7,
      code: "07-hook-mate",
      title: "The Hook",
      theme: "Hook Mate",
      difficulty: "Intermediate",
      fen: "6k1/5N1R/6P1/8/8/8/8/6K1 w - - 0 1",
      solution: {
        from: "h7",
        to: "h8",
        san: "Rh8#"
      },
      hint: "Pawn defends Knight, Knight defends Rook. Close the trap!",
      explanation: "Rh8# completes the hook interlocking chain: pawn on g6 shields Knight on f7 which shields Rook on h8."
    },
    {
      id: 8,
      code: "08-bodens-cross",
      title: "Criss-Cross Squeeze",
      theme: "Boden Mate",
      difficulty: "Intermediate",
      fen: "2k5/1p1p4/B7/8/5B2/8/8/4K3 w - - 0 1",
      solution: {
        from: "f4",
        to: "c7",
        san: "Bc7#"
      },
      hint: "The dark-square bishop guards b7/b8. Use the light-square bishop to finish.",
      explanation: "Bc7# cuts off the King completely as Ba6 seals b8, and the King cannot capture on c7."
    },
    {
      id: 9,
      code: "09-double-ladder",
      title: "Two Towers",
      theme: "Ladder Mate",
      difficulty: "Beginner",
      fen: "k7/1R6/8/8/8/8/8/2R4K w - - 0 1",
      solution: {
        from: "c1",
        to: "a1",
        san: "Ra1#"
      },
      hint: "One Rook controls the b-file wall. The second Rook delivers the final strike.",
      explanation: "Ra1# drives down the open a-file while the b7 Rook stops any retreat to the b-file."
    },
    {
      id: 10,
      code: "10-smothered-pin",
      title: "The Pinned Shield",
      theme: "Smothered Mate",
      difficulty: "Master",
      fen: "6rk/5p1p/8/6N1/8/1Q6/8/6K1 w - - 0 1",
      solution: {
        from: "g5",
        to: "f7",
        san: "Nf7#"
      },
      hint: "Notice that Black\u2019s pawn on f7 cannot capture because of the Queen on b3!",
      explanation: "Nf7# attacks the King while the pinned f7 pawn is helpless against the strike."
    },
    {
      id: 11,
      code: "11-epaulette-box",
      title: "Royal Epaulettes",
      theme: "Epaulette Mate",
      difficulty: "Intermediate",
      fen: "2rkr3/8/2K5/5Q2/8/8/8/8 w - - 0 1",
      solution: {
        from: "f5",
        to: "d7",
        san: "Qd7#"
      },
      hint: "Black\u2019s King is hemmed in by its own Rooks on c8 and e8.",
      explanation: "Qd7# lands right in front of the King, protected by the King on c6, leaving no escape."
    },
    {
      id: 12,
      code: "12-pawn-thrust",
      title: "The Humble Soldier",
      theme: "Pawn Mate",
      difficulty: "Intermediate",
      fen: "6k1/5p1p/5PpK/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "g6",
        to: "g7",
        san: "g7#"
      },
      hint: "Advance the pawn to seal the King in the corner.",
      explanation: "g7# gives check while taking away the final square on g8."
    },
    {
      id: 13,
      code: "13-underpromotion",
      title: "Golden Coronation",
      theme: "Promotion Mate",
      difficulty: "Intermediate",
      fen: "7k/5P1p/5K2/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "f7",
        to: "f8",
        promotion: "q",
        san: "f8=Q#"
      },
      hint: "Push the f7 pawn to the 8th rank and promote to Queen.",
      explanation: "f8=Q# promotes with immediate checkmate, supported by the King on f6."
    },
    {
      id: 14,
      code: "14-blind-swine",
      title: "Seventh Heaven",
      theme: "Seventh Rank Rooks",
      difficulty: "Intermediate",
      fen: "5rk1/R6R/8/8/8/8/8/6K1 w - - 0 1",
      solution: {
        from: "a7",
        to: "g7",
        san: "Rag7#"
      },
      hint: "Slide the a7 Rook to g7 alongside your partner Rook.",
      explanation: "Rag7# coordinates both 7th-rank rooks to crush the King against the edge."
    },
    {
      id: 15,
      code: "15-chess-mate",
      title: "Queen & King Mate",
      theme: "Corner Lockdown",
      difficulty: "Beginner",
      fen: "7k/8/6K1/8/8/8/8/7Q w - - 0 1",
      solution: {
        from: "h1",
        to: "h7",
        san: "Qh7#"
      },
      hint: "Advance White\u2019s Queen directly into the King\u2019s face, guarded by your King.",
      explanation: "Qh7# traps the King in the corner under the protective umbrella of the King on g6."
    },
    {
      id: 16,
      code: "16-damiano-mate",
      title: "Damiano\u2019s Secret",
      theme: "Damiano Mate",
      difficulty: "Intermediate",
      fen: "5rk1/6p1/5p2/8/8/8/4Q3/6K1 w - - 0 1",
      solution: {
        from: "e2",
        to: "e6",
        san: "Qe6#"
      },
      hint: "Target the open diagonal weakened by Black\u2019s f-pawn push.",
      explanation: "Qe6# attacks the paralyzed King with no blocks available."
    },
    {
      id: 17,
      code: "17-smothered-jump",
      title: "Corner Leap",
      theme: "Smothered Mate",
      difficulty: "Master",
      fen: "k7/2N5/1K6/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "c7",
        to: "a6",
        san: "Na6#"
      },
      hint: "Move the Knight to trap the King in the corner pocket.",
      explanation: "Na6# (or jump to a8) delivers checkmate with King on b6 controlling escape squares."
    },
    {
      id: 18,
      code: "18-dovetail-net",
      title: "Dovetail Net",
      theme: "Cozio / Dovetail Mate",
      difficulty: "Master",
      fen: "8/8/3k4/2pp4/4Q3/3K4/8/8 w - - 0 1",
      solution: {
        from: "e4",
        to: "e7",
        san: "Qe7#"
      },
      hint: "Find the diagonal square for the Queen where Black\u2019s pawns trap their own King.",
      explanation: "Qe7# corners the King between its own pawns on c5 and d5."
    },
    {
      id: 19,
      code: "19-double-bishop",
      title: "Crossed Lasers",
      theme: "Bishop Pair Mate",
      difficulty: "Intermediate",
      fen: "k7/8/1KB5/8/8/8/8/2B5 w - - 0 1",
      solution: {
        from: "c1",
        to: "f4",
        san: "Bf4#"
      },
      hint: "Activate your dark-square bishop along the long diagonal.",
      explanation: "Bf4# sweeps the remaining open diagonal while Bc6 and Kb6 seal all exits."
    },
    {
      id: 20,
      code: "20-queen-battery",
      title: "Heavy Battery",
      theme: "Major Piece Battery",
      difficulty: "Intermediate",
      fen: "3r2k1/p4ppp/8/8/8/8/1Q3PPP/1R4K1 w - - 0 1",
      solution: {
        from: "b2",
        to: "b8",
        san: "Qb8#"
      },
      hint: "Sacrifice or push the Queen to overload Black\u2019s defensive Rook.",
      explanation: "Qb8# attacks the back rank. Black cannot take without losing to Rxb8#."
    },
    {
      id: 21,
      code: "21-pawn-spear",
      title: "The Edge Spike",
      theme: "Pawn Mate",
      difficulty: "Intermediate",
      fen: "k7/P7/1K6/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "b6",
        to: "a6",
        san: "Ka6#"
      },
      hint: "Stalemate trap! Be careful not to stalemate.",
      explanation: "Wait, when pawn is on a7, Ka6 would be stalemate. Let\u2019s make a guaranteed checkmate."
    },
    {
      id: 22,
      code: "22-knight-fork-mate",
      title: "Leaping Checkmate",
      theme: "Knight Mate",
      difficulty: "Intermediate",
      fen: "k7/8/NK6/8/8/8/8/8 w - - 0 1",
      solution: {
        from: "a6",
        to: "c7",
        san: "Nc7#"
      },
      hint: "Hop the Knight into c7 while the King guards the perimeter.",
      explanation: "Nc7# strikes the cornered King, supported by the King on b6."
    },
    {
      id: 23,
      code: "23-blackburne-mate",
      title: "Blackburne\u2019s Strike",
      theme: "Blackburne Mate",
      difficulty: "Master",
      fen: "5rk1/5ppp/8/8/8/8/1B5N/7K w - - 0 1",
      solution: {
        from: "h2",
        to: "g4",
        san: "Ng4#"
      },
      hint: "Coordinate Knight and Bishop to cut off the g8 King.",
      explanation: "Ng4# or Nf3# coordinates with the Bishop cutting across the diagonal."
    },
    {
      id: 24,
      code: "24-corridor-crush",
      title: "Corridor Crush",
      theme: "Back-Rank Mate",
      difficulty: "Beginner",
      fen: "2r3k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1",
      solution: {
        from: "c1",
        to: "c8",
        san: "Rxc8#"
      },
      hint: "Capture the undefended rook on c8.",
      explanation: "Rxc8# removes the enemy defender and delivers an unstoppable back-rank mate."
    },
    {
      id: 25,
      code: "25-grandmaster-mate",
      title: "The Grandmaster Finale",
      theme: "Queen Crossfire",
      difficulty: "Master",
      fen: "k7/8/K7/8/8/8/8/7Q w - - 0 1",
      solution: {
        from: "h1",
        to: "a8",
        san: "Qa8#"
      },
      hint: "Fire the Queen across the entire board directly into a8.",
      explanation: "Qa8# reaches right into Black\u2019s sanctuary, leaving no escape."
    }
  ];
  CHESS_PUZZLES[20] = {
    id: 21,
    code: "21-rook-box",
    title: "Edge Box Mate",
    theme: "Rook & King Mate",
    difficulty: "Beginner",
    fen: "k7/8/1K6/8/8/8/8/R7 w - - 0 1",
    solution: {
      from: "a1",
      to: "a8",
      san: "Ra8#"
    },
    hint: "Drive your Rook to the 8th rank on the edge file.",
    explanation: "Ra8# delivers checkmate with King on b6 sealing b7 and b8."
  };
  CHESS_PUZZLES[22] = {
    id: 23,
    code: "23-knight-corner-pin",
    title: "Knight Corner Strike",
    theme: "Knight Mate",
    difficulty: "Master",
    fen: "7k/6p1/5N1K/8/8/8/8/8 w - - 0 1",
    solution: {
      from: "f6",
      to: "g8",
      san: "Ng8#"
    },
    hint: "Move the Knight to g8 or take advantage of the g7 pin.",
    explanation: "Ng8# or similar knight leap seals Black King."
  };
  CHESS_PUZZLES[22] = {
    id: 23,
    code: "23-queen-sniper",
    title: "Long-Range Sniper",
    theme: "Queen Mate",
    difficulty: "Intermediate",
    fen: "k7/p7/K7/8/8/8/8/1Q6 w - - 0 1",
    solution: {
      from: "b1",
      to: "b7",
      san: "Qb7#"
    },
    hint: "Slide the Queen right up to the enemy doorstep at b7.",
    explanation: "Qb7# strikes the King, protected by the White King on a6. Pawn on a7 cannot capture."
  };

  // src/games/chess-mate-in-one/src/game-state.ts
  var SAVE_KEY = "chess_mate_in_one_save";
  var GameStateManager = class {
    constructor() {
      this.currentLevelIndex = 0;
      this.puzzleCache = /* @__PURE__ */ new Map();
      this.board = [];
      this.selectedCoord = null;
      this.validDestinations = [];
      this.lastMove = null;
      this.checkmateCoords = null;
      // Level status
      this.isLevelCompleted = false;
      this.hintActive = false;
      this.hintStep = 0;
      // 0 = none, 1 = piece highlight, 2 = full solution
      // Timers and metrics
      this.levelStartTime = Date.now();
      this.timerInterval = null;
      this.elapsedSeconds = 0;
      // Persistent save
      this.saveData = {
        unlockedLevel: 1,
        completedLevels: [],
        stars: {},
        scores: {},
        soundEnabled: true,
        totalSolved: 0,
        bestStreak: 0,
        currentStreak: 0
      };
      this.loadSave();
      this.initLevel(0);
    }
    setCallbacks(cbs) {
      this.onStateChangeCb = cbs.onStateChange;
      this.onCheckmateWinCb = cbs.onCheckmateWin;
      this.onWrongMoveCb = cbs.onWrongMove;
    }
    loadSave() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.saveData = {
            unlockedLevel: parsed.unlockedLevel || 1,
            completedLevels: parsed.completedLevels || [],
            stars: parsed.stars || {},
            scores: parsed.scores || {},
            soundEnabled: parsed.soundEnabled ?? true,
            totalSolved: parsed.totalSolved || 0,
            bestStreak: parsed.bestStreak || 0,
            currentStreak: parsed.currentStreak || 0
          };
        }
      } catch {
      }
    }
    save() {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData));
      } catch {
      }
    }
    initLevel(index) {
      if (index < 0) index = 0;
      const targetLevelNum = index + 1;
      if (targetLevelNum > this.saveData.unlockedLevel) {
        index = Math.max(0, this.saveData.unlockedLevel - 1);
      }
      this.currentLevelIndex = index;
      const puzzle = this.getCurrentPuzzle();
      this.board = ChessEngine.parseFen(puzzle.fen);
      this.selectedCoord = null;
      this.validDestinations = [];
      this.lastMove = null;
      this.checkmateCoords = null;
      this.isLevelCompleted = false;
      this.hintActive = false;
      this.hintStep = 0;
      this.levelStartTime = Date.now();
      this.elapsedSeconds = 0;
      this.startTimer();
      this.notify();
    }
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.timerInterval = window.setInterval(() => {
        if (!this.isLevelCompleted) {
          this.elapsedSeconds = Math.floor((Date.now() - this.levelStartTime) / 1e3);
          this.notify();
        }
      }, 1e3);
    }
    getCurrentPuzzle() {
      return this.getPuzzleAtIndex(this.currentLevelIndex);
    }
    getPuzzleAtIndex(index) {
      if (this.puzzleCache.has(index)) {
        return this.puzzleCache.get(index);
      }
      let puzzle;
      if (index < CHESS_PUZZLES.length) {
        puzzle = CHESS_PUZZLES[index];
      } else {
        puzzle = ProceduralChessGenerator.generatePuzzle(index);
      }
      this.puzzleCache.set(index, puzzle);
      return puzzle;
    }
    getCurrentLevelIndex() {
      return this.currentLevelIndex;
    }
    getBoard() {
      return this.board;
    }
    getSelectedCoord() {
      return this.selectedCoord;
    }
    getValidDestinations() {
      return this.validDestinations;
    }
    getLastMove() {
      return this.lastMove;
    }
    getCheckmateCoords() {
      return this.checkmateCoords;
    }
    isCompleted() {
      return this.isLevelCompleted;
    }
    getElapsedSeconds() {
      return this.elapsedSeconds;
    }
    isHintActive() {
      return this.hintActive;
    }
    getHintStep() {
      return this.hintStep;
    }
    getSaveData() {
      return this.saveData;
    }
    getTotalScore() {
      return Object.values(this.saveData.scores).reduce((acc, s) => acc + s, 0);
    }
    getHintPieceSquare() {
      if (!this.hintActive || this.hintStep < 1) return null;
      const sol = this.getCurrentPuzzle().solution;
      const f = sol.from.charCodeAt(0) - "a".charCodeAt(0);
      const r = parseInt(sol.from[1], 10) - 1;
      return { file: f, rank: r };
    }
    getHintTargetSquare() {
      if (!this.hintActive || this.hintStep < 2) return null;
      const sol = this.getCurrentPuzzle().solution;
      const f = sol.to.charCodeAt(0) - "a".charCodeAt(0);
      const r = parseInt(sol.to[1], 10) - 1;
      return { file: f, rank: r };
    }
    unlockHint() {
      sound.playHint();
      this.hintActive = true;
      this.hintStep = Math.min(this.hintStep + 1, 2);
      const hp = this.getHintPieceSquare();
      if (hp) {
        this.selectSquare(hp.file, hp.rank);
      }
      this.notify();
    }
    selectSquare(file, rank) {
      if (this.isLevelCompleted) return;
      const piece = ChessEngine.getPiece(this.board, file, rank);
      if (this.selectedCoord && this.selectedCoord.file === file && this.selectedCoord.rank === rank) {
        this.selectedCoord = null;
        this.validDestinations = [];
        this.notify();
        return;
      }
      if (this.selectedCoord) {
        const isDestination = this.validDestinations.some((d) => d.file === file && d.rank === rank);
        if (isDestination) {
          this.executeMove(this.selectedCoord.file, this.selectedCoord.rank, file, rank);
          return;
        }
      }
      if (piece && piece.color === "w") {
        sound.playClick();
        this.selectedCoord = { file, rank };
        const allLegalMoves = ChessEngine.getLegalMoves(this.board, "w");
        this.validDestinations = allLegalMoves.filter((m) => m.fromFile === file && m.fromRank === rank).map((m) => ({ file: m.toFile, rank: m.toRank }));
        this.notify();
      } else {
        this.selectedCoord = null;
        this.validDestinations = [];
        this.notify();
      }
    }
    executeMove(fromFile, fromRank, toFile, toRank) {
      if (this.isLevelCompleted) return;
      const puzzle = this.getCurrentPuzzle();
      const targetPiece = ChessEngine.getPiece(this.board, toFile, toRank);
      const moveCoord = {
        fromFile,
        fromRank,
        toFile,
        toRank,
        promotion: puzzle.solution.promotion || (toRank === 7 ? "q" : void 0)
      };
      const legalMoves = ChessEngine.getLegalMoves(this.board, "w");
      const isLegal = legalMoves.some(
        (m) => m.fromFile === fromFile && m.fromRank === fromRank && m.toFile === toFile && m.toRank === toRank
      );
      if (!isLegal) {
        sound.playError();
        this.notifyWrongMove("Illegal chess move.");
        return;
      }
      if (targetPiece) {
        sound.playCapture();
      } else {
        sound.playMove();
      }
      this.board = ChessEngine.makeMove(this.board, moveCoord);
      this.lastMove = { fromFile, fromRank, toFile, toRank };
      this.selectedCoord = null;
      this.validDestinations = [];
      const isWinningMate = ChessEngine.isWinningCheckmate(
        ChessEngine.parseFen(puzzle.fen),
        moveCoord
      );
      if (isWinningMate) {
        const blackKing = ChessEngine.findKing(this.board, "b");
        this.checkmateCoords = blackKing ? { file: blackKing.file, rank: blackKing.rank } : { file: toFile, rank: toRank };
        this.handleVictory();
      } else {
        sound.playError();
        const inCheck = ChessEngine.isKingInCheck(this.board, "b");
        const msg = inCheck ? "Good check! But Black can still escape or block. Find the single mate in 1!" : "Not checkmate! White must deliver immediate checkmate in one move.";
        this.notifyWrongMove(msg);
        setTimeout(() => {
          if (!this.isLevelCompleted) {
            this.board = ChessEngine.parseFen(puzzle.fen);
            this.lastMove = null;
            this.notify();
          }
        }, 1200);
      }
      this.notify();
    }
    handleVictory() {
      this.isLevelCompleted = true;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      sound.playCheckmate();
      const puzzle = this.getCurrentPuzzle();
      const levelNum = puzzle.id;
      const timeSpent = Math.max(1, this.elapsedSeconds);
      let baseScore = 1e3;
      const timeBonus = Math.max(0, 500 - timeSpent * 15);
      const hintPenalty = this.hintActive ? 300 : 0;
      const roundScore = Math.max(250, baseScore + timeBonus - hintPenalty);
      let stars = 3;
      if (this.hintActive) stars = 2;
      if (this.hintStep >= 2 || timeSpent > 45) stars = 1;
      if (!this.saveData.completedLevels.includes(levelNum)) {
        this.saveData.completedLevels.push(levelNum);
        this.saveData.totalSolved += 1;
        this.saveData.currentStreak += 1;
        if (this.saveData.currentStreak > this.saveData.bestStreak) {
          this.saveData.bestStreak = this.saveData.currentStreak;
        }
      }
      this.saveData.stars[levelNum] = Math.max(this.saveData.stars[levelNum] || 0, stars);
      this.saveData.scores[levelNum] = Math.max(this.saveData.scores[levelNum] || 0, roundScore);
      if (levelNum + 1 > this.saveData.unlockedLevel) {
        this.saveData.unlockedLevel = levelNum + 1;
      }
      this.save();
      try {
        window.parent.postMessage({ type: "win", time: timeSpent }, "*");
      } catch {
      }
      if (this.onCheckmateWinCb) {
        this.onCheckmateWinCb(puzzle, timeSpent, roundScore);
      }
    }
    nextLevel() {
      const nextIndex = this.currentLevelIndex + 1;
      const nextLevelNum = nextIndex + 1;
      if (nextLevelNum <= this.saveData.unlockedLevel) {
        this.initLevel(nextIndex);
        return true;
      }
      return false;
    }
    restartLevel() {
      this.initLevel(this.currentLevelIndex);
    }
    notifyWrongMove(msg) {
      if (this.onWrongMoveCb) {
        this.onWrongMoveCb(msg);
      }
    }
    notify() {
      if (this.onStateChangeCb) {
        this.onStateChangeCb();
      }
    }
  };

  // src/games/chess-mate-in-one/src/chess-piece-vector.ts
  var ChessPieceVector = class {
    static draw(ctx, type, color, cx, cy, size, isDragging) {
      const isWhite = color === "w";
      const scale = size * 0.98 / 100;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      if (isDragging) {
        ctx.translate(0, -6);
      }
      const mainGrad = ctx.createLinearGradient(-35, -45, 35, 45);
      const bevelGrad = ctx.createLinearGradient(-30, -30, 30, 30);
      const strokeColor = isWhite ? "#1e293b" : "#090d16";
      if (isWhite) {
        mainGrad.addColorStop(0, "#ffffff");
        mainGrad.addColorStop(0.3, "#fbfbfe");
        mainGrad.addColorStop(0.8, "#e2e8f0");
        mainGrad.addColorStop(1, "#cbd5e1");
        bevelGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        bevelGrad.addColorStop(1, "rgba(203, 213, 225, 0.2)");
      } else {
        mainGrad.addColorStop(0, "#334155");
        mainGrad.addColorStop(0.3, "#1e293b");
        mainGrad.addColorStop(0.8, "#0f172a");
        mainGrad.addColorStop(1, "#020617");
        bevelGrad.addColorStop(0, "rgba(148, 163, 184, 0.55)");
        bevelGrad.addColorStop(1, "rgba(15, 23, 42, 0.1)");
      }
      ctx.fillStyle = mainGrad;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      switch (type) {
        case "p":
          this.drawPawn(ctx, isWhite);
          break;
        case "n":
          this.drawKnight(ctx, isWhite);
          break;
        case "b":
          this.drawBishop(ctx, isWhite);
          break;
        case "r":
          this.drawRook(ctx, isWhite);
          break;
        case "q":
          this.drawQueen(ctx, isWhite);
          break;
        case "k":
          this.drawKing(ctx, isWhite);
          break;
      }
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-10, -18, 6, 14, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.22)";
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }
    static drawBase(ctx, width = 38) {
      ctx.beginPath();
      ctx.roundRect(-width, 36, width * 2, 8, 3);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-width * 0.82, 28, width * 1.64, 8, 2);
      ctx.fill();
      ctx.stroke();
    }
    static drawPawn(ctx, _isWhite) {
      this.drawBase(ctx, 32);
      ctx.beginPath();
      ctx.moveTo(-22, 28);
      ctx.bezierCurveTo(-14, 18, -10, 0, -12, -10);
      ctx.lineTo(12, -10);
      ctx.bezierCurveTo(10, 0, 14, 18, 22, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-15, -13, 30, 5, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -25, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    static drawKnight(ctx, isWhite) {
      this.drawBase(ctx, 36);
      ctx.beginPath();
      ctx.moveTo(-24, 28);
      ctx.bezierCurveTo(-26, 12, -26, -6, -18, -20);
      ctx.bezierCurveTo(-15, -28, -8, -36, 4, -40);
      ctx.lineTo(8, -36);
      ctx.bezierCurveTo(14, -32, 26, -26, 32, -16);
      ctx.bezierCurveTo(34, -12, 32, -6, 26, -4);
      ctx.lineTo(16, -2);
      ctx.bezierCurveTo(10, 2, 6, 8, 8, 14);
      ctx.bezierCurveTo(14, 20, 22, 24, 24, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(14, -20, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isWhite ? "#1e293b" : "#f8fafc";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-16, -12);
      ctx.lineTo(-6, -8);
      ctx.moveTo(-18, 0);
      ctx.lineTo(-8, 4);
      ctx.moveTo(-20, 12);
      ctx.lineTo(-10, 16);
      ctx.stroke();
    }
    static drawBishop(ctx, _isWhite) {
      this.drawBase(ctx, 35);
      ctx.beginPath();
      ctx.moveTo(-24, 28);
      ctx.bezierCurveTo(-16, 15, -12, -2, -14, -15);
      ctx.lineTo(14, -15);
      ctx.bezierCurveTo(12, -2, 16, 15, 24, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-17, -18, 34, 6, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -30, 15, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(3, -40);
      ctx.lineTo(-6, -26);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -48, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    static drawRook(ctx, _isWhite) {
      this.drawBase(ctx, 36);
      ctx.beginPath();
      ctx.moveTo(-24, 28);
      ctx.bezierCurveTo(-20, 12, -18, -4, -18, -14);
      ctx.lineTo(18, -14);
      ctx.bezierCurveTo(18, -4, 20, 12, 24, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-24, -19, 48, 6, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-23, -19);
      ctx.lineTo(-23, -36);
      ctx.lineTo(-14, -36);
      ctx.lineTo(-14, -28);
      ctx.lineTo(-6, -28);
      ctx.lineTo(-6, -36);
      ctx.lineTo(6, -36);
      ctx.lineTo(6, -28);
      ctx.lineTo(14, -28);
      ctx.lineTo(14, -36);
      ctx.lineTo(23, -36);
      ctx.lineTo(23, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-16, 4);
      ctx.lineTo(16, 4);
      ctx.stroke();
    }
    static drawQueen(ctx, _isWhite) {
      this.drawBase(ctx, 38);
      ctx.beginPath();
      ctx.moveTo(-26, 28);
      ctx.bezierCurveTo(-18, 12, -14, -6, -16, -18);
      ctx.lineTo(16, -18);
      ctx.bezierCurveTo(14, -6, 18, 12, 26, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-20, -21, 40, 6, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-24, -21);
      ctx.lineTo(-25, -38);
      ctx.lineTo(-13, -28);
      ctx.lineTo(-8, -42);
      ctx.lineTo(0, -29);
      ctx.lineTo(8, -42);
      ctx.lineTo(13, -28);
      ctx.lineTo(25, -38);
      ctx.lineTo(24, -21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      const pearlX = [-25, -8, 8, 25];
      const pearlY = [-38, -42, -42, -38];
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(pearlX[i], pearlY[i], 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    static drawKing(ctx, _isWhite) {
      this.drawBase(ctx, 39);
      ctx.beginPath();
      ctx.moveTo(-27, 28);
      ctx.bezierCurveTo(-19, 12, -15, -6, -17, -18);
      ctx.lineTo(17, -18);
      ctx.bezierCurveTo(15, -6, 19, 12, 27, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-21, -21, 42, 6, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -28, 18, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      ctx.stroke();
      const crossTop = -48;
      ctx.beginPath();
      ctx.moveTo(-3, -33);
      ctx.lineTo(-3, crossTop);
      ctx.lineTo(3, crossTop);
      ctx.lineTo(3, -33);
      ctx.moveTo(-9, -41);
      ctx.lineTo(-9, -45);
      ctx.lineTo(9, -45);
      ctx.lineTo(9, -41);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  };

  // src/games/chess-mate-in-one/src/renderer.ts
  var ChessRenderer = class {
    constructor(ctx, initialState) {
      this.width = 400;
      this.height = 400;
      // Board layout metrics
      this.boardX = 0;
      this.boardY = 0;
      this.boardSize = 320;
      this.squareSize = 40;
      this.margin = 24;
      // Colors
      this.lightSquareColor = "#f5efe6";
      this.darkSquareColor = "#8d5b36";
      this.boardBorderColor = "#5c3a21";
      // Particles
      this.particles = [];
      this.slidingPiece = null;
      this.lastTime = performance.now();
      this.animFrameId = null;
      this.ctx = ctx;
      this.state = initialState;
    }
    updateDimensions(w, h) {
      this.width = w;
      this.height = h;
      const minDim = Math.min(w, h);
      this.boardSize = Math.max(minDim - 10, 240);
      this.margin = Math.max(Math.floor(this.boardSize * 0.035), 14);
      this.squareSize = (this.boardSize - this.margin * 2) / 8;
      this.boardX = (w - this.boardSize) / 2;
      this.boardY = (h - this.boardSize) / 2;
    }
    setState(nextState) {
      this.state = { ...this.state, ...nextState };
    }
    getSquareAt(px, py) {
      const startX = this.boardX + this.margin;
      const startY = this.boardY + this.margin;
      if (px < startX || px >= startX + this.squareSize * 8 || py < startY || py >= startY + this.squareSize * 8) {
        return null;
      }
      const file = Math.floor((px - startX) / this.squareSize);
      const row = Math.floor((py - startY) / this.squareSize);
      const rank = 7 - row;
      if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
        return { file, rank };
      }
      return null;
    }
    getSquareCenter(file, rank) {
      const startX = this.boardX + this.margin;
      const startY = this.boardY + this.margin;
      const row = 7 - rank;
      return {
        x: startX + (file + 0.5) * this.squareSize,
        y: startY + (row + 0.5) * this.squareSize
      };
    }
    animatePieceSlide(fromFile, fromRank, toFile, toRank, piece, onComplete) {
      const from = this.getSquareCenter(fromFile, fromRank);
      const to = this.getSquareCenter(toFile, toRank);
      this.slidingPiece = {
        piece,
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
        targetFile: toFile,
        targetRank: toRank,
        progress: 0,
        duration: 0.16,
        onComplete
      };
    }
    spawnMoveStars(file, rank) {
      const center = this.getSquareCenter(file, rank);
      const colors = ["#fbbf24", "#f59e0b", "#facc15", "#38bdf8", "#ffffff"];
      for (let i = 0; i < 24; i++) {
        const angle = Math.PI * 2 * i / 24 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4 + 1.8;
        this.particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 4.5 + 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 26 + 22,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.35,
          shape: "star"
        });
      }
    }
    spawnCheckmateCelebration(file, rank) {
      const center = this.getSquareCenter(file, rank);
      const colors = ["#f59e0b", "#fbbf24", "#3b82f6", "#60a5fa", "#10b981", "#ec4899", "#ffffff"];
      this.particles.push({
        x: center.x,
        y: center.y,
        vx: 0,
        vy: 0,
        size: 15,
        color: "#fbbf24",
        alpha: 1,
        life: 0,
        maxLife: 45,
        rotation: 0,
        vRot: 0,
        shape: "ring"
      });
      for (let i = 0; i < 65; i++) {
        const angle = Math.PI * 2 * i / 65 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 5 + 2.5;
        this.particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 40 + 35,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.25,
          shape: Math.random() > 0.5 ? "star" : "circle"
        });
      }
    }
    startLoop() {
      if (this.animFrameId !== null) return;
      const loop = (now) => {
        const dt = Math.min((now - this.lastTime) / 1e3, 0.1);
        this.lastTime = now;
        this.updateParticles(dt);
        this.render();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }
    stopLoop() {
      if (this.animFrameId !== null) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
    updateParticles(dt) {
      if (this.slidingPiece) {
        this.slidingPiece.progress += dt / this.slidingPiece.duration;
        if (this.slidingPiece.progress >= 1) {
          const sp = this.slidingPiece;
          this.slidingPiece = null;
          this.spawnMoveStars(sp.targetFile, sp.targetRank);
          if (sp.onComplete) sp.onComplete();
        }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        if (p.shape !== "ring") {
          p.vy += 0.15;
        } else {
          p.size += 3.5;
        }
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife || p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this.drawBoardBackground();
      this.drawSquares();
      this.drawCoordinates();
      this.drawMoveIndicators();
      this.drawPieces();
      this.drawHintHighlight();
      this.drawDraggingPiece();
      this.drawParticles();
    }
    drawBoardBackground() {
      const ctx = this.ctx;
      const x = this.boardX;
      const y = this.boardY;
      const size = this.boardSize;
      const radius = 14;
      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 8, size - 8, size, radius + 4);
      ctx.fill();
      ctx.restore();
      ctx.save();
      const grad = ctx.createLinearGradient(x, y, x + size, y + size);
      grad.addColorStop(0, "#53341b");
      grad.addColorStop(0.5, "#422813");
      grad.addColorStop(1, "#331e0d");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
      ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
    drawSquares() {
      const ctx = this.ctx;
      const startX = this.boardX + this.margin;
      const startY = this.boardY + this.margin;
      const sq = this.squareSize;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const file = col;
          const rank = 7 - row;
          const isDark = (col + row) % 2 === 1;
          const sx = startX + col * sq;
          const sy = startY + row * sq;
          ctx.fillStyle = isDark ? this.darkSquareColor : this.lightSquareColor;
          ctx.fillRect(sx, sy, sq, sq);
          ctx.fillStyle = isDark ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.15)";
          ctx.fillRect(sx, sy, sq, 1.5);
          if (this.state.lastMove) {
            const lm = this.state.lastMove;
            if (lm.fromFile === file && lm.fromRank === rank || lm.toFile === file && lm.toRank === rank) {
              ctx.fillStyle = "rgba(245, 158, 11, 0.28)";
              ctx.fillRect(sx, sy, sq, sq);
            }
          }
          if (this.state.selectedCoord && this.state.selectedCoord.file === file && this.state.selectedCoord.rank === rank) {
            ctx.fillStyle = "rgba(59, 130, 246, 0.35)";
            ctx.fillRect(sx, sy, sq, sq);
            ctx.strokeStyle = "#2563eb";
            ctx.lineWidth = 2.5;
            ctx.strokeRect(sx + 1.25, sy + 1.25, sq - 2.5, sq - 2.5);
          }
          if (this.state.checkmateCoords && this.state.checkmateCoords.file === file && this.state.checkmateCoords.rank === rank) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
            ctx.fillRect(sx, sy, sq, sq);
          }
        }
      }
    }
    drawCoordinates() {
      const ctx = this.ctx;
      const startX = this.boardX + this.margin;
      const startY = this.boardY + this.margin;
      const sq = this.squareSize;
      const fontSize = Math.max(Math.floor(this.margin * 0.55), 10);
      ctx.save();
      ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillStyle = "rgba(254, 243, 199, 0.75)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
      for (let c = 0; c < 8; c++) {
        const cx = startX + (c + 0.5) * sq;
        const cy = startY + 8 * sq + this.margin * 0.48;
        ctx.fillText(letters[c], cx, cy);
      }
      for (let r = 0; r < 8; r++) {
        const rankNum = 8 - r;
        const cy = startY + (r + 0.5) * sq;
        const cx = startX - this.margin * 0.48;
        ctx.fillText(String(rankNum), cx, cy);
      }
      ctx.restore();
    }
    drawMoveIndicators() {
      const ctx = this.ctx;
      const sq = this.squareSize;
      for (const dest of this.state.validDestinations) {
        const center = this.getSquareCenter(dest.file, dest.rank);
        const targetPiece = this.state.board[dest.rank][dest.file];
        ctx.save();
        if (targetPiece) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
          ctx.lineWidth = Math.max(sq * 0.08, 3);
          ctx.beginPath();
          ctx.arc(center.x, center.y, sq * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = "rgba(37, 99, 235, 0.65)";
          ctx.beginPath();
          ctx.arc(center.x, center.y, sq * 0.16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.beginPath();
          ctx.arc(center.x - 1, center.y - 1, sq * 0.06, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    drawPieces() {
      for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
          const piece = this.state.board[rank][file];
          if (!piece) continue;
          if (this.state.draggingPiece && this.state.draggingPiece.originFile === file && this.state.draggingPiece.originRank === rank) {
            continue;
          }
          if (this.slidingPiece && this.slidingPiece.targetFile === file && this.slidingPiece.targetRank === rank) {
            continue;
          }
          const center = this.getSquareCenter(file, rank);
          this.renderPiece(piece, center.x, center.y, this.squareSize, false);
        }
      }
      if (this.slidingPiece) {
        const t = Math.min(1, Math.max(0, this.slidingPiece.progress));
        const ease = 1 - Math.pow(1 - t, 3);
        const curX = this.slidingPiece.fromX + (this.slidingPiece.toX - this.slidingPiece.fromX) * ease;
        const curY = this.slidingPiece.fromY + (this.slidingPiece.toY - this.slidingPiece.fromY) * ease;
        this.renderPiece(this.slidingPiece.piece, curX, curY, this.squareSize * 1.05, true);
      }
    }
    drawHintHighlight() {
      const ctx = this.ctx;
      if (this.state.hintPiece) {
        const hp = this.state.hintPiece;
        const center = this.getSquareCenter(hp.file, hp.rank);
        const time = performance.now() * 5e-3;
        const radius = this.squareSize * (0.42 + 0.04 * Math.sin(time));
        ctx.save();
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      if (this.state.hintTarget) {
        const ht = this.state.hintTarget;
        const center = this.getSquareCenter(ht.file, ht.rank);
        ctx.save();
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.squareSize * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    drawDraggingPiece() {
      if (!this.state.draggingPiece) return;
      const { piece, currentX, currentY } = this.state.draggingPiece;
      this.renderPiece(piece, currentX, currentY, this.squareSize * 1.12, true);
    }
    /**
     * 2.5D Tactile Chess Piece rendering with contact shadow and directional lighting
     */
    renderPiece(piece, cx, cy, size, isDragging) {
      const ctx = this.ctx;
      const isWhite = piece.color === "w";
      ctx.save();
      const shadowY = cy + size * (isDragging ? 0.38 : 0.32);
      const shadowRadiusX = size * (isDragging ? 0.38 : 0.34);
      const shadowRadiusY = size * (isDragging ? 0.16 : 0.12);
      const shadowAlpha = isDragging ? 0.22 : 0.15;
      ctx.beginPath();
      ctx.ellipse(cx, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
      ctx.fill();
      ChessPieceVector.draw(ctx, piece.type, piece.color, cx, cy, size, isDragging);
      ctx.restore();
    }
    drawParticles() {
      const ctx = this.ctx;
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.shape === "ring") {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === "star") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * p.size, -Math.sin((18 + i * 72) * Math.PI / 180) * p.size);
            ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (p.size * 0.45), -Math.sin((54 + i * 72) * Math.PI / 180) * (p.size * 0.45));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  };

  // src/games/chess-mate-in-one/src/screen-manager.ts
  var ScreenController = class {
    constructor(rootEl, gameState, onScreenChange) {
      this.currentScreen = "MAIN_MENU";
      // Ad simulation modal state
      this.adTimer = 5;
      this.adInterval = null;
      this.adModalEl = null;
      this.rootEl = rootEl;
      this.gameState = gameState;
      this.onScreenChangeCb = onScreenChange;
    }
    setScreen(screen) {
      sound.playClick();
      this.currentScreen = screen;
      this.render();
      if (this.onScreenChangeCb) {
        this.onScreenChangeCb(screen);
      }
    }
    getCurrentScreen() {
      return this.currentScreen;
    }
    render() {
      this.rootEl.innerHTML = "";
      if (this.currentScreen === "MAIN_MENU") {
        this.renderMainMenu();
      } else if (this.currentScreen === "PLAYING") {
        this.renderPlayingScreen();
      } else if (this.currentScreen === "LEVEL_SELECT") {
        this.renderLevelSelect();
      } else if (this.currentScreen === "HOW_TO_PLAY") {
        this.renderHowToPlay();
      } else if (this.currentScreen === "PROGRESS") {
        this.renderProgressScreen();
      }
    }
    /**
     * Main Menu Screen
     */
    renderMainMenu() {
      const save = this.gameState.getSaveData();
      const currentPuzzle = this.gameState.getCurrentPuzzle();
      const container = document.createElement("div");
      container.className = "w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white relative overflow-y-auto";
      container.innerHTML = `
      <!-- Top Bar: Sound toggle -->
      <div class="w-full flex items-center justify-between z-10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-sm">
            \u265E
          </div>
          <span class="text-xs font-bold tracking-wider text-slate-400 uppercase">CHESS TACTICS</span>
        </div>
        <button id="btn-menu-sound" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 active:scale-95" title="Toggle Sound">
          ${sound.isEnabled() ? "\u{1F50A}" : "\u{1F507}"}
        </button>
      </div>

      <!-- Center Hero: Knight Emblem & Title -->
      <div class="flex flex-col items-center text-center my-auto z-10 max-w-sm">
        <div class="relative mb-5">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 shadow-xl shadow-blue-500/25 border-2 border-blue-400/40 flex items-center justify-center text-5xl sm:text-6xl text-white select-none">
            \u265E
          </div>
          <div class="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            MATE IN 1
          </div>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-['Outfit']">
          Chess Mate in One
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
          Spot the single winning move by White to deliver immediate, unstoppable checkmate.
        </p>

        <!-- Stats Chips -->
        <div class="grid grid-cols-2 gap-3 w-full mb-8">
          <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 flex flex-col items-center">
            <span class="text-[10px] uppercase font-bold text-slate-400">Solved Puzzles</span>
            <span class="text-xl font-extrabold text-blue-400">${save.completedLevels.length} / ${CHESS_PUZZLES.length}</span>
          </div>
          <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 flex flex-col items-center">
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
            <span class="text-xl font-extrabold text-amber-400">${this.gameState.getTotalScore()}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3 w-full">
          <button id="btn-menu-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98]">
            <span>PLAY PUZZLE ${currentPuzzle.id}</span>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>

          <button id="btn-menu-levels" class="btn-tactile w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm tracking-wide flex items-center justify-center gap-2 active:scale-[0.98]">
            <span>LEVEL SELECT</span>
            <span class="text-xs bg-slate-700 px-2 py-0.5 rounded-md text-blue-300 font-bold">${save.unlockedLevel} Unlocked</span>
          </button>

          <button id="btn-menu-rules" class="btn-tactile w-full py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/60 font-medium text-xs tracking-wide flex items-center justify-center gap-1.5 active:scale-[0.98]">
            <span>\u{1F4A1} How to Play</span>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="text-[11px] text-slate-400 font-medium text-center z-10 shrink-0 mt-4">
        25 Handcrafted Tactical Puzzles \u2022 Pure Vanilla Engine
      </div>
    `;
      this.rootEl.appendChild(container);
      container.querySelector("#btn-menu-sound")?.addEventListener("click", () => {
        sound.toggle();
        this.render();
      });
      container.querySelector("#btn-menu-play")?.addEventListener("click", () => {
        this.setScreen("PLAYING");
      });
      container.querySelector("#btn-menu-levels")?.addEventListener("click", () => {
        this.setScreen("LEVEL_SELECT");
      });
      container.querySelector("#btn-menu-rules")?.addEventListener("click", () => {
        this.setScreen("HOW_TO_PLAY");
      });
    }
    /**
     * Playing Screen (Header + Canvas + Subheader + Tactical Card + Bottom Navigation)
     */
    renderPlayingScreen() {
      const puzzle = this.gameState.getCurrentPuzzle();
      const save = this.gameState.getSaveData();
      const isCompleted = this.gameState.isCompleted();
      const hintActive = this.gameState.isHintActive();
      const container = document.createElement("div");
      container.className = "w-full h-full flex flex-col bg-slate-100 relative overflow-hidden select-none";
      container.innerHTML = `
      <!-- 1. Header (Superior HUD matching manual with shrink-0) -->
      <header class="w-full h-14 bg-white/95 px-3 sm:px-4 border-b border-slate-200 flex items-center justify-between gap-1.5 shrink-0 z-20 shadow-xs">
        <!-- Left: Pause/Home + Level Pill -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="btn-game-menu" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 active:scale-95 transition-transform" title="Menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div id="level-badge" class="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shrink-0 uppercase tracking-wide">
            LEVEL ${puzzle.id}
          </div>
        </div>

        <!-- Right: Metrics (Score, Hint, Restart, Sound) -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-0.5 text-center min-w-[58px] shrink-0">
            <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase leading-none mt-0.5">SCORE</span>
            <span id="score-counter" class="font-extrabold text-xs sm:text-sm text-slate-800 leading-tight">${this.gameState.getTotalScore()}</span>
          </div>

          <!-- Hint button -->
          <button id="btn-game-hint" class="btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all ${hintActive ? "bg-amber-400 text-slate-900 border-amber-500 font-black shadow-xs" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"}" title="Get Tactical Hint">
            <span>\u{1F4A1}</span>
            <span class="text-xs font-bold">${hintActive ? "HINT ON" : "HINT"}</span>
          </button>

          <!-- Restart button -->
          <button id="btn-game-restart" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 hover:bg-slate-50" title="Restart Puzzle">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span class="hidden sm:inline">RESET</span>
          </button>

          <!-- Sound button -->
          <button id="btn-game-sound" class="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 active:scale-95 transition-transform" title="Toggle Sound">
            <span class="text-sm">${sound.isEnabled() ? "\u{1F50A}" : "\u{1F507}"}</span>
          </button>
        </div>
      </header>

      <!-- 2. Subheader -->
      <div class="w-full bg-slate-50/90 border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between text-xs shrink-0 z-10">
        <span id="puzzle-code-badge" class="font-bold text-slate-500 tracking-tight">${puzzle.code}</span>
        <div class="flex items-center gap-1.5 font-bold text-blue-700 truncate max-w-[280px] sm:max-w-md">
          <span>\u{1F9E9}</span>
          <span id="tactical-hint-text">${hintActive ? puzzle.hint : "Mate in 1 \u2022 White to move"}</span>
        </div>
        <div class="flex items-center gap-1 text-slate-400 text-xs shrink-0">
          <span>\u2B50</span>
        </div>
      </div>

      <!-- 3. Canvas Container (Flex-1 central area taking all available space) -->
      <div id="canvas-container" class="flex-1 w-full relative flex items-center justify-center overflow-hidden p-1 min-h-[260px]">
        <canvas id="chess-canvas" class="block touch-none"></canvas>

        <!-- Wrong move warning toast overlay -->
        <div id="wrong-move-toast" class="absolute top-3 left-4 right-4 bg-rose-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transform -translate-y-16 transition-transform duration-300 opacity-0 pointer-events-none z-30">
          <span>\u26A0\uFE0F</span>
          <span id="wrong-move-text">Not checkmate! White must deliver mate in one.</span>
        </div>

        <!-- Victory celebration banner overlay -->
        <div id="victory-banner" class="${isCompleted ? "flex" : "hidden"} absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex-col items-center justify-center p-4 z-40 animate-fade-in" onclick="event.stopPropagation()">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center relative" onclick="event.stopPropagation()">
            <button id="btn-victory-close" aria-label="Close" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm active:scale-90 transition-all cursor-pointer">\u2715</button>
            <div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 text-3xl flex items-center justify-center mb-3 shadow-inner">
              \u{1F451}
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-1 font-['Outfit']">CHECKMATE!</h3>
            <p id="victory-explanation" class="text-slate-500 text-xs mb-4 font-medium">${puzzle.explanation}</p>
            <div id="victory-stars" class="flex items-center justify-center gap-1 text-amber-400 text-xl mb-5">
              ${"\u2B50".repeat(save.stars[puzzle.id] || 3)}
            </div>
            <div class="flex gap-2 w-full">
              <button id="btn-victory-replay" class="btn-tactile flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 cursor-pointer">
                RESTART
              </button>
              <button id="btn-victory-next" class="btn-tactile-primary flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs active:scale-95 shadow-md shadow-blue-500/30 cursor-pointer">
                NEXT PUZZLE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation Bar matching screenshot (Home, Puzzles, Progress) -->
      <footer class="w-full h-14 bg-white border-t border-slate-200 px-4 flex items-center justify-around shrink-0 z-20">
        <button id="btn-tab-home" class="flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-colors gap-0.5 py-1">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px] font-bold">Home</span>
        </button>

        <button id="btn-tab-puzzles" class="flex flex-col items-center justify-center text-blue-600 font-extrabold active:scale-95 gap-0.5 py-1">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/></svg>
          <span class="text-[10px]">Puzzles</span>
        </button>

        <button id="btn-tab-progress" class="flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-colors gap-0.5 py-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span class="text-[10px] font-bold">Progress</span>
        </button>
      </footer>
    `;
      this.rootEl.appendChild(container);
      container.querySelector("#btn-game-menu")?.addEventListener("click", () => {
        this.setScreen("MAIN_MENU");
      });
      container.querySelector("#btn-game-restart")?.addEventListener("click", () => {
        sound.playClick();
        this.gameState.restartLevel();
      });
      container.querySelector("#btn-game-sound")?.addEventListener("click", () => {
        sound.toggle();
        const soundBtn = container.querySelector("#btn-game-sound");
        if (soundBtn) {
          soundBtn.innerHTML = `<span class="text-sm">${sound.isEnabled() ? "\u{1F50A}" : "\u{1F507}"}</span>`;
        }
      });
      container.querySelector("#btn-game-hint")?.addEventListener("click", () => {
        this.openRewardedAdModal();
      });
      container.querySelector("#btn-victory-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        sound.playClick();
        this.hideVictoryModal();
      });
      container.querySelector("#btn-victory-replay")?.addEventListener("click", (e) => {
        e.stopPropagation();
        sound.playClick();
        this.hideVictoryModal();
        this.gameState.restartLevel();
        this.updatePlayingHud();
      });
      container.querySelector("#btn-victory-next")?.addEventListener("click", (e) => {
        e.stopPropagation();
        sound.playClick();
        this.hideVictoryModal();
        this.gameState.nextLevel();
        this.updatePlayingHud();
      });
      container.querySelector("#btn-tab-home")?.addEventListener("click", () => {
        this.setScreen("MAIN_MENU");
      });
      container.querySelector("#btn-tab-puzzles")?.addEventListener("click", () => {
        this.setScreen("LEVEL_SELECT");
      });
      container.querySelector("#btn-tab-progress")?.addEventListener("click", () => {
        this.setScreen("PROGRESS");
      });
    }
    /**
     * Rewarded Ad Simulated Modal (Section 6.B of manual)
     */
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
      modal.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.target === modal) {
          this.closeAdModal();
        }
      });
      const progressBar = modal.querySelector("#ad-progress-bar");
      const badge = modal.querySelector("#ad-counter-badge");
      const claimBtn = modal.querySelector("#btn-claim-hint");
      const skipBtn = modal.querySelector("#btn-skip-ad");
      skipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
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

  // src/games/chess-mate-in-one/src/main.ts
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
      canvas.style.touchAction = "none";
      const handlePointerDown = (clientX, clientY, e) => {
        if (!this.displayManager || !this.renderer || this.gameState.isCompleted()) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        const square = this.renderer.getSquareAt(coords.x, coords.y);
        if (!square) return;
        const board = this.gameState.getBoard();
        const piece = ChessEngine.getPiece(board, square.file, square.rank);
        const currentSelected = this.gameState.getSelectedCoord();
        const validDests = this.gameState.getValidDestinations();
        if (currentSelected && validDests.some((d) => d.file === square.file && d.rank === square.rank)) {
          if (e && e.cancelable) e.preventDefault();
          const p = ChessEngine.getPiece(board, currentSelected.file, currentSelected.rank);
          if (this.renderer && p) {
            this.renderer.animatePieceSlide(currentSelected.file, currentSelected.rank, square.file, square.rank, p, () => {});
          }
          this.gameState.executeMove(currentSelected.file, currentSelected.rank, square.file, square.rank);
          return;
        }
        if (piece && piece.color === "w") {
          if (e && e.cancelable) e.preventDefault();
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
      const handlePointerMove = (clientX, clientY, e) => {
        if (!this.isDragging || !this.displayManager || !this.renderer || !this.draggedPiece || !this.dragOrigin) return;
        if (e && e.cancelable) e.preventDefault();
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
      const handlePointerUp = (clientX, clientY, e) => {
        if (!this.isDragging || !this.displayManager || !this.renderer || !this.dragOrigin) return;
        if (e && e.cancelable) e.preventDefault();
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        const targetSquare = this.renderer.getSquareAt(coords.x, coords.y);
        const origin = this.dragOrigin;
        this.isDragging = false;
        this.dragOrigin = null;
        this.draggedPiece = null;
        this.renderer.setState({ draggingPiece: null });
        if (targetSquare && (targetSquare.file !== origin.file || targetSquare.rank !== origin.rank)) {
          if (this.renderer) {
            this.renderer.spawnMoveStars(targetSquare.file, targetSquare.rank);
          }
          this.gameState.executeMove(origin.file, origin.rank, targetSquare.file, targetSquare.rank);
        }
      };
      canvas.addEventListener("mousedown", (e) => {
        handlePointerDown(e.clientX, e.clientY, e);
      });
      window.addEventListener("mousemove", (e) => {
        if (this.isDragging) {
          handlePointerMove(e.clientX, e.clientY, e);
        }
      });
      window.addEventListener("mouseup", (e) => {
        if (this.isDragging) {
          handlePointerUp(e.clientX, e.clientY, e);
        }
      });
      canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerDown(t.clientX, t.clientY, e);
        }
      }, { passive: false });
      window.addEventListener("touchmove", (e) => {
        if (this.isDragging && e.touches.length > 0) {
          const t = e.touches[0];
          handlePointerMove(t.clientX, t.clientY, e);
        }
      }, { passive: false });
      window.addEventListener("touchend", (e) => {
        if (this.isDragging && e.changedTouches.length > 0) {
          const t = e.changedTouches[0];
          handlePointerUp(t.clientX, t.clientY, e);
        }
      }, { passive: false });
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new ChessGameApp();
  });
})();
