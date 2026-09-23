import { Block, LevelData, Particle, SolverMove } from './types';

export interface BoardLayout {
  boardX: number;
  boardY: number;
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
  cols: number;
  rows: number;
  exitRow: number;
  exitCol: number;
}

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animTime: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // Calculate proportional board placement inside available CSS area
  public computeBoardLayout(width: number, height: number, level: LevelData): BoardLayout {
    const cols = level.cols;
    const rows = level.rows;

    const paddingX = Math.max(16, width * 0.04);
    const paddingY = Math.max(16, height * 0.04);

    // Leave space for the exit gate protrusion on the right
    const exitExtraWidth = 32;
    const availW = width - paddingX * 2 - exitExtraWidth;
    const availH = height - paddingY * 2;

    const maxCellByW = availW / cols;
    const maxCellByH = availH / rows;
    const cellSize = Math.floor(Math.min(maxCellByW, maxCellByH, 72));

    const boardWidth = cellSize * cols;
    const boardHeight = cellSize * rows;

    const boardX = Math.floor((width - boardWidth - exitExtraWidth) / 2) + Math.floor(exitExtraWidth / 4);
    const boardY = Math.floor((height - boardHeight) / 2);

    return {
      boardX,
      boardY,
      boardWidth,
      boardHeight,
      cellSize,
      cols,
      rows,
      exitRow: level.exitRow,
      exitCol: level.exitCol,
    };
  }

  // Main render loop
  public render(
    width: number,
    height: number,
    level: LevelData,
    blocks: Block[],
    activeDrag: { blockId: string; currentX: number; currentY: number } | null,
    activeHint: SolverMove | null,
    isWon: boolean,
    exitProgress: number // 0 to 1 when key is escaping
  ) {
    this.animTime += 0.02;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const layout = this.computeBoardLayout(width, height, level);

    // 1. Draw subtle background ambient pattern/vignette
    this.drawBackground(width, height);

    // 2. Draw 2.5D Wooden Board Tray & Grid
    this.drawBoardTray(layout, level);

    // 3. Draw Exit Archway & Label
    this.drawExitGate(layout, level, isWon, exitProgress);

    // 4. Draw Static (non-dragged) Blocks
    const draggedId = activeDrag?.blockId;
    for (const b of blocks) {
      if (b.id !== draggedId) {
        let posX = b.x;
        let posY = b.y;

        // If key is winning and escaping, animate sliding beyond the exit
        if (b.isKey && isWon && exitProgress > 0) {
          posX = b.x + exitProgress * (layout.cols - b.x + 1.2);
        }

        this.drawBlock(layout, b, posX, posY, false, b.id === activeHint?.blockId);
      }
    }

    // 5. Draw Active Dragged Block (elevated with enhanced shadow)
    if (activeDrag) {
      const b = blocks.find(item => item.id === activeDrag.blockId);
      if (b) {
        this.drawBlock(
          layout,
          b,
          activeDrag.currentX,
          activeDrag.currentY,
          true,
          b.id === activeHint?.blockId
        );
      }
    }

    // 6. Draw Hint Overlay Arrow if active
    if (activeHint && !isWon) {
      this.drawHintArrow(layout, activeHint, blocks);
    }

    // 7. Update & Draw Particles (Confetti, Key Sparkles)
    this.renderParticles(ctx);
  }

  private drawBackground(width: number, height: number) {
    const ctx = this.ctx;
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      30,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.7
    );
    bgGrad.addColorStop(0, '#f0f7fc');
    bgGrad.addColorStop(0.5, '#e4eff7');
    bgGrad.addColorStop(1, '#d0e2ee');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle geometrical polygon lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.25);
    ctx.lineTo(width * 0.4, 0);
    ctx.moveTo(width * 0.6, 0);
    ctx.lineTo(width, height * 0.4);
    ctx.moveTo(0, height * 0.75);
    ctx.lineTo(width * 0.35, height);
    ctx.moveTo(width * 0.7, height);
    ctx.lineTo(width, height * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  // Draw 2.5D Wooden Frame, Tray and Grid Mat
  private drawBoardTray(layout: BoardLayout, level: LevelData) {
    const ctx = this.ctx;
    const { boardX, boardY, boardWidth, boardHeight, cellSize, cols, rows } = layout;

    const rim = Math.max(14, Math.floor(cellSize * 0.28));
    const outerX = boardX - rim;
    const outerY = boardY - rim;
    const outerW = boardWidth + rim * 2;
    const outerH = boardHeight + rim * 2;
    const outerRadius = 22;

    // 1. Drop shadow beneath the entire wooden tray
    ctx.save();
    ctx.shadowColor = 'rgba(28, 16, 7, 0.24)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    this.roundRect(ctx, outerX, outerY, outerW, outerH, outerRadius);
    ctx.fillStyle = '#6d4224';
    ctx.fill();
    ctx.restore();

    // 2. Outer wooden rim with directional gradient (Light from top-left)
    ctx.save();
    const woodRimGrad = ctx.createLinearGradient(outerX, outerY, outerX + outerW, outerY + outerH);
    woodRimGrad.addColorStop(0, '#be8251'); // Highlight light oak
    woodRimGrad.addColorStop(0.3, '#9c633a');
    woodRimGrad.addColorStop(0.7, '#7a4624');
    woodRimGrad.addColorStop(1, '#532d15'); // Dark shadow corner

    this.roundRect(ctx, outerX, outerY, outerW, outerH, outerRadius);
    ctx.fillStyle = woodRimGrad;
    ctx.fill();

    // Top rim highlight bevel
    ctx.strokeStyle = 'rgba(255, 235, 205, 0.45)';
    ctx.lineWidth = 2.5;
    this.roundRect(ctx, outerX + 1.5, outerY + 1.5, outerW - 3, outerH - 3, outerRadius - 1);
    ctx.stroke();

    // Inner carved groove shadow around inner tray
    ctx.strokeStyle = '#381c0c';
    ctx.lineWidth = 2;
    this.roundRect(ctx, boardX - 2, boardY - 2, boardWidth + 4, boardHeight + 4, 8);
    ctx.stroke();
    ctx.restore();

    // 3. Carve the exit slot in the right rim
    const exitCellY = boardY + level.exitRow * cellSize;
    const exitOpeningH = cellSize * 0.94;
    const exitOpeningY = exitCellY + (cellSize - exitOpeningH) / 2;

    ctx.save();
    // Inner floor color fills the exit gap in the right rim
    ctx.fillStyle = '#edd8be';
    ctx.fillRect(boardX + boardWidth - 2, exitOpeningY, rim + 4, exitOpeningH);

    // Groove lines inside exit
    ctx.strokeStyle = '#baa185';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boardX + boardWidth, exitOpeningY);
    ctx.lineTo(boardX + boardWidth + rim, exitOpeningY);
    ctx.moveTo(boardX + boardWidth, exitOpeningY + exitOpeningH);
    ctx.lineTo(boardX + boardWidth + rim, exitOpeningY + exitOpeningH);
    ctx.stroke();
    ctx.restore();

    // 4. Board Grid Floor Mat
    ctx.save();
    this.roundRect(ctx, boardX, boardY, boardWidth, boardHeight, 6);
    ctx.clip();

    // Inner board mat gradient
    const matGrad = ctx.createLinearGradient(boardX, boardY, boardX, boardY + boardHeight);
    matGrad.addColorStop(0, '#f9f5ed');
    matGrad.addColorStop(1, '#eee4d4');
    ctx.fillStyle = matGrad;
    ctx.fillRect(boardX, boardY, boardWidth, boardHeight);

    // Subtle checkered / grid tile lines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = boardX + c * cellSize;
        const cy = boardY + r * cellSize;

        // Alternate subtle shade
        if ((r + c) % 2 === 1) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
          ctx.fillRect(cx, cy, cellSize, cellSize);
        }

        // Inner tile border
        ctx.strokeStyle = 'rgba(175, 150, 125, 0.28)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + 0.5, cy + 0.5, cellSize - 1, cellSize - 1);
      }
    }

    // Inner wall ambient occlusion shadows
    const aoGradTop = ctx.createLinearGradient(boardX, boardY, boardX, boardY + 12);
    aoGradTop.addColorStop(0, 'rgba(40, 20, 10, 0.22)');
    aoGradTop.addColorStop(1, 'rgba(40, 20, 10, 0)');
    ctx.fillStyle = aoGradTop;
    ctx.fillRect(boardX, boardY, boardWidth, 12);

    const aoGradLeft = ctx.createLinearGradient(boardX, boardY, boardX + 12, boardY);
    aoGradLeft.addColorStop(0, 'rgba(40, 20, 10, 0.22)');
    aoGradLeft.addColorStop(1, 'rgba(40, 20, 10, 0)');
    ctx.fillStyle = aoGradLeft;
    ctx.fillRect(boardX, boardY, 12, boardHeight);

    ctx.restore();
  }

  // Draw 2.5D Exit Gate & Horseshoe Arrow
  private drawExitGate(layout: BoardLayout, level: LevelData, isWon: boolean, exitProgress: number) {
    const ctx = this.ctx;
    const { boardX, boardY, boardWidth, cellSize } = layout;

    const exitX = boardX + boardWidth + 8;
    const exitY = boardY + level.exitRow * cellSize + cellSize / 2;

    ctx.save();
    // Glowing pulse on exit when key is nearing or winning
    const pulse = Math.sin(this.animTime * 4) * 0.25 + 0.75;

    // Golden Horseshoe / Archway
    const archSize = cellSize * 0.42;
    ctx.save();
    ctx.translate(exitX + 10, exitY);

    if (isWon) {
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.shadowBlur = 15;
    }

    // Archway 3D Shadow
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(100, 60, 20, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 3, archSize, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Archway Golden Body
    const goldGrad = ctx.createLinearGradient(-archSize, -archSize, archSize, archSize);
    goldGrad.addColorStop(0, '#fff4b8');
    goldGrad.addColorStop(0.4, '#f59e0b');
    goldGrad.addColorStop(0.8, '#d97706');
    goldGrad.addColorStop(1, '#92400e');

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, archSize, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Arrow tip pointing right
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(archSize + 4, 0);
    ctx.lineTo(archSize - 4, -7);
    ctx.lineTo(archSize - 4, 7);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Text "EXIT" under gate
    ctx.font = `800 ${Math.max(10, Math.floor(cellSize * 0.2))}px Outfit, sans-serif`;
    ctx.fillStyle = isWon ? '#d97706' : '#926a45';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('EXIT', exitX + 10, exitY + archSize + 6);

    ctx.restore();
  }

  // Draw 2.5D Realistic Wooden Block (or Red Key Block)
  private drawBlock(
    layout: BoardLayout,
    block: Block,
    gridX: number,
    gridY: number,
    isElevated: boolean,
    isHinted: boolean
  ) {
    const ctx = this.ctx;
    const { boardX, boardY, cellSize } = layout;

    const gap = Math.max(3, Math.floor(cellSize * 0.06));
    const radius = Math.max(5, Math.floor(cellSize * 0.12));

    const px = boardX + gridX * cellSize + gap;
    const py = boardY + gridY * cellSize + gap;
    const pw = block.width * cellSize - gap * 2;
    const ph = block.height * cellSize - gap * 2;

    const isKey = !!block.isKey;
    const depth3D = Math.max(4, Math.floor(cellSize * 0.09));

    ctx.save();

    // 1. Soft Contact Shadow (grows when elevated during dragging)
    const shadowOffset = isElevated ? depth3D + 5 : depth3D;
    const shadowBlur = isElevated ? 14 : 6;
    const shadowAlpha = isElevated ? 0.35 : 0.22;

    ctx.fillStyle = `rgba(30, 15, 5, ${shadowAlpha})`;
    this.roundRect(ctx, px, py + shadowOffset, pw, ph, radius);
    ctx.filter = `blur(${shadowBlur}px)`;
    ctx.fill();
    ctx.filter = 'none';

    // 2. Bottom 3D Bevel / Extrusion Edge (Dark side)
    const baseColorDark = isKey ? '#690a0a' : '#4a2610';
    ctx.fillStyle = baseColorDark;
    this.roundRect(ctx, px, py + depth3D, pw, ph, radius);
    ctx.fill();

    // 3. Top Face of Block
    ctx.save();
    this.roundRect(ctx, px, py, pw, ph, radius);
    ctx.clip();

    if (isKey) {
      // --- RED KEY BLOCK (LUSTROUS CRIMSON LACQUER + GOLD KEY) ---
      const redGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
      redGrad.addColorStop(0, '#f84343'); // Specular highlight
      redGrad.addColorStop(0.35, '#e02424');
      redGrad.addColorStop(0.8, '#b91c1c');
      redGrad.addColorStop(1, '#8b0e0e'); // Dark bevel

      ctx.fillStyle = redGrad;
      ctx.fillRect(px, py, pw, ph);

      // Wood grain / lacquer sheen lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px + 4, py + ph * 0.3);
      ctx.lineTo(px + pw - 4, py + ph * 0.3);
      ctx.moveTo(px + 10, py + ph * 0.7);
      ctx.lineTo(px + pw - 10, py + ph * 0.7);
      ctx.stroke();

      // Draw Embossed Golden Key Icon
      this.drawGoldenKeyEmboss(px, py, pw, ph);
    } else {
      // --- STANDARD HARDWOOD BLOCK (WARM OAK / TEAK) ---
      const isHorizontal = block.width > block.height;
      const woodGrad = isHorizontal
        ? ctx.createLinearGradient(px, py, px, py + ph)
        : ctx.createLinearGradient(px, py, px + pw, py);

      woodGrad.addColorStop(0, '#be8353'); // Top highlight
      woodGrad.addColorStop(0.3, '#9d633b');
      woodGrad.addColorStop(0.85, '#7b4623');
      woodGrad.addColorStop(1, '#5e3215'); // Bottom shadow

      ctx.fillStyle = woodGrad;
      ctx.fillRect(px, py, pw, ph);

      // Fine Wood Grain Texture
      ctx.strokeStyle = 'rgba(60, 25, 5, 0.18)';
      ctx.lineWidth = 1;
      const lines = isHorizontal ? Math.floor(ph / 7) : Math.floor(pw / 7);
      for (let i = 1; i < lines; i++) {
        const offset = isHorizontal ? py + i * 7 : px + i * 7;
        ctx.beginPath();
        if (isHorizontal) {
          ctx.moveTo(px + 6, offset);
          ctx.bezierCurveTo(px + pw * 0.3, offset - 2, px + pw * 0.7, offset + 2, px + pw - 6, offset);
        } else {
          ctx.moveTo(offset, py + 6);
          ctx.bezierCurveTo(offset - 2, py + ph * 0.3, offset + 2, py + ph * 0.7, offset, py + ph - 6);
        }
        ctx.stroke();
      }

      // Subtle center grip groove for tactile aesthetics
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 3, py + 3, pw - 6, ph - 6);
    }

    ctx.restore();

    // 4. Highlight Bevel Rim on the Face
    ctx.strokeStyle = isKey ? 'rgba(255, 200, 200, 0.5)' : 'rgba(255, 235, 205, 0.4)';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, px + 0.75, py + 0.75, pw - 1.5, ph - 1.5, radius);
    ctx.stroke();

    // 5. Hint Glow if this block is suggested
    if (isHinted) {
      const hintPulse = Math.sin(this.animTime * 6) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(250, 204, 21, ${hintPulse})`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      this.roundRect(ctx, px - 2, py - 2, pw + 4, ph + 4, radius + 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw 2.5D Golden Embossed Key Glyph on the Red Block
  private drawGoldenKeyEmboss(px: number, py: number, pw: number, ph: number) {
    const ctx = this.ctx;
    const cx = px + pw * 0.46;
    const cy = py + ph * 0.5;

    const scale = Math.min(pw * 0.75, ph * 1.5) / 60;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Golden Key Drop Shadow (Engraved look)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;

    const goldGrad = ctx.createLinearGradient(-24, -10, 24, 10);
    goldGrad.addColorStop(0, '#fffbe6');
    goldGrad.addColorStop(0.3, '#fcd34d');
    goldGrad.addColorStop(0.7, '#f59e0b');
    goldGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;

    // --- KEY HEAD (Round Ring) ---
    ctx.beginPath();
    ctx.arc(-16, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Key Ring Hole
    ctx.fillStyle = '#a81c1c';
    ctx.beginPath();
    ctx.arc(-16, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // --- KEY SHAFT ---
    ctx.fillStyle = goldGrad;
    ctx.fillRect(-8, -2.8, 28, 5.6);
    ctx.strokeRect(-8, -2.8, 28, 5.6);

    // --- KEY BITS / TEETH ---
    // Tooth 1
    ctx.fillRect(8, 2.8, 4.2, 5.8);
    ctx.strokeRect(8, 2.8, 4.2, 5.8);

    // Tooth 2
    ctx.fillRect(15, 2.8, 3.8, 7.5);
    ctx.strokeRect(15, 2.8, 3.8, 7.5);

    // Sparkle reflection on key bow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(-18, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw animated hint arrow showing destination
  private drawHintArrow(layout: BoardLayout, hint: SolverMove, blocks: Block[]) {
    const ctx = this.ctx;
    const { boardX, boardY, cellSize } = layout;

    const block = blocks.find(b => b.id === hint.blockId);
    if (!block) return;

    const startX = boardX + (block.x + block.width / 2) * cellSize;
    const startY = boardY + (block.y + block.height / 2) * cellSize;

    const targetX = boardX + (hint.targetX + block.width / 2) * cellSize;
    const targetY = boardY + (hint.targetY + block.height / 2) * cellSize;

    const bounce = Math.sin(this.animTime * 8) * 6;
    const angle = Math.atan2(targetY - startY, targetX - startX);

    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
    ctx.shadowBlur = 8;

    // Arrow Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(targetX + Math.cos(angle) * bounce, targetY + Math.sin(angle) * bounce);
    ctx.stroke();

    // Arrow Head
    const headLen = 14;
    const tipX = targetX + Math.cos(angle) * (bounce + 4);
    const tipY = targetY + Math.sin(angle) * (bounce + 4);

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - headLen * Math.cos(angle - Math.PI / 6),
      tipY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      tipX - headLen * Math.cos(angle + Math.PI / 6),
      tipY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Confetti and Sparkle Particle System
  public spawnVictoryParticles(width: number, height: number) {
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24'];
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 * i) / 70 + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: width * 0.65,
        y: height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.4 ? 'square' : 'sparkle',
      });
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else {
        // Sparkle 4-point star
        ctx.beginPath();
        for (let s = 0; s < 4; s++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(0, -p.size * 1.2);
          ctx.lineTo(p.size * 0.3, 0);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Rounded rectangle utility
  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
}
