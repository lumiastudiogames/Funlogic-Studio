import { GameState, PLANE_CONFIGS } from './game-state';
import { AltitudeLevel, Particle, Plane, Runway, Waypoint } from './types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private animTimer: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public render(state: GameState, width: number, height: number, dt: number) {
    this.animTimer += dt;
    const ctx = this.ctx;
    const level = state.getCurrentLevel();

    ctx.save();

    // Camera Screen Shake during Collision / Explosion
    if (state.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * state.screenShake * 2.2;
      const shakeY = (Math.random() - 0.5) * state.screenShake * 2.2;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Clear & Render Sector Background
    this.renderAirspaceBackground(ctx, width, height, state);

    // 2. Render Ground Scorch / Impact Craters
    this.renderScorchMarks(ctx, state);

    // 3. Render Storm / Turbulence Zones if any
    if (level.stormZones) {
      for (const storm of level.stormZones) {
        this.renderStormCell(ctx, storm.x * width, storm.y * height, storm.radius);
      }
    }

    // 4. Render Beacons & Navigational Fixes
    for (const beacon of level.beacons) {
      this.renderBeacon(ctx, beacon.x * width, beacon.y * height, beacon.name, beacon.type);
    }

    // 5. Render Runways and Approach Lights
    for (const runway of level.runways) {
      this.renderRunway(ctx, runway, width, height);
    }

    // 6. Render Active Flight Paths & Waypoints
    this.renderFlightPaths(ctx, state);

    // 7. Render Aircraft Altitude Contact Shadows (3D Depth)
    for (const plane of state.planes) {
      this.renderPlaneShadow(ctx, plane);
    }

    // 8. Render Contrails / Jet Vapor Trails
    for (const plane of state.planes) {
      this.renderPlaneTrails(ctx, plane);
    }

    // 9. Render Aircraft Bodies (2.5D Top-Down View & Crash Flames)
    for (const plane of state.planes) {
      this.renderPlaneBody(ctx, plane);
    }

    // 10. Render TCAS Proximity Warning Rings (only for airborne planes)
    for (const plane of state.planes) {
      if (plane.status === 'airborne') {
        this.renderTCASAlerts(ctx, plane);
      }
    }

    // 11. Render Flight Data Tags (HUD Callouts)
    for (const plane of state.planes) {
      if (plane.status === 'airborne') {
        this.renderFlightDataTag(ctx, plane, plane.id === state.selectedPlaneId);
      }
    }

    // 12. Render Interactive User Drawing Path
    if (state.isDrawingPath && state.activeDrawingPath.length > 0) {
      this.renderUserDrawing(ctx, state.activeDrawingPath);
    }

    // 13. Render Particles, Fireballs, Sparks & Debris
    this.renderParticles(ctx, state);

    // 14. Render Radar Sweep Overlay
    this.renderRadarSweep(ctx, width, height, state.radarSweepAngle);

    // 15. Emergency Clearance Radar Wave
    if (state.emergencyRadarWaveTimer > 0) {
      this.renderEmergencyWaveOverlay(ctx, width, height, state.emergencyRadarWaveTimer);
    }

    ctx.restore();

    // Full Screen Blinding Blast Flash on Collision
    if (state.flashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, state.flashAlpha * 0.95)})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  private renderAirspaceBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _state: GameState
  ) {
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      10,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Radar Concentric Distance Rings (Range Rings: 5NM, 10NM, 15NM)
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const maxDim = Math.max(width, height);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let r = 80; r < maxDim; r += 90) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.font = '9px monospace';
      ctx.fillText(`${Math.floor(r / 10)}NM`, cx + r + 3, cy - 3);
    }

    // Crosshair Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    ctx.restore();
  }

  private renderScorchMarks(ctx: CanvasRenderingContext2D, state: GameState) {
    ctx.save();
    for (const pt of state.particles) {
      if (pt.type === 'scorch') {
        const radGrad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, pt.radius);
        radGrad.addColorStop(0, `rgba(0, 0, 0, ${pt.alpha * 0.95})`);
        radGrad.addColorStop(0.5, `rgba(15, 23, 42, ${pt.alpha * 0.7})`);
        radGrad.addColorStop(0.8, `rgba(180, 83, 9, ${pt.alpha * 0.4})`); // glowing burnt edge
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private renderStormCell(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
    grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(0.8, 'rgba(16, 185, 129, 0.15)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ SQUALL LINE', x, y - radius + 12);

    ctx.restore();
  }

  private renderBeacon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    name: string,
    type: 'VOR' | 'NDB' | 'WAYPOINT'
  ) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    if (type === 'VOR') {
      ctx.strokeRect(x - 5, y - 5, 10, 10);
      ctx.strokeRect(x - 2, y - 2, 4, 4);
    } else if (type === 'WAYPOINT') {
      ctx.beginPath();
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x + 5, y + 4);
      ctx.lineTo(x - 5, y + 4);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`▲ ${name}`, x, y + 15);

    ctx.restore();
  }

  private renderRunway(
    ctx: CanvasRenderingContext2D,
    runway: Runway,
    width: number,
    height: number
  ) {
    const rx = runway.x * width;
    const ry = runway.y * height;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(runway.heading);

    if (runway.type === 'helipad') {
      const padRadius = 38;

      // Helipad Outer Safety Apron & Glow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, padRadius + 6, 0, Math.PI * 2);
      ctx.fill();

      // Textured Concrete / Asphalt Pad
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, padRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Yellow Outer Perimeter Ring
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, padRadius - 4, 0, Math.PI * 2);
      ctx.stroke();

      // White Inner Aiming Circle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, padRadius - 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Helipad Boundary Green/Amber Lights
      const beaconFlash = (Math.sin(this.animTimer * 6) + 1) * 0.5;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const lx = Math.cos(a) * (padRadius + 2);
        const ly = Math.sin(a) * (padRadius + 2);
        ctx.fillStyle = `rgba(248, 113, 113, ${0.4 + beaconFlash * 0.6})`;
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red/Coral Medical Cross Background Accent
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(-6, -20, 12, 40);
      ctx.fillRect(-20, -6, 40, 12);

      // Central Bold 'H' Marking
      ctx.fillStyle = '#f87171';
      ctx.font = '900 24px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', 0, 0);

      // Helipad Designation Tag
      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(runway.name, 0, padRadius + 18);
    } else {
      const len = runway.length;
      const wid = 44;

      // 1. Graded Shoulder / Apron Base
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(-len / 2 - 20, -wid / 2 - 8, len + 40, wid + 16);

      // 2. High-Friction Asphalt Surface
      const asphaltGrad = ctx.createLinearGradient(0, -wid / 2, 0, wid / 2);
      asphaltGrad.addColorStop(0, '#090d16');
      asphaltGrad.addColorStop(0.2, '#0f172a');
      asphaltGrad.addColorStop(0.8, '#0f172a');
      asphaltGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = asphaltGrad;
      ctx.fillRect(-len / 2, -wid / 2, len, wid);

      // Runway Perimeter Solid White Edge Lines
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-len / 2, -wid / 2, len, wid);

      // 3. Blast Pad Yellow Chevrons (Overrun stopway before threshold)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      for (let c = -len / 2 - 14; c < -len / 2; c += 6) {
        ctx.beginPath();
        ctx.moveTo(c - 4, -wid / 3);
        ctx.lineTo(c, 0);
        ctx.lineTo(c - 4, wid / 3);
        ctx.stroke();
      }

      // 4. Extended ILS Approach Light Bar & Sequenced Flashing "Rabbit" Strobes
      const approachPulse = (this.animTimer * 4) % 1;
      const rabbitIndex = Math.floor(approachPulse * 7);

      for (let i = 0; i < 8; i++) {
        const dist = 30 + i * 22;
        const lx = -len / 2 - dist;

        // Steady White / Amber Crossbars
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, -12);
        ctx.lineTo(lx, 12);
        ctx.stroke();

        // Sequenced Flashing Strobe (Lead-in Rabbit)
        const isRabbit = i === 7 - rabbitIndex;
        ctx.fillStyle = isRabbit ? '#ffffff' : 'rgba(52, 211, 153, 0.6)';
        ctx.beginPath();
        ctx.arc(lx, 0, isRabbit ? 4.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (isRabbit) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(lx, 0, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Green Runway Threshold Bar & REIL Strobes
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-len / 2 - 2, -wid / 2, 4, wid);
      // Threshold REIL side flashing lights
      const reilFlash = Math.sin(this.animTimer * 8) > 0.3;
      if (reilFlash) {
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(-len / 2, -wid / 2 - 4, 3.5, 0, Math.PI * 2);
        ctx.arc(-len / 2, wid / 2 + 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Threshold "Piano Keys" (12 Crisp White Striped Markings)
      ctx.fillStyle = '#f8fafc';
      const keyCount = 10;
      const keyHeight = 2.4;
      const keySpacing = (wid - 10) / keyCount;
      for (let k = 0; k < keyCount; k++) {
        const ky = -wid / 2 + 5 + k * keySpacing;
        ctx.fillRect(-len / 2 + 4, ky, 18, keyHeight);
        ctx.fillRect(len / 2 - 22, ky, 18, keyHeight);
      }

      // 7. Bold Runway Stenciled Designation (e.g. 09 / 27)
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(-len / 2 + 36, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(runway.name.replace('RWY ', ''), 0, 0);
      ctx.restore();

      // 8. Touchdown Zone Aiming Point Markers (Thick White Rectangular Bars)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-len / 2 + 65, -wid / 3, 24, 4);
      ctx.fillRect(-len / 2 + 65, wid / 3 - 4, 24, 4);
      // Secondary TDZ distance stripes
      ctx.fillRect(-len / 2 + 105, -wid / 4, 16, 2.5);
      ctx.fillRect(-len / 2 + 105, wid / 4 - 2.5, 16, 2.5);

      // 9. High-Intensity Dashed Centerline with Runway Lights
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 12]);
      ctx.beginPath();
      ctx.moveTo(-len / 2 + 48, 0);
      ctx.lineTo(len / 2 - 30, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Centerline embedded lights (White / Amber near end)
      for (let l = -len / 2 + 50; l < len / 2 - 30; l += 26) {
        const isEndPortion = l > len / 2 - 80;
        ctx.fillStyle = isEndPortion ? '#fbbf24' : '#f8fafc';
        ctx.beginPath();
        ctx.arc(l, 0, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 10. Red Runway End Overrun Bar
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(len / 2 - 2, -wid / 2, 4, wid);

      // Runway Edge Lights (Gleaming white studs along both sides)
      for (let ex = -len / 2; ex <= len / 2; ex += 22) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, -wid / 2, 1.5, 0, Math.PI * 2);
        ctx.arc(ex, wid / 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Runway Identifier Top Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`▲ ${runway.name}`, 0, -wid / 2 - 8);
    }

    ctx.restore();
  }

  private renderFlightPaths(ctx: CanvasRenderingContext2D, state: GameState) {
    for (const plane of state.planes) {
      if (plane.status === 'collided' || plane.path.length === 0) continue;

      const isSelected = plane.id === state.selectedPlaneId;
      ctx.save();

      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(plane.x, plane.y);
      for (const pt of plane.path) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Draw Waypoint Rings & Chevron direction
      for (let i = 0; i < plane.path.length; i++) {
        const wp = plane.path[i];
        ctx.fillStyle = isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.7)';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, isSelected ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();

        const prevX = i === 0 ? plane.x : plane.path[i - 1].x;
        const prevY = i === 0 ? plane.y : plane.path[i - 1].y;
        const midX = (prevX + wp.x) / 2;
        const midY = (prevY + wp.y) / 2;
        const segAngle = Math.atan2(wp.y - prevY, wp.x - prevX);

        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(segAngle);
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.lineTo(2, 0);
        ctx.lineTo(-4, 4);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  private renderPlaneShadow(ctx: CanvasRenderingContext2D, plane: Plane) {
    const alt = plane.altitude;
    const offset = alt === 1 ? 10 : alt === 2 ? 22 : 36;
    const shadowAlpha = (alt === 1 ? 0.38 : alt === 2 ? 0.24 : 0.12) * (plane.opacity || 1);
    const shadowScale = alt === 1 ? 0.95 : alt === 2 ? 1.05 : 1.15;

    const config = PLANE_CONFIGS[plane.type];

    ctx.save();
    ctx.translate(plane.x + offset * 0.7, plane.y + offset);
    ctx.rotate(plane.heading);
    ctx.scale(shadowScale, shadowScale);

    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, config.length * 0.48, config.wingspan * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderPlaneTrails(ctx: CanvasRenderingContext2D, plane: Plane) {
    if (plane.trail.length === 0) return;

    ctx.save();
    for (const t of plane.trail) {
      ctx.fillStyle =
        plane.type === 'concorde'
          ? `rgba(251, 191, 36, ${t.alpha * 0.5})`
          : `rgba(255, 255, 255, ${t.alpha * 0.35})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2 + (1 - t.alpha) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderPlaneBody(ctx: CanvasRenderingContext2D, plane: Plane) {
    const config = PLANE_CONFIGS[plane.type];
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.heading);

    if (plane.opacity !== undefined) {
      ctx.globalAlpha = Math.max(0, plane.opacity);
    }

    // Apply 3D Bank Angle roll transformation
    if (Math.abs(plane.bankAngle) > 0.05) {
      ctx.transform(1, 0, plane.bankAngle * 0.25, 1, 0, 0);
    }

    // If burning from collision, tint dark/charred and draw flame burst
    if (plane.status === 'collided') {
      const fireGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
      fireGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      fireGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.85)');
      fireGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.65)');
      fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    const bodyColor = plane.status === 'collided' ? '#1e293b' : config.color;
    const accentColor = plane.status === 'collided' ? '#0f172a' : config.accentColor;

    if (plane.type === 'helicopter') {
      // ===== RESCUE EUROCOPTER =====
      // 1. Searchlight beam (illuminating forward in night airspace)
      ctx.save();
      const beamGrad = ctx.createRadialGradient(28, 0, 2, 45, 0, 25);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(50, -16);
      ctx.lineTo(50, 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Tail Boom & Fenestron Shroud
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(-24, 0);
      ctx.stroke();

      // Horizontal Stabilizer Fins
      ctx.fillStyle = accentColor;
      ctx.fillRect(-18, -7, 3, 14);

      // Fenestron Enclosed Shrouded Tail Rotor
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-24, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Spinning Tail Fan
      const tailSpin = this.animTimer * 45;
      ctx.save();
      ctx.translate(-24, 0);
      ctx.rotate(tailSpin);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.moveTo(0, -4);
      ctx.lineTo(0, 4);
      ctx.stroke();
      ctx.restore();

      // 3. Main Cabin Fuselage (Streamlined Pod)
      const cabinGrad = ctx.createLinearGradient(0, -9, 0, 9);
      cabinGrad.addColorStop(0, '#ffffff');
      cabinGrad.addColorStop(0.3, bodyColor);
      cabinGrad.addColorStop(1, accentColor);
      ctx.fillStyle = cabinGrad;
      ctx.beginPath();
      ctx.ellipse(3, 0, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Red Medical Rescue Cross on Roof
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, -5, 4, 10);
      ctx.fillRect(-3, -2, 10, 4);

      // Panoramic Cockpit Glass Windshield
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(12, 0, 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(14, -1.5, 2, 0, Math.PI * 2);
      ctx.fill();

      // 4. Main Rotor Mast, Swashplate, & Motion Blur Disc
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.arc(3, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Rotor Outer Tip Ring Accent
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(3, 0, 21.5, 0, Math.PI * 2);
      ctx.stroke();

      // Articulated Rotor Blades (4-Bladed Propeller)
      const rotorAngle = this.animTimer * 32;
      ctx.save();
      ctx.translate(3, 0);
      ctx.rotate(rotorAngle);

      for (let b = 0; b < 4; b++) {
        ctx.rotate(Math.PI / 2);
        // Carbon fiber blade
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-1.5, 3, 3, 18);
        // High-vis yellow blade tip
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-1.5, 17, 3, 4);
      }

      // Center Swashplate Hub
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (plane.type === 'concorde') {
      // ===== SST CONCORDE (SUPERSONIC OGIVAL DELTA) =====
      // 1. Afterburner Reheat Thrust Flames (Twin Turbojet Olympus Exhauster)
      if (plane.status !== 'collided') {
        const flameLength = 12 + Math.sin(this.animTimer * 30) * 4;
        const flameGrad = ctx.createLinearGradient(-18, 0, -18 - flameLength, 0);
        flameGrad.addColorStop(0, '#60a5fa');
        flameGrad.addColorStop(0.3, '#f59e0b');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-17, -5);
        ctx.lineTo(-17 - flameLength, -3.5);
        ctx.lineTo(-17, -2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-17, 2);
        ctx.lineTo(-17 - flameLength, 3.5);
        ctx.lineTo(-17, 5);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Ogival Complex Compound-Delta Wings
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(10, 0); // Wing root strake
      ctx.quadraticCurveTo(0, -16, -16, -18); // Left wingtip
      ctx.lineTo(-20, -17);
      ctx.lineTo(-16, -6);
      ctx.lineTo(-24, 0); // Tail fin base
      ctx.lineTo(-16, 6);
      ctx.lineTo(-20, 17);
      ctx.quadraticCurveTo(0, 16, 10, 0); // Right wingtip
      ctx.closePath();
      ctx.fill();

      // Wing Camber Elevation Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(-14, -14);
      ctx.moveTo(0, 4);
      ctx.lineTo(-14, 14);
      ctx.stroke();

      // 3. Twin Engine Nacelle Boxes Underwing
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -6, 10, 3.5);
      ctx.fillRect(-16, 2.5, 10, 3.5);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(-16, -6, 10, 3.5);
      ctx.strokeRect(-16, 2.5, 10, 3.5);

      // 4. Slender Supersonic Fuselage (Cylindrical Needle)
      const concordeGrad = ctx.createLinearGradient(0, -4, 0, 4);
      concordeGrad.addColorStop(0, '#ffffff');
      concordeGrad.addColorStop(0.4, bodyColor);
      concordeGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = concordeGrad;
      ctx.beginPath();
      ctx.moveTo(28, 0); // Needle probe tip
      ctx.lineTo(20, -2.5);
      ctx.lineTo(-22, -3.5);
      ctx.lineTo(-26, 0);
      ctx.lineTo(-22, 3.5);
      ctx.lineTo(20, 2.5);
      ctx.closePath();
      ctx.fill();

      // Pitot Probe Needle
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();

      // Droop-Nose Supersonic Visor Windshield
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(18, -1.5);
      ctx.lineTo(22, 0);
      ctx.lineTo(18, 1.5);
      ctx.closePath();
      ctx.fill();

      // Tall Swept Tail Fin
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-26, 0);
      ctx.lineTo(-22, -1.5);
      ctx.closePath();
      ctx.fill();
    } else if (plane.type === 'cargo') {
      // ===== AN-124 HEAVY CARGO FREIGHTER =====
      // 1. Massive High-Set Swept Wings
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(4, -26);
      ctx.lineTo(-3, -26);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-3, 26);
      ctx.lineTo(4, 26);
      ctx.closePath();
      ctx.fill();

      // Wingtip Fairings
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -26.5, 5, 1.5);
      ctx.fillRect(-2, 25, 5, 1.5);

      // 2. Four Heavy Turbofan Engines with Spinning Fan Hubs
      const enginePositions = [-19, -11, 11, 19];
      for (const ey of enginePositions) {
        // Engine Pylon
        ctx.fillStyle = '#475569';
        ctx.fillRect(-2, ey > 0 ? ey - 2 : ey + 1, 6, 1.5);
        // Engine Nacelle Pod
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, ey - 2, 9, 4);
        // Front Intake Ring Highlight
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(8, ey - 2, 2, 4);
        // Jet Exhaust Heat Glow
        if (plane.status !== 'collided') {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.6)';
          ctx.fillRect(-2, ey - 1, 2, 2);
        }
      }

      // 3. Wide Heavy Cargo Fuselage with Sponson Pods
      const cargoGrad = ctx.createLinearGradient(0, -9, 0, 9);
      cargoGrad.addColorStop(0, '#ffffff');
      cargoGrad.addColorStop(0.35, bodyColor);
      cargoGrad.addColorStop(1, '#6b21a8');
      ctx.fillStyle = cargoGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Landing Gear Sponson Blisters (Sides of fuselage)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-6, -8.5, 14, 2);
      ctx.fillRect(-6, 6.5, 14, 2);

      // Cockpit Bubble & Nose Cargo Visor Seam Line
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(17, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(16, 0, 4, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Large T-Tail & Horizontal Tailplanes
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-24, -13);
      ctx.lineTo(-27, -13);
      ctx.lineTo(-25, 0);
      ctx.lineTo(-27, 13);
      ctx.lineTo(-24, 13);
      ctx.closePath();
      ctx.fill();
    } else if (plane.type === 'cessna') {
      // ===== CESSNA 172 SKYHAWK (LIGHT PROP) =====
      // 1. High-Wing Monoplane
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(3, -17);
      ctx.lineTo(7, -16);
      ctx.lineTo(4, 0);
      ctx.lineTo(7, 16);
      ctx.lineTo(3, 17);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Wing Struts (Underwing Support)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(3, -12);
      ctx.lineTo(0, -3);
      ctx.moveTo(3, 12);
      ctx.lineTo(0, 3);
      ctx.stroke();

      // 2. Compact Light Aircraft Fuselage
      const cessnaGrad = ctx.createLinearGradient(0, -4, 0, 4);
      cessnaGrad.addColorStop(0, '#ffffff');
      cessnaGrad.addColorStop(0.3, bodyColor);
      cessnaGrad.addColorStop(1, '#047857');
      ctx.fillStyle = cessnaGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Greenhouse Cockpit Canopy
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(3, -1.5, 2, 3);

      // Tailplane
      ctx.fillStyle = accentColor;
      ctx.fillRect(-15, -7, 3, 14);

      // 3. Front Spinning Propeller with Yellow Tip Motion Blur
      const propAngle = this.animTimer * 40;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(16, 0, 1.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(16, 0);
      ctx.rotate(propAngle);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-1, -7, 2, 2);
      ctx.fillRect(-1, 5, 2, 2);
      ctx.restore();

      // Propeller Spinner Cone
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(16, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // ===== BOEING 777 / AIRBUS A350 AIRLINER =====
      // 1. Swept Jet Wings with Blended Curved Wingtips (Sharklets)
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(4, -20);
      ctx.lineTo(1, -21); // Wingtip curve
      ctx.lineTo(-2, -20);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-2, 20);
      ctx.lineTo(1, 21);
      ctx.lineTo(4, 20);
      ctx.closePath();
      ctx.fill();

      // Wingtip Blended Winglets
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -22, 3, 2);
      ctx.fillRect(0, 20, 3, 2);

      // 2. Twin High-Bypass GE90 Turbofan Engines
      for (const ey of [-10, 10]) {
        // Engine Pylon Mount
        ctx.fillStyle = '#475569';
        ctx.fillRect(2, ey > 0 ? ey - 2 : ey + 1, 6, 1.5);
        // Engine Cowling Pod
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(3, ey - 2.5, 10, 5);
        // Front Intake Ring Metallic Highlight
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(11, ey - 2.5, 2.5, 5);
        // Engine Spinner Center
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(12, ey - 1, 2, 2);
        // Hot Core Exhaust Glow
        if (plane.status !== 'collided') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.fillRect(1, ey - 1, 2, 2);
        }
      }

      // 3. Streamlined 3D Cylindrical Fuselage
      const fuselageGrad = ctx.createLinearGradient(0, -6, 0, 6);
      fuselageGrad.addColorStop(0, '#ffffff');
      fuselageGrad.addColorStop(0.3, bodyColor);
      fuselageGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = fuselageGrad;
      ctx.beginPath();
      ctx.ellipse(2, 0, 22, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Airline Livery Body Stripe
      ctx.fillStyle = accentColor;
      ctx.fillRect(-10, -1, 22, 2);

      // Passenger Window Rows (Dotted lines along fuselage)
      ctx.fillStyle = '#0f172a';
      for (let w = -8; w <= 12; w += 3) {
        ctx.fillRect(w, -3.2, 1.5, 1);
        ctx.fillRect(w, 2.2, 1.5, 1);
      }

      // Aerodynamic Cockpit Windshield (Multi-Pane Glass Canopy)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(17, -2.5);
      ctx.lineTo(21, 0);
      ctx.lineTo(17, 2.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(18, -1.5, 2, 1.2);
      ctx.fillRect(18, 0.3, 2, 1.2);

      // 4. Horizontal Stabilizers & Tail Fin
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(-20, -10);
      ctx.lineTo(-24, -10);
      ctx.lineTo(-21, 0);
      ctx.lineTo(-24, 10);
      ctx.lineTo(-20, 10);
      ctx.closePath();
      ctx.fill();

      // Vertical Stabilizer Dorsal Spine
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -0.8, 8, 1.6);
    }

    // ===== REAL-TIME AVIATION NAVIGATION & ANTI-COLLISION LIGHTING =====
    if (plane.status !== 'collided') {
      const strobeTimer = this.animTimer * 10;
      const wingStrobe = Math.sin(strobeTimer) > 0.6;
      const beaconFlash = Math.sin(strobeTimer * 0.7) > 0.4;

      // Steady Red Port Wing Light (Left)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -config.wingspan * 0.48, 2, 0, Math.PI * 2);
      ctx.fill();

      // Steady Green Starboard Wing Light (Right)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, config.wingspan * 0.48, 2, 0, Math.PI * 2);
      ctx.fill();

      // High-Intensity White Wingtip Strobes
      if (wingStrobe) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-2, -config.wingspan * 0.48, 3, 0, Math.PI * 2);
        ctx.arc(-2, config.wingspan * 0.48, 3, 0, Math.PI * 2);
        ctx.arc(-config.length * 0.45, 0, 2.5, 0, Math.PI * 2); // Tail white strobe
        ctx.fill();
      }

      // Red Anti-Collision Rotating Beacon (Top of Fuselage)
      if (beaconFlash) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private renderTCASAlerts(ctx: CanvasRenderingContext2D, plane: Plane) {
    if (plane.warningLevel === 'none') return;

    const isCritical = plane.warningLevel === 'critical';
    ctx.save();

    const r = isCritical ? 26 : 45;
    const pulse = (Math.sin(this.animTimer * (isCritical ? 14 : 6)) + 1) * 0.5;
    const color = isCritical
      ? `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`
      : `rgba(245, 158, 11, ${0.3 + pulse * 0.4})`;

    ctx.strokeStyle = color;
    ctx.lineWidth = isCritical ? 2.5 : 1.5;
    ctx.setLineDash(isCritical ? [4, 4] : [8, 6]);

    ctx.beginPath();
    ctx.arc(plane.x, plane.y, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isCritical ? 'rgba(239, 68, 68, 0.85)' : 'rgba(245, 158, 11, 0.85)';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isCritical ? '⚠️ TRAFFIC CRITICAL' : 'CAUTION', plane.x, plane.y - r - 4);

    ctx.restore();
  }

  private renderFlightDataTag(
    ctx: CanvasRenderingContext2D,
    plane: Plane,
    isSelected: boolean
  ) {
    ctx.save();
    const tagX = plane.x + 24;
    const tagY = plane.y - 20;

    // Leader line
    ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plane.x + 8, plane.y - 8);
    ctx.lineTo(tagX - 4, tagY + 6);
    ctx.stroke();

    // Flight Data Tag Box
    const altName = `FL${plane.altitude}00`;
    const spdName = `${Math.floor(plane.speed * 4)}KT`;

    ctx.fillStyle = isSelected
      ? 'rgba(15, 23, 42, 0.95)'
      : plane.warningLevel === 'critical'
      ? 'rgba(239, 68, 68, 0.25)'
      : 'rgba(15, 23, 42, 0.75)';

    ctx.strokeStyle = isSelected
      ? '#38bdf8'
      : plane.warningLevel === 'critical'
      ? '#ef4444'
      : '#334155';
    ctx.lineWidth = 1;

    ctx.fillRect(tagX - 4, tagY - 12, 68, 26);
    ctx.strokeRect(tagX - 4, tagY - 12, 68, 26);

    ctx.fillStyle = isSelected ? '#38bdf8' : '#f8fafc';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(plane.callsign, tagX, tagY - 2);

    ctx.fillStyle =
      plane.altitude === 3 ? '#a855f7' : plane.altitude === 2 ? '#38bdf8' : '#34d399';
    ctx.font = '8px monospace';
    ctx.fillText(`${altName} ${spdName}`, tagX, tagY + 9);

    if (isSelected) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(plane.x, plane.y, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderUserDrawing(ctx: CanvasRenderingContext2D, path: Waypoint[]) {
    ctx.save();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    const tip = path[path.length - 1];
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
    ctx.moveTo(tip.x - 12, tip.y);
    ctx.lineTo(tip.x + 12, tip.y);
    ctx.moveTo(tip.x, tip.y - 12);
    ctx.lineTo(tip.x, tip.y + 12);
    ctx.stroke();

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D, state: GameState) {
    ctx.save();
    for (const pt of state.particles) {
      if (pt.type === 'scorch') {
        continue; // Rendered in renderScorchMarks
      }

      if (pt.type === 'fireball') {
        // Multi-tier volumetric fiery explosion cloud
        const alpha = Math.max(0, pt.alpha);
        const grad = ctx.createRadialGradient(pt.x, pt.y, pt.radius * 0.1, pt.x, pt.y, pt.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
        grad.addColorStop(0.3, `rgba(251, 191, 36, ${alpha * 0.9})`);
        grad.addColorStop(0.65, `rgba(239, 68, 68, ${alpha * 0.75})`);
        grad.addColorStop(0.9, `rgba(30, 41, 59, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.type === 'debris') {
        // Tumbling metallic aircraft wreckage part with rotation
        ctx.save();
        ctx.translate(pt.x, pt.y);
        if (pt.rotation !== undefined) {
          ctx.rotate(pt.rotation);
        }
        ctx.globalAlpha = Math.max(0, pt.alpha);

        const w = pt.width || 6;
        const l = pt.length || 14;

        if (pt.debrisType === 'wing') {
          // Sharp wing fragment
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#f97316'; // burning edge
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-l / 2, -w / 2);
          ctx.lineTo(l / 2, 0);
          ctx.lineTo(-l / 2, w / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (pt.debrisType === 'engine') {
          // Cylindrical engine chunk
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(-l / 3, -w / 2, (l * 2) / 3, w);
          ctx.fill();
          ctx.stroke();
        } else {
          // Fuselage jagged shard
          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-l / 2, -w / 2);
          ctx.lineTo(l / 2, -w / 4);
          ctx.lineTo(l / 3, w / 2);
          ctx.lineTo(-l / 2, w / 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      } else if (pt.type === 'ring') {
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 3 * pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pt.type === 'radar_wave') {
        ctx.strokeStyle = `rgba(56, 189, 248, ${pt.alpha * 0.6})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pt.type === 'spark') {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();

        // Spark motion trail
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x - pt.vx * 0.04, pt.y - pt.vy * 0.04);
        ctx.stroke();
      } else {
        // Smoke & Fire puffs
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private renderRadarSweep(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    angle: number
  ) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.hypot(width, height) / 2;

    const sweepGrad = ctx.createConicGradient(angle - 0.4, cx, cy);
    sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    sweepGrad.addColorStop(0.9, 'rgba(56, 189, 248, 0.08)');
    sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0.18)');

    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fill();

    // Leading sweep line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.stroke();

    ctx.restore();
  }

  private renderEmergencyWaveOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeLeft: number
  ) {
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${timeLeft * 0.05})`;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('📡 EMERGENCY RADAR CLEARANCE ACTIVE', width / 2, 40);

    ctx.restore();
  }
}
