export class Renderer2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = 1;
    this.tileSize = 64;
    this.originX = 0;
    this.originY = 0;
    this.particles = [];
    this.lastTime = 0;
    this.animTime = 0;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.max(280, Math.floor(rect.width));
    const cssHeight = Math.max(360, Math.floor(rect.height || 480));

    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  getScreenSize() {
    return {
      width: this.canvas.width / this.dpr,
      height: this.canvas.height / this.dpr,
    };
  }

  gridToScreen(gx, gy) {
    return {
      x: this.originX + gx * this.tileSize,
      y: this.originY + gy * this.tileSize,
    };
  }

  updateLayout(state) {
    const { width, height } = this.getScreenSize();
    const { cols, rows } = state;

    const isMobile = width < 640;
    const paddingX = isMobile ? 16 : 40;
    const paddingY = isMobile ? 20 : 48;

    const availW = Math.max(200, width - paddingX * 2);
    const availH = Math.max(200, height - paddingY * 2);

    const maxTileW = availW / cols;
    const maxTileH = availH / rows;

    const rawTileSize = Math.min(maxTileW, maxTileH);
    const maxCap = isMobile ? 72 : 96;
    this.tileSize = Math.max(32, Math.min(maxCap, Math.floor(rawTileSize)));

    const boardW = cols * this.tileSize;
    const boardH = rows * this.tileSize;

    this.originX = Math.floor((width - boardW) / 2);
    this.originY = Math.floor((height - boardH) / 2);
  }

  addCrateSparkles(gridX, gridY) {
    const pos = this.gridToScreen(gridX + 0.5, gridY + 0.5);
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: pos.x + (Math.random() * 24 - 12),
        y: pos.y + (Math.random() * 24 - 12),
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        alpha: 1,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.3 ? '#4ade80' : '#86efac',
        maxLife: 0.6,
        life: 0.6,
        shape: 'star',
      });
    }
  }

  addPushDust(gridX, gridY) {
    const pos = this.gridToScreen(gridX + 0.5, gridY + 0.5);
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: pos.x + (Math.random() * 20 - 10),
        y: pos.y + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        alpha: 0.5,
        size: 3 + Math.random() * 3,
        color: '#94a3b8',
        maxLife: 0.35,
        life: 0.35,
        shape: 'circle',
      });
    }
  }

  addConfetti() {
    const { width, height } = this.getScreenSize();
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: width * 0.5 + (Math.random() * 200 - 100),
        y: height * 0.35 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 320,
        vy: -150 - Math.random() * 250,
        alpha: 1,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        maxLife: 2.2,
        life: 2.2,
        shape: 'confetti',
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 12,
      });
    }
  }

  render(state, timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;
    this.animTime += dt;

    this.updateLayout(state);

    const { width, height } = this.getScreenSize();
    const ctx = this.ctx;

    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, Math.max(width, height) * 0.7);
    bgGrad.addColorStop(0, '#131e32');
    bgGrad.addColorStop(0.6, '#0f172a');
    bgGrad.addColorStop(1, '#070d18');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    this.drawBoardShadow(state);
    this.drawFloor(state);
    this.drawTargets(state);
    this.drawDecorations(state);
    this.drawWalls(state);
    this.drawCrates(state);
    this.drawPlayer(state);

    if (state.hintCrate && state.hintDirection) {
      this.drawHintArrow(state.hintCrate, state.hintDirection);
    }

    this.updateParticles(dt);
  }

  drawBoardShadow(state) {
    const ctx = this.ctx;
    const { cols, rows } = state;
    const boardW = cols * this.tileSize;
    const boardH = rows * this.tileSize;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(this.originX - 12, this.originY - 12, boardW + 24, boardH + 24, 16);
    ctx.fill();
    ctx.restore();
  }

  drawFloor(state) {
    const ctx = this.ctx;
    const { cols, rows, grid } = state;
    const ts = this.tileSize;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y]?.[x];
        if (!cell || cell === ' ') continue;

        const pos = this.gridToScreen(x, y);

        ctx.save();

        const isAlt = (x + y) % 2 === 0;
        ctx.fillStyle = isAlt ? '#1e293b' : '#1a2333';
        ctx.fillRect(pos.x, pos.y, ts, ts);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.strokeRect(pos.x + 0.5, pos.y + 0.5, ts - 1, ts - 1);

        const gap = ts * 0.15;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fillRect(pos.x + gap, pos.y + gap, ts - gap * 2, ts - gap * 2);

        ctx.restore();
      }
    }
  }

  drawTargets(state) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    const pulse = Math.sin(this.animTime * 3.5) * 0.1 + 0.9;

    for (const tgt of state.targets) {
      const pos = this.gridToScreen(tgt.x, tgt.y);
      const isOccupied = state.crates.some(c => c.grid.x === tgt.x && c.grid.y === tgt.y);
      const cx = pos.x + ts / 2;
      const cy = pos.y + ts / 2;
      const radius = (ts / 2) * 0.65;

      ctx.save();

      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.4);
      if (isOccupied) {
        glow.addColorStop(0, 'rgba(74, 222, 128, 0.5)');
        glow.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else {
        glow.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
        glow.addColorStop(1, 'rgba(34, 197, 94, 0)');
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = isOccupied ? '#4ade80' : '#22c55e';
      ctx.lineWidth = isOccupied ? 3.5 : 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = isOccupied ? '#86efac' : '#4ade80';
      ctx.fill();

      ctx.strokeStyle = isOccupied ? '#86efac' : 'rgba(74, 222, 128, 0.8)';
      ctx.lineWidth = 1.5;
      const len = radius * 0.85;

      ctx.beginPath();
      ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
      ctx.moveTo(cx, cy - len); ctx.lineTo(cx, cy + len);
      ctx.stroke();

      ctx.restore();
    }
  }

  drawWalls(state) {
    const ctx = this.ctx;
    const { cols, rows, grid } = state;
    const ts = this.tileSize;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y]?.[x] !== '#') continue;

        const pos = this.gridToScreen(x, y);

        ctx.save();

        const wallGrad = ctx.createLinearGradient(pos.x, pos.y, pos.x + ts, pos.y + ts);
        wallGrad.addColorStop(0, '#334155');
        wallGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = wallGrad;
        ctx.beginPath();
        ctx.roundRect(pos.x + 1, pos.y + 1, ts - 2, ts - 2, 4);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(pos.x + 4, pos.y + 4, ts - 8, ts - 8, 3);
        ctx.fill();

        const innerGrad = ctx.createLinearGradient(pos.x, pos.y, pos.x + ts, pos.y + ts);
        innerGrad.addColorStop(0, '#273548');
        innerGrad.addColorStop(1, '#1a2332');
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.roundRect(pos.x + 6, pos.y + 6, ts - 12, ts - 12, 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pos.x + 2, pos.y + 2, ts - 4, ts - 4);

        ctx.restore();
      }
    }
  }

  drawDecorations(state) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    for (const decor of state.decorations) {
      const pos = this.gridToScreen(decor.x, decor.y);
      const cx = pos.x + ts / 2;
      const cy = pos.y + ts / 2;

      ctx.save();

      if (decor.type === 'barrel') {
        const radius = ts * 0.32;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        const bGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
        bGrad.addColorStop(0, '#a75822');
        bGrad.addColorStop(0.7, '#6d3916');
        bGrad.addColorStop(1, '#3e1d09');
        ctx.fillStyle = bGrad;
        ctx.fill();

        ctx.strokeStyle = '#2d1607';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#475569';
        ctx.fill();
      } else if (decor.type === 'pallet') {
        const pad = ts * 0.12;
        const pw = ts - pad * 2;
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pos.x + pad, pos.y + pad, pw, pw, 3);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
          const sy = pos.y + pad + (pw / 4) * i;
          ctx.beginPath();
          ctx.moveTo(pos.x + pad + 2, sy);
          ctx.lineTo(pos.x + pad + pw - 2, sy);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  drawCrates(state) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    for (const crate of state.crates) {
      const pos = this.gridToScreen(crate.visual.x, crate.visual.y);
      const pad = ts * 0.1;
      const cw = ts - pad * 2;
      const cx = pos.x + ts / 2;
      const cy = pos.y + ts / 2;

      ctx.save();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(pos.x + pad + 3, pos.y + pad + 3, cw, cw);

      if (crate.onTarget) {
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 14;
      }

      const crateGrad = ctx.createLinearGradient(pos.x + pad, pos.y + pad, pos.x + pad + cw, pos.y + pad + cw);
      if (crate.onTarget) {
        crateGrad.addColorStop(0, '#15803d');
        crateGrad.addColorStop(0.5, '#166534');
        crateGrad.addColorStop(1, '#14532d');
      } else {
        crateGrad.addColorStop(0, '#d97706');
        crateGrad.addColorStop(0.5, '#b45309');
        crateGrad.addColorStop(1, '#78350f');
      }

      ctx.fillStyle = crateGrad;
      ctx.beginPath();
      ctx.roundRect(pos.x + pad, pos.y + pad, cw, cw, 6);
      ctx.fill();

      ctx.strokeStyle = crate.onTarget ? '#4ade80' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = crate.onTarget ? '#86efac' : '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pos.x + pad + 4, pos.y + pad + 4);
      ctx.lineTo(pos.x + pad + cw - 4, pos.y + pad + cw - 4);
      ctx.moveTo(pos.x + pad + cw - 4, pos.y + pad + 4);
      ctx.lineTo(pos.x + pad + 4, pos.y + pad + cw - 4);
      ctx.stroke();

      ctx.strokeStyle = crate.onTarget ? '#166534' : '#451a03';
      ctx.lineWidth = 3;
      ctx.strokeRect(pos.x + pad + 3, pos.y + pad + 3, cw - 6, cw - 6);

      if (crate.onTarget) {
        ctx.fillStyle = '#86efac';
        ctx.beginPath();
        ctx.arc(cx, cy, cw * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawPlayer(state) {
    const ctx = this.ctx;
    const { playerVisual, playerFacing } = state;
    const ts = this.tileSize;

    const pos = this.gridToScreen(playerVisual.x, playerVisual.y);
    const cx = pos.x + ts / 2;
    const cy = pos.y + ts / 2;
    const radius = ts * 0.36;

    const isMoving = Math.abs(playerVisual.x - state.player.x) > 0.05 || Math.abs(playerVisual.y - state.player.y) > 0.05;
    const walkBob = isMoving ? Math.sin(this.animTime * 18) * 2.5 : 0;

    ctx.save();
    ctx.translate(cx, cy + walkBob);

    let angle = 0;
    switch (playerFacing) {
      case 'up': angle = -Math.PI / 2; break;
      case 'down': angle = Math.PI / 2; break;
      case 'left': angle = Math.PI; break;
      case 'right': angle = 0; break;
    }
    ctx.rotate(angle);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 3, radius * 1.1, radius * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.8, -radius * 0.9, radius * 1.6, radius * 1.8, 6);
    ctx.fill();
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.fillRect(-radius * 0.7, -radius * 0.4, radius * 1.4, 3);
    ctx.fillRect(-radius * 0.7, radius * 0.2, radius * 1.4, 3);

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(radius * 0.1, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(radius * 0.35, 0, radius * 0.18, radius * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(radius * 0.75, -radius * 0.55, radius * 0.22, 0, Math.PI * 2);
    ctx.arc(radius * 0.75, radius * 0.55, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHintArrow(crateCoord, direction) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    const pos = this.gridToScreen(crateCoord.x, crateCoord.y);
    const cx = pos.x + ts / 2;
    const cy = pos.y + ts / 2;

    const bounce = Math.sin(this.animTime * 6) * 4;

    let rot = 0;
    let offX = 0;
    let offY = 0;

    switch (direction) {
      case 'up': rot = -Math.PI / 2; offY = -ts * 0.65; break;
      case 'down': rot = Math.PI / 2; offY = ts * 0.65; break;
      case 'left': rot = Math.PI; offX = -ts * 0.65; break;
      case 'right': rot = 0; offX = ts * 0.65; break;
    }

    ctx.save();
    ctx.translate(cx + offX, cy + offY + bounce);
    ctx.rotate(rot);

    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -10);
    ctx.lineTo(-3, -10);
    ctx.lineTo(-3, -18);
    ctx.lineTo(-11, -18);
    ctx.lineTo(-11, 18);
    ctx.lineTo(-3, 18);
    ctx.lineTo(-3, 10);
    ctx.lineTo(-8, 10);
    ctx.closePath();

    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  updateParticles(dt) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.shape === 'confetti') {
        p.vy += 200 * dt;
        p.rot += (p.vRot || 2) * dt;
      }
      p.alpha = Math.max(0, p.life / p.maxLife);

      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.shape === 'star') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'confetti') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot || 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
