// Physics and Simulation Engine for Metro Subway Train Yard
import { DangerZone, DangerZoneSeverity, LevelConfig, MetroLineColor, Particle, SwitchState, TrackSwitchDef, TrainCarPos } from './types';
import { audio } from './audio';

export interface ActiveCar {
  x: number;
  y: number;
  angle: number;
  trackIndex: number;
  isEngine: boolean;
}

export interface ActiveTrain {
  id: string;
  color: MetroLineColor;
  carCount: number;
  speed: number;
  baseSpeed: number;
  headX: number;       // in pixels
  currentTrack: number;// current track index of the lead car
  isMoving: boolean;
  state: 'STOPPED' | 'MOVING' | 'ENTERED_TUNNEL' | 'CRASHED';
  cars: ActiveCar[];
  pathHistory: { x: number; y: number; angle: number; trackIndex: number }[];
  targetTunnelTrack?: number;
  enteredTimer: number; // for tunnel fade animation
}

export interface SimulationResult {
  won: boolean;
  crashed: boolean;
  crashReason?: string;
  clearedTrains: number;
  totalTrains: number;
}

export class YardEngine {
  public level: LevelConfig;
  public width: number = 800;
  public height: number = 500;
  public tracksY: number[] = [];
  public switches: TrackSwitchDef[] = [];
  public trains: ActiveTrain[] = [];
  public particles: Particle[] = [];
  public dangerZones: DangerZone[] = [];
  public speedMultiplier: number = 1; // 1x or 2x
  public isPaused: boolean = false;
  public gameTime: number = 0; // in seconds
  public isCompleted: boolean = false;
  public isGameOver: boolean = false;
  public gameOverReason: string = '';
  public onWinCallback?: (timeSec: number) => void;
  public onCrashCallback?: (reason: string) => void;

  // Geometry Constants & Dynamic Sizing
  public CAR_LENGTH: number = 44;
  public CAR_WIDTH: number = 22;
  public CAR_GAP: number = 6;
  public CAR_SPACING: number = 50; // CAR_LENGTH + CAR_GAP
  public readonly TUNNEL_X_NORM = 0.88;
  public readonly START_X_OFFSET = 30;

  constructor(level: LevelConfig, width: number, height: number) {
    this.level = JSON.parse(JSON.stringify(level));
    this.width = width;
    this.height = height;
    this.updateDimensions();
    this.init();
  }

  public updateDimensions() {
    // Dynamic scale for mobile / small viewports
    const scale = Math.max(0.62, Math.min(1.15, this.width / 720));
    this.CAR_LENGTH = Math.round(44 * scale);
    this.CAR_WIDTH = Math.round(22 * scale);
    this.CAR_GAP = Math.max(4, Math.round(6 * scale));
    this.CAR_SPACING = this.CAR_LENGTH + this.CAR_GAP;
  }

  public init() {
    this.gameTime = 0;
    this.isCompleted = false;
    this.isGameOver = false;
    this.gameOverReason = '';
    this.particles = [];

    this.updateDimensions();
    this.recalculateTracks();

    // Deep copy switches with active anim progress
    this.switches = this.level.switches.map(sw => ({
      ...sw,
      state: sw.initialState,
      animProgress: sw.initialState === 'divert' ? 1 : 0
    }));

    // Initialize trains with screen-proportional speed
    this.trains = this.level.trains.map(t => {
      const startX = this.width * t.startXNorm;
      // Proportional speed ensures fair reaction time on both mobile and desktop (crosses in ~7-8s)
      const speed = (t.speed || 1.0) * (this.width * 0.135);
      const currentTrack = t.startTrack;

      const train: ActiveTrain = {
        id: t.id,
        color: t.color,
        carCount: t.carCount,
        speed: speed,
        baseSpeed: speed,
        headX: startX,
        currentTrack: currentTrack,
        isMoving: true, // Auto starts moving, can be paused by tapping
        state: 'MOVING',
        cars: [],
        pathHistory: [],
        enteredTimer: 0
      };

      // Pre-seed path history
      const y = this.tracksY[currentTrack] || this.height * 0.5;
      for (let x = startX - (t.carCount * this.CAR_SPACING + 100); x <= startX; x += 2) {
        train.pathHistory.push({ x, y, angle: 0, trackIndex: currentTrack });
      }

      this.updateTrainCars(train);
      return train;
    });
  }

  public recalculateTracks() {
    this.tracksY = [];
    const count = this.level.trackCount;
    if (count <= 0) return;

    // In portrait / tall mobile viewports, keep tracks comfortably grouped and vertically centered
    const maxTrackGap = Math.min(105, Math.max(46, this.width * 0.22));
    const totalDesiredTracksHeight = count > 1 ? (count - 1) * maxTrackGap : 0;
    
    // Top/bottom margins
    const availableH = this.height - 40;
    const actualGap = (totalDesiredTracksHeight <= availableH && availableH > 150)
      ? maxTrackGap
      : (count > 1 ? availableH / (count - 1) : 0);
    
    const startY = count > 1 
      ? Math.max(28, (this.height - (count - 1) * actualGap) / 2)
      : this.height / 2;

    for (let i = 0; i < count; i++) {
      this.tracksY.push(startY + i * actualGap);
    }
  }

  public resize(width: number, height: number) {
    if (width <= 0 || height <= 0) return;
    const scaleX = width / this.width;
    const scaleY = height / this.height;

    this.width = width;
    this.height = height;
    this.updateDimensions();
    this.recalculateTracks();

    // Update trains positions proportionally
    this.trains.forEach(train => {
      train.headX *= scaleX;
      train.pathHistory = train.pathHistory.map(p => ({
        x: p.x * scaleX,
        y: this.tracksY[p.trackIndex] || p.y * scaleY,
        angle: p.angle,
        trackIndex: p.trackIndex
      }));
      this.updateTrainCars(train);
    });
  }

  public toggleSwitch(switchId: string): boolean {
    const sw = this.switches.find(s => s.id === switchId);
    if (!sw || this.isGameOver || this.isCompleted) return false;

    sw.state = sw.state === 'straight' ? 'divert' : 'straight';
    audio.playSwitchToggle();

    // Spark particles at the switch frog / point
    const swX = this.width * sw.xNorm;
    const swY = this.tracksY[sw.fromTrack];
    this.spawnSparks(swX, swY, 12, '#38bdf8');

    return true;
  }

  public toggleTrainMovement(trainId: string): boolean {
    const train = this.trains.find(t => t.id === trainId);
    if (!train || train.state === 'ENTERED_TUNNEL' || train.state === 'CRASHED' || this.isGameOver) {
      return false;
    }

    if (train.isMoving) {
      train.isMoving = false;
      train.state = 'STOPPED';
      audio.playTrainBrake();
      // Spawn braking smoke/sparks
      if (train.cars.length > 0) {
        train.cars.forEach(car => {
          this.spawnBrakeSparks(car.x, car.y + this.CAR_WIDTH * 0.4);
        });
      }
    } else {
      train.isMoving = true;
      train.state = 'MOVING';
      audio.playTrainDispatch();
    }
    return true;
  }

  public setSpeedMultiplier(mult: number) {
    this.speedMultiplier = mult;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (paused) {
      audio.stopTrainHum();
    }
  }

  public update(dt: number) {
    if (this.isPaused || this.isGameOver || this.isCompleted) {
      this.updateParticles(dt);
      return;
    }

    const effectiveDt = dt * this.speedMultiplier;
    this.gameTime += effectiveDt;

    // Smooth switch blade animation
    this.switches.forEach(sw => {
      const target = sw.state === 'divert' ? 1 : 0;
      if (sw.animProgress === undefined) sw.animProgress = target;
      sw.animProgress += (target - sw.animProgress) * Math.min(1, effectiveDt * 14);
    });

    let movingCount = 0;

    // Advance trains
    this.trains.forEach(train => {
      if (train.state === 'ENTERED_TUNNEL') {
        train.enteredTimer += effectiveDt;
        return;
      }
      if (train.state === 'CRASHED' || !train.isMoving) {
        return;
      }

      movingCount++;
      const step = train.speed * effectiveDt;
      train.headX += step;

      // Compute track position and check switches
      const currentY = this.computeTrackYAtX(train.headX, train);
      const angle = this.computeTrackAngleAtX(train.headX, train);

      train.pathHistory.push({
        x: train.headX,
        y: currentY,
        angle: angle,
        trackIndex: train.currentTrack
      });

      // Keep path history bounded
      if (train.pathHistory.length > 1500) {
        train.pathHistory.splice(0, 500);
      }

      this.updateTrainCars(train);

      // Check tunnel entrance
      const tunnelX = this.width * this.TUNNEL_X_NORM;
      if (train.headX >= tunnelX) {
        this.checkTunnelArrival(train);
      }
    });

    audio.updateTrainHum(movingCount);

    // Collision Detection between trains
    this.checkCollisions();

    // Trajectory Projection & Danger Zone Evaluation
    this.updateDangerZones();

    // Check Win Condition
    this.checkWinCondition();

    // Update Particles
    this.updateParticles(dt);
  }

  private computeTrackYAtX(x: number, train: ActiveTrain): number {
    const xNorm = x / this.width;

    // Check if lead car is crossing any switch
    for (const sw of this.switches) {
      const startX = sw.xNorm;
      const endX = sw.xNorm + sw.lengthNorm;

      if (xNorm >= startX && xNorm <= endX) {
        if (train.currentTrack === sw.fromTrack && sw.state === 'divert') {
          const t = (xNorm - startX) / sw.lengthNorm;
          // Smooth S-curve (cubic hermite interpolation)
          const smoothT = t * t * (3 - 2 * t);
          const yFrom = this.tracksY[sw.fromTrack];
          const yTo = this.tracksY[sw.toTrack];
          return yFrom + (yTo - yFrom) * smoothT;
        }
      } else if (xNorm > endX && train.currentTrack === sw.fromTrack && sw.state === 'divert') {
        // Passed through switch, track index transferred
        train.currentTrack = sw.toTrack;
      }
    }

    return this.tracksY[train.currentTrack] || this.height * 0.5;
  }

  private computeTrackAngleAtX(x: number, train: ActiveTrain): number {
    const delta = 3;
    const y1 = this.computeTrackYAtX(x - delta, train);
    const y2 = this.computeTrackYAtX(x + delta, train);
    return Math.atan2(y2 - y1, delta * 2);
  }

  private updateTrainCars(train: ActiveTrain) {
    const cars: ActiveCar[] = [];
    const history = train.pathHistory;
    const historyLen = history.length;

    if (historyLen === 0) return;

    // Head car (Engine)
    const headPoint = history[historyLen - 1];
    cars.push({
      x: headPoint.x,
      y: headPoint.y,
      angle: headPoint.angle,
      trackIndex: headPoint.trackIndex,
      isEngine: true
    });

    // Trailing cars
    for (let c = 1; c < train.carCount; c++) {
      const targetDist = c * this.CAR_SPACING;
      const point = this.findPointAtDistanceBehind(history, targetDist);
      cars.push({
        x: point.x,
        y: point.y,
        angle: point.angle,
        trackIndex: point.trackIndex,
        isEngine: false
      });
    }

    train.cars = cars;
  }

  private findPointAtDistanceBehind(
    history: { x: number; y: number; angle: number; trackIndex: number }[],
    targetDist: number
  ): { x: number; y: number; angle: number; trackIndex: number } {
    if (history.length === 0) {
      return { x: 0, y: 0, angle: 0, trackIndex: 0 };
    }

    let accDist = 0;
    const lastIdx = history.length - 1;

    for (let i = lastIdx; i > 0; i--) {
      const p1 = history[i];
      const p2 = history[i - 1];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const segmentDist = Math.hypot(dx, dy);

      if (accDist + segmentDist >= targetDist) {
        const remaining = targetDist - accDist;
        const ratio = remaining / (segmentDist || 1);
        return {
          x: p1.x - dx * ratio,
          y: p1.y - dy * ratio,
          angle: p2.angle,
          trackIndex: p2.trackIndex
        };
      }
      accDist += segmentDist;
    }

    // Fallback if history isn't long enough: project backward from the earliest point
    const first = history[0];
    const remainingDist = targetDist - accDist;
    return {
      x: first.x - remainingDist * Math.cos(first.angle),
      y: first.y - remainingDist * Math.sin(first.angle),
      angle: first.angle,
      trackIndex: first.trackIndex
    };
  }

  private checkTunnelArrival(train: ActiveTrain) {
    if (train.state === 'ENTERED_TUNNEL') return;

    // Find the tunnel on the train's current track
    const tunnel = this.level.tunnels.find(t => t.trackIndex === train.currentTrack);

    if (tunnel && tunnel.color === train.color) {
      // Correct tunnel!
      train.state = 'ENTERED_TUNNEL';
      train.isMoving = false;
      audio.playTunnelArrival();

      // Confetti & victory sparkles at the portal
      const portalX = this.width * this.TUNNEL_X_NORM + 15;
      const portalY = this.tracksY[train.currentTrack];
      this.spawnCelebration(portalX, portalY, train.color);
    } else {
      // Wrong tunnel entered or no tunnel on this track!
      train.state = 'CRASHED';
      train.isMoving = false;
      this.isGameOver = true;
      this.gameOverReason = `Wrong Line! ${train.color.toUpperCase()} Train arrived at ${tunnel ? tunnel.color.toUpperCase() : 'UNKNOWN'} Tunnel.`;
      audio.playCollision();
      this.spawnCrashExplosion(train.cars[0]?.x || 0, train.cars[0]?.y || 0);

      if (this.onCrashCallback) {
        this.onCrashCallback(this.gameOverReason);
      }
    }
  }

  private checkCollisions() {
    if (this.isGameOver) return;

    const activeTrains = this.trains.filter(t => t.state !== 'ENTERED_TUNNEL');
    const collisionRadius = 26; // collision envelope between car centroids

    for (let i = 0; i < activeTrains.length; i++) {
      for (let j = i + 1; j < activeTrains.length; j++) {
        const trainA = activeTrains[i];
        const trainB = activeTrains[j];

        // Compare each car of trainA against each car of trainB
        for (const carA of trainA.cars) {
          for (const carB of trainB.cars) {
            const dist = Math.hypot(carA.x - carB.x, carA.y - carB.y);
            if (dist < collisionRadius) {
              // Collision occurred!
              trainA.state = 'CRASHED';
              trainB.state = 'CRASHED';
              trainA.isMoving = false;
              trainB.isMoving = false;
              this.isGameOver = true;
              this.gameOverReason = `Subway Collision between ${trainA.color.toUpperCase()} and ${trainB.color.toUpperCase()} trains!`;

              audio.playCollision();
              audio.stopTrainHum();

              const midX = (carA.x + carB.x) / 2;
              const midY = (carA.y + carB.y) / 2;
              this.spawnCrashExplosion(midX, midY);

              if (this.onCrashCallback) {
                this.onCrashCallback(this.gameOverReason);
              }
              return;
            }
          }
        }
      }
    }
  }

  private checkWinCondition() {
    if (this.isGameOver || this.isCompleted) return;

    const allEntered = this.trains.every(t => t.state === 'ENTERED_TUNNEL');
    if (allEntered && this.trains.length > 0) {
      this.isCompleted = true;
      audio.playVictory();
      audio.stopTrainHum();

      // Screen celebration fireworks
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.spawnCelebration(
            this.width * (0.3 + Math.random() * 0.5),
            this.height * (0.2 + Math.random() * 0.6),
            'yellow'
          );
        }, i * 180);
      }

      if (this.onWinCallback) {
        this.onWinCallback(Math.round(this.gameTime));
      }
    }
  }

  // Particle Generators
  public spawnSparks(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        alpha: 1,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.3,
        color,
        size: 2 + Math.random() * 3,
        type: 'spark'
      });
    }
  }

  public spawnBrakeSparks(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y,
        vx: (Math.random() - 0.5) * 50 - 20,
        vy: (Math.random() - 0.5) * 30 - 15,
        alpha: 1,
        life: 0,
        maxLife: 0.25 + Math.random() * 0.25,
        color: '#fbbf24',
        size: 1.5 + Math.random() * 2,
        type: 'spark'
      });
    }
  }

  public spawnCrashExplosion(x: number, y: number) {
    // Fireball particles
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 200;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? '#ef4444' : '#f59e0b',
        size: 4 + Math.random() * 6,
        type: 'fire'
      });
    }

    // Smoke plumes
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 70;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        alpha: 0.8,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.7,
        color: '#64748b',
        size: 6 + Math.random() * 12,
        type: 'smoke'
      });
    }
  }

  public spawnCelebration(x: number, y: number, colorKey: MetroLineColor) {
    const palette = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#f87171'];
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        alpha: 1,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.6,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 3 + Math.random() * 4,
        type: 'confetti'
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.type === 'smoke') {
        p.vy -= 15 * dt; // rise up
        p.size += 6 * dt; // expand
      } else if (p.type === 'confetti' || p.type === 'spark') {
        p.vy += 120 * dt; // gravity
      }

      p.alpha = 1 - (p.life / p.maxLife);
    }
  }

  // Trajectory simulation & Danger Zone Detection
  public updateDangerZones() {
    this.dangerZones = [];
    if (this.isGameOver || this.isCompleted) return;

    const activeTrains = this.trains.filter(t => t.state !== 'ENTERED_TUNNEL' && t.state !== 'CRASHED');
    if (activeTrains.length < 2) return;

    // Time steps to simulate forward (in seconds)
    const futureSteps = [0.2, 0.4, 0.6, 0.8, 1.0, 1.25, 1.5, 1.8, 2.1, 2.5, 3.0, 3.5];
    const collisionRadius = 48; // collision envelope between car centers

    interface ProjectedState {
      time: number;
      trainId: string;
      color: MetroLineColor;
      currentTrack: number;
      cars: { x: number; y: number }[];
    }

    const projections: Record<string, ProjectedState[]> = {};

    activeTrains.forEach(train => {
      projections[train.id] = [];
      const isMoving = train.isMoving;
      const speed = isMoving ? train.speed : 0;

      let simHeadX = train.headX;
      let simTrack = train.currentTrack;
      const simHistory = [...train.pathHistory];

      let lastT = 0;
      futureSteps.forEach(targetT => {
        const deltaT = targetT - lastT;
        lastT = targetT;

        if (speed > 0) {
          const subSteps = Math.max(1, Math.round(deltaT / 0.04));
          const dt = deltaT / subSteps;

          for (let s = 0; s < subSteps; s++) {
            simHeadX += speed * dt;
            const xNorm = simHeadX / this.width;

            let simY = this.tracksY[simTrack] || this.height * 0.5;
            for (const sw of this.switches) {
              const startX = sw.xNorm;
              const endX = sw.xNorm + sw.lengthNorm;

              if (xNorm >= startX && xNorm <= endX) {
                if (simTrack === sw.fromTrack && sw.state === 'divert') {
                  const t = (xNorm - startX) / sw.lengthNorm;
                  const smoothT = t * t * (3 - 2 * t);
                  const yFrom = this.tracksY[sw.fromTrack];
                  const yTo = this.tracksY[sw.toTrack];
                  simY = yFrom + (yTo - yFrom) * smoothT;
                }
              } else if (xNorm > endX && simTrack === sw.fromTrack && sw.state === 'divert') {
                simTrack = sw.toTrack;
              }
            }

            simHistory.push({
              x: simHeadX,
              y: simY,
              angle: 0,
              trackIndex: simTrack
            });
          }
        }

        // Calculate simulated cars
        const simCars: { x: number; y: number }[] = [];
        if (simHistory.length > 0) {
          const headPt = simHistory[simHistory.length - 1];
          simCars.push({ x: headPt.x, y: headPt.y });

          for (let c = 1; c < train.carCount; c++) {
            const targetDist = c * this.CAR_SPACING;
            const pt = this.findPointAtDistanceBehind(simHistory, targetDist);
            simCars.push({ x: pt.x, y: pt.y });
          }
        }

        projections[train.id].push({
          time: targetT,
          trainId: train.id,
          color: train.color,
          currentTrack: simTrack,
          cars: simCars
        });
      });
    });

    // Check pairs for prospective collision
    for (let i = 0; i < activeTrains.length; i++) {
      for (let j = i + 1; j < activeTrains.length; j++) {
        const trainA = activeTrains[i];
        const trainB = activeTrains[j];
        const projA = projections[trainA.id];
        const projB = projections[trainB.id];

        let impactTime: number | null = null;
        let impactX = 0;
        let impactY = 0;
        let trackA = trainA.currentTrack;
        let trackB = trainB.currentTrack;

        for (let s = 0; s < futureSteps.length; s++) {
          const stateA = projA[s];
          const stateB = projB[s];
          if (!stateA || !stateB) continue;

          let collided = false;
          for (const carA of stateA.cars) {
            for (const carB of stateB.cars) {
              const dist = Math.hypot(carA.x - carB.x, carA.y - carB.y);
              if (dist < collisionRadius) {
                collided = true;
                impactX = (carA.x + carB.x) / 2;
                impactY = (carA.y + carB.y) / 2;
                trackA = stateA.currentTrack;
                trackB = stateB.currentTrack;
                break;
              }
            }
            if (collided) break;
          }

          if (collided) {
            impactTime = stateA.time;
            break;
          }
        }

        if (impactTime !== null) {
          const severity: DangerZoneSeverity = impactTime <= 1.8 ? 'DANGER' : 'WARNING';
          this.dangerZones.push({
            id: `dz_${trainA.id}_${trainB.id}`,
            x: impactX,
            y: impactY,
            trackA,
            trackB,
            severity,
            trainsInvolved: [trainA.id, trainB.id],
            timeToImpact: impactTime,
            description: `${trainA.color.toUpperCase()} & ${trainB.color.toUpperCase()} in collision path`,
            pulsePhase: (this.gameTime * 6) % (Math.PI * 2)
          });
        }
      }
    }
  }

  // Hit-testing optimized for mobile fingers and touchscreens
  public getSwitchAt(x: number, y: number): TrackSwitchDef | null {
    // Generous touch hit radius based on screen density
    const hitRadius = Math.max(38, Math.min(52, this.width * 0.08));

    for (const sw of this.switches) {
      const swX = this.width * sw.xNorm;
      const yFrom = this.tracksY[sw.fromTrack];
      const yTo = this.tracksY[sw.toTrack];

      // 1. Direct hit at switch point / frog
      if (Math.hypot(x - swX, y - yFrom) < hitRadius) {
        return sw;
      }

      // 2. Hit on tactile LED indicator stand badge
      const indicatorY = yFrom + (yTo > yFrom ? -28 : 28);
      if (Math.hypot(x - swX, y - indicatorY) < hitRadius) {
        return sw;
      }

      // 3. Hit along the switch turnout entrance
      const midX = swX + (this.width * sw.lengthNorm) * 0.35;
      const midY = (yFrom + yTo) / 2;
      if (Math.hypot(x - midX, y - midY) < hitRadius * 0.9) {
        return sw;
      }
    }
    return null;
  }

  public getTrainAt(x: number, y: number): ActiveTrain | null {
    const hitRadius = Math.max(38, Math.min(54, this.width * 0.085));
    for (const train of this.trains) {
      if (train.state === 'ENTERED_TUNNEL' || train.state === 'CRASHED') continue;
      for (const car of train.cars) {
        if (Math.hypot(x - car.x, y - car.y) < hitRadius) {
          return train;
        }
      }
    }
    return null;
  }
}
