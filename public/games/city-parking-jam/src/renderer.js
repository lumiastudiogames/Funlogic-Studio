/**
 * Linear Interpolation (LERP) helper function
 * @param {number} start Current value
 * @param {number} end Target value
 * @param {number} factor Interpolation factor (0 to 1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.cssWidth = 0;
    this.cssHeight = 0;
    this.lastRenderTime = performance.now();
    this.carInterpolationMap = new Map();
  }

  resize(width, height) {
    this.cssWidth = width;
    this.cssHeight = height;
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  render(game, frameDt) {
    if (!this.ctx || this.cssWidth === 0 || this.cssHeight === 0) return;

    const now = performance.now();
    const dt = typeof frameDt === 'number' ? frameDt : Math.min(0.1, (now - this.lastRenderTime) / 1000);
    this.lastRenderTime = now;

    const ctx = this.ctx;
    const lvl = game.getCurrentLevelDef();
    if (!lvl) return;

    // 1. Calculate optimal responsive grid cell size
    const pad = Math.min(this.cssWidth, this.cssHeight) > 600 ? 50 : 24;
    const availW = this.cssWidth - pad * 2;
    const availH = this.cssHeight - pad * 2;

    const cellSize = Math.min(
      64,
      Math.floor(Math.min(availW / lvl.gridWidth, availH / lvl.gridHeight))
    );

    const gridW = lvl.gridWidth * cellSize;
    const gridH = lvl.gridHeight * cellSize;
    const ox = Math.floor((this.cssWidth - gridW) / 2);
    const oy = Math.floor((this.cssHeight - gridH) / 2);

    game.cellSize = cellSize;
    game.gridPixelWidth = gridW;
    game.gridPixelHeight = gridH;
    game.gridOffsetX = ox;
    game.gridOffsetY = oy;

    // 2. Animate Cars using LERP (Linear Interpolation) for smooth gliding
    const cars = game.getCars();
    for (const car of cars) {
      if (!this.carInterpolationMap.has(car.id)) {
        this.carInterpolationMap.set(car.id, {
          x: car.visualX,
          y: car.visualY,
          angle: car.visualAngle || 0,
        });
      }

      const interp = this.carInterpolationMap.get(car.id);
      
      // Calculate smooth interpolation rate based on delta time & car status
      let lerpRate;
      if (car.state === 'moving_exit') {
        // Smooth progressive glide on acceleration & exit
        lerpRate = 1 - Math.exp(-24 * dt);
      } else if (car.state === 'bumping') {
        // Quick spring response on collision bounce
        lerpRate = 1 - Math.exp(-32 * dt);
      } else {
        // Silky glide settling back into parked or undo position
        lerpRate = 1 - Math.exp(-20 * dt);
      }

      // Apply linear interpolation to X, Y, and rotation angle
      interp.x = lerp(interp.x, car.visualX, lerpRate);
      interp.y = lerp(interp.y, car.visualY, lerpRate);
      interp.angle = lerp(interp.angle, car.visualAngle || 0, lerpRate);

      // Snap when close enough to eliminate floating point micro-jitters
      if (Math.abs(interp.x - car.visualX) < 0.0005) interp.x = car.visualX;
      if (Math.abs(interp.y - car.visualY) < 0.0005) interp.y = car.visualY;

      car.renderX = interp.x;
      car.renderY = interp.y;
      car.renderAngle = interp.angle;
    }

    // 3. Clear & Draw Urban Asphalt Canvas Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    // Subtle background ambient asphalt texture
    this.drawAsphaltBackground(ctx, ox, oy, gridW, gridH);

    // 4. Draw Parking Lot Base Plate (2.5D Beveled Concrete Border)
    this.drawParkingLotBase(ctx, ox, oy, gridW, gridH, lvl, cellSize);

    // 5. Draw Hint Path Guides (if car is hinted)
    this.drawHintPaths(ctx, game, ox, oy, cellSize);

    // 6. Draw Obstacles (Cones, Hydrants, Barriers, Planters)
    this.drawObstacles(ctx, game.getObstacles(), ox, oy, cellSize);

    // 7. Draw Vehicles with Always-On Headlights & Light Beams
    const activeSkin = game.getProgress().activeSkin;

    for (const car of cars) {
      if (car.state !== 'exited') {
        this.drawCar(ctx, car, ox, oy, cellSize, activeSkin);
      }
    }

    // 8. Draw Visual Particles (Sparks, Smoke, Confetti)
    this.drawParticles(ctx, game.getParticles());
  }

  drawAsphaltBackground(ctx, ox, oy, gridW, gridH) {
    // Subtle background street grid lines
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;

    const step = 40;
    for (let x = 0; x < this.cssWidth; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.cssHeight);
      ctx.stroke();
    }
    for (let y = 0; y < this.cssHeight; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.cssWidth, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawParkingLotBase(ctx, ox, oy, gridW, gridH, lvl, cellSize) {
    ctx.save();

    // Deep outer shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    // Outer curb border (Dark Charcoal Concrete)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(ox - 8, oy - 8, gridW + 16, gridH + 16, 16);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Inner asphalt pavement
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(ox, oy, gridW, gridH, 10);
    ctx.fill();

    // Parking slot bay markings (Dashed Yellow/White Paint)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    for (let c = 1; c < lvl.gridWidth; c++) {
      ctx.beginPath();
      ctx.moveTo(ox + c * cellSize, oy + 4);
      ctx.lineTo(ox + c * cellSize, oy + gridH - 4);
      ctx.stroke();
    }

    for (let r = 1; r < lvl.gridHeight; r++) {
      ctx.beginPath();
      ctx.moveTo(ox + 4, oy + r * cellSize);
      ctx.lineTo(ox + gridW - 4, oy + r * cellSize);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Yellow perimeter edge dashes (Caution curb striping)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(ox - 3, oy - 3, gridW + 6, gridH + 6);
    ctx.setLineDash([]);

    ctx.restore();
  }

  drawObstacles(ctx, obstacles, ox, oy, cs) {
    for (const obs of obstacles) {
      const px = ox + obs.x * cs;
      const py = oy + obs.y * cs;
      const w = obs.width * cs;
      const h = obs.height * cs;

      ctx.save();
      // Contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(px + w / 2, py + h / 2 + 4, w * 0.42, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      if (obs.type === 'cone') {
        // Traffic Cone
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.34, 0, Math.PI * 2);
        ctx.fill();

        // White reflective stripe
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Orange top tip
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.1, 0, Math.PI * 2);
        ctx.fill();
      } else if (obs.type === 'hydrant') {
        // Fire Hydrant
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (obs.type === 'barrier') {
        // Concrete Striped Barrier
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(px + 4, py + 4, w - 8, h - 8, 4);
        ctx.fill();

        // Red/White stripes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 6, py + 6, (w - 12) * 0.3, h - 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 6 + (w - 12) * 0.35, py + 6, (w - 12) * 0.3, h - 12);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 6 + (w - 12) * 0.7, py + 6, (w - 12) * 0.3, h - 12);
      } else if (obs.type === 'planter') {
        // Urban Greenery Planter Box
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.roundRect(px + 4, py + 4, w - 8, h - 8, 6);
        ctx.fill();

        // Foliage
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(px + w / 2, py + h / 2, cs * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(px + w / 2 - 3, py + h / 2 - 2, cs * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  drawHintPaths(ctx, game, ox, oy, cs) {
    for (const car of game.getCars()) {
      if (car.state === 'parked' && car.isHinted) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);

        const rx = typeof car.renderX === 'number' ? car.renderX : car.visualX;
        const ry = typeof car.renderY === 'number' ? car.renderY : car.visualY;

        const isH = car.direction === 'LEFT' || car.direction === 'RIGHT';
        const carW = (isH ? car.length : 1) * cs;
        const carH = (!isH ? car.length : 1) * cs;
        const cx = ox + rx * cs + carW / 2;
        const cy = oy + ry * cs + carH / 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);

        if (car.direction === 'RIGHT') ctx.lineTo(this.cssWidth, cy);
        if (car.direction === 'LEFT') ctx.lineTo(0, cy);
        if (car.direction === 'DOWN') ctx.lineTo(cx, this.cssHeight);
        if (car.direction === 'UP') ctx.lineTo(cx, 0);

        ctx.stroke();

        // Pulsing hint glow box around car
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(
          ox + rx * cs - 4,
          oy + ry * cs - 4,
          carW + 8,
          carH + 8
        );

        ctx.restore();
      }
    }
  }

  drawCar(ctx, car, ox, oy, cs, activeSkin) {
    const isHorizontal = car.direction === 'LEFT' || car.direction === 'RIGHT';
    const totalLen = car.length * cs;
    const width = cs * 0.82;
    const length = totalLen - cs * 0.18;

    const rx = typeof car.renderX === 'number' ? car.renderX : car.visualX;
    const ry = typeof car.renderY === 'number' ? car.renderY : car.visualY;
    const rAngle = typeof car.renderAngle === 'number' ? car.renderAngle : (car.visualAngle || 0);

    // Center point in world (gliding smoothly with LERP)
    const cx = ox + rx * cs + (isHorizontal ? totalLen / 2 : cs / 2);
    const cy = oy + ry * cs + (isHorizontal ? cs / 2 : totalLen / 2);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rAngle);

    // Local coordinates: car faces towards +X (Right)
    const hx = -length / 2;
    const hy = -width / 2;

    // 1. Soft Ambient Contact Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
    ctx.beginPath();
    ctx.roundRect(hx + 3, hy + 4, length - 2, width - 2, 8);
    ctx.fill();

    // 2. ALWAYS-ON HEADLIGHTS & FORWARD LIGHT BEAMS (FAROL LIGADO)
    // Front edge is at +X (hx + length)
    const frontEdgeX = hx + length;
    const beamLength = cs * 1.35;
    const beamSpread = width * 0.9;

    // Draw illuminated light cone projection onto asphalt
    const beamGrad = ctx.createLinearGradient(frontEdgeX, 0, frontEdgeX + beamLength, 0);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)'); // Warm yellow light
    beamGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.22)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(frontEdgeX - 2, -width * 0.35);
    ctx.lineTo(frontEdgeX + beamLength, -beamSpread);
    ctx.lineTo(frontEdgeX + beamLength, beamSpread);
    ctx.lineTo(frontEdgeX - 2, width * 0.35);
    ctx.closePath();
    ctx.fill();

    // 3. 4 Rubber Wheels (Tires)
    ctx.fillStyle = '#020617';
    const tireW = length * 0.16;
    const tireH = width * 0.18;

    // Front tires
    ctx.fillRect(hx + length * 0.68, hy - tireH * 0.4, tireW, tireH);
    ctx.fillRect(hx + length * 0.68, hy + width - tireH * 0.6, tireW, tireH);
    // Rear tires
    ctx.fillRect(hx + length * 0.16, hy - tireH * 0.4, tireW, tireH);
    ctx.fillRect(hx + length * 0.16, hy + width - tireH * 0.6, tireW, tireH);

    // 4. Car Chassis / Metallic Body
    let bodyColor = car.color;
    if (activeSkin === 'taxi') bodyColor = '#eab308';
    else if (activeSkin === 'police') bodyColor = '#1e293b';
    else if (activeSkin === 'fire') bodyColor = '#dc2626';
    else if (activeSkin === 'cyber') bodyColor = '#06b6d4';
    else if (activeSkin === 'gold') bodyColor = '#f59e0b';

    // 2.5D Body bevel gradient
    const bodyGrad = ctx.createLinearGradient(0, hy, 0, hy + width);
    bodyGrad.addColorStop(0, this.lightenColor(bodyColor, 20));
    bodyGrad.addColorStop(0.5, bodyColor);
    bodyGrad.addColorStop(1, this.darkenColor(bodyColor, 25));

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(hx, hy, length, width, 7);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Special Skin Details
    if (activeSkin === 'taxi') {
      // Taxi checkerboard stripe
      ctx.fillStyle = '#000000';
      ctx.fillRect(hx + length * 0.35, hy + 2, length * 0.3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx + length * 0.4, hy + 2, length * 0.1, 3);
    } else if (activeSkin === 'police') {
      // White roof door
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx + length * 0.28, hy + 3, length * 0.44, width - 6);
      // Emergency Light Bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(hx + length * 0.48, hy + 3, length * 0.08, (width - 6) / 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(hx + length * 0.48, hy + 3 + (width - 6) / 2, length * 0.08, (width - 6) / 2);
    }

    // 5. Roof & Tinted Glass Windows
    ctx.fillStyle = '#0f172a'; // Deep tinted glass
    const glassStartX = hx + length * (car.type === 'van' ? 0.22 : 0.26);
    const glassLen = length * (car.type === 'van' ? 0.62 : 0.52);
    const glassW = width * 0.72;
    const glassY = -glassW / 2;

    ctx.beginPath();
    ctx.roundRect(glassStartX, glassY, glassLen, glassW, 4);
    ctx.fill();

    // Car Roof Top (Body Color)
    ctx.fillStyle = bodyColor;
    const roofLen = glassLen * 0.55;
    const roofStartX = glassStartX + glassLen * 0.2;
    const roofW = glassW * 0.8;
    const roofY = -roofW / 2;

    ctx.beginPath();
    ctx.roundRect(roofStartX, roofY, roofLen, roofW, 3);
    ctx.fill();

    // Windshield Sun Glare (Reflective diagonal highlight)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.moveTo(glassStartX + glassLen * 0.8, glassY + 2);
    ctx.lineTo(glassStartX + glassLen * 0.95, glassY + 2);
    ctx.lineTo(glassStartX + glassLen * 0.75, glassY + glassW - 2);
    ctx.lineTo(glassStartX + glassLen * 0.6, glassY + glassW - 2);
    ctx.closePath();
    ctx.fill();

    // 6. FRONT HEADLIGHTS (Bright Xenon/Yellow LED Lamps with Glow Halos)
    ctx.fillStyle = '#fef08a';
    // Top front lamp
    ctx.beginPath();
    ctx.roundRect(hx + length - 3, hy + 2, 4, width * 0.22, 2);
    ctx.fill();
    // Bottom front lamp
    ctx.beginPath();
    ctx.roundRect(hx + length - 3, hy + width - width * 0.22 - 2, 4, width * 0.22, 2);
    ctx.fill();

    // Headlight Halo Glow
    ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.beginPath();
    ctx.arc(hx + length - 1, hy + 2 + (width * 0.22) / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx + length - 1, hy + width - (width * 0.22) / 2 - 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Front Grille Accent (Chrome / Dark)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(hx + length - 2, hy + width * 0.32, 2, width * 0.36);

    // Front Arrow Direction Indicator on Hood (Clearly marks forward direction)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    const arrowX = hx + length - 10;
    ctx.moveTo(arrowX, -4);
    ctx.lineTo(arrowX + 5, 0);
    ctx.lineTo(arrowX, 4);
    ctx.closePath();
    ctx.fill();

    // 7. REAR TAIL LIGHTS (Deep Crimson Red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(hx - 1, hy + 2, 3, width * 0.2);
    ctx.fillRect(hx - 1, hy + width - width * 0.2 - 2, 3, width * 0.2);

    ctx.restore();
  }

  drawParticles(ctx, particles) {
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      ctx.fillStyle = p.color;

      if (p.shape === 'spark') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'star') {
        this.drawStar(ctx, 0, 0, 4, p.size, p.size / 2);
      } else if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        // Smoke / circle
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  lightenColor(col, percent) {
    return this.adjustColor(col, percent);
  }

  darkenColor(col, percent) {
    return this.adjustColor(col, -percent);
  }

  adjustColor(color, percent) {
    let num = parseInt(color.replace('#', ''), 16);
    if (isNaN(num)) return color;
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00ff) + amt;
    let G = (num & 0x0000ff) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
