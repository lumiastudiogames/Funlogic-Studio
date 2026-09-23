export class MatchstickRenderer {
  constructor(canvas, gameState) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;
    this.width = 800;
    this.height = 400;
    this.hoveredSegment = null;
    this.mousePos = { x: 0, y: 0 };
    this.particles = [];
    this.animationFrameId = null;
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.updateSegmentLayout();
  }

  setHoveredSegment(seg, mousePos) {
    this.hoveredSegment = seg;
    if (mousePos) {
      this.mousePos = mousePos;
    }
  }

  updateSegmentLayout() {
    const segments = this.gameState.getSegments();
    const chars = this.gameState.getCurrentLevel().initialEquation.split('');
    const charCount = chars.length;

    const availableWidth = this.width * 0.92;
    const availableHeight = this.height * 0.72;

    const digitRatio = 1.0;
    const opRatio = 0.75;
    const spacingRatio = 0.35;

    let totalUnits = 0;
    chars.forEach((c) => {
      totalUnits += (c === '+' || c === '-' || c === '=') ? opRatio : digitRatio;
    });
    totalUnits += (charCount - 1) * spacingRatio;

    const maxLByWidth = availableWidth / totalUnits;
    const maxLByHeight = availableHeight / 2.3;
    const L = Math.max(28, Math.min(68, Math.min(maxLByWidth, maxLByHeight)));

    const stickThickness = Math.max(6, Math.round(L * 0.14));
    const totalRenderWidth = totalUnits * L;
    const startX = (this.width - totalRenderWidth) / 2;
    const centerY = this.height * 0.48;
    const startY = centerY - L;

    let currentX = startX;

    for (let charIdx = 0; charIdx < charCount; charIdx++) {
      const char = chars[charIdx];
      const isOp = char === '+' || char === '-' || char === '=';
      const charW = isOp ? opRatio * L : L;

      const charSegs = segments.filter(s => s.charIndex === charIdx);

      if (char >= '0' && char <= '9') {
        const gap = stickThickness * 0.55;
        this.setSegmentCoords(charSegs, 0, currentX + gap, startY, currentX + L - gap, startY);
        this.setSegmentCoords(charSegs, 1, currentX, startY + gap, currentX, startY + L - gap);
        this.setSegmentCoords(charSegs, 2, currentX + L, startY + gap, currentX + L, startY + L - gap);
        this.setSegmentCoords(charSegs, 3, currentX + gap, startY + L, currentX + L - gap, startY + L);
        this.setSegmentCoords(charSegs, 4, currentX, startY + L + gap, currentX, startY + 2 * L - gap);
        this.setSegmentCoords(charSegs, 5, currentX + L, startY + L + gap, currentX + L, startY + 2 * L - gap);
        this.setSegmentCoords(charSegs, 6, currentX + gap, startY + 2 * L, currentX + L - gap, startY + 2 * L);
      } else if (char === '+' || char === '-') {
        const midX = currentX + charW / 2;
        const midY = startY + L;
        this.setSegmentCoords(charSegs, 0, midX - L * 0.45, midY, midX + L * 0.45, midY);
        this.setSegmentCoords(charSegs, 1, midX, midY - L * 0.45, midX, midY + L * 0.45);
      } else if (char === '=') {
        const midX = currentX + charW / 2;
        const barSpacing = L * 0.28;
        this.setSegmentCoords(charSegs, 0, midX - L * 0.45, startY + L - barSpacing, midX + L * 0.45, startY + L - barSpacing);
        this.setSegmentCoords(charSegs, 1, midX - L * 0.45, startY + L + barSpacing, midX + L * 0.45, startY + L + barSpacing);
      }

      currentX += charW + spacingRatio * L;
    }
  }

  setSegmentCoords(segs, segIdx, x1, y1, x2, y2) {
    const s = segs.find(item => item.segIndex === segIdx);
    if (s) {
      s.x1 = x1;
      s.y1 = y1;
      s.x2 = x2;
      s.y2 = y2;
    }
  }

  getSegmentAt(x, y, hitPadding = 26) {
    const segments = this.gameState.getSegments();
    let bestSeg = null;
    let bestDist = hitPadding;

    for (const seg of segments) {
      const dist = this.pointToSegmentDistance(x, y, seg.x1, seg.y1, seg.x2, seg.y2);
      if (dist < bestDist) {
        bestDist = dist;
        bestSeg = seg;
      }
    }
    return bestSeg;
  }

  getClosestEmptySegment(x, y, maxDist = 42) {
    const segments = this.gameState.getSegments();
    let closest = null;
    let minDist = maxDist;

    for (const seg of segments) {
      if (!seg.hasMatch) {
        const dist = this.pointToSegmentDistance(x, y, seg.x1, seg.y1, seg.x2, seg.y2);
        if (dist < minDist) {
          minDist = dist;
          closest = seg;
        }
      }
    }
    return closest;
  }

  pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  triggerWinCelebration() {
    const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#fde047'];
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      this.particles.push({
        x: this.width / 2 + (Math.random() - 0.5) * (this.width * 0.5),
        y: this.height * 0.45 + (Math.random() - 0.5) * (this.height * 0.3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 45 + Math.random() * 35,
      });
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(loop);
    }
  }

  stopRenderLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawBoardBackground(ctx);

    const segments = this.gameState.getSegments();
    const held = this.gameState.getHeldMatch();
    const isWon = this.gameState.isLevelWon();

    for (const seg of segments) {
      if (!seg.hasMatch) {
        const isHovered = this.hoveredSegment?.id === seg.id;
        const isOriginalHeldSlot = held && held.charIndex === seg.charIndex && held.segIndex === seg.segIndex;
        this.drawEmptySlot(ctx, seg, isHovered, Boolean(held), Boolean(isOriginalHeldSlot));
      }
    }

    for (const seg of segments) {
      if (seg.hasMatch) {
        const isHovered = !held && this.hoveredSegment?.id === seg.id;
        this.drawMatchstick(ctx, seg.x1, seg.y1, seg.x2, seg.y2, {
          isHovered,
          isWon,
          isGhost: false,
          elevation: 0,
          headAtStart: seg.segIndex % 2 === 0,
        });
      }
    }

    if (held) {
      const origSeg = held.initialSegment;
      const stickLength = Math.hypot(origSeg.x2 - origSeg.x1, origSeg.y2 - origSeg.y1);
      const angle = Math.atan2(origSeg.y2 - origSeg.y1, origSeg.x2 - origSeg.x1);

      const hx1 = this.mousePos.x - (Math.cos(angle) * stickLength) / 2;
      const hy1 = this.mousePos.y - (Math.sin(angle) * stickLength) / 2;
      const hx2 = this.mousePos.x + (Math.cos(angle) * stickLength) / 2;
      const hy2 = this.mousePos.y + (Math.sin(angle) * stickLength) / 2;

      this.drawMatchstick(ctx, hx1, hy1, hx2, hy2, {
        isHovered: true,
        isWon: false,
        isGhost: false,
        elevation: 12,
        headAtStart: held.segIndex % 2 === 0,
      });
    }

    this.renderParticles(ctx);
  }

  drawBoardBackground(ctx) {
    const bgGrad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.width * 0.1,
      this.width / 2, this.height / 2, this.width * 0.75
    );
    bgGrad.addColorStop(0, '#fefaf3');
    bgGrad.addColorStop(0.6, '#f7eee0');
    bgGrad.addColorStop(1, '#e2d3bf');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(160, 120, 80, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < this.height; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        this.width * 0.3, y + Math.sin(y * 0.1) * 3,
        this.width * 0.7, y - Math.sin(y * 0.1) * 3,
        this.width, y
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  drawEmptySlot(ctx, seg, isHovered, isHolding, isOriginalHeldSlot) {
    const { x1, y1, x2, y2 } = seg;
    ctx.save();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) {
      ctx.restore();
      return;
    }

    const angle = Math.atan2(dy, dx);
    const thickness = Math.max(5, Math.round(len * 0.14));

    ctx.translate(x1, y1);
    ctx.rotate(angle);

    ctx.fillStyle = 'rgba(70, 50, 30, 0.18)';
    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, len, thickness, thickness / 2);
    ctx.fill();

    if (isHovered && isHolding) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-2, -thickness / 2 - 2, len + 4, thickness + 4, (thickness + 4) / 2);
      ctx.fill();
      ctx.stroke();
    } else if (isOriginalHeldSlot) {
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.roundRect(-1, -thickness / 2 - 1, len + 2, thickness + 2, (thickness + 2) / 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(120, 90, 60, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.roundRect(0, -thickness / 2, len, thickness, thickness / 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawMatchstick(ctx, x1, y1, x2, y2, opts) {
    const { isHovered, isWon, elevation, headAtStart } = opts;

    ctx.save();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) {
      ctx.restore();
      return;
    }

    const angle = Math.atan2(dy, dx);
    const thickness = Math.max(6, Math.round(len * 0.14));
    const headRadius = thickness * 1.15;

    ctx.translate(x1, y1);
    ctx.rotate(angle);

    const shadowOffset = 3 + elevation * 0.6;
    const shadowBlur = 4 + elevation * 0.8;
    ctx.fillStyle = `rgba(30, 15, 5, ${0.28 - elevation * 0.01})`;
    ctx.shadowColor = 'rgba(30, 15, 5, 0.3)';
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;

    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, len, thickness, thickness / 3);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const stickGrad = ctx.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
    if (isWon) {
      stickGrad.addColorStop(0, '#fef08a');
      stickGrad.addColorStop(0.5, '#f59e0b');
      stickGrad.addColorStop(1, '#b45309');
    } else if (isHovered) {
      stickGrad.addColorStop(0, '#ffedd5');
      stickGrad.addColorStop(0.4, '#fde047');
      stickGrad.addColorStop(1, '#d97706');
    } else {
      stickGrad.addColorStop(0, '#ffedd5');
      stickGrad.addColorStop(0.3, '#fed7aa');
      stickGrad.addColorStop(0.7, '#f59e0b');
      stickGrad.addColorStop(1, '#b45309');
    }

    ctx.fillStyle = stickGrad;
    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, len, thickness, thickness / 3);
    ctx.fill();

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const headX = headAtStart ? headRadius * 0.4 : len - headRadius * 0.4;
    const headY = 0;

    const headGrad = ctx.createRadialGradient(
      headX - headRadius * 0.3, headY - headRadius * 0.3, headRadius * 0.1,
      headX, headY, headRadius * 1.2
    );

    if (isWon) {
      headGrad.addColorStop(0, '#34d399');
      headGrad.addColorStop(0.6, '#059669');
      headGrad.addColorStop(1, '#064e3b');
    } else {
      headGrad.addColorStop(0, '#f87171');
      headGrad.addColorStop(0.4, '#dc2626');
      headGrad.addColorStop(0.8, '#991b1b');
      headGrad.addColorStop(1, '#450a0a');
    }

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(headX - headRadius * 0.3, headY - headRadius * 0.3, headRadius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderParticles(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
