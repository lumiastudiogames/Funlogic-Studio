export type AltitudeLevel = 1 | 2 | 3; // 1 = 10,000 ft (Low), 2 = 20,000 ft (Med), 3 = 30,000 ft (High)

export type PlaneCategory = 'airliner' | 'concorde' | 'cargo' | 'cessna' | 'helicopter';

export interface PlaneTypeConfig {
  name: string;
  speed: number; // Pixels per second
  turnSpeed: number; // Radian per second
  radius: number; // Hitbox radius
  length: number;
  wingspan: number;
  color: string;
  accentColor: string;
  canLand: boolean;
  scoreValue: number;
}

export interface Waypoint {
  x: number;
  y: number;
}

export interface Plane {
  id: string;
  callsign: string;
  type: PlaneCategory;
  x: number;
  y: number;
  heading: number; // Radians (0 is right, Math.PI/2 is down)
  targetHeading: number;
  speed: number;
  altitude: AltitudeLevel;
  targetAltitude: AltitudeLevel;
  altitudeProgress: number; // 0 to 1 transition
  path: Waypoint[];
  targetRunwayId?: string;
  status: 'airborne' | 'landing' | 'landed' | 'exited' | 'collided';
  assignedExitSector?: number;
  selected: boolean;
  warningLevel: 'none' | 'caution' | 'critical';
  warningTimer: number;
  trail: { x: number; y: number; alpha: number }[];
  timeInAir: number;
  bankAngle: number; // For 3D roll effect
  // Collision physics properties
  spinSpeed?: number;
  impactVx?: number;
  impactVy?: number;
  opacity?: number;
  fireTimer?: number;
}

export interface Runway {
  id: string;
  name: string;
  x: number;
  y: number;
  length: number;
  heading: number; // Orientation of landing approach
  type: 'paved' | 'helipad';
  active: boolean;
}

export interface Beacon {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'VOR' | 'NDB' | 'WAYPOINT';
}

export interface SectorExit {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface AirspaceLevel {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  description: string;
  targetSafelyManaged: number;
  spawnIntervalMin: number;
  spawnIntervalMax: number;
  maxSimultaneousPlanes: number;
  allowedPlaneTypes: PlaneCategory[];
  runways: Runway[];
  beacons: Beacon[];
  stormZones?: { x: number; y: number; radius: number }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  type?: 'smoke' | 'spark' | 'fire' | 'ring' | 'radar_wave' | 'debris' | 'fireball' | 'flash' | 'scorch';
  rotation?: number;
  vRot?: number;
  growthRate?: number;
  maxRadius?: number;
  debrisType?: 'wing' | 'fuselage' | 'engine';
  width?: number;
  length?: number;
}

export interface GameSaveData {
  unlockedLevel: number;
  highScores: Record<number, number>;
  stars: Record<number, number>;
  soundEnabled: boolean;
  totalPlanesRouted: number;
}
