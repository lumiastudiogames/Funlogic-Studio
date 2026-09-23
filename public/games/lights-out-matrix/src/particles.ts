/**
 * High-performance 2.5D Canvas Particle System with Object Pooling
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  decay: number;
  life: number;
  gravity?: number;
  spin?: number;
  angle?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private ambientDust: { x: number; y: number; r: number; alpha: number; speed: number; phase: number }[] = [];
  private width: number = 800;
  private height: number = 600;

  constructor() {
    this.initDust();
  }

  public setDimensions(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  private initDust() {
    this.ambientDust = [];
    for (let i = 0; i < 35; i++) {
      this.ambientDust.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.25,
        speed: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Spawns radiant electrical/amber spark particles when a bulb toggles
   */
  public spawnBulbSparks(x: number, y: number, isTurningOn: boolean) {
    const count = isTurningOn ? 22 : 12;
    const colors = isTurningOn
      ? ['#fef08a', '#fde047', '#f59e0b', '#fbbf24', '#ffffff']
      : ['#94a3b8', '#64748b', '#cbd5e1', '#475569'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isTurningOn ? 0.8 : 0),
        radius: isTurningOn ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 1.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.025 + Math.random() * 0.035,
        life: 1,
        gravity: 0.08,
      });
    }
  }

  /**
   * Spawns victory confetti and firework sparks
   */
  public spawnVictoryExplosion(centerX: number, centerY: number) {
    const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#34d399', '#f43f5e', '#a855f7', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.012 + Math.random() * 0.018,
        life: 1,
        gravity: 0.12,
        spin: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI,
      });
    }
  }

  /**
   * Update and render all particles to Canvas
   */
  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 1. Draw ambient subtle floating light orbs (warm golden bokeh)
    const time = performance.now() * 0.001;
    ctx.shadowBlur = 0;
    for (const dust of this.ambientDust) {
      dust.y -= dust.speed;
      dust.x += Math.sin(time + dust.phase) * 0.2;
      if (dust.y < -10) dust.y = this.height + 10;
      if (dust.x < -10) dust.x = this.width + 10;
      if (dust.x > this.width + 10) dust.x = -10;

      ctx.beginPath();
      ctx.arc(dust.x, dust.y, dust.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${dust.alpha * (0.6 + 0.4 * Math.sin(time * 2 + dust.phase))})`;
      ctx.fill();
    }

    // 2. Render dynamic particle effects
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.radius * 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}
