// Data types and interfaces for Metro Subway Train Yard

export type MetroLineColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan';

export interface ColorScheme {
  id: MetroLineColor;
  name: string;
  badge: string;
  hex: string;
  darkHex: string;
  lightHex: string;
  glowHex: string;
}

export const METRO_COLORS: Record<MetroLineColor, ColorScheme> = {
  red: {
    id: 'red',
    name: 'Red Line',
    badge: 'M1',
    hex: '#ef4444',
    darkHex: '#991b1b',
    lightHex: '#fca5a5',
    glowHex: 'rgba(239, 68, 68, 0.4)'
  },
  blue: {
    id: 'blue',
    name: 'Blue Line',
    badge: 'M2',
    hex: '#3b82f6',
    darkHex: '#1e40af',
    lightHex: '#93c5fd',
    glowHex: 'rgba(59, 130, 246, 0.4)'
  },
  green: {
    id: 'green',
    name: 'Green Line',
    badge: 'M3',
    hex: '#10b981',
    darkHex: '#065f46',
    lightHex: '#6ee7b7',
    glowHex: 'rgba(16, 185, 129, 0.4)'
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow Line',
    badge: 'M4',
    hex: '#eab308',
    darkHex: '#854d0e',
    lightHex: '#fde047',
    glowHex: 'rgba(234, 179, 8, 0.4)'
  },
  purple: {
    id: 'purple',
    name: 'Purple Line',
    badge: 'M5',
    hex: '#a855f7',
    darkHex: '#6b21a8',
    lightHex: '#d8b4fe',
    glowHex: 'rgba(168, 85, 247, 0.4)'
  },
  orange: {
    id: 'orange',
    name: 'Orange Line',
    badge: 'M6',
    hex: '#f97316',
    darkHex: '#9a3412',
    lightHex: '#fdba74',
    glowHex: 'rgba(249, 115, 22, 0.4)'
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan Line',
    badge: 'M7',
    hex: '#06b6d4',
    darkHex: '#155e75',
    lightHex: '#67e8f9',
    glowHex: 'rgba(6, 182, 212, 0.4)'
  }
};

export type SwitchState = 'straight' | 'divert';

export interface TrackSwitchDef {
  id: string;
  fromTrack: number; // 0-indexed track index
  toTrack: number;   // destination track if diverted
  xNorm: number;     // Normalized horizontal position along track (0.1 to 0.8)
  lengthNorm: number;// Horizontal span of the switch crossover curve
  initialState: SwitchState;
  state: SwitchState;
  // Current animation progress for switch blade (0 = straight, 1 = divert)
  animProgress?: number;
}

export interface TunnelDef {
  trackIndex: number;
  color: MetroLineColor;
  label?: string;
}

export type TrainState = 'STOPPED' | 'MOVING' | 'DISPATCHED' | 'ENTERED_TUNNEL' | 'CRASHED';

export interface TrainCarPos {
  x: number;
  y: number;
  angle: number;
  trackIndex: number;
}

export interface TrainDef {
  id: string;
  color: MetroLineColor;
  carCount: number; // 2 to 4 cars
  startTrack: number;
  startXNorm: number; // initial normalized position (e.g. 0.08)
  speed?: number; // base speed
  isMoving?: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  trackCount: number; // 2 to 5 parallel tracks
  switches: TrackSwitchDef[];
  tunnels: TunnelDef[];
  trains: TrainDef[];
  targetTimeSec: number;
  hintDescription?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type?: 'spark' | 'smoke' | 'confetti' | 'fire';
}

export interface LevelSaveData {
  unlockedLevel: number;
  stars: Record<number, number>; // levelId -> stars (1, 2, 3)
  bestTimes: Record<number, number>; // levelId -> seconds
}

export type DangerZoneSeverity = 'SAFE' | 'WARNING' | 'DANGER';

export interface DangerZone {
  id: string;
  x: number;
  y: number;
  trackA: number;
  trackB: number;
  severity: DangerZoneSeverity;
  trainsInvolved: string[];
  timeToImpact: number;
  description: string;
  pulsePhase: number;
}
