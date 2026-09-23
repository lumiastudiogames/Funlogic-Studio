/**
 * 2.5D Canvas Renderer for Museum Art Heist (Evidence Board & Atmospheric Crime Scene)
 */

import { game } from './game-state';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface InteractiveCard {
  id: string;
  type: 'detective' | 'painting' | 'clue';
  name: string;
  icon: string;
  desc: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isHovered: boolean;
}

export class BoardRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 800;
  private height: number = 600;
  private particles: Particle[] = [];
  private cards: InteractiveCard[] = [];
  private mouseX: number = -1;
  private mouseY: number = -1;
  private animFrameId: number | null = null;
  private time: number = 0;
  public selectedCard: InteractiveCard | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initParticles();
    this.setupListeners();
  }

  public setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.rebuildCards();
  }

  private setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.checkHover();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseX = -1;
      this.mouseY = -1;
      this.cards.forEach(c => c.isHovered = false);
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = this.cards.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
      if (hit) {
        this.selectedCard = this.selectedCard?.id === hit.id ? null : hit;
        this.spawnBurst(hit.x + hit.w / 2, hit.y + hit.h / 2, hit.color);
      } else {
        this.selectedCard = null;
      }
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        const hit = this.cards.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
        if (hit) {
          this.selectedCard = this.selectedCard?.id === hit.id ? null : hit;
          this.spawnBurst(hit.x + hit.w / 2, hit.y + hit.h / 2, hit.color);
        }
      }
    }, { passive: true });
  }

  private checkHover() {
    this.cards.forEach(c => {
      c.isHovered = (this.mouseX >= c.x && this.mouseX <= c.x + c.w && this.mouseY >= c.y && this.mouseY <= c.y + c.h);
    });
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? 'rgba(250, 204, 21, ' : 'rgba(226, 232, 240, ',
        alpha: Math.random() * 0.6 + 0.2,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200
      });
    }
  }

  public spawnBurst(x: number, y: number, color: string) {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.2;
      const speed = Math.random() * 3 + 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        color: color.startsWith('#') ? color : '#facc15',
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 20
      });
    }
  }

  public rebuildCards() {
    const lvl = game.currentLevel;
    const n = lvl.detectives.length;
    this.cards = [];

    const paddingX = Math.max(12, this.width * 0.03);
    const paddingY = Math.max(16, this.height * 0.05);
    const availableW = this.width - paddingX * 2;
    const colWidth = Math.min(220, (availableW - 32) / 3);
    const gapX = (availableW - colWidth * 3) / 2;

    const availableH = this.height - paddingY * 2 - 20;
    const cardHeight = Math.min(74, Math.max(50, (availableH - (n - 1) * 8) / n));
    const gapY = (availableH - cardHeight * n) / Math.max(1, n - 1);

    // Column 1: Detectives
    lvl.detectives.forEach((d, i) => {
      this.cards.push({
        id: d.id,
        type: 'detective',
        name: d.name,
        icon: d.icon,
        desc: d.desc,
        color: d.color,
        x: paddingX,
        y: paddingY + 20 + i * (cardHeight + gapY),
        w: colWidth,
        h: cardHeight,
        isHovered: false
      });
    });

    // Column 2: Paintings
    lvl.paintings.forEach((p, i) => {
      this.cards.push({
        id: p.id,
        type: 'painting',
        name: p.name,
        icon: p.icon,
        desc: p.artist || p.desc,
        color: p.color,
        x: paddingX + colWidth + gapX,
        y: paddingY + 20 + i * (cardHeight + gapY),
        w: colWidth,
        h: cardHeight,
        isHovered: false
      });
    });

    // Column 3: Clues
    lvl.clues.forEach((c, i) => {
      this.cards.push({
        id: c.id,
        type: 'clue',
        name: c.name,
        icon: c.icon,
        desc: c.desc,
        color: c.color,
        x: paddingX + (colWidth + gapX) * 2,
        y: paddingY + 20 + i * (cardHeight + gapY),
        w: colWidth,
        h: cardHeight,
        isHovered: false
      });
    });
  }

  public start() {
    if (!this.animFrameId) {
      const loop = () => {
        this.time += 0.016;
        this.render();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Background: Corkboard with wood tone & gallery spotlight
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(0.6, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle cork texture pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridStep = 24;
    for (let x = 0; x < w; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Column Headers
    this.renderColumnHeaders();

    // 2. Draw Red String Connections for confirmed matches
    this.renderEvidenceThreads();

    // 3. Draw 2.5D Tactile Cards
    this.renderCards();

    // 4. Draw Floating Atmosphere Particles
    this.renderParticles();

    // 5. Solved Overlay Stamp
    if (game.isCompleted) {
      this.renderSolvedStamp();
    }
  }

  private renderColumnHeaders() {
    const ctx = this.ctx;
    const paddingX = Math.max(12, this.width * 0.03);
    const availableW = this.width - paddingX * 2;
    const colWidth = Math.min(220, (availableW - 32) / 3);
    const gapX = (availableW - colWidth * 3) / 2;

    const headers = [
      { text: "DETECTIVES", icon: "🕵️", x: paddingX + colWidth / 2, color: "#38bdf8" },
      { text: "STOLEN ARTWORKS", icon: "🎨", x: paddingX + colWidth + gapX + colWidth / 2, color: "#fbbf24" },
      { text: "FORENSIC CLUES", icon: "🔬", x: paddingX + (colWidth + gapX) * 2 + colWidth / 2, color: "#f43f5e" }
    ];

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px system-ui, sans-serif';

    headers.forEach(h => {
      ctx.fillStyle = h.color;
      ctx.fillText(`${h.icon} ${h.text}`, h.x, 16);
    });
  }

  private renderEvidenceThreads() {
    const ctx = this.ctx;
    const lvl = game.currentLevel;
    const n = lvl.detectives.length;

    // Detectives to Paintings
    for (let d = 0; d < n; d++) {
      for (let p = 0; p < n; p++) {
        if (game.gridState.AB[d][p] === 2) {
          const cardD = this.cards.find(c => c.id === lvl.detectives[d].id);
          const cardP = this.cards.find(c => c.id === lvl.paintings[p].id);
          if (cardD && cardP) {
            this.drawYarnThread(cardD.x + cardD.w - 10, cardD.y + cardD.h / 2, cardP.x + 10, cardP.y + cardP.h / 2, '#ef4444');
          }
        }
      }
    }

    // Paintings to Clues
    for (let p = 0; p < n; p++) {
      for (let c = 0; c < n; c++) {
        if (game.gridState.BC[p][c] === 2) {
          const cardP = this.cards.find(card => card.id === lvl.paintings[p].id);
          const cardC = this.cards.find(card => card.id === lvl.clues[c].id);
          if (cardP && cardC) {
            this.drawYarnThread(cardP.x + cardP.w - 10, cardP.y + cardP.h / 2, cardC.x + 10, cardC.y + cardC.h / 2, '#ef4444');
          }
        }
      }
    }
  }

  private drawYarnThread(x1: number, y1: number, x2: number, y2: number, color: string) {
    const ctx = this.ctx;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 + 10 + Math.sin(this.time * 2 + x1) * 2; // Catenary sag

    // Thread shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x1 + 1, y1 + 3);
    ctx.quadraticCurveTo(midX + 1, midY + 3, x2 + 1, y2 + 3);
    ctx.stroke();

    // Red yarn line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.stroke();

    // Golden fiber shine
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.stroke();
  }

  private renderCards() {
    const ctx = this.ctx;

    this.cards.forEach(card => {
      const isSelected = this.selectedCard?.id === card.id;
      const isHovered = card.isHovered;
      const elev = isHovered || isSelected ? 3 : 0;

      // 1. Drop shadow (contact shadow)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(card.x + 2, card.y + 4 + elev, card.w, card.h, 10);
      ctx.fill();

      // 2. Card body
      const cardGrad = ctx.createLinearGradient(card.x, card.y - elev, card.x, card.y + card.h - elev);
      if (isSelected) {
        cardGrad.addColorStop(0, '#334155');
        cardGrad.addColorStop(1, '#1e293b');
      } else if (isHovered) {
        cardGrad.addColorStop(0, '#1e293b');
        cardGrad.addColorStop(1, '#0f172a');
      } else {
        cardGrad.addColorStop(0, '#182234');
        cardGrad.addColorStop(1, '#0b1120');
      }

      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(card.x, card.y - elev, card.w, card.h, 10);
      ctx.fill();

      // 3. Top inset highlight edge
      ctx.strokeStyle = isSelected ? card.color : (isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)');
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // 4. Push Pin (metallic head with shadow)
      const pinX = card.x + 12;
      const pinY = card.y + 12 - elev;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(pinX + 1, pinY + 2, 4, 0, Math.PI * 2);
      ctx.fill();

      const pinGrad = ctx.createRadialGradient(pinX - 1, pinY - 1, 1, pinX, pinY, 4);
      pinGrad.addColorStop(0, '#f87171');
      pinGrad.addColorStop(0.7, '#dc2626');
      pinGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = pinGrad;
      ctx.beginPath();
      ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 5. Icon & Typography
      ctx.font = `${Math.min(22, Math.floor(card.h * 0.42))}px system-ui, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(card.icon, card.x + 24, card.y + card.h / 2 - elev);

      // Name
      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${Math.max(10, Math.min(13, Math.floor(card.w * 0.065)))}px system-ui, sans-serif`;
      ctx.fillText(card.name, card.x + 56, card.y + card.h * 0.38 - elev, card.w - 62);

      // Subtitle / Desc
      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.max(9, Math.min(11, Math.floor(card.w * 0.052)))}px system-ui, sans-serif`;
      ctx.fillText(card.desc, card.x + 56, card.y + card.h * 0.68 - elev, card.w - 62);
    });
  }

  private renderParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const currentAlpha = p.color.startsWith('rgba') 
        ? p.alpha * (1 - p.life / p.maxLife)
        : 1 - p.life / p.maxLife;

      if (currentAlpha > 0) {
        ctx.fillStyle = p.color.startsWith('rgba') ? `${p.color}${Math.max(0, currentAlpha)})` : p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Remove dead burst particles
    this.particles = this.particles.filter(p => p.life < p.maxLife);
  }

  private renderSolvedStamp() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.15);

    // Stamp border
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.85)';
    ctx.lineWidth = 4;
    ctx.strokeRect(-160, -35, 320, 70);

    // Stamp inner dashed border
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(-154, -29, 308, 58);
    ctx.setLineDash([]);

    // Stamp text
    ctx.fillStyle = 'rgba(34, 197, 94, 0.95)';
    ctx.font = '900 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CASE SOLVED!', 0, 0);

    ctx.restore();
  }
}
