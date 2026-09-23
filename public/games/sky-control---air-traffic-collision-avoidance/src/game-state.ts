import {
  AirspaceLevel,
  AltitudeLevel,
  GameSaveData,
  Particle,
  Plane,
  PlaneCategory,
  PlaneTypeConfig,
  SectorExit,
  Waypoint,
} from './types';
import { sound } from './audio';

export const PLANE_CONFIGS: Record<PlaneCategory, PlaneTypeConfig> = {
  airliner: {
    name: 'Boeing 777 Airliner',
    speed: 55,
    turnSpeed: 1.8,
    radius: 20,
    length: 44,
    wingspan: 42,
    color: '#38bdf8', // Sky blue
    accentColor: '#0284c7',
    canLand: true,
    scoreValue: 100,
  },
  concorde: {
    name: 'SST Concorde',
    speed: 85,
    turnSpeed: 1.4,
    radius: 19,
    length: 52,
    wingspan: 30,
    color: '#fbbf24', // Amber gold
    accentColor: '#d97706',
    canLand: true,
    scoreValue: 180,
  },
  cargo: {
    name: 'An-124 Heavy Cargo',
    speed: 40,
    turnSpeed: 1.2,
    radius: 24,
    length: 50,
    wingspan: 48,
    color: '#a855f7', // Purple
    accentColor: '#7e22ce',
    canLand: true,
    scoreValue: 140,
  },
  cessna: {
    name: 'Cessna 172 Skyhawk',
    speed: 48,
    turnSpeed: 2.4,
    radius: 16,
    length: 32,
    wingspan: 34,
    color: '#34d399', // Emerald
    accentColor: '#059669',
    canLand: true,
    scoreValue: 80,
  },
  helicopter: {
    name: 'Rescue Eurocopter',
    speed: 42,
    turnSpeed: 3.2,
    radius: 17,
    length: 34,
    wingspan: 28,
    color: '#f87171', // Red/Coral
    accentColor: '#dc2626',
    canLand: true,
    scoreValue: 120,
  },
};

const CALLSIGNS_PREFIX = ['AA', 'BA', 'DL', 'UA', 'LH', 'AF', 'KL', 'JL', 'EK', 'SK', 'TP', 'AZ'];

export const LEVELS: AirspaceLevel[] = [
  {
    id: 1,
    title: 'Sector 1: Coastal Approach',
    subtitle: 'Basic vectoring & collision avoidance',
    difficulty: 'Easy',
    description: 'Guide commercial flights across the sector or land on Runway 09. Keep separation and manage flight levels.',
    targetSafelyManaged: 6,
    spawnIntervalMin: 5.5,
    spawnIntervalMax: 7.5,
    maxSimultaneousPlanes: 3,
    allowedPlaneTypes: ['airliner', 'cessna'],
    runways: [
      { id: 'rw1', name: 'RWY 09', x: 0.5, y: 0.65, length: 240, heading: 0, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'VOR1', name: 'BAY', x: 0.3, y: 0.35, type: 'VOR' },
      { id: 'VOR2', name: 'OAK', x: 0.7, y: 0.35, type: 'VOR' },
    ],
  },
  {
    id: 2,
    title: 'Sector 2: Twin Corridors',
    subtitle: 'Altitude separation & crossing traffic',
    difficulty: 'Easy',
    description: 'Planes at different altitudes (FL100, FL200, FL300) can safely fly over each other without crashing!',
    targetSafelyManaged: 8,
    spawnIntervalMin: 4.5,
    spawnIntervalMax: 6.5,
    maxSimultaneousPlanes: 4,
    allowedPlaneTypes: ['airliner', 'cessna', 'cargo'],
    runways: [
      { id: 'rw1', name: 'RWY 27', x: 0.5, y: 0.7, length: 250, heading: Math.PI, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'NAV1', x: 0.25, y: 0.3, type: 'VOR' },
      { id: 'B2', name: 'NAV2', x: 0.75, y: 0.3, type: 'VOR' },
      { id: 'B3', name: 'CTR', x: 0.5, y: 0.45, type: 'WAYPOINT' },
    ],
  },
  {
    id: 3,
    title: 'Sector 3: Dual Runway Hub',
    subtitle: 'Parallel landings & cargo heavies',
    difficulty: 'Medium',
    description: 'Heavy cargo freighters turn slowly. Coordinate landings between North and South parallel runways.',
    targetSafelyManaged: 10,
    spawnIntervalMin: 4.0,
    spawnIntervalMax: 6.0,
    maxSimultaneousPlanes: 5,
    allowedPlaneTypes: ['airliner', 'cargo', 'cessna'],
    runways: [
      { id: 'rw1', name: 'RWY 09L', x: 0.5, y: 0.52, length: 240, heading: 0, type: 'paved', active: true },
      { id: 'rw2', name: 'RWY 09R', x: 0.5, y: 0.8, length: 240, heading: 0, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'ALP', x: 0.25, y: 0.25, type: 'VOR' },
      { id: 'B2', name: 'BET', x: 0.75, y: 0.25, type: 'VOR' },
    ],
  },
  {
    id: 4,
    title: 'Sector 4: Supersonic Express',
    subtitle: 'Fast concorde speeds & tight reactions',
    difficulty: 'Medium',
    description: 'Concorde SST aircraft cruise at high velocity. Plan turns early and utilize high altitude (FL300) bypass.',
    targetSafelyManaged: 12,
    spawnIntervalMin: 3.5,
    spawnIntervalMax: 5.5,
    maxSimultaneousPlanes: 5,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo'],
    runways: [
      { id: 'rw1', name: 'RWY 18', x: 0.5, y: 0.6, length: 260, heading: Math.PI / 2, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'FAST', x: 0.5, y: 0.2, type: 'VOR' },
      { id: 'B2', name: 'WPT1', x: 0.2, y: 0.5, type: 'WAYPOINT' },
      { id: 'B3', name: 'WPT2', x: 0.8, y: 0.5, type: 'WAYPOINT' },
    ],
  },
  {
    id: 5,
    title: 'Sector 5: Helipad Medevac',
    subtitle: 'Helicopter hover & fast agile landings',
    difficulty: 'Medium',
    description: 'Helicopters land directly on designated Helipads (H). Maintain clear landing sectors for incoming jets.',
    targetSafelyManaged: 14,
    spawnIntervalMin: 3.2,
    spawnIntervalMax: 5.0,
    maxSimultaneousPlanes: 6,
    allowedPlaneTypes: ['airliner', 'helicopter', 'cessna', 'cargo'],
    runways: [
      { id: 'rw1', name: 'RWY 27', x: 0.62, y: 0.7, length: 240, heading: Math.PI, type: 'paved', active: true },
      { id: 'h1', name: 'HELI-PAD', x: 0.25, y: 0.7, length: 80, heading: 0, type: 'helipad', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'HOSP', x: 0.25, y: 0.45, type: 'VOR' },
      { id: 'B2', name: 'CITY', x: 0.7, y: 0.35, type: 'VOR' },
    ],
  },
  {
    id: 6,
    title: 'Sector 6: Storm Front Turbulence',
    subtitle: 'Navigating active squall line cells',
    difficulty: 'Hard',
    description: 'Storm zones cause turbulence. Vector airplanes around red weather radar echoes while keeping separation.',
    targetSafelyManaged: 15,
    spawnIntervalMin: 3.0,
    spawnIntervalMax: 4.8,
    maxSimultaneousPlanes: 6,
    allowedPlaneTypes: ['airliner', 'concorde', 'cessna', 'cargo', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 09', x: 0.5, y: 0.75, length: 250, heading: 0, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'RADAR', x: 0.2, y: 0.25, type: 'VOR' },
      { id: 'B2', name: 'STORM', x: 0.8, y: 0.25, type: 'VOR' },
    ],
    stormZones: [
      { x: 0.5, y: 0.35, radius: 65 },
    ],
  },
  {
    id: 7,
    title: 'Sector 7: Crosswind X-Runways',
    subtitle: 'Intersecting runway operations',
    difficulty: 'Hard',
    description: 'Two intersecting runways require precise timing so planes on final approach never cross simultaneously.',
    targetSafelyManaged: 16,
    spawnIntervalMin: 2.8,
    spawnIntervalMax: 4.5,
    maxSimultaneousPlanes: 7,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 09', x: 0.5, y: 0.65, length: 250, heading: 0, type: 'paved', active: true },
      { id: 'rw2', name: 'RWY 18', x: 0.5, y: 0.65, length: 250, heading: Math.PI / 2, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'NORTH', x: 0.5, y: 0.18, type: 'VOR' },
      { id: 'B2', name: 'WEST', x: 0.15, y: 0.5, type: 'VOR' },
      { id: 'B3', name: 'EAST', x: 0.85, y: 0.5, type: 'VOR' },
    ],
  },
  {
    id: 8,
    title: 'Sector 8: Night Radar Matrix',
    subtitle: 'High density transit corridors',
    difficulty: 'Hard',
    description: 'Transit airspace with multiple exit corridors. Direct through-traffic to exit gates while managing arrivals.',
    targetSafelyManaged: 18,
    spawnIntervalMin: 2.5,
    spawnIntervalMax: 4.0,
    maxSimultaneousPlanes: 7,
    allowedPlaneTypes: ['airliner', 'concorde', 'cessna', 'cargo', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 27', x: 0.65, y: 0.75, length: 240, heading: Math.PI, type: 'paved', active: true },
      { id: 'h1', name: 'HELIPAD', x: 0.22, y: 0.75, length: 80, heading: 0, type: 'helipad', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'NEXUS', x: 0.35, y: 0.35, type: 'VOR' },
      { id: 'B2', name: 'POLAR', x: 0.65, y: 0.35, type: 'VOR' },
    ],
    stormZones: [
      { x: 0.5, y: 0.2, radius: 50 },
    ],
  },
  {
    id: 9,
    title: 'Sector 9: Mountain Ridge Pass',
    subtitle: 'Confined airspace & twin storms',
    difficulty: 'Hard',
    description: 'Restricted flight zones on both flanks. Keep all traffic within the central corridor using strict altitude layers.',
    targetSafelyManaged: 20,
    spawnIntervalMin: 2.4,
    spawnIntervalMax: 3.8,
    maxSimultaneousPlanes: 8,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 09', x: 0.5, y: 0.75, length: 260, heading: 0, type: 'paved', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'RIDGE', x: 0.5, y: 0.45, type: 'VOR' },
    ],
    stormZones: [
      { x: 0.2, y: 0.35, radius: 60 },
      { x: 0.8, y: 0.35, radius: 60 },
    ],
  },
  {
    id: 10,
    title: 'Sector 10: Quad Runway Terminal',
    subtitle: 'International Mega Hub',
    difficulty: 'Extreme',
    description: 'Heavy traffic volume from all cardinal directions. Continuous flow management and quick vector drawing required.',
    targetSafelyManaged: 22,
    spawnIntervalMin: 2.2,
    spawnIntervalMax: 3.5,
    maxSimultaneousPlanes: 8,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo', 'cessna', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 09L', x: 0.4, y: 0.58, length: 230, heading: 0, type: 'paved', active: true },
      { id: 'rw2', name: 'RWY 09R', x: 0.4, y: 0.82, length: 230, heading: 0, type: 'paved', active: true },
      { id: 'h1', name: 'H-PAD', x: 0.82, y: 0.7, length: 80, heading: 0, type: 'helipad', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'FIX-W', x: 0.2, y: 0.25, type: 'VOR' },
      { id: 'B2', name: 'FIX-E', x: 0.8, y: 0.25, type: 'VOR' },
    ],
  },
  {
    id: 11,
    title: 'Sector 11: Cyclone Vortex',
    subtitle: 'Dynamic weather & multiple crises',
    difficulty: 'Extreme',
    description: 'Large rotating storm cell in center. Rapid altitude reassignment is critical to prevent mid-air gridlock.',
    targetSafelyManaged: 25,
    spawnIntervalMin: 2.0,
    spawnIntervalMax: 3.2,
    maxSimultaneousPlanes: 9,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 27', x: 0.5, y: 0.8, length: 260, heading: Math.PI, type: 'paved', active: true },
      { id: 'h1', name: 'H-MED', x: 0.2, y: 0.8, length: 80, heading: 0, type: 'helipad', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'VORTEX', x: 0.5, y: 0.2, type: 'VOR' },
    ],
    stormZones: [
      { x: 0.5, y: 0.45, radius: 80 },
    ],
  },
  {
    id: 12,
    title: 'Sector 12: Grand Apex Metropolis',
    subtitle: 'The Ultimate Air Traffic Master',
    difficulty: 'Extreme',
    description: 'Maximum density airspace with Concorde, Freighters, Airliners, and Medevac copters. Zero margin for error.',
    targetSafelyManaged: 30,
    spawnIntervalMin: 1.8,
    spawnIntervalMax: 2.8,
    maxSimultaneousPlanes: 10,
    allowedPlaneTypes: ['airliner', 'concorde', 'cargo', 'cessna', 'helicopter'],
    runways: [
      { id: 'rw1', name: 'RWY 09', x: 0.35, y: 0.65, length: 230, heading: 0, type: 'paved', active: true },
      { id: 'rw2', name: 'RWY 27', x: 0.72, y: 0.65, length: 230, heading: Math.PI, type: 'paved', active: true },
      { id: 'h1', name: 'H-ROOF', x: 0.5, y: 0.86, length: 80, heading: 0, type: 'helipad', active: true },
    ],
    beacons: [
      { id: 'B1', name: 'APEX', x: 0.5, y: 0.3, type: 'VOR' },
      { id: 'B2', name: 'CORR1', x: 0.15, y: 0.4, type: 'WAYPOINT' },
      { id: 'B3', name: 'CORR2', x: 0.85, y: 0.4, type: 'WAYPOINT' },
    ],
    stormZones: [
      { x: 0.3, y: 0.2, radius: 45 },
      { x: 0.7, y: 0.2, radius: 45 },
    ],
  },
];

export class GameState {
  public planes: Plane[] = [];
  public particles: Particle[] = [];
  public currentLevelId: number = 1;
  public score: number = 0;
  public planesSafelyManaged: number = 0;
  public levelStartTime: number = 0;
  public spawnTimer: number = 0;
  public nextSpawnInterval: number = 4;
  public selectedPlaneId: string | null = null;
  public isDrawingPath: boolean = false;
  public activeDrawingPath: Waypoint[] = [];
  public isGameOver: boolean = false;
  public isLevelWon: boolean = false;
  public isPaused: boolean = false;
  public totalFlightHours: number = 0;
  public collisionsCount: number = 0;
  public lastIncidentDetails: { p1: string; p2: string; x: number; y: number } | null = null;
  public radarSweepAngle: number = 0;
  public emergencyRadarWaveTimer: number = 0;

  // Collision Animation & Screen FX
  public screenShake: number = 0;
  public flashAlpha: number = 0;
  public collisionSequenceTimer: number = 0;

  // Persistence
  public save: GameSaveData = {
    unlockedLevel: 1,
    highScores: {},
    stars: {},
    soundEnabled: true,
    totalPlanesRouted: 0,
  };

  private callsignCounter = 101;

  constructor() {
    this.loadSave();
  }

  public loadSave() {
    try {
      const stored = localStorage.getItem('sky_control_save');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.save = { ...this.save, ...parsed };
      }
    } catch {
      // ignore
    }
  }

  public writeSave() {
    try {
      localStorage.setItem('sky_control_save', JSON.stringify(this.save));
    } catch {
      // ignore
    }
  }

  public getCurrentLevel(): AirspaceLevel {
    return LEVELS.find((l) => l.id === this.currentLevelId) || LEVELS[0];
  }

  public startLevel(levelId: number) {
    this.currentLevelId = levelId;
    this.planes = [];
    this.particles = [];
    this.score = 0;
    this.planesSafelyManaged = 0;
    this.levelStartTime = Date.now();
    this.spawnTimer = 1.0;
    this.nextSpawnInterval = 2.0;
    this.selectedPlaneId = null;
    this.isDrawingPath = false;
    this.activeDrawingPath = [];
    this.isGameOver = false;
    this.isLevelWon = false;
    this.isPaused = false;
    this.lastIncidentDetails = null;
    this.emergencyRadarWaveTimer = 0;
    this.screenShake = 0;
    this.flashAlpha = 0;
    this.collisionSequenceTimer = 0;
  }

  public generateCallsign(): string {
    const pfx = CALLSIGNS_PREFIX[Math.floor(Math.random() * CALLSIGNS_PREFIX.length)];
    const num = this.callsignCounter++;
    return `${pfx}${num}`;
  }

  public spawnPlane(width: number, height: number) {
    const level = this.getCurrentLevel();
    if (this.planes.length >= level.maxSimultaneousPlanes) return;

    const type = level.allowedPlaneTypes[Math.floor(Math.random() * level.allowedPlaneTypes.length)];
    const config = PLANE_CONFIGS[type];

    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    let heading = 0;
    const margin = 20;

    if (side === 0) {
      x = margin + Math.random() * (width - margin * 2);
      y = -margin;
      heading = Math.PI / 2 + (Math.random() * 0.8 - 0.4);
    } else if (side === 1) {
      x = width + margin;
      y = margin + Math.random() * (height - margin * 2);
      heading = Math.PI + (Math.random() * 0.8 - 0.4);
    } else if (side === 2) {
      x = margin + Math.random() * (width - margin * 2);
      y = height + margin;
      heading = -Math.PI / 2 + (Math.random() * 0.8 - 0.4);
    } else {
      x = -margin;
      y = margin + Math.random() * (height - margin * 2);
      heading = 0 + (Math.random() * 0.8 - 0.4);
    }

    const altitude: AltitudeLevel = (Math.floor(Math.random() * 3) + 1) as AltitudeLevel;

    const plane: Plane = {
      id: 'plane_' + Math.random().toString(36).substring(2, 9),
      callsign: this.generateCallsign(),
      type,
      x,
      y,
      heading,
      targetHeading: heading,
      speed: config.speed,
      altitude,
      targetAltitude: altitude,
      altitudeProgress: 1,
      path: [],
      status: 'airborne',
      selected: false,
      warningLevel: 'none',
      warningTimer: 0,
      trail: [],
      timeInAir: 0,
      bankAngle: 0,
      opacity: 1,
      fireTimer: 0,
    };

    const targetX = width * 0.5 + (Math.random() * 100 - 50);
    const targetY = height * 0.5 + (Math.random() * 100 - 50);
    plane.targetHeading = Math.atan2(targetY - y, targetX - x);
    plane.heading = plane.targetHeading;

    this.planes.push(plane);
    sound.playRadioBlip();
  }

  public selectPlane(id: string | null) {
    this.selectedPlaneId = id;
    for (const p of this.planes) {
      p.selected = p.id === id;
    }
    if (id) {
      sound.playClick();
    }
  }

  public setPlaneAltitude(planeId: string, alt: AltitudeLevel) {
    const plane = this.planes.find((p) => p.id === planeId);
    if (plane && plane.altitude !== alt) {
      plane.targetAltitude = alt;
      sound.playRadioBlip();
    }
  }

  public turnPlaneRelative(planeId: string, angleDeltaRad: number) {
    const plane = this.planes.find((p) => p.id === planeId);
    if (plane) {
      plane.path = [];
      plane.targetHeading = (plane.targetHeading + angleDeltaRad + Math.PI * 4) % (Math.PI * 2);
      sound.playRadioBlip();
    }
  }

  public directPlaneToRunway(planeId: string, runwayId: string, width: number, height: number) {
    const plane = this.planes.find((p) => p.id === planeId);
    const level = this.getCurrentLevel();
    const runway = level.runways.find((r) => r.id === runwayId);
    if (!plane || !runway) return;

    const rX = runway.x * width;
    const rY = runway.y * height;

    const approachDist = 180;
    const approachAngle = runway.heading + Math.PI;
    const entryX = rX + Math.cos(approachAngle) * approachDist;
    const entryY = rY + Math.sin(approachAngle) * approachDist;
    const outerX = rX + Math.cos(approachAngle) * (approachDist * 1.6);
    const outerY = rY + Math.sin(approachAngle) * (approachDist * 1.6);

    plane.path = [
      { x: outerX, y: outerY },
      { x: entryX, y: entryY },
      { x: rX, y: rY },
    ];
    plane.targetRunwayId = runwayId;
    plane.targetAltitude = 1;
    sound.playRadioBlip();
  }

  public activateEmergencyClearance(width: number, height: number) {
    this.emergencyRadarWaveTimer = 3.0;
    sound.playRadarPing();

    for (let i = 0; i < this.planes.length; i++) {
      const p = this.planes[i];
      if (p.status === 'airborne') {
        p.warningLevel = 'none';
        const safeAlt = ((i % 3) + 1) as AltitudeLevel;
        p.targetAltitude = safeAlt;
        const cx = width / 2;
        const cy = height / 2;
        const awayAngle = Math.atan2(p.y - cy, p.x - cx);
        p.targetHeading = awayAngle;
        p.path = [];
      }
    }

    this.particles.push({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      color: '#38bdf8',
      radius: 20,
      alpha: 1,
      decay: 0.35,
      type: 'radar_wave',
    });
  }

  public update(dt: number, width: number, height: number): {
    hasCollision: boolean;
    hasWon: boolean;
    landedPlane: Plane | null;
    showGameOverModal: boolean;
  } {
    let showGameOverModal = false;

    // Decay Screen Shake & Impact Flash FX
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 14);
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.8);
    }

    // Handle Active Collision Sequence Timer
    if (this.isGameOver && this.collisionSequenceTimer > 0) {
      this.collisionSequenceTimer -= dt;
      if (this.collisionSequenceTimer <= 0) {
        showGameOverModal = true;
      }
    }

    if (this.isPaused) {
      return { hasCollision: false, hasWon: false, landedPlane: null, showGameOverModal: false };
    }

    const level = this.getCurrentLevel();
    let landedPlane: Plane | null = null;

    // Radar sweep
    this.radarSweepAngle = (this.radarSweepAngle + dt * 1.5) % (Math.PI * 2);

    if (this.emergencyRadarWaveTimer > 0) {
      this.emergencyRadarWaveTimer -= dt;
    }

    // Spawn logic (Only if game is actively running)
    if (!this.isGameOver && !this.isLevelWon) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnPlane(width, height);
        this.nextSpawnInterval =
          level.spawnIntervalMin + Math.random() * (level.spawnIntervalMax - level.spawnIntervalMin);
        this.spawnTimer = this.nextSpawnInterval;
      }
    }

    // Update Particles (Sparks, Debris, Fireball expansions, Smoke)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.alpha -= pt.decay * dt;

      // Friction / Drag on flying debris & sparks
      if (pt.type === 'debris' || pt.type === 'spark') {
        pt.vx *= 0.96;
        pt.vy *= 0.96;
      }

      // Rotation on debris
      if (pt.rotation !== undefined && pt.vRot !== undefined) {
        pt.rotation += pt.vRot * dt;
      }

      // Fireball / Shockwave Expansion
      if (pt.growthRate) {
        pt.radius += pt.growthRate * dt;
      }
      if (pt.type === 'radar_wave') {
        pt.radius += dt * 350;
      }

      // Spawn trailing dark smoke from hot debris
      if (pt.type === 'debris' && Math.random() < 0.35 && pt.alpha > 0.3) {
        this.particles.push({
          x: pt.x,
          y: pt.y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          color: '#475569',
          radius: 2 + Math.random() * 3,
          alpha: 0.6,
          decay: 0.8,
          growthRate: 8,
          type: 'smoke',
        });
      }

      if (pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Planes
    for (let i = this.planes.length - 1; i >= 0; i--) {
      const plane = this.planes[i];
      plane.timeInAir += dt;

      // Handle Planes in Collided / Crashing State
      if (plane.status === 'collided') {
        plane.fireTimer = (plane.fireTimer || 0) + dt;
        plane.heading += (plane.spinSpeed || 6) * dt; // Violent tumble spin
        plane.x += (plane.impactVx || 0) * dt;
        plane.y += (plane.impactVy || 0) * dt;
        plane.opacity = Math.max(0, (plane.opacity || 1) - dt * 0.45);

        // Continuous fiery smoke exhaust from burning aircraft
        if (Math.random() < 0.7) {
          const isFire = Math.random() < 0.6;
          this.particles.push({
            x: plane.x + (Math.random() - 0.5) * 10,
            y: plane.y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 30,
            color: isFire ? (Math.random() < 0.5 ? '#f97316' : '#fbbf24') : '#334155',
            radius: isFire ? 4 + Math.random() * 4 : 5 + Math.random() * 6,
            alpha: 0.9,
            decay: isFire ? 1.2 : 0.6,
            growthRate: 14,
            type: isFire ? 'fire' : 'smoke',
          });
        }

        if (plane.opacity <= 0.05) {
          this.planes.splice(i, 1);
        }
        continue;
      }

      // Normal Airborne Aircraft Physics
      if (plane.altitude !== plane.targetAltitude) {
        const dir = plane.targetAltitude > plane.altitude ? 1 : -1;
        plane.altitudeProgress += dir * dt * 0.8;
        if (dir > 0 && plane.altitudeProgress >= 1) {
          plane.altitude = (plane.altitude + 1) as AltitudeLevel;
          plane.altitudeProgress = 1;
        } else if (dir < 0 && plane.altitudeProgress <= 0) {
          plane.altitude = (plane.altitude - 1) as AltitudeLevel;
          plane.altitudeProgress = 1;
        }
      }

      if (plane.path.length > 0) {
        const nextWp = plane.path[0];
        const dx = nextWp.x - plane.x;
        const dy = nextWp.y - plane.y;
        const dist = Math.hypot(dx, dy);

        plane.targetHeading = Math.atan2(dy, dx);

        if (dist < 18) {
          plane.path.shift();
        }
      }

      let diff = plane.targetHeading - plane.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const config = PLANE_CONFIGS[plane.type];
      const maxTurn = config.turnSpeed * dt;

      if (Math.abs(diff) < maxTurn) {
        plane.heading = plane.targetHeading;
        plane.bankAngle *= 0.85;
      } else {
        const sign = Math.sign(diff);
        plane.heading += sign * maxTurn;
        plane.bankAngle = sign * 0.45;
      }

      plane.x += Math.cos(plane.heading) * plane.speed * dt;
      plane.y += Math.sin(plane.heading) * plane.speed * dt;

      if (Math.random() < 0.35) {
        plane.trail.push({ x: plane.x, y: plane.y, alpha: 0.6 });
      }
      for (let t = plane.trail.length - 1; t >= 0; t--) {
        plane.trail[t].alpha -= dt * 0.35;
        if (plane.trail[t].alpha <= 0) {
          plane.trail.splice(t, 1);
        }
      }

      // Check Runway Landings
      for (const runway of level.runways) {
        const rX = runway.x * width;
        const rY = runway.y * height;
        const distToRunway = Math.hypot(plane.x - rX, plane.y - rY);

        if (runway.type === 'helipad' && plane.type === 'helicopter') {
          if (distToRunway < 44 && plane.altitude === 1) {
            plane.status = 'landed';
            this.handleSafeClearance(plane, true);
            landedPlane = plane;
            this.planes.splice(i, 1);
            break;
          }
        } else if (runway.type === 'paved' && plane.type !== 'helicopter') {
          let angleDiff = Math.abs(plane.heading - runway.heading);
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          angleDiff = Math.abs(angleDiff);

          // Paved runway landing condition (within threshold touchdown zone & aligned)
          if (distToRunway < 56 && plane.altitude === 1 && angleDiff < 0.75) {
            plane.status = 'landed';
            this.handleSafeClearance(plane, true);
            landedPlane = plane;
            this.planes.splice(i, 1);
            break;
          }
        }
      }

      // Check Sector Boundary Exits
      const outMargin = 45;
      if (
        plane.x < -outMargin ||
        plane.x > width + outMargin ||
        plane.y < -outMargin ||
        plane.y > height + outMargin
      ) {
        if (plane.timeInAir > 4.0) {
          plane.status = 'exited';
          this.handleSafeClearance(plane, false);
          this.planes.splice(i, 1);
        }
      }
    }

    // Check Collisions & Proximity Warnings (TCAS) if not already game over
    let hasCollision = false;
    let anyCaution = false;
    let anyCritical = false;

    if (!this.isGameOver) {
      for (let i = 0; i < this.planes.length; i++) {
        this.planes[i].warningLevel = 'none';
      }

      for (let i = 0; i < this.planes.length; i++) {
        for (let j = i + 1; j < this.planes.length; j++) {
          const p1 = this.planes[i];
          const p2 = this.planes[j];

          if (p1.status !== 'airborne' || p2.status !== 'airborne') continue;

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const altDiff = Math.abs(p1.altitude - p2.altitude);

          if (altDiff === 0) {
            if (dist < 28) {
              // CRASH / MID-AIR COLLISION TRIGGERED!
              this.triggerMidAirCollision(p1, p2);
              hasCollision = true;
              break;
            } else if (dist < 55) {
              p1.warningLevel = 'critical';
              p2.warningLevel = 'critical';
              anyCritical = true;
            } else if (dist < 95) {
              if (p1.warningLevel !== 'critical') p1.warningLevel = 'caution';
              if (p2.warningLevel !== 'critical') p2.warningLevel = 'caution';
              anyCaution = true;
            }
          } else if (altDiff === 1) {
            if (dist < 40) {
              if (p1.warningLevel === 'none') p1.warningLevel = 'caution';
              if (p2.warningLevel === 'none') p2.warningLevel = 'caution';
            }
          }
        }
        if (hasCollision) break;
      }

      if (anyCritical) {
        sound.playCollisionWarning();
      } else if (anyCaution && Math.random() < 0.1) {
        sound.playWarningCaution();
      }
    }

    // Check Win Condition
    let hasWon = false;
    if (this.planesSafelyManaged >= level.targetSafelyManaged && !this.isGameOver) {
      this.isLevelWon = true;
      hasWon = true;
      sound.playLevelWin();
      this.handleLevelCompleted();
    }

    return { hasCollision, hasWon, landedPlane, showGameOverModal };
  }

  private triggerMidAirCollision(p1: Plane, p2: Plane) {
    this.isGameOver = true;
    this.collisionSequenceTimer = 2.4; // 2.4s of spectacular cinematic explosion
    this.screenShake = 18; // Strong camera rumble
    this.flashAlpha = 0.9; // Blinding explosion flash
    this.collisionsCount++;

    p1.status = 'collided';
    p2.status = 'collided';
    p1.opacity = 1.0;
    p2.opacity = 1.0;
    p1.fireTimer = 0;
    p2.fireTimer = 0;

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    this.lastIncidentDetails = { p1: p1.callsign, p2: p2.callsign, x: midX, y: midY };

    // Deflection impact velocities
    const angleP1 = Math.atan2(p1.y - midY, p1.x - midX);
    const angleP2 = Math.atan2(p2.y - midY, p2.x - midX);
    p1.impactVx = Math.cos(angleP1) * 70;
    p1.impactVy = Math.sin(angleP1) * 70;
    p1.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 8);

    p2.impactVx = Math.cos(angleP2) * 70;
    p2.impactVy = Math.sin(angleP2) * 70;
    p2.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 8);

    sound.playExplosion();

    // 1. Initial Epicenter Flash Ring
    this.particles.push({
      x: midX,
      y: midY,
      vx: 0,
      vy: 0,
      color: '#ffffff',
      radius: 12,
      alpha: 1,
      decay: 2.2,
      growthRate: 160,
      type: 'ring',
    });

    // 2. Secondary Expanding Fiery Shockwave
    this.particles.push({
      x: midX,
      y: midY,
      vx: 0,
      vy: 0,
      color: '#ef4444',
      radius: 8,
      alpha: 1,
      decay: 1.2,
      growthRate: 110,
      type: 'ring',
    });

    // 3. Multi-Phase Fireball Bloom Clouds (Layered White, Yellow, Orange, Red)
    for (let f = 0; f < 6; f++) {
      const angle = (Math.PI * 2 * f) / 6 + Math.random() * 0.4;
      const dist = 5 + Math.random() * 15;
      this.particles.push({
        x: midX + Math.cos(angle) * dist,
        y: midY + Math.sin(angle) * dist,
        vx: Math.cos(angle) * (20 + Math.random() * 30),
        vy: Math.sin(angle) * (20 + Math.random() * 30),
        color: f % 2 === 0 ? '#fbbf24' : '#f97316',
        radius: 14 + Math.random() * 10,
        alpha: 1,
        decay: 0.65 + Math.random() * 0.4,
        growthRate: 45 + Math.random() * 35,
        type: 'fireball',
      });
    }

    // 4. 80+ Ballistic Fiery Sparks and Embers
    for (let k = 0; k < 80; k++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 240;
      const colors = ['#ffffff', '#fef08a', '#fbbf24', '#f97316', '#ef4444'];
      this.particles.push({
        x: midX,
        y: midY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.7 + Math.random() * 1.0,
        type: 'spark',
      });
    }

    // 5. 16+ Tumbling Metallic Aircraft Debris Chunks (Wings, Engines, Fuselage panels)
    const debrisTypes: ('wing' | 'fuselage' | 'engine')[] = ['wing', 'fuselage', 'engine', 'wing'];
    for (let d = 0; d < 18; d++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 140;
      this.particles.push({
        x: midX,
        y: midY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: d % 2 === 0 ? '#38bdf8' : '#e2e8f0',
        radius: 6,
        length: 12 + Math.random() * 16,
        width: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 14,
        alpha: 1,
        decay: 0.35 + Math.random() * 0.25,
        type: 'debris',
        debrisType: debrisTypes[d % debrisTypes.length],
      });
    }

    // 6. Ground Scorch / Impact Crater Mark
    this.particles.push({
      x: midX,
      y: midY,
      vx: 0,
      vy: 0,
      color: '#020617',
      radius: 42,
      alpha: 0.85,
      decay: 0.05,
      type: 'scorch',
    });
  }

  private handleSafeClearance(plane: Plane, isLanding: boolean) {
    const config = PLANE_CONFIGS[plane.type];
    const pts = isLanding ? config.scoreValue * 1.5 : config.scoreValue;
    this.score += Math.floor(pts);
    this.planesSafelyManaged++;
    this.save.totalPlanesRouted++;

    if (isLanding) {
      sound.playLandingSuccess();
      for (let k = 0; k < 12; k++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 10 + Math.random() * 35;
        this.particles.push({
          x: plane.x,
          y: plane.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: '#cbd5e1',
          radius: 2 + Math.random() * 3,
          alpha: 0.8,
          decay: 0.9,
          type: 'smoke',
        });
      }
    } else {
      sound.playRadioBlip();
    }
  }

  private handleLevelCompleted() {
    if (this.currentLevelId >= this.save.unlockedLevel) {
      this.save.unlockedLevel = Math.min(12, this.currentLevelId + 1);
    }
    const prevHigh = this.save.highScores[this.currentLevelId] || 0;
    if (this.score > prevHigh) {
      this.save.highScores[this.currentLevelId] = this.score;
    }
    this.save.stars[this.currentLevelId] = 3;
    this.writeSave();
  }
}
