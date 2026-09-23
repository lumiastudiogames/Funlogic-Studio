/**
 * 2.5D Isometric Diorama Renderer
 * Renders ancient Egyptian tomb pedestals with archaeologist face portraits and golden relic discoveries.
 */
import { gameState } from './game-state.js';
import { ASSETS } from './assets.js';

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.animFrameId = null;
    this.time = 0;
    this.particles = [];
    this.portraitImages = {};

    this.initParticles();
    this.loadPortraits();
    this.loop();
  }

  setDimensions(w, h) {
    this.width = w;
    this.height = h;
  }

  loadPortraits() {
    Object.keys(ASSETS).forEach((key) => {
      if (key.startsWith('explorer_')) {
        const svgStr = ASSETS[key];
        const img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
        this.portraitImages[key] = img;
      }
    });
  }

  initParticles() {
    this.particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 300,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  triggerCelebration() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: this.width / 2 + (Math.random() - 0.5) * 100,
        y: this.height / 2 + (Math.random() - 0.5) * 50,
        size: Math.random() * 3.5 + 1.5,
        speedY: (Math.random() - 0.7) * 2,
        alpha: 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  loop() {
    this.time += 0.03;
    this.render();
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Dark Tomb Chamber Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#24170d');
    bgGrad.addColorStop(0.6, '#140c06');
    bgGrad.addColorStop(1, '#080402');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Ambient Dust Particles
    this.renderParticles(ctx, w, h);

    // 3. Render Pedestals & Explorers/Relics
    const currentLevel = gameState.currentLevel;
    if (!currentLevel) return;

    const numItems = currentLevel.size;
    const confirmed = gameState.getConfirmedTriples();

    const centerX = w / 2;
    const centerY = h / 2 + 10;
    const spacing = Math.min(w / (numItems + 1), 90);

    ctx.save();

    for (let i = 0; i < numItems; i++) {
      const offsetX = (i - (numItems - 1) / 2) * spacing;
      const px = centerX + offsetX;
      const py = centerY + (i % 2 === 0 ? -6 : 6);

      const arch = currentLevel.archeologists[i];
      const triple = confirmed[i];

      const isDiscovered = Boolean(triple && triple.pyramid && triple.relic);

      this.renderPedestal(ctx, px, py, isDiscovered, i);

      if (isDiscovered) {
        this.renderRelicDiscovery(ctx, px, py, triple.relic || 'Relic', i);
      } else {
        this.renderExplorerAvatar(ctx, px, py, arch, i);
      }
    }

    ctx.restore();
  }

  renderParticles(ctx, w, h) {
    ctx.save();
    this.particles.forEach((p) => {
      p.y -= p.speedY;
      p.pulse += 0.02;
      if (p.y < 0) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }

      const alpha = Math.sin(p.pulse) * 0.3 + p.alpha;
      ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, Math.min(1, alpha))})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  renderPedestal(ctx, x, y, isGold, index) {
    ctx.save();

    const hoverY = Math.sin(this.time * 2 + index) * 2;
    const py = y + hoverY;

    const pw = 48;
    const ph = 14;

    const topGrad = ctx.createLinearGradient(x - pw / 2, py - ph / 2, x + pw / 2, py + ph / 2);
    if (isGold) {
      topGrad.addColorStop(0, '#fef08a');
      topGrad.addColorStop(0.5, '#f59e0b');
      topGrad.addColorStop(1, '#b45309');
    } else {
      topGrad.addColorStop(0, '#78350f');
      topGrad.addColorStop(0.5, '#451a03');
      topGrad.addColorStop(1, '#1c120c');
    }

    // Top Rhombus
    ctx.beginPath();
    ctx.moveTo(x, py - ph);
    ctx.lineTo(x + pw / 2, py);
    ctx.lineTo(x, py + ph);
    ctx.lineTo(x - pw / 2, py);
    ctx.closePath();
    ctx.fillStyle = topGrad;
    ctx.fill();
    ctx.strokeStyle = isGold ? '#fef08a' : '#d97706';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Side Base Depth
    const baseHeight = 16;
    ctx.beginPath();
    ctx.moveTo(x - pw / 2, py);
    ctx.lineTo(x, py + ph);
    ctx.lineTo(x + pw / 2, py);
    ctx.lineTo(x + pw / 2, py + baseHeight);
    ctx.lineTo(x, py + ph + baseHeight);
    ctx.lineTo(x - pw / 2, py + baseHeight);
    ctx.closePath();
    ctx.fillStyle = isGold ? '#92400e' : '#26170d';
    ctx.fill();
    ctx.strokeStyle = isGold ? '#f59e0b' : '#78350f';
    ctx.stroke();

    // Torch light / glow beneath
    if (isGold) {
      const glow = ctx.createRadialGradient(x, py, 5, x, py, 35);
      glow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, py, 35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderExplorerAvatar(ctx, x, y, arch, index) {
    ctx.save();
    const hoverY = Math.sin(this.time * 2 + index) * 2;
    const py = y + hoverY - 18;

    const img = this.portraitImages[arch.icon];
    if (img && img.complete && img.naturalWidth !== 0) {
      const size = 36;
      ctx.drawImage(img, x - size / 2, py - size / 2, size, size);
    } else {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(x, py, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Name label
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    const shortName = arch.name.split(' ')[1] || arch.name;
    ctx.fillText(shortName, x, py + 26);

    ctx.restore();
  }

  renderRelicDiscovery(ctx, x, y, relicName, index) {
    ctx.save();
    const floatY = Math.sin(this.time * 3 + index) * 3;
    const py = y + floatY - 22;

    // Glowing Aura
    const aura = ctx.createRadialGradient(x, py, 2, x, py, 20);
    aura.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
    aura.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, py, 20, 0, Math.PI * 2);
    ctx.fill();

    // Relic Starburst
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x, py, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText('DISCOVERED', x, py + 26);

    ctx.restore();
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
