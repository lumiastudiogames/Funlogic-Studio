// High Fidelity 2.5D Canvas Renderer for Metro Subway Train Yard
import { YardEngine, ActiveTrain, ActiveCar } from './engine';
import { METRO_COLORS, TrackSwitchDef, DangerZone, DangerZoneSeverity } from './types';

export class YardRenderer {
  private ctx: CanvasRenderingContext2D;
  private engine: YardEngine;
  public showHintRoutes: boolean = false;
  private frameCount: number = 0;

  constructor(ctx: CanvasRenderingContext2D, engine: YardEngine) {
    this.ctx = ctx;
    this.engine = engine;
  }

  public setEngine(engine: YardEngine) {
    this.engine = engine;
  }

  public render() {
    this.frameCount++;
    const ctx = this.ctx;
    const { width, height } = this.engine;

    ctx.clearRect(0, 0, width, height);

    // 1. Depot Ballast & Yard Ground
    this.renderGround(ctx, width, height);

    // 2. Sleepers / Ties & Track Beds
    this.renderTrackBeds(ctx);

    // 3. Switch Turnout Curves & Connections
    this.renderSwitchTurnouts(ctx);

    // 4. Rails & Third Rail
    this.renderRails(ctx);

    // 5. Danger Ground Zones (Underneath tracks and switches)
    this.renderDangerZones(ctx);

    // 6. Switches (Blades & LED Directional Indicators)
    this.renderSwitches(ctx);

    // 7. Hint Route Overlays (if active)
    if (this.showHintRoutes) {
      this.renderHintRoutes(ctx);
    }

    // 8. Tunnel Portals & Station Entrances
    this.renderTunnels(ctx);

    // 9. Trains & Multi-Car Rolling Stock
    this.renderTrains(ctx);

    // 10. Tactical Danger Alert Badges & Threat Beams
    this.renderDangerAlertOverlays(ctx);

    // 11. Particle Effects (Sparks, Smoke, Confetti)
    this.renderParticles(ctx);
  }

  private renderGround(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Underground station terminal base gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.35, '#0f172a');
    bgGrad.addColorStop(0.7, '#0b1120');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subway station wall ceramic tile grid pattern
    const tileW = 28;
    const tileH = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += tileH) {
      const rowOffset = (Math.floor(y / tileH) % 2 === 0) ? 0 : tileW / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      for (let x = -tileW + rowOffset; x < width; x += tileW) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + tileH);
        ctx.stroke();
      }
    }

    // 3. Station Ceramic Frieze Banner along the top
    ctx.save();
    const bannerH = 22;
    const bannerGrad = ctx.createLinearGradient(0, 0, width, 0);
    bannerGrad.addColorStop(0, 'rgba(30, 58, 138, 0.45)');
    bannerGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.55)');
    bannerGrad.addColorStop(1, 'rgba(30, 58, 138, 0.45)');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(0, 2, width, bannerH);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 2, width, bannerH);

    // Station Name Sign
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 9px "Outfit", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('METRO CENTRAL TERMINAL  •  PLATFORMS 1 - 4  •  DISPATCH CONTROL', width / 2, 16);
    ctx.restore();

    // 4. Overhead Industrial Arched Steel Roof Girders
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.12)';
    ctx.lineWidth = 3;
    for (let gx = 60; gx < width; gx += 130) {
      ctx.beginPath();
      ctx.moveTo(gx - 20, 0);
      ctx.lineTo(gx, 28);
      ctx.lineTo(gx + 20, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderTrackBeds(ctx: CanvasRenderingContext2D) {
    const { width, tracksY } = this.engine;

    tracksY.forEach((y, idx) => {
      // 1. Concrete Platform Slab above the track
      const platformY = y - 32;
      const platformH = 14;
      if (platformY > 20) {
        // Platform concrete deck
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, platformY, width, platformH);

        // Tactile safety yellow warning strip along platform edge
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, platformY + platformH - 3, width, 3);

        // Tactile studs on yellow strip
        ctx.fillStyle = '#ca8a04';
        for (let sx = 8; sx < width; sx += 12) {
          ctx.fillRect(sx, platformY + platformH - 2.5, 3, 2);
        }

        // Warning stenciled text on platform
        if (width > 420) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.font = 'bold 7px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('STAND BEHIND YELLOW LINE', 140, platformY + 9);
        }
      }

      // 2. Ballast gravel strip for track bed
      const ballastGrad = ctx.createLinearGradient(0, y - 18, 0, y + 18);
      ballastGrad.addColorStop(0, '#1e293b');
      ballastGrad.addColorStop(0.5, '#0f172a');
      ballastGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = ballastGrad;
      ctx.fillRect(0, y - 18, width, 36);

      // Ballast stone texture speckles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let bx = 12; bx < width - 60; bx += 22) {
        ctx.fillRect(bx + (idx * 5) % 11, y - 14, 2, 2);
        ctx.fillRect(bx + ((idx * 7) % 13), y + 12, 2, 2);
      }

      // 3. Sleepers / Wooden cross-ties
      const tieSpacing = 16;
      for (let x = 10; x < width - 70; x += tieSpacing) {
        // Dark 3D sleeper
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y - 15, 6, 30);
        // Sleeper highlight
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y - 15, 6, 2);
      }

      // 4. Station Column / Pillar at regular intervals
      const pillarX = 75 + (idx % 2) * 50;
      if (pillarX < width - 100) {
        ctx.save();
        // Pillar shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(pillarX - 2, y - 36, 12, 22);
        // Pillar body
        ctx.fillStyle = '#475569';
        ctx.fillRect(pillarX, y - 36, 8, 20);
        // Rivet dots
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(pillarX + 2, y - 34, 2, 2);
        ctx.fillRect(pillarX + 2, y - 20, 2, 2);
        // Warm station sconce lamp glow
        const glow = ctx.createRadialGradient(pillarX + 4, y - 26, 2, pillarX + 4, y - 26, 18);
        glow.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pillarX + 4, y - 26, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Track Index Station Badge on the left
      ctx.save();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(8, y - 24, 52, 13, 3);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`LINE ${idx + 1}`, 14, y - 15);
      ctx.restore();
    });
  }

  private renderSwitchTurnouts(ctx: CanvasRenderingContext2D) {
    const { width, tracksY, switches } = this.engine;

    switches.forEach(sw => {
      const startX = width * sw.xNorm;
      const endX = width * (sw.xNorm + sw.lengthNorm);
      const yFrom = tracksY[sw.fromTrack];
      const yTo = tracksY[sw.toTrack];

      // Draw curved ties along the turnout
      const samples = 14;
      for (let i = 1; i < samples; i++) {
        const t = i / samples;
        const curX = startX + (endX - startX) * t;
        const smoothT = t * t * (3 - 2 * t);
        const curY = yFrom + (yTo - yFrom) * smoothT;

        const nextT = Math.min(1, t + 0.05);
        const nextX = startX + (endX - startX) * nextT;
        const nextY = yFrom + (yTo - yFrom) * (nextT * nextT * (3 - 2 * nextT));
        const angle = Math.atan2(nextY - curY, nextX - curX) + Math.PI / 2;

        ctx.save();
        ctx.translate(curX, curY);
        ctx.rotate(angle);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-3, -15, 6, 30);
        ctx.restore();
      }

      // Draw turnout curve rails
      const railOffsets = [-10, 10];
      railOffsets.forEach(offset => {
        ctx.beginPath();
        for (let i = 0; i <= 30; i++) {
          const t = i / 30;
          const curX = startX + (endX - startX) * t;
          const smoothT = t * t * (3 - 2 * t);
          const curY = yFrom + (yTo - yFrom) * smoothT + offset;
          if (i === 0) ctx.moveTo(curX, curY);
          else ctx.lineTo(curX, curY);
        }
        ctx.strokeStyle = sw.state === 'divert' ? '#94a3b8' : '#475569';
        ctx.lineWidth = sw.state === 'divert' ? 3.5 : 2;
        ctx.stroke();

        // Shiny steel reflection on top
        if (sw.state === 'divert') {
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
  }

  private renderRails(ctx: CanvasRenderingContext2D) {
    const { width, tracksY } = this.engine;
    const railOffsets = [-10, 10];

    tracksY.forEach(y => {
      railOffsets.forEach(offset => {
        const railY = y + offset;

        // Base rail shadow
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, railY + 1);
        ctx.lineTo(width - 40, railY + 1);
        ctx.stroke();

        // Steel rail
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, railY);
        ctx.lineTo(width - 40, railY);
        ctx.stroke();

        // Specular highlight on rail top
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, railY - 0.5);
        ctx.lineTo(width - 40, railY - 0.5);
        ctx.stroke();
      });

      // 3rd Rail (Electrified Power Rail) on bottom side
      const thirdRailY = y + 17;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, thirdRailY);
      ctx.lineTo(width - 60, thirdRailY);
      ctx.stroke();

      // Hazard yellow insulator supports
      for (let x = 40; x < width - 70; x += 80) {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x - 2, thirdRailY - 3, 5, 6);
      }
    });
  }

  private renderSwitches(ctx: CanvasRenderingContext2D) {
    const { width, tracksY, switches } = this.engine;

    switches.forEach(sw => {
      const swX = width * sw.xNorm;
      const yFrom = tracksY[sw.fromTrack];
      const yTo = tracksY[sw.toTrack];
      const isDiverting = sw.state === 'divert';
      const anim = sw.animProgress ?? (isDiverting ? 1 : 0);

      // 1. Moving Switch Blade Points
      const bladeEndX = swX + 24;
      const bladeEndY = yFrom + (yTo - yFrom) * 0.22 * anim;

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(swX - 4, yFrom);
      ctx.lineTo(bladeEndX, bladeEndY);
      ctx.stroke();

      // 2. Interactive Tactile Switch Target Base
      ctx.save();
      const indicatorY = yFrom + (yTo > yFrom ? -28 : 28);

      // Contact shadow for switch stand
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(swX, indicatorY + 2, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Switch Stand Box
      ctx.fillStyle = isDiverting ? '#0284c7' : '#334155';
      ctx.strokeStyle = isDiverting ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(swX - 22, indicatorY - 14, 44, 28, 8);
      ctx.fill();
      ctx.stroke();

      // Glowing LED Indicator Arrow inside switch badge
      ctx.fillStyle = isDiverting ? '#38bdf8' : '#22c55e';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const arrowSymbol = isDiverting ? (yTo > yFrom ? '↘' : '↗') : '➔';
      ctx.fillText(arrowSymbol, swX, indicatorY);

      // Pulse glow ring when active
      if (isDiverting) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(swX - 25, indicatorY - 17, 50, 34, 11);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  private renderTunnels(ctx: CanvasRenderingContext2D) {
    const { width, height, tracksY } = this.engine;
    const tunnelX = width * this.engine.TUNNEL_X_NORM;
    const tunnelW = width - tunnelX;

    this.engine.level.tunnels.forEach(t => {
      const y = tracksY[t.trackIndex];
      const colorScheme = METRO_COLORS[t.color] || METRO_COLORS.blue;
      const archH = 50;

      // 1. Dark Tunnel Abyss / Depth interior
      const abyssGrad = ctx.createRadialGradient(
        tunnelX + 25, y, 5,
        tunnelX + 25, y, 45
      );
      abyssGrad.addColorStop(0, '#000000');
      abyssGrad.addColorStop(0.7, '#020617');
      abyssGrad.addColorStop(1, '#090d16');

      ctx.fillStyle = abyssGrad;
      ctx.beginPath();
      ctx.roundRect(tunnelX, y - archH / 2, tunnelW + 10, archH, [18, 0, 0, 18]);
      ctx.fill();

      // 2. Masonry Arch Border & Heavy Portal Frame
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(tunnelX, y - archH / 2, tunnelW + 10, archH, [18, 0, 0, 18]);
      ctx.stroke();

      // 3. Neon Tunnel Halo in Metro Line Color
      ctx.strokeStyle = colorScheme.hex;
      ctx.lineWidth = 3;
      ctx.shadowColor = colorScheme.hex;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(tunnelX, y - archH / 2 + 1, tunnelW + 10, archH - 2, [16, 0, 0, 16]);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // 4. Line Badge Plate above / inside tunnel entrance
      ctx.fillStyle = colorScheme.darkHex;
      ctx.strokeStyle = colorScheme.lightHex;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tunnelX + 6, y - 11, 40, 22, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(colorScheme.badge, tunnelX + 26, y);
    });
  }

  private renderTrains(ctx: CanvasRenderingContext2D) {
    this.engine.trains.forEach(train => {
      if (train.state === 'ENTERED_TUNNEL') {
        // Fade out as it enters deeper into the tunnel
        const fade = Math.max(0, 1 - train.enteredTimer * 2);
        if (fade <= 0) return;
        ctx.globalAlpha = fade;
      }

      const colorScheme = METRO_COLORS[train.color] || METRO_COLORS.blue;

      // Draw couplers / accordion bellows between cars
      for (let i = 0; i < train.cars.length - 1; i++) {
        const c1 = train.cars[i];
        const c2 = train.cars[i + 1];
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.stroke();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.stroke();
      }

      // Draw each carriage from rear to front
      for (let i = train.cars.length - 1; i >= 0; i--) {
        const car = train.cars[i];
        const isHead = i === 0;
        const isTail = i === train.cars.length - 1;
        this.renderSingleCar(ctx, car, colorScheme, isHead, isTail, train.isMoving);
      }

      // Train Status Badge / Tap-to-Go floating icon if stopped
      if (train.state === 'STOPPED' && train.cars[0]) {
        this.renderTrainStopBadge(ctx, train.cars[0]);
      }

      ctx.globalAlpha = 1.0;
    });
  }

  private renderSingleCar(
    ctx: CanvasRenderingContext2D,
    car: ActiveCar,
    colorScheme: typeof METRO_COLORS['red'],
    isHead: boolean,
    isTail: boolean,
    isMoving: boolean
  ) {
    const carL = this.engine.CAR_LENGTH;
    const carW = this.engine.CAR_WIDTH;

    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);

    // 1. Contact shadow under car
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 3, carL / 2 + 3, carW / 2 + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Steel Bogie Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-carL * 0.35, -carW * 0.5 - 2, 10, 4);
    ctx.fillRect(-carL * 0.35, carW * 0.5 - 2, 10, 4);
    ctx.fillRect(carL * 0.35 - 10, -carW * 0.5 - 2, 10, 4);
    ctx.fillRect(carL * 0.35 - 10, carW * 0.5 - 2, 10, 4);

    // 3. Car Body 2.5D Shading
    const carGrad = ctx.createLinearGradient(0, -carW / 2, 0, carW / 2);
    carGrad.addColorStop(0, '#e2e8f0'); // roof highlight
    carGrad.addColorStop(0.35, '#94a3b8'); // steel body
    carGrad.addColorStop(0.65, colorScheme.hex); // Metro Line Color Band
    carGrad.addColorStop(1, colorScheme.darkHex); // lower undercarriage shadow

    ctx.fillStyle = carGrad;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;

    const cornerRadius = isHead ? [4, 10, 10, 4] : (isTail ? [10, 4, 4, 10] : 4);
    ctx.beginPath();
    ctx.roundRect(-carL / 2, -carW / 2, carL, carW, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // 4. Passenger Windows & Interior Warm Lighting
    const windowColor = '#fef08a';
    ctx.fillStyle = windowColor;
    const winW = 7;
    const winH = 4;

    [-12, 0, 12].forEach(wx => {
      // Top window
      ctx.fillRect(wx - winW / 2, -carW / 2 + 3, winW, winH);
      // Bottom window
      ctx.fillRect(wx - winW / 2, carW / 2 - 7, winW, winH);
    });

    // 5. Roof Details / AC & Pantograph
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-8, -3, 16, 6);

    // 6. Lead Engine Headlights & Windshield
    if (isHead) {
      // Windshield
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(carL / 2 - 7, -carW / 2 + 4, 5, carW - 8, 2);
      ctx.fill();

      // Glowing twin headlights projecting forward light cone
      if (isMoving) {
        ctx.save();
        const lightGrad = ctx.createRadialGradient(
          carL / 2 + 5, 0, 2,
          carL / 2 + 65, 0, 60
        );
        lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.moveTo(carL / 2, -carW / 2 + 2);
        ctx.lineTo(carL / 2 + 80, -carW);
        ctx.lineTo(carL / 2 + 80, carW);
        ctx.lineTo(carL / 2, carW / 2 - 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Headlight bulbs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(carL / 2 - 1, -6, 2, 0, Math.PI * 2);
      ctx.arc(carL / 2 - 1, 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Red Tail Lights if rear carriage
    if (isTail) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-carL / 2 + 2, -6, 1.8, 0, Math.PI * 2);
      ctx.arc(-carL / 2 + 2, 6, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderTrainStopBadge(ctx: CanvasRenderingContext2D, leadCar: ActiveCar) {
    ctx.save();
    const pulse = 1 + Math.sin(this.frameCount * 0.12) * 0.1;
    ctx.translate(leadCar.x, leadCar.y - 28);
    ctx.scale(pulse, pulse);

    ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-36, -11, 72, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 9px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAP TO START ▶', 0, 0);

    ctx.restore();
  }

  private renderHintRoutes(ctx: CanvasRenderingContext2D) {
    const { width, tracksY, switches, trains } = this.engine;
    ctx.save();

    trains.forEach(train => {
      if (train.state === 'ENTERED_TUNNEL') return;

      const colorScheme = METRO_COLORS[train.color] || METRO_COLORS.blue;
      ctx.strokeStyle = colorScheme.hex;
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -this.frameCount * 0.8;

      ctx.beginPath();
      const startX = train.headX;
      const startY = tracksY[train.currentTrack];
      ctx.moveTo(startX, startY);

      // Connect to target tunnel track
      const tunnel = this.engine.level.tunnels.find(t => t.color === train.color);
      if (tunnel) {
        const targetY = tracksY[tunnel.trackIndex];
        const tunnelX = width * this.engine.TUNNEL_X_NORM;

        // Draw direct trajectory suggestion
        ctx.bezierCurveTo(
          startX + (tunnelX - startX) * 0.4, startY,
          startX + (tunnelX - startX) * 0.6, targetY,
          tunnelX, targetY
        );
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  private renderDangerZones(ctx: CanvasRenderingContext2D) {
    const { dangerZones } = this.engine;
    if (!dangerZones || dangerZones.length === 0) return;

    ctx.save();

    dangerZones.forEach(zone => {
      const isCritical = zone.severity === 'DANGER';
      const mainColor = isCritical ? '#ef4444' : '#f59e0b';
      const pulseSpeed = isCritical ? 0.25 : 0.15;
      const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * pulseSpeed);
      const radius = 32 + pulse * 8;

      // 1. Ground Hazard Glow & Radial Beacon
      const glowGrad = ctx.createRadialGradient(zone.x, zone.y, 2, zone.x, zone.y, radius * 1.5);
      glowGrad.addColorStop(0, isCritical ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.35)');
      glowGrad.addColorStop(0.6, isCritical ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Animated Expanding Radar Ripple Wave
      const wavePhase = (this.frameCount * 0.04) % 1;
      const waveRadius = 15 + wavePhase * 35;
      ctx.strokeStyle = isCritical ? `rgba(239, 68, 68, ${0.8 * (1 - wavePhase)})` : `rgba(245, 158, 11, ${0.8 * (1 - wavePhase)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, waveRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Hazard Diamond / Octagon Perimeter
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = isCritical ? 2.5 : 1.5;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -this.frameCount * 1.2;

      ctx.beginPath();
      ctx.rect(zone.x - radius, zone.y - 18, radius * 2, 36);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Diagonal Hazard Warning Stripes on the track
      ctx.save();
      ctx.beginPath();
      ctx.rect(zone.x - radius, zone.y - 18, radius * 2, 36);
      ctx.clip();

      ctx.strokeStyle = isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 4;
      const stripeOffset = (this.frameCount * 1.5) % 20;
      for (let sx = zone.x - radius * 2 + stripeOffset; sx < zone.x + radius * 2; sx += 14) {
        ctx.beginPath();
        ctx.moveTo(sx, zone.y - 25);
        ctx.lineTo(sx + 20, zone.y + 25);
        ctx.stroke();
      }
      ctx.restore();
    });

    ctx.restore();
  }

  private renderDangerAlertOverlays(ctx: CanvasRenderingContext2D) {
    const { dangerZones, trains } = this.engine;
    if (!dangerZones || dangerZones.length === 0) return;

    ctx.save();

    dangerZones.forEach(zone => {
      const isCritical = zone.severity === 'DANGER';
      const mainColor = isCritical ? '#ef4444' : '#f59e0b';
      const pulseSpeed = isCritical ? 0.25 : 0.15;
      const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * pulseSpeed);

      // 1. Draw Laser Threat Vectors to Approaching Trains
      zone.trainsInvolved.forEach(tId => {
        const train = trains.find(t => t.id === tId);
        if (train && train.cars.length > 0 && train.state !== 'ENTERED_TUNNEL' && train.state !== 'CRASHED') {
          const leadCar = train.cars[0];

          // Laser line from lead car to danger intersection
          ctx.strokeStyle = isCritical ? 'rgba(239, 68, 68, 0.75)' : 'rgba(245, 158, 11, 0.65)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -this.frameCount * 2;

          ctx.beginPath();
          ctx.moveTo(leadCar.x, leadCar.y);
          ctx.lineTo(zone.x, zone.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Lock-on Target Crosshair around approaching train lead car
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 1.8;
          const reticleSize = 18 + pulse * 4;
          ctx.beginPath();
          ctx.arc(leadCar.x, leadCar.y, reticleSize, 0, Math.PI * 2);
          ctx.stroke();

          // Reticle ticks
          ctx.beginPath();
          ctx.moveTo(leadCar.x - reticleSize - 4, leadCar.y);
          ctx.lineTo(leadCar.x - reticleSize + 4, leadCar.y);
          ctx.moveTo(leadCar.x + reticleSize - 4, leadCar.y);
          ctx.lineTo(leadCar.x + reticleSize + 4, leadCar.y);
          ctx.moveTo(leadCar.x, leadCar.y - reticleSize - 4);
          ctx.lineTo(leadCar.x, leadCar.y - reticleSize + 4);
          ctx.moveTo(leadCar.x, leadCar.y + reticleSize - 4);
          ctx.lineTo(leadCar.x, leadCar.y + reticleSize + 4);
          ctx.stroke();
        }
      });

      // 2. Tactical Floating Warning Pill
      const badgeY = Math.max(24, zone.y - 34);
      const badgeW = Math.min(136, this.engine.width * 0.42);
      const badgeH = 24;
      const badgeX = Math.max(badgeW / 2 + 6, Math.min(this.engine.width - badgeW / 2 - 6, zone.x));

      ctx.save();
      // Drop shadow / glow
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = isCritical ? 10 : 5;

      // Pill Background
      ctx.fillStyle = isCritical ? '#7f1d1d' : '#78350f';
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Flashing Alert Icon & Indicator
      const alertIcon = isCritical ? '⚠️' : '⚡';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(alertIcon, badgeX - badgeW / 2 + 6, badgeY);

      // Alert Title & Impact Countdown
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'left';
      const text = isCritical ? `CRASH IN ${zone.timeToImpact.toFixed(1)}s!` : `RISK: ${zone.timeToImpact.toFixed(1)}s`;
      ctx.fillText(text, badgeX - badgeW / 2 + 24, badgeY);

      // Tactical Corner Brackets framing the danger zone
      const bracketSpan = 38;
      const bracketH = 22;
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2;

      // Left bracket [
      ctx.beginPath();
      ctx.moveTo(zone.x - bracketSpan + 6, zone.y - bracketH);
      ctx.lineTo(zone.x - bracketSpan, zone.y - bracketH);
      ctx.lineTo(zone.x - bracketSpan, zone.y + bracketH);
      ctx.lineTo(zone.x - bracketSpan + 6, zone.y + bracketH);
      ctx.stroke();

      // Right bracket ]
      ctx.beginPath();
      ctx.moveTo(zone.x + bracketSpan - 6, zone.y - bracketH);
      ctx.lineTo(zone.x + bracketSpan, zone.y - bracketH);
      ctx.lineTo(zone.x + bracketSpan, zone.y + bracketH);
      ctx.lineTo(zone.x + bracketSpan - 6, zone.y + bracketH);
      ctx.stroke();

      // 3. Urgent Action Hint text if critical (< 1.5s)
      if (zone.timeToImpact < 1.6) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TAP TRAIN OR SWITCH!', zone.x, badgeY + 20);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    this.engine.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.type === 'confetti') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 1.5);
      } else if (p.type === 'fire') {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sparks / Smoke
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }
}
