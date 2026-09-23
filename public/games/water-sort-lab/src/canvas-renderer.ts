import { GameState } from './game-state';
import { LIQUID_COLORS } from './colors';
import { ColorId, TubeLayout } from './types';
import { sound } from './audio';

interface Bubble {
  x: number; // 0 to 1 relative to tube width
  y: number; // 0 to 1 relative to liquid height
  size: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  alpha: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private layouts: TubeLayout[] = [];
  private bubbles: Map<number, Bubble[]> = new Map();
  private splashParticles: SplashParticle[] = [];
  private confettiParticles: Confetti[] = [];
  private animFrameId: number | null = null;
  private lastTime: number = performance.now();
  private dpr: number = 1;

  // Visual offsets for animation
  private tubeVisualOffsets: Map<number, { x: number; y: number; rotation: number }> = new Map();

  constructor(canvas: HTMLCanvasElement, state: GameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.state = state;
    this.initBubbles();
    this.startLoop();
  }

  private initBubbles() {
    for (let i = 0; i < 12; i++) {
      const tubeBubbles: Bubble[] = [];
      const count = 5 + Math.floor(Math.random() * 4);
      for (let b = 0; b < count; b++) {
        tubeBubbles.push({
          x: 0.2 + Math.random() * 0.6,
          y: Math.random(),
          size: 1.5 + Math.random() * 2.5,
          speed: 0.0003 + Math.random() * 0.0006,
          wobbleSpeed: 0.002 + Math.random() * 0.003,
          wobbleAmp: 0.03 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.3 + Math.random() * 0.4,
        });
      }
      this.bubbles.set(i, tubeBubbles);
    }
  }

  public triggerConfetti() {
    this.confettiParticles = [];
    const colors = ['#0284c7', '#ec4899', '#eab308', '#16a34a', '#ea580c', '#7c3aed', '#38bdf8'];
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;

    for (let i = 0; i < 90; i++) {
      this.confettiParticles.push({
        x: w * 0.5 + (Math.random() - 0.5) * 80,
        y: h * 0.45 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 14,
        vy: -7 - Math.random() * 9,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        width: 8 + Math.random() * 6,
        height: 5 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Cap at 2.5 for mobile GPU battery/perf

    const displayWidth = Math.floor(rect.width);
    // Dynamic height based on screen size and orientation
    const isMobile = displayWidth < 600;
    const displayHeight = isMobile ? Math.min(520, Math.max(380, window.innerHeight * 0.54)) : 460;

    this.canvas.width = Math.floor(displayWidth * this.dpr);
    this.canvas.height = Math.floor(displayHeight * this.dpr);

    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);

    this.calculateLayouts(displayWidth, displayHeight);
  }

  private calculateLayouts(canvasW: number, canvasH: number) {
    this.layouts = [];
    const numTubes = this.state.tubes.length;
    if (numTubes === 0) return;

    // Determine row layout: 1 row if screen is wide enough, or 2 rows for narrow mobile screens
    const isTwoRows = canvasW < 560 && numTubes > 4;

    if (!isTwoRows) {
      // Single row layout
      const maxTubeWidth = Math.min(72, (canvasW - 40) / numTubes - 14);
      const tubeWidth = Math.max(38, Math.min(62, maxTubeWidth));
      const tubeHeight = Math.min(canvasH * 0.65, tubeWidth * 3.8);
      const totalWidth = numTubes * tubeWidth + (numTubes - 1) * Math.max(12, (canvasW - numTubes * tubeWidth) / (numTubes + 1));
      const startX = (canvasW - totalWidth) / 2;
      const spacing = numTubes > 1 ? (totalWidth - numTubes * tubeWidth) / (numTubes - 1) : 0;
      const y = canvasH * 0.52 - tubeHeight * 0.45;

      for (let i = 0; i < numTubes; i++) {
        const x = startX + i * (tubeWidth + spacing);
        this.layouts.push({
          index: i,
          x,
          y,
          width: tubeWidth,
          height: tubeHeight,
          rimRadius: tubeWidth * 0.16,
          innerRadius: tubeWidth * 0.46,
          bottomRadius: tubeWidth * 0.48,
        });
      }
    } else {
      // Two rows layout for mobile (Moto G4, narrow screens)
      const topCount = Math.ceil(numTubes / 2);
      const bottomCount = numTubes - topCount;

      const tubeWidth = Math.max(36, Math.min(52, (canvasW - 48) / topCount - 16));
      const tubeHeight = Math.min(canvasH * 0.38, tubeWidth * 3.6);

      // Top row
      const topTotalW = topCount * tubeWidth + (topCount - 1) * 16;
      const topStartX = (canvasW - topTotalW) / 2;
      const topY = canvasH * 0.14;

      for (let i = 0; i < topCount; i++) {
        const x = topStartX + i * (tubeWidth + 16);
        this.layouts.push({
          index: i,
          x,
          y: topY,
          width: tubeWidth,
          height: tubeHeight,
          rimRadius: tubeWidth * 0.16,
          innerRadius: tubeWidth * 0.46,
          bottomRadius: tubeWidth * 0.48,
        });
      }

      // Bottom row
      const btmTotalW = bottomCount * tubeWidth + (bottomCount - 1) * 16;
      const btmStartX = (canvasW - btmTotalW) / 2;
      const btmY = canvasH * 0.56;

      for (let i = 0; i < bottomCount; i++) {
        const x = btmStartX + i * (tubeWidth + 16);
        this.layouts.push({
          index: topCount + i,
          x,
          y: btmY,
          width: tubeWidth,
          height: tubeHeight,
          rimRadius: tubeWidth * 0.16,
          innerRadius: tubeWidth * 0.46,
          bottomRadius: tubeWidth * 0.48,
        });
      }
    }
  }

  public getTubeAt(canvasX: number, canvasY: number): number | null {
    // Generous hit box for mobile fingers
    for (const layout of this.layouts) {
      const padding = 12;
      if (
        canvasX >= layout.x - padding &&
        canvasX <= layout.x + layout.width + padding &&
        canvasY >= layout.y - padding - 20 &&
        canvasY <= layout.y + layout.height + padding
      ) {
        return layout.index;
      }
    }
    return null;
  }

  private startLoop() {
    const loop = (timestamp: number) => {
      const dt = Math.min(timestamp - this.lastTime, 60);
      this.lastTime = timestamp;
      this.update(dt, timestamp);
      this.render(timestamp);
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private update(dt: number, timestamp: number) {
    // Update pour animation
    if (this.state.pourAnimation) {
      const anim = this.state.pourAnimation;
      const elapsed = timestamp - anim.startTime;
      anim.progress = Math.min(1, elapsed / anim.durationMs);

      // Handle sound during stream
      if (anim.progress > 0.15 && anim.progress < 0.85) {
        // Emit splash particles at destination tube mouth/liquid surface
        const destLayout = this.layouts[anim.toIndex];
        if (destLayout && Math.random() < 0.35) {
          const destTube = this.state.tubes[anim.toIndex];
          const liquidHeight = (destTube.length / 4) * destLayout.height * 0.82;
          const surfaceY = destLayout.y + destLayout.height - liquidHeight;
          const colorDef = LIQUID_COLORS[anim.color];

          this.splashParticles.push({
            x: destLayout.x + destLayout.width * 0.5 + (Math.random() - 0.5) * (destLayout.width * 0.6),
            y: surfaceY,
            vx: (Math.random() - 0.5) * 3,
            vy: -2 - Math.random() * 2.5,
            size: 1.5 + Math.random() * 2,
            alpha: 0.9,
            color: colorDef ? colorDef.highlight : '#ffffff',
          });
        }
      }
    }

    // Update splash particles
    for (let i = this.splashParticles.length - 1; i >= 0; i--) {
      const p = this.splashParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        this.splashParticles.splice(i, 1);
      }
    }

    // Update confetti particles
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.2; // gravity
      c.rotation += c.vRot;
      c.alpha -= 0.005;
      if (c.alpha <= 0 || c.y > this.canvas.height / this.dpr + 50) {
        this.confettiParticles.splice(i, 1);
      }
    }

    // Update bubbles
    this.bubbles.forEach(tubeBubbles => {
      tubeBubbles.forEach(b => {
        b.y -= b.speed * dt;
        if (b.y < 0) {
          b.y = 1;
          b.x = 0.2 + Math.random() * 0.6;
        }
      });
    });
  }

  private render(timestamp: number) {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    if (w <= 0 || h <= 0) return;

    this.ctx.clearRect(0, 0, w, h);

    // Render table shadow / laboratory counter surface
    this.renderCounterSurface(w, h);

    // Calculate dynamic visual positions for each tube (lift, tilt during pour)
    this.calculateTubePositions(timestamp);

    // Render unselected / non-pouring tubes first
    const pourFromIndex = this.state.pourAnimation?.fromIndex ?? -1;
    const pourToIndex = this.state.pourAnimation?.toIndex ?? -1;

    for (const layout of this.layouts) {
      if (layout.index !== pourFromIndex && layout.index !== this.state.selectedTubeIndex) {
        this.renderSingleTube(layout, timestamp);
      }
    }

    // Render selected tube (if not actively pouring)
    if (this.state.selectedTubeIndex !== null && this.state.selectedTubeIndex !== pourFromIndex) {
      const selectedLayout = this.layouts[this.state.selectedTubeIndex];
      if (selectedLayout) {
        this.renderSingleTube(selectedLayout, timestamp);
      }
    }

    // Render destination tube if it's receiving liquid
    if (pourToIndex >= 0) {
      const destLayout = this.layouts[pourToIndex];
      if (destLayout) {
        this.renderSingleTube(destLayout, timestamp);
      }
    }

    // Render pouring stream in mid-air
    if (this.state.pourAnimation) {
      this.renderLiquidStream(timestamp);
    }

    // Render pouring source tube on top (so its spout covers the stream origin)
    if (pourFromIndex >= 0) {
      const pourLayout = this.layouts[pourFromIndex];
      if (pourLayout) {
        this.renderSingleTube(pourLayout, timestamp);
      }
    }

    // Render splash particles
    this.renderSplashParticles();

    // Render celebratory confetti
    this.renderConfetti();
  }

  private renderCounterSurface(w: number, h: number) {
    // Subtle glossy lab surface reflection line
    const grad = this.ctx.createLinearGradient(0, h * 0.85, 0, h);
    grad.addColorStop(0, 'rgba(226, 232, 240, 0)');
    grad.addColorStop(1, 'rgba(203, 213, 225, 0.25)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, h * 0.85, w, h * 0.15);
  }

  private calculateTubePositions(timestamp: number) {
    this.tubeVisualOffsets.clear();

    // Lift selected tube up slightly
    if (this.state.selectedTubeIndex !== null && !this.state.pourAnimation) {
      const floatY = -18 + Math.sin(timestamp * 0.005) * 3;
      this.tubeVisualOffsets.set(this.state.selectedTubeIndex, { x: 0, y: floatY, rotation: 0 });
    }

    // Handle pouring movement and tilt
    if (this.state.pourAnimation) {
      const anim = this.state.pourAnimation;
      const srcLayout = this.layouts[anim.fromIndex];
      const dstLayout = this.layouts[anim.toIndex];

      if (srcLayout && dstLayout) {
        const p = anim.progress;
        // Direction: pour to left or right
        const isPouringRight = dstLayout.x >= srcLayout.x;
        const targetAngle = isPouringRight ? (Math.PI * 0.44) : (-Math.PI * 0.44);

        // Ease functions
        let liftProgress = 0;
        let tiltProgress = 0;

        if (p < 0.2) {
          // Phase 1: Lift & move towards target mouth
          const t = p / 0.2;
          liftProgress = this.easeOutQuad(t);
          tiltProgress = 0;
        } else if (p < 0.8) {
          // Phase 2: Tilt and stream liquid
          liftProgress = 1;
          const t = (p - 0.2) / 0.15;
          tiltProgress = Math.min(1, this.easeInOutCubic(Math.min(1, t)));
          if (p > 0.65) {
            const returnT = (p - 0.65) / 0.15;
            tiltProgress = 1 - this.easeInOutCubic(returnT);
          }
        } else {
          // Phase 3: Return to rest position
          const t = (p - 0.8) / 0.2;
          liftProgress = 1 - this.easeInQuad(t);
          tiltProgress = 0;
        }

        // Target mouth position
        const targetMouthX = isPouringRight 
          ? dstLayout.x - srcLayout.width * 0.5 
          : dstLayout.x + dstLayout.width - srcLayout.width * 0.5;
        const targetMouthY = dstLayout.y - srcLayout.height * 0.65;

        const currentX = (targetMouthX - srcLayout.x) * liftProgress;
        const currentY = (targetMouthY - srcLayout.y) * liftProgress;
        const currentRot = targetAngle * tiltProgress;

        this.tubeVisualOffsets.set(anim.fromIndex, {
          x: currentX,
          y: currentY,
          rotation: currentRot,
        });
      }
    }
  }

  private renderSingleTube(layout: TubeLayout, timestamp: number) {
    const ctx = this.ctx;
    const isSelected = this.state.selectedTubeIndex === layout.index;
    const isCompleted = this.state.isTubeComplete(layout.index);
    const offset = this.tubeVisualOffsets.get(layout.index) || { x: 0, y: 0, rotation: 0 };

    ctx.save();
    ctx.translate(layout.x + layout.width * 0.5 + offset.x, layout.y + offset.y);
    ctx.rotate(offset.rotation);

    const halfW = layout.width * 0.5;
    const h = layout.height;
    const bottomRadius = halfW;

    // Tube base shadow on table
    if (offset.y > -5 && Math.abs(offset.rotation) < 0.05) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, h + 4, halfW * 0.95, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.restore();
    }

    // Glowing halo for selected tube (matching reference image!)
    if (isSelected) {
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // Top glowing arrow pointing down into the tube (matching reference image!)
      this.renderSelectedArrow(ctx, 0, -28, timestamp);
    }

    // Glow if tube completed!
    if (isCompleted) {
      ctx.save();
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // 1. Render Back Glass & Ambient Shadow inside tube
    ctx.save();
    ctx.beginPath();
    this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
    ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
    ctx.fill();
    ctx.restore();

    // 2. Render Liquids
    this.renderTubeLiquids(ctx, layout, timestamp);

    // 3. Render Glass Tube Walls, Reflections, Highlights and Rim Lip
    this.renderGlassOverlays(ctx, -halfW, 0, layout.width, h, bottomRadius, isSelected);

    ctx.restore();
  }

  private renderSelectedArrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, timestamp: number) {
    const bounce = Math.sin(timestamp * 0.007) * 4;
    ctx.save();
    ctx.translate(cx, cy + bounce);

    // Soft blue glowing arrow matching reference screenshot
    ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
    ctx.shadowBlur = 10;

    // Arrow body
    ctx.beginPath();
    ctx.moveTo(-7, -12);
    ctx.lineTo(7, -12);
    ctx.lineTo(7, -4);
    ctx.lineTo(14, -4);
    ctx.lineTo(0, 8);
    ctx.lineTo(-14, -4);
    ctx.lineTo(-7, -4);
    ctx.closePath();

    const arrowGrad = ctx.createLinearGradient(0, -12, 0, 8);
    arrowGrad.addColorStop(0, '#93c5fd');
    arrowGrad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = arrowGrad;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  private renderTubeLiquids(ctx: CanvasRenderingContext2D, layout: TubeLayout, timestamp: number) {
    const tube = this.state.tubes[layout.index] || [];
    const anim = this.state.pourAnimation;
    const isPourSource = anim && anim.fromIndex === layout.index;
    const isPourDest = anim && anim.toIndex === layout.index;

    // Determine current segments to render
    // If pouring, compute intermediate heights
    const maxCapacity = 4;
    const halfW = layout.width * 0.5;
    const totalLiquidMaxH = layout.height * 0.84;
    const segmentH = totalLiquidMaxH / maxCapacity;
    const bottomRadius = halfW;

    ctx.save();
    // Clip inside the test tube inner path so liquid doesn't leak out of glass
    ctx.beginPath();
    this.traceTubeInnerPath(ctx, -halfW + 2, 2, layout.width - 4, layout.height - 2, bottomRadius - 2);
    ctx.clip();

    // Calculate effective segment counts during animation
    let segmentsToRender: ColorId[] = [...tube];
    let topSegmentPartial = 1.0;

    if (isPourSource) {
      // Source tube is losing liquid
      const streamProgress = Math.max(0, Math.min(1, (anim.progress - 0.25) / 0.45));
      const totalAmountLost = anim.amount * streamProgress;
      const fullLost = Math.floor(totalAmountLost);
      const partialLost = totalAmountLost - fullLost;

      segmentsToRender = tube.slice(0, Math.max(0, tube.length - fullLost));
      topSegmentPartial = 1.0 - partialLost;
    } else if (isPourDest) {
      // Dest tube is gaining liquid
      const streamProgress = Math.max(0, Math.min(1, (anim.progress - 0.3) / 0.45));
      const totalGained = anim.amount * streamProgress;
      const fullGained = Math.floor(totalGained);
      const partialGained = totalGained - fullGained;

      for (let i = 0; i < fullGained; i++) {
        segmentsToRender.push(anim.color);
      }
      if (partialGained > 0.01) {
        segmentsToRender.push(anim.color);
        topSegmentPartial = partialGained;
      }
    }

    let currentBottomY = layout.height;

    for (let s = 0; s < segmentsToRender.length; s++) {
      const colorId = segmentsToRender[s];
      const colorDef = LIQUID_COLORS[colorId];
      if (!colorDef) continue;

      const isTopSegment = s === segmentsToRender.length - 1;
      const effectiveFactor = isTopSegment ? topSegmentPartial : 1.0;
      const thisSegH = segmentH * effectiveFactor;
      const segTopY = currentBottomY - thisSegH;

      // Draw liquid block
      const grad = ctx.createLinearGradient(-halfW, segTopY, halfW, currentBottomY);
      grad.addColorStop(0, colorDef.gradientTop);
      grad.addColorStop(0.5, colorDef.primary);
      grad.addColorStop(1, colorDef.gradientBottom);

      ctx.fillStyle = grad;
      ctx.fillRect(-halfW, segTopY, layout.width, thisSegH + 1);

      // Liquid inner glow / depth
      const innerGlow = ctx.createRadialGradient(0, segTopY + thisSegH * 0.5, 2, 0, segTopY + thisSegH * 0.5, halfW);
      innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(-halfW, segTopY, layout.width, thisSegH + 1);

      // Meniscus / surface tension curve on top of liquid layer
      const wave = Math.sin(timestamp * 0.005 + s) * 0.8;
      ctx.beginPath();
      ctx.ellipse(0, segTopY, halfW * 0.9, 3.5 + wave, 0, 0, Math.PI * 2);
      ctx.fillStyle = colorDef.highlight;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Divider line between layers
      if (s > 0) {
        ctx.beginPath();
        ctx.ellipse(0, currentBottomY, halfW * 0.85, 2.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      currentBottomY = segTopY;
    }

    // Render micro bubbles in the liquid
    if (segmentsToRender.length > 0) {
      const tubeBubbles = this.bubbles.get(layout.index) || [];
      const totalLiquidH = layout.height - currentBottomY;

      tubeBubbles.forEach(b => {
        const bubbleY = currentBottomY + b.y * totalLiquidH;
        const wobble = Math.sin(timestamp * b.wobbleSpeed + b.phase) * b.wobbleAmp * layout.width;
        const bubbleX = -halfW + b.x * layout.width + wobble;

        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        ctx.fill();

        // Tiny glint
        ctx.beginPath();
        ctx.arc(bubbleX - b.size * 0.3, bubbleY - b.size * 0.3, b.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      });
    }

    ctx.restore();
  }

  private renderGlassOverlays(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    isSelected: boolean
  ) {
    const halfW = w * 0.5;

    // 1. Test Tube Outline & Glass thickness
    ctx.beginPath();
    this.traceTubePath(ctx, x, y, w, h, r);
    ctx.strokeStyle = isSelected ? 'rgba(56, 189, 248, 0.85)' : 'rgba(203, 213, 225, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 2. Flared Glass Lip / Rim at Top (matching real laboratory test tube)
    const rimW = w * 1.14;
    const rimH = 8;
    const rimX = -rimW * 0.5;
    const rimY = -3;

    // Rim glass reflection
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, rimW * 0.5, rimH * 0.5, 0, 0, Math.PI * 2);
    const rimGrad = ctx.createLinearGradient(rimX, 0, -rimX, 0);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    rimGrad.addColorStop(0.2, 'rgba(226, 232, 240, 0.6)');
    rimGrad.addColorStop(0.8, 'rgba(203, 213, 225, 0.6)');
    rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    ctx.fillStyle = rimGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Inner rim mouth hole
    ctx.beginPath();
    ctx.ellipse(0, 0, halfW * 0.85, (rimH - 3) * 0.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // 3. High-Contrast Glass Reflection Stripes
    // Left vertical glossy specular highlight
    ctx.save();
    ctx.beginPath();
    const highlightW = Math.max(3, w * 0.08);
    ctx.rect(-halfW + 4, 6, highlightW, h - halfW - 8);
    const highlightGrad = ctx.createLinearGradient(-halfW + 4, 0, -halfW + 4 + highlightW, 0);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    // Right subtle rim highlight
    ctx.beginPath();
    ctx.rect(halfW - 6, 6, 2, h - halfW - 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    // Rounded bottom highlight curve
    ctx.beginPath();
    ctx.arc(0, h - halfW, halfW - 4, Math.PI * 0.25, Math.PI * 0.75);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private traceTubePath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const straightH = h - r;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + straightH);
    ctx.arc(x + r, y + straightH, r, Math.PI, 0, true);
    ctx.lineTo(x + w, y);
    ctx.closePath();
  }

  private traceTubeInnerPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const straightH = Math.max(0, h - r);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + straightH);
    ctx.arc(x + r, y + straightH, r, Math.PI, 0, true);
    ctx.lineTo(x + w, y);
    ctx.closePath();
  }

  private renderLiquidStream(timestamp: number) {
    const anim = this.state.pourAnimation;
    if (!anim) return;

    const p = anim.progress;
    if (p < 0.22 || p > 0.78) return;

    const srcLayout = this.layouts[anim.fromIndex];
    const dstLayout = this.layouts[anim.toIndex];
    if (!srcLayout || !dstLayout) return;

    const srcOffset = this.tubeVisualOffsets.get(anim.fromIndex) || { x: 0, y: 0, rotation: 0 };
    const isPouringRight = dstLayout.x >= srcLayout.x;

    // Spout coordinates (mouth of tilted tube)
    const spoutLocalX = isPouringRight ? srcLayout.width * 0.48 : -srcLayout.width * 0.48;
    const spoutLocalY = 2;
    
    // Rotate and translate spout coordinates to world space
    const cosR = Math.cos(srcOffset.rotation);
    const sinR = Math.sin(srcOffset.rotation);
    const startX = srcLayout.x + srcLayout.width * 0.5 + srcOffset.x + (spoutLocalX * cosR - spoutLocalY * sinR);
    const startY = srcLayout.y + srcOffset.y + (spoutLocalX * sinR + spoutLocalY * cosR);

    // Destination target coordinates (inside target tube mouth)
    const endX = dstLayout.x + dstLayout.width * 0.5;
    const destTube = this.state.tubes[anim.toIndex] || [];
    const destLiquidH = (destTube.length / 4) * dstLayout.height * 0.82;
    const endY = dstLayout.y + dstLayout.height - destLiquidH;

    const colorDef = LIQUID_COLORS[anim.color];
    if (!colorDef) return;

    const ctx = this.ctx;
    ctx.save();

    // Stream width pulses slightly with liquid fluid dynamics
    const streamW = Math.max(4, srcLayout.width * 0.16) + Math.sin(timestamp * 0.02) * 1.5;

    // Bezier curve control points
    const cp1X = startX + (isPouringRight ? 15 : -15);
    const cp1Y = startY + 25;
    const cp2X = endX + (isPouringRight ? -5 : 5);
    const cp2Y = startY + (endY - startY) * 0.6;

    // Stream glow
    ctx.shadowColor = colorDef.primary;
    ctx.shadowBlur = 10;

    // Outer stream
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.strokeStyle = colorDef.stream;
    ctx.lineWidth = streamW;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner bright fluid core
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    ctx.strokeStyle = colorDef.highlight;
    ctx.lineWidth = streamW * 0.45;
    ctx.stroke();

    // Splash ripples at destination impact point
    ctx.beginPath();
    ctx.ellipse(endX, endY, streamW * 1.4, streamW * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = colorDef.highlight;
    ctx.fill();

    ctx.restore();
  }

  private renderSplashParticles() {
    const ctx = this.ctx;
    ctx.save();
    for (const p of this.splashParticles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }
    ctx.restore();
  }

  private renderConfetti() {
    if (this.confettiParticles.length === 0) return;
    const ctx = this.ctx;
    ctx.save();
    for (const c of this.confettiParticles) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.fillRect(-c.width * 0.5, -c.height * 0.5, c.width, c.height);
      ctx.restore();
    }
    ctx.restore();
  }

  private easeOutQuad(t: number): number {
    return t * (2 - t);
  }

  private easeInQuad(t: number): number {
    return t * t;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
