import { PipeTile, Direction, Particle, Bubble } from './types';
import { getPipeOpenings } from './levels';

export class PipeRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private cssWidth: number = 0;
  private cssHeight: number = 0;

  // Grid layout geometry
  public rows: number = 4;
  public cols: number = 8;
  public tileSize: number = 70;
  public tileGap: number = 10;
  public gridOffsetX: number = 0;
  public gridOffsetY: number = 0;

  // Hover and selection
  public hoveredTile: { row: number; col: number } | null = null;

  // Dynamic animations
  private particles: Particle[] = [];
  private bubbles: Bubble[] = [];
  private animFrameId: number = 0;
  private lastTime: number = 0;
  public isCompleted: boolean = false;
  private victoryPulse: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Could not get Canvas 2D context');
    this.ctx = context;

    // Initialize decorative bubbles
    for (let i = 0; i < 40; i++) {
      this.bubbles.push({
        x: Math.random(),
        y: Math.random(),
        offset: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.4,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  public resize(containerWidth: number, containerHeight: number, rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssWidth = Math.max(260, Math.floor(containerWidth));
    this.cssHeight = Math.max(260, Math.floor(containerHeight));

    const pixelWidth = Math.floor(this.cssWidth * this.dpr);
    const pixelHeight = Math.floor(this.cssHeight * this.dpr);

    if (this.canvas.width !== pixelWidth) {
      this.canvas.width = pixelWidth;
    }
    if (this.canvas.height !== pixelHeight) {
      this.canvas.height = pixelHeight;
    }

    const cssWidthStr = `${this.cssWidth}px`;
    const cssHeightStr = `${this.cssHeight}px`;
    if (this.canvas.style.width !== cssWidthStr) {
      this.canvas.style.width = cssWidthStr;
    }
    if (this.canvas.style.height !== cssHeightStr) {
      this.canvas.style.height = cssHeightStr;
    }

    // Calculate tile dimensions to fit comfortably with padding
    const paddingX = Math.min(32, this.cssWidth * 0.06);
    const paddingY = Math.min(32, this.cssHeight * 0.06);

    const availableWidth = Math.max(120, this.cssWidth - paddingX * 2);
    const availableHeight = Math.max(120, this.cssHeight - paddingY * 2);

    const maxTileW = (availableWidth - (this.cols - 1) * 8) / this.cols;
    const maxTileH = (availableHeight - (this.rows - 1) * 8) / this.rows;

    this.tileSize = Math.max(24, Math.floor(Math.min(maxTileW, maxTileH, 84)));
    this.tileGap = Math.max(4, Math.floor(this.tileSize * 0.12));

    const totalGridW = this.cols * this.tileSize + (this.cols - 1) * this.tileGap;
    const totalGridH = this.rows * this.tileSize + (this.rows - 1) * this.tileGap;

    this.gridOffsetX = Math.floor((this.cssWidth - totalGridW) / 2);
    this.gridOffsetY = Math.floor((this.cssHeight - totalGridH) / 2);
  }

  private safeRoundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (w <= 0 || h <= 0) return;
    const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    if (typeof ctx.roundRect === 'function') {
      try {
        ctx.roundRect(x, y, w, h, radius);
        return;
      } catch {
        // Fallback below
      }
    }
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  public getTileAt(canvasX: number, canvasY: number): { row: number; col: number } | null {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.gridOffsetX + c * (this.tileSize + this.tileGap);
        const y = this.gridOffsetY + r * (this.tileSize + this.tileGap);

        if (
          canvasX >= x &&
          canvasX <= x + this.tileSize &&
          canvasY >= y &&
          canvasY <= y + this.tileSize
        ) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  public render(grid: PipeTile[][], timestamp: number) {
    const dt = this.lastTime ? Math.min((timestamp - this.lastTime) / 1000, 0.1) : 0.016;
    this.lastTime = timestamp;

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    // Update animations
    if (this.isCompleted) {
      this.victoryPulse += dt * 4;
    }

    // 1. Draw subtle grid container backing
    this.drawBoardBackground(ctx);

    // 2. Draw tiles and pipes
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = grid[r][c];
        if (!tile) continue;

        // Smooth rotation interpolation
        if (Math.abs(tile.targetRotation - tile.displayRotation) > 0.05) {
          tile.displayRotation += (tile.targetRotation - tile.displayRotation) * 0.22;
          if (Math.abs(tile.targetRotation - tile.displayRotation) <= 0.05) {
            tile.displayRotation = tile.targetRotation;
            tile.isRotating = false;
          }
        }

        const x = this.gridOffsetX + c * (this.tileSize + this.tileGap);
        const y = this.gridOffsetY + r * (this.tileSize + this.tileGap);
        const isHovered = this.hoveredTile?.row === r && this.hoveredTile?.col === c;

        this.drawTile(ctx, tile, x, y, isHovered, timestamp);
      }
    }

    // 3. Draw water splashes and end drain particles
    this.updateAndDrawParticles(ctx, dt, grid);

    ctx.restore();
  }

  private drawBoardBackground(ctx: CanvasRenderingContext2D) {
    const totalGridW = this.cols * this.tileSize + (this.cols - 1) * this.tileGap;
    const totalGridH = this.rows * this.tileSize + (this.rows - 1) * this.tileGap;
    const pad = 14;

    const bx = this.gridOffsetX - pad;
    const by = this.gridOffsetY - pad;
    const bw = totalGridW + pad * 2;
    const bh = totalGridH + pad * 2;
    const r = 24;

    // Board container shadow
    ctx.save();
    ctx.beginPath();
    this.safeRoundRect(ctx, bx, by, bw, bh, r);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fill();

    // Subtle inner border
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
    ctx.stroke();

    // Subtle background dot grid pattern
    const dotSpacing = 20;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
    for (let x = bx + 16; x < bx + bw - 10; x += dotSpacing) {
      for (let y = by + 16; y < by + bh - 10; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    tile: PipeTile,
    x: number,
    y: number,
    isHovered: boolean,
    timestamp: number
  ) {
    const size = this.tileSize;
    const radius = Math.min(14, size * 0.2);

    // 1. Soft 3D Tile Background (Base cushion)
    ctx.save();
    ctx.beginPath();
    this.safeRoundRect(ctx, x, y, size, size, radius);

    // Bevel tile shadow
    ctx.shadowColor = 'rgba(15, 23, 42, 0.09)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Light acrylic laboratory tile gradient
    const tileGrad = ctx.createLinearGradient(x, y, x, y + size);
    tileGrad.addColorStop(0, '#f8fafc');
    tileGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = tileGrad;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Tile inner bevel highlight
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();

    // 2. Active Hover State (Cyan glow & Rotate Badge as in the screenshot)
    if (isHovered && !tile.locked && tile.type !== 'empty') {
      ctx.beginPath();
      this.safeRoundRect(ctx, x - 1, y - 1, size + 2, size + 2, radius + 1);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Circular Rotate badge (⟳) in top-right corner like the image
      const badgeR = 11;
      const bx = x + size - badgeR - 4;
      const by = y + badgeR + 4;

      ctx.beginPath();
      ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = '#bae6fd';
      ctx.shadowColor = 'rgba(14, 165, 233, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();

      // Rotation arrow symbol
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(timestamp * 0.003);
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 5, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(3, 4);
      ctx.lineTo(6, 1);
      ctx.lineTo(6, 6);
      ctx.fillStyle = '#0369a1';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 3. Render Pipe Content inside Tile with rotation
    if (tile.type !== 'empty') {
      ctx.save();
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.translate(cx, cy);

      const rad = (tile.displayRotation * Math.PI) / 180;
      ctx.rotate(rad);

      this.drawPipeGeometry(ctx, tile.type, size, tile.hasWater, timestamp, tile);
      ctx.restore();

      // Overlay START / END labels & specific fixtures
      if (tile.type === 'start') {
        this.drawStartFixture(ctx, x, y, size, tile.hasWater, timestamp);
      } else if (tile.type === 'end') {
        this.drawEndFixture(ctx, x, y, size, tile.hasWater, timestamp);
      }
    }
  }

  private drawPipeGeometry(
    ctx: CanvasRenderingContext2D,
    type: string,
    size: number,
    hasWater: boolean,
    timestamp: number,
    tile: PipeTile
  ) {
    const pipeW = size * 0.36; // Pipe diameter
    const r = pipeW / 2;
    const half = size / 2 + 1; // Slight bleed so joints seamlessly connect

    // Outer Drop Shadow for 2.5D realism
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.2)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Define pipe path based on type
    ctx.beginPath();
    if (type === 'straight') {
      ctx.rect(-half, -r, half * 2, pipeW);
    } else if (type === 'elbow') {
      // 90° smooth rounded bend from bottom (0, half) to right (half, 0)
      ctx.arc(half, half, half + r, Math.PI, Math.PI * 1.5);
      ctx.arc(half, half, half - r, Math.PI * 1.5, Math.PI, true);
      ctx.closePath();
    } else if (type === 'tee') {
      // Horizontal straight + branch going to bottom
      ctx.rect(-half, -r, half * 2, pipeW);
      ctx.rect(-r, 0, pipeW, half);
    } else if (type === 'cross') {
      ctx.rect(-half, -r, half * 2, pipeW);
      ctx.rect(-r, -half, pipeW, half * 2);
    } else if (type === 'start') {
      // Origin tap pipe connecting to the right
      ctx.rect(-r * 0.6, -r, half + r * 0.6, pipeW);
    } else if (type === 'end') {
      // Drain pipe coming from left to center
      ctx.rect(-half, -r, half + r * 0.6, pipeW);
    }

    // A. Base Pipe Outer Color (Matte Gray PVC / Metal from screenshot)
    const baseGrad = ctx.createLinearGradient(0, -r, 0, r);
    baseGrad.addColorStop(0, '#94a3b8');
    baseGrad.addColorStop(0.25, '#cbd5e1'); // highlight on upper cylinder edge
    baseGrad.addColorStop(0.65, '#64748b'); // midtone
    baseGrad.addColorStop(1, '#334155'); // bottom rim shadow

    ctx.fillStyle = baseGrad;
    ctx.fill();
    ctx.restore();

    // B. Flange / Collar joint rings at pipe ends
    this.drawFlanges(ctx, type, half, r, pipeW);

    // C. Flowing Fluid Layer if Water is Active
    if (hasWater) {
      this.drawWaterFlow(ctx, type, size, half, r, timestamp, tile);
    }
  }

  private drawFlanges(
    ctx: CanvasRenderingContext2D,
    type: string,
    half: number,
    r: number,
    pipeW: number
  ) {
    const flangeThickness = 4;
    const flangeW = pipeW * 1.14;
    const flangeR = flangeW / 2;

    const drawRing = (cx: number, cy: number, isVertical: boolean) => {
      ctx.save();
      ctx.beginPath();
      if (isVertical) {
        ctx.roundRect(cx - flangeThickness / 2, cy - flangeR, flangeThickness, flangeW, 2);
      } else {
        ctx.roundRect(cx - flangeR, cy - flangeThickness / 2, flangeW, flangeThickness, 2);
      }
      const ringGrad = isVertical
        ? ctx.createLinearGradient(0, cy - flangeR, 0, cy + flangeR)
        : ctx.createLinearGradient(cx - flangeR, 0, cx + flangeR, 0);

      ringGrad.addColorStop(0, '#cbd5e1');
      ringGrad.addColorStop(0.3, '#f1f5f9');
      ringGrad.addColorStop(0.8, '#64748b');
      ringGrad.addColorStop(1, '#334155');

      ctx.fillStyle = ringGrad;
      ctx.fill();
      ctx.restore();
    };

    if (type === 'straight') {
      drawRing(-half + 2, 0, true);
      drawRing(half - 2, 0, true);
    } else if (type === 'elbow') {
      drawRing(half - 2, 0, true);
      drawRing(0, half - 2, false);
    } else if (type === 'tee') {
      drawRing(-half + 2, 0, true);
      drawRing(half - 2, 0, true);
      drawRing(0, half - 2, false);
    } else if (type === 'cross') {
      drawRing(-half + 2, 0, true);
      drawRing(half - 2, 0, true);
      drawRing(0, -half + 2, false);
      drawRing(0, half - 2, false);
    }
  }

  private drawWaterFlow(
    ctx: CanvasRenderingContext2D,
    type: string,
    size: number,
    half: number,
    r: number,
    timestamp: number,
    tile: PipeTile
  ) {
    const innerW = r * 1.62;
    const innerR = innerW / 2;

    ctx.save();
    // Ambient cyan glow
    ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
    ctx.shadowBlur = this.isCompleted ? 14 : 7;

    // Clip to water core path
    ctx.beginPath();
    if (type === 'straight') {
      ctx.rect(-half, -innerR, half * 2, innerW);
    } else if (type === 'elbow') {
      ctx.arc(half, half, half + innerR, Math.PI, Math.PI * 1.5);
      ctx.arc(half, half, half - innerR, Math.PI * 1.5, Math.PI, true);
      ctx.closePath();
    } else if (type === 'tee') {
      ctx.rect(-half, -innerR, half * 2, innerW);
      ctx.rect(-innerR, 0, innerW, half);
    } else if (type === 'cross') {
      ctx.rect(-half, -innerR, half * 2, innerW);
      ctx.rect(-innerR, -half, innerW, half * 2);
    } else if (type === 'start') {
      ctx.rect(-innerR * 0.4, -innerR, half + innerR * 0.4, innerW);
    } else if (type === 'end') {
      ctx.rect(-half, -innerR, half + innerR * 0.4, innerW);
    }

    // 1. Vibrant 2.5D Cylindrical Liquid Gradient (as in Water Sort Lab manual)
    const waterGrad = ctx.createLinearGradient(0, -innerR, 0, innerR);
    waterGrad.addColorStop(0, '#38bdf8'); // Top reflection
    waterGrad.addColorStop(0.22, '#e0f2fe'); // White-cyan specular glint
    waterGrad.addColorStop(0.55, '#0284c7'); // Deep electric water body
    waterGrad.addColorStop(1, '#0369a1'); // Cylindrical bottom shading

    ctx.fillStyle = waterGrad;
    ctx.fill();

    // 2. Animated Flowing Wave Displacement & Ripples
    const wavePhase = timestamp * 0.007;
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();

    if (type === 'straight' || type === 'tee' || type === 'cross' || type === 'start' || type === 'end') {
      const waveY = -innerR * 0.35 + Math.sin(wavePhase + tile.col) * 1.2;
      ctx.moveTo(-half, waveY);
      ctx.quadraticCurveTo(0, waveY + Math.cos(wavePhase) * 1.5, half, waveY);
      ctx.stroke();
    } else if (type === 'elbow') {
      const arcR = half;
      ctx.beginPath();
      ctx.arc(half, half, arcR, Math.PI, Math.PI * 1.5);
      ctx.stroke();
    }

    // 3. Flowing bubbles within the pipe stream
    for (let b = 0; b < 3; b++) {
      const bubbleTime = (timestamp * 0.001 * 1.2 + b * 0.33 + tile.row * 0.2 + tile.col * 0.4) % 1;
      const bx = -half + bubbleTime * half * 2;
      const by = (Math.sin(bubbleTime * Math.PI * 4 + b) * innerR * 0.4);

      if (bx > -half + 4 && bx < half - 4) {
        ctx.beginPath();
        ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
      }
    }

    // 4. Longitudinal Glass Specular Line (Manual section 6.4)
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(-half + 2, -innerR * 0.55);
    ctx.lineTo(half - 2, -innerR * 0.55);
    ctx.stroke();

    ctx.restore();
  }

  private drawStartFixture(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    hasWater: boolean,
    timestamp: number
  ) {
    const cx = x + size * 0.32;
    const cy = y + size * 0.5;

    ctx.save();
    // A. 3D Faucet Tap Valve
    ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Valve stem
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(cx - 5, cy - 16, 10, 16);

    // Spigot valve wheel
    ctx.beginPath();
    ctx.roundRect(cx - 14, cy - 20, 28, 8, 3);
    const wheelGrad = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0);
    wheelGrad.addColorStop(0, '#1d4ed8');
    wheelGrad.addColorStop(0.4, '#60a5fa');
    wheelGrad.addColorStop(0.8, '#1e40af');
    ctx.fillStyle = wheelGrad;
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Valve body
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();

    ctx.restore();

    // B. START Label under tile
    ctx.save();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#2563eb';
    ctx.textAlign = 'center';
    ctx.fillText('START', x + size / 2, y + size - 4);
    ctx.restore();
  }

  private drawEndFixture(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    hasWater: boolean,
    timestamp: number
  ) {
    const cx = x + size * 0.65;
    const cy = y + size * 0.5;

    ctx.save();
    // A. Industrial Teal Drain / Valve Nozzle
    ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Flange collar
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(cx - 5, cy - 12, 10, 24);

    // Downward curved nozzle
    ctx.beginPath();
    ctx.arc(cx + 4, cy + 4, 10, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Water droplet hanging or spraying
    if (hasWater) {
      // Dynamic gushing water stream spraying out
      ctx.beginPath();
      ctx.moveTo(cx + 4, cy + 12);
      ctx.quadraticCurveTo(cx + 8, cy + 24, cx + 4, cy + size * 0.45);
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Droplets
      const dropY = cy + 14 + ((timestamp * 0.04) % 16);
      ctx.beginPath();
      ctx.arc(cx + 4, dropY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();

      // Spawn splash particles if completed!
      if (this.isCompleted && Math.random() < 0.4) {
        this.spawnSplashParticle(cx + 4, cy + size * 0.45);
      }
    } else {
      // Single quiet pending droplet
      ctx.beginPath();
      ctx.arc(cx + 4, cy + 14, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0d9488';
      ctx.fill();
    }

    ctx.restore();

    // B. END Label under tile
    ctx.save();
    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0d9488';
    ctx.textAlign = 'center';
    ctx.fillText('END', x + size / 2, y + size - 4);
    ctx.restore();
  }

  public spawnSplashParticle(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.PI * 0.1 + Math.random() * Math.PI * 0.8;
      const speed = 40 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
      });
    }
  }

  private updateAndDrawParticles(
    ctx: CanvasRenderingContext2D,
    dt: number,
    grid: PipeTile[][]
  ) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt; // Gravity
      p.alpha = 1 - p.life / p.maxLife;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.restore();
    }
  }
}
