import { DisplayManager } from './display';
import { GameState } from './game-state';
import { Particle, Point } from './types';

export class GameRenderer {
  private display: DisplayManager;
  private state: GameState;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private pulseTime: number = 0;

  constructor(display: DisplayManager, state: GameState) {
    this.display = display;
    this.state = state;
  }

  public start() {
    if (this.animId !== null) return;
    const loop = () => {
      this.updateAndRender();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public spawnSparkles(x: number, y: number, color: string, count: number = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: 3 + Math.random() * 5,
        color,
        alpha: 1.0,
        life: 0,
        maxLife: 30 + Math.random() * 25,
        shape: Math.random() > 0.4 ? 'star' : 'circle'
      });
    }
  }

  public spawnWinCelebration() {
    const { cssWidth, cssHeight } = this.display.currentMetrics;
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#c026d3', '#fbbf24'];

    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: cssWidth * (0.2 + Math.random() * 0.6),
        y: cssHeight * (0.2 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 8,
        vy: -2 - Math.random() * 7,
        size: 4 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        shape: Math.random() > 0.5 ? 'square' : 'star'
      });
    }
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.vx *= 0.98;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateAndRender() {
    this.pulseTime += 0.04;
    this.updateParticles();

    const ctx = this.display.getContext();
    const { cssWidth, cssHeight, boardX, boardY, boardSize, cellSize } = this.display.currentMetrics;

    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // 1. Draw Board Container Background
    this.drawBoardBackground(ctx, boardX, boardY, boardSize, cellSize);

    // 2. Draw Pipes
    this.drawPipes(ctx, boardX, boardY, cellSize);

    // 3. Draw Numbered Endpoints
    this.drawEndpoints(ctx, boardX, boardY, cellSize);

    // 4. Draw Particles
    this.drawParticles(ctx);
  }

  private drawBoardBackground(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    size: number,
    cellSize: number
  ) {
    const gridSize = this.state.level.size;
    const cornerRadius = 18;

    // Outer Board Contact Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#f8fafc'; // Clean slate-50 background
    this.roundRect(ctx, bx, by, size, size, cornerRadius);
    ctx.fill();
    ctx.restore();

    // Board Border
    ctx.save();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    this.roundRect(ctx, bx, by, size, size, cornerRadius);
    ctx.stroke();
    ctx.restore();

    // Grid Cells
    const inset = Math.max(2, Math.floor(cellSize * 0.06));
    const cellRadius = Math.max(6, Math.floor(cellSize * 0.18));

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cx = bx + c * cellSize + inset;
        const cy = by + r * cellSize + inset;
        const cw = cellSize - inset * 2;
        const ch = cellSize - inset * 2;

        // Cell slot background with gentle 2.5D inset groove
        const cellGrad = ctx.createLinearGradient(cx, cy, cx, cy + ch);
        cellGrad.addColorStop(0, '#f1f5f9');
        cellGrad.addColorStop(1, '#e2e8f0');

        ctx.fillStyle = cellGrad;
        this.roundRect(ctx, cx, cy, cw, ch, cellRadius);
        ctx.fill();

        // Subtle cell border
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        this.roundRect(ctx, cx, cy, cw, ch, cellRadius);
        ctx.stroke();

        // Inner top-edge light reflection
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + cellRadius, cy + 1);
        ctx.lineTo(cx + cw - cellRadius, cy + 1);
        ctx.stroke();
      }
    }
  }

  private drawPipes(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    cellSize: number
  ) {
    const pipeWidth = Math.max(10, Math.floor(cellSize * 0.36));

    for (const pair of this.state.level.pairs) {
      const path = this.state.paths.get(pair.id);
      if (!path || path.length < 1) continue;

      const isConnected = this.state.isPairConnected(pair.id);
      const isDrawingThis = this.state.activePairId === pair.id;

      // 1. Draw pipe path contact shadow
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = pipeWidth + 4;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';

      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const pt = path[i];
        const px = bx + pt.c * cellSize + cellSize / 2;
        const py = by + pt.r * cellSize + cellSize / 2 + 2; // offset down
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Draw Main 2.5D Pipe Body
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = pipeWidth;
      ctx.strokeStyle = pair.color;

      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const pt = path[i];
        const px = bx + pt.c * cellSize + cellSize / 2;
        const py = by + pt.r * cellSize + cellSize / 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Draw Inner Light Highlight on top of the pipe (Specular tube highlight)
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(3, Math.floor(pipeWidth * 0.32));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';

      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const pt = path[i];
        const px = bx + pt.c * cellSize + cellSize / 2;
        const py = by + pt.r * cellSize + cellSize / 2 - pipeWidth * 0.15; // slightly higher
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Draw node discs at each intermediate step in the path (matching screenshot style)
      const jointRadius = Math.floor(pipeWidth * 0.38);
      for (let i = 1; i < path.length - 1; i++) {
        const pt = path[i];
        const jx = bx + pt.c * cellSize + cellSize / 2;
        const jy = by + pt.r * cellSize + cellSize / 2;

        ctx.save();
        ctx.fillStyle = pair.lightColor;
        ctx.beginPath();
        ctx.arc(jx, jy, jointRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(jx - 1, jy - 1, jointRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // If actively drawing, draw pulsing head marker
      if (isDrawingThis && path.length > 0) {
        const head = path[path.length - 1];
        const hx = bx + head.c * cellSize + cellSize / 2;
        const hy = by + head.r * cellSize + cellSize / 2;
        const pulseR = pipeWidth * 0.65 + Math.sin(this.pulseTime * 5) * 2;

        ctx.save();
        ctx.strokeStyle = pair.lightColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hx, hy, pulseR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  private drawEndpoints(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    cellSize: number
  ) {
    const nodeRadius = Math.max(14, Math.floor(cellSize * 0.34));

    for (const pair of this.state.level.pairs) {
      const isConnected = this.state.isPairConnected(pair.id);

      this.renderSingleNode(ctx, pair.start, pair, bx, by, cellSize, nodeRadius, isConnected);
      this.renderSingleNode(ctx, pair.end, pair, bx, by, cellSize, nodeRadius, isConnected);
    }
  }

  private renderSingleNode(
    ctx: CanvasRenderingContext2D,
    pt: Point,
    pair: any,
    bx: number,
    by: number,
    cellSize: number,
    r: number,
    isConnected: boolean
  ) {
    const cx = bx + pt.c * cellSize + cellSize / 2;
    const cy = by + pt.r * cellSize + cellSize / 2;

    // 1. Contact Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.35, r * 0.95, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Connected Glowing Aura (if completed)
    if (isConnected) {
      const glowR = r + 3 + Math.sin(this.pulseTime * 4) * 1.5;
      ctx.save();
      ctx.strokeStyle = pair.lightColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. 2.5D Embossed Gradient Body
    const nodeGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    nodeGrad.addColorStop(0, pair.lightColor);
    nodeGrad.addColorStop(0.35, pair.color);
    nodeGrad.addColorStop(1, pair.darkColor);

    ctx.save();
    ctx.fillStyle = nodeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 4. Inner Ring Accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 5. Specular Gloss Highlight Bubble
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.3, cy - r * 0.35, r * 0.4, r * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Number Text in Crisp Bold Typography
    ctx.save();
    const fontSize = Math.max(12, Math.floor(r * 1.05));
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text Shadow for contrast
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(pair.number), cx, cy + 0.5);
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        this.drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.4);
      } else if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
