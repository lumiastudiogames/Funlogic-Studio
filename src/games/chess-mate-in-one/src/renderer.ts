import { BoardArray, coordsToSquare } from './chess-engine';
import { ChessPieceVector } from './chess-piece-vector';
import { Piece, PieceColor, PieceType } from './types';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'ring';
}

export interface RenderState {
  board: BoardArray;
  selectedCoord: { file: number; rank: number } | null;
  validDestinations: { file: number; rank: number }[];
  lastMove: { fromFile: number; fromRank: number; toFile: number; toRank: number } | null;
  hintPiece: { file: number; rank: number } | null;
  hintTarget: { file: number; rank: number } | null;
  draggingPiece: {
    piece: Piece;
    originFile: number;
    originRank: number;
    currentX: number;
    currentY: number;
  } | null;
  checkmateCoords: { file: number; rank: number } | null;
}

export class ChessRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 400;
  private height: number = 400;

  // Board layout metrics
  private boardX: number = 0;
  private boardY: number = 0;
  private boardSize: number = 320;
  private squareSize: number = 40;
  private margin: number = 24;

  // Colors
  private lightSquareColor = '#f5efe6';
  private darkSquareColor = '#8d5b36';
  private boardBorderColor = '#5c3a21';

  // Particles
  private particles: Particle[] = [];
  private lastTime: number = performance.now();
  private animFrameId: number | null = null;
  private state: RenderState;

  constructor(ctx: CanvasRenderingContext2D, initialState: RenderState) {
    this.ctx = ctx;
    this.state = initialState;
  }

  public updateDimensions(w: number, h: number) {
    this.width = w;
    this.height = h;

    // Calculate maximum square board fitting inside container with minimal wasted border
    const minDim = Math.min(w, h);
    this.boardSize = Math.max(minDim - 10, 240);
    this.margin = Math.max(Math.floor(this.boardSize * 0.035), 14);
    this.squareSize = (this.boardSize - this.margin * 2) / 8;

    this.boardX = (w - this.boardSize) / 2;
    this.boardY = (h - this.boardSize) / 2;
  }

  public setState(nextState: Partial<RenderState>) {
    this.state = { ...this.state, ...nextState };
  }

  public getSquareAt(px: number, py: number): { file: number; rank: number } | null {
    const startX = this.boardX + this.margin;
    const startY = this.boardY + this.margin;

    if (
      px < startX ||
      px >= startX + this.squareSize * 8 ||
      py < startY ||
      py >= startY + this.squareSize * 8
    ) {
      return null;
    }

    const file = Math.floor((px - startX) / this.squareSize);
    // In standard chess rendering, top row is rank 8 (rankIndex 7)
    const row = Math.floor((py - startY) / this.squareSize);
    const rank = 7 - row;

    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return { file, rank };
    }
    return null;
  }

  public getSquareCenter(file: number, rank: number): { x: number; y: number } {
    const startX = this.boardX + this.margin;
    const startY = this.boardY + this.margin;
    const row = 7 - rank;

    return {
      x: startX + (file + 0.5) * this.squareSize,
      y: startY + (row + 0.5) * this.squareSize,
    };
  }

  public spawnCheckmateCelebration(file: number, rank: number) {
    const center = this.getSquareCenter(file, rank);
    const colors = ['#f59e0b', '#fbbf24', '#3b82f6', '#60a5fa', '#10b981', '#ec4899', '#ffffff'];

    // Big central expanding ring
    this.particles.push({
      x: center.x,
      y: center.y,
      vx: 0,
      vy: 0,
      size: 15,
      color: '#fbbf24',
      alpha: 1,
      life: 0,
      maxLife: 45,
      rotation: 0,
      vRot: 0,
      shape: 'ring',
    });

    // Confetti bursts
    for (let i = 0; i < 65; i++) {
      const angle = (Math.PI * 2 * i) / 65 + (Math.random() - 0.5) * 0.4;
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
        shape: Math.random() > 0.5 ? 'star' : 'circle',
      });
    }
  }

  public startLoop() {
    if (this.animFrameId !== null) return;
    const loop = (now: number) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.updateParticles(dt);
      this.render();

      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.shape !== 'ring') {
        p.vy += 0.15; // gravity
      } else {
        p.size += 3.5; // expanding ring
      }
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife || p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw outer wood border & background card
    this.drawBoardBackground();

    // 2. Draw 64 squares & board highlights
    this.drawSquares();

    // 3. Draw coordinates (1-8 and a-h)
    this.drawCoordinates();

    // 4. Draw valid destination dots
    this.drawMoveIndicators();

    // 5. Draw static chess pieces
    this.drawPieces();

    // 6. Draw hint glow beacon
    this.drawHintHighlight();

    // 7. Draw dragging piece on top
    this.drawDraggingPiece();

    // 8. Draw celebratory particles
    this.drawParticles();
  }

  private drawBoardBackground() {
    const ctx = this.ctx;
    const x = this.boardX;
    const y = this.boardY;
    const size = this.boardSize;
    const radius = 14;

    // Contact shadow beneath entire board
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 8, size - 8, size, radius + 4);
    ctx.fill();
    ctx.restore();

    // Board wood frame
    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x + size, y + size);
    grad.addColorStop(0, '#53341b');
    grad.addColorStop(0.5, '#422813');
    grad.addColorStop(1, '#331e0d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.fill();

    // Subtle golden inner rim
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  private drawSquares() {
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

        // Base square color
        ctx.fillStyle = isDark ? this.darkSquareColor : this.lightSquareColor;
        ctx.fillRect(sx, sy, sq, sq);

        // Subtle bevel texture
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.15)';
        ctx.fillRect(sx, sy, sq, 1.5);

        // Highlight: last move
        if (this.state.lastMove) {
          const lm = this.state.lastMove;
          if (
            (lm.fromFile === file && lm.fromRank === rank) ||
            (lm.toFile === file && lm.toRank === rank)
          ) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
            ctx.fillRect(sx, sy, sq, sq);
          }
        }

        // Highlight: selected square
        if (
          this.state.selectedCoord &&
          this.state.selectedCoord.file === file &&
          this.state.selectedCoord.rank === rank
        ) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
          ctx.fillRect(sx, sy, sq, sq);

          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(sx + 1.25, sy + 1.25, sq - 2.5, sq - 2.5);
        }

        // Highlight: checkmate square
        if (
          this.state.checkmateCoords &&
          this.state.checkmateCoords.file === file &&
          this.state.checkmateCoords.rank === rank
        ) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.fillRect(sx, sy, sq, sq);
        }
      }
    }
  }

  private drawCoordinates() {
    const ctx = this.ctx;
    const startX = this.boardX + this.margin;
    const startY = this.boardY + this.margin;
    const sq = this.squareSize;
    const fontSize = Math.max(Math.floor(this.margin * 0.55), 10);

    ctx.save();
    ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Letters a-h along bottom
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let c = 0; c < 8; c++) {
      const cx = startX + (c + 0.5) * sq;
      const cy = startY + 8 * sq + this.margin * 0.48;
      ctx.fillText(letters[c], cx, cy);
    }

    // Numbers 1-8 along left
    for (let r = 0; r < 8; r++) {
      const rankNum = 8 - r;
      const cy = startY + (r + 0.5) * sq;
      const cx = startX - this.margin * 0.48;
      ctx.fillText(String(rankNum), cx, cy);
    }

    ctx.restore();
  }

  private drawMoveIndicators() {
    const ctx = this.ctx;
    const sq = this.squareSize;

    for (const dest of this.state.validDestinations) {
      const center = this.getSquareCenter(dest.file, dest.rank);
      const targetPiece = this.state.board[dest.rank][dest.file];

      ctx.save();
      if (targetPiece) {
        // Capture circle outline around target
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = Math.max(sq * 0.08, 3);
        ctx.beginPath();
        ctx.arc(center.x, center.y, sq * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Subtle tactile destination dot
        ctx.fillStyle = 'rgba(37, 99, 235, 0.65)';
        ctx.beginPath();
        ctx.arc(center.x, center.y, sq * 0.16, 0, Math.PI * 2);
        ctx.fill();

        // Inner soft highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(center.x - 1, center.y - 1, sq * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawPieces() {
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = this.state.board[rank][file];
        if (!piece) continue;

        // Skip drawing if piece is currently being dragged
        if (
          this.state.draggingPiece &&
          this.state.draggingPiece.originFile === file &&
          this.state.draggingPiece.originRank === rank
        ) {
          continue;
        }

        const center = this.getSquareCenter(file, rank);
        this.renderPiece(piece, center.x, center.y, this.squareSize, false);
      }
    }
  }

  private drawHintHighlight() {
    const ctx = this.ctx;
    if (this.state.hintPiece) {
      const hp = this.state.hintPiece;
      const center = this.getSquareCenter(hp.file, hp.rank);
      const time = performance.now() * 0.005;
      const radius = this.squareSize * (0.42 + 0.04 * Math.sin(time));

      ctx.save();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#facc15';
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
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(center.x, center.y, this.squareSize * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawDraggingPiece() {
    if (!this.state.draggingPiece) return;
    const { piece, currentX, currentY } = this.state.draggingPiece;
    this.renderPiece(piece, currentX, currentY, this.squareSize * 1.12, true);
  }

  /**
   * 2.5D Tactile Chess Piece rendering with contact shadow and directional lighting
   */
  private renderPiece(piece: Piece, cx: number, cy: number, size: number, isDragging: boolean) {
    const ctx = this.ctx;
    const isWhite = piece.color === 'w';

    ctx.save();

    // 1. Contact shadow (Section 7 of manual)
    const shadowY = cy + size * (isDragging ? 0.38 : 0.32);
    const shadowRadiusX = size * (isDragging ? 0.38 : 0.34);
    const shadowRadiusY = size * (isDragging ? 0.16 : 0.12);
    const shadowAlpha = isDragging ? 0.22 : 0.15;

    ctx.beginPath();
    ctx.ellipse(cx, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.fill();

    // 2. Elaborate, large vector Staunton chess piece with lighting
    ChessPieceVector.draw(ctx, piece.type, piece.color, cx, cy, size, isDragging);

    ctx.restore();
  }

  private drawParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'ring') {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'star') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + i * 72) * Math.PI) / 180) * p.size);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (p.size * 0.45), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (p.size * 0.45));
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
}
