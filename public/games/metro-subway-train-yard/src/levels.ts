// 30 progressive levels for Metro Subway Train Yard
import { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  // --- ACT 1: DEPOT APPRENTICE (Levels 1 - 5) ---
  {
    id: 1,
    name: 'First Switch',
    subtitle: 'Depot Induction',
    difficulty: 'Easy',
    trackCount: 2,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.30, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'blue', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.0 }
    ],
    targetTimeSec: 25,
    hintDescription: 'Divert Red Train from Track 0 to Track 1 via Switch 1, and Blue Train from Track 1 to Track 0 via Switch 2. Tap a train to brake and avoid collisions!'
  },
  {
    id: 2,
    name: 'Parallel Cross',
    subtitle: 'Two-Way Turnout',
    difficulty: 'Easy',
    trackCount: 2,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.30, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 0, xNorm: 0.55, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'green', label: 'M3 Green' },
      { trackIndex: 1, color: 'yellow', label: 'M4 Yellow' }
    ],
    trains: [
      { id: 't1', color: 'green', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'yellow', carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1.0 }
    ],
    targetTimeSec: 25,
    hintDescription: 'Divert Yellow Train to Track 1 using Switch 1. Then divert Green Train to Track 0 using Switch 2.'
  },
  {
    id: 3,
    name: 'Three-Car Express',
    subtitle: 'Longer Rolling Stock',
    difficulty: 'Easy',
    trackCount: 2,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.40, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 1, color: 'orange', label: 'M6 Orange' }
    ],
    trains: [
      { id: 't1', color: 'orange', carCount: 3, startTrack: 0, startXNorm: 0.04, speed: 1.05 },
      { id: 't2', color: 'purple', carCount: 3, startTrack: 0, startXNorm: -0.32, speed: 1.0 }
    ],
    targetTimeSec: 30,
    hintDescription: 'The Orange Train comes first: divert it down. Once its 3 cars clear the switch, flip it back to straight for the Purple Train!'
  },
  {
    id: 4,
    name: 'Triple Platform',
    subtitle: 'Introduction to 3 Tracks',
    difficulty: 'Easy',
    trackCount: 3,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.32, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.56, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'green', carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'red', carCount: 2, startTrack: 0, startXNorm: -0.25, speed: 1.0 },
      { id: 't3', color: 'blue', carCount: 2, startTrack: 0, startXNorm: -0.55, speed: 1.0 }
    ],
    targetTimeSec: 35,
    hintDescription: 'Single line sequence: Green takes switch 1 then switch 2 to reach bottom. Red takes switch 1 only. Blue goes straight.'
  },
  {
    id: 5,
    name: 'Brake & Clearance',
    subtitle: 'Traffic Control',
    difficulty: 'Easy',
    trackCount: 3,
    switches: [
      { id: 'sw1', fromTrack: 1, toTrack: 0, xNorm: 0.35, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.35, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 2, color: 'blue', label: 'M2 Blue' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'blue', carCount: 3, startTrack: 1, startXNorm: -0.35, speed: 1.0 },
      { id: 't3', color: 'yellow', carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 0.9 }
    ],
    targetTimeSec: 35,
    hintDescription: 'Tap the Yellow train to pause it while Red crosses track 0 safely. Then release Yellow and steer Blue to track 2.'
  },

  // --- ACT 2: JUNCTION COORDINATOR (Levels 6 - 10) ---
  {
    id: 6,
    name: 'Scissor Crossing',
    subtitle: 'X-Junction Manifold',
    difficulty: 'Medium',
    trackCount: 3,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 0, xNorm: 0.55, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 1, toTrack: 2, xNorm: 0.55, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 1, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 2, color: 'cyan', label: 'M7 Cyan' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'cyan', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
      { id: 't3', color: 'orange', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 0.95 }
    ],
    targetTimeSec: 40,
    hintDescription: 'Dispatch Cyan first to track 2. Then divert Purple to track 1, and make sure Orange crosses to track 0.'
  },
  {
    id: 7,
    name: 'Four-Car Heavy Haul',
    subtitle: 'Length Management',
    difficulty: 'Medium',
    trackCount: 3,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.30, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 1, xNorm: 0.30, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 0, xNorm: 0.60, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'green', label: 'M3 Green' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' }
    ],
    trains: [
      { id: 't1', color: 'green', carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'red', carCount: 3, startTrack: 0, startXNorm: 0.04, speed: 1.0 },
      { id: 't3', color: 'yellow', carCount: 2, startTrack: 1, startXNorm: 0.04, speed: 1.1 }
    ],
    targetTimeSec: 45,
    hintDescription: 'A 4-car train takes longer to clear a switch. Tap to hold Green until Red has finished crossing track 1!'
  },
  {
    id: 8,
    name: 'Quad Yard Gate',
    subtitle: '4-Track Grid Entrance',
    difficulty: 'Medium',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 3, xNorm: 0.65, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.05 },
      { id: 't2', color: 'yellow', carCount: 3, startTrack: 0, startXNorm: -0.35, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 2, startTrack: 0, startXNorm: -0.70, speed: 1.0 },
      { id: 't4', color: 'blue', carCount: 2, startTrack: 0, startXNorm: -1.00, speed: 1.0 }
    ],
    targetTimeSec: 50,
    hintDescription: 'Staircase turnout: Purple steps down to track 3, Yellow steps to track 2, Red steps to track 1, Blue stays straight.'
  },
  {
    id: 9,
    name: 'Double Inversion',
    subtitle: 'Dual Reversible Tracks',
    difficulty: 'Medium',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.30, lengthNorm: 0.25, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 1, xNorm: 0.30, lengthNorm: 0.25, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 0, xNorm: 0.60, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 3, xNorm: 0.60, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'green', label: 'M3 Green' },
      { trackIndex: 1, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 2, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 3, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'orange', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'cyan', carCount: 2, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
      { id: 't4', color: 'red', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
    ],
    targetTimeSec: 50,
    hintDescription: 'Hold tracks 1 and 2 briefly while trains on 0 and 3 cross over, then route all 4 trains to their target tunnel lines.'
  },
  {
    id: 10,
    name: 'Rush Hour Squeeze',
    subtitle: 'High Frequency Shunting',
    difficulty: 'Medium',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 1, toTrack: 0, xNorm: 0.30, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 3, xNorm: 0.30, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 0, toTrack: 2, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 2, color: 'red', label: 'M1 Red' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
      { id: 't2', color: 'blue', carCount: 4, startTrack: 1, startXNorm: -0.42, speed: 0.95 },
      { id: 't3', color: 'green', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.0 }
    ],
    targetTimeSec: 45,
    hintDescription: 'Red goes straight to track 0 and then crosses to track 2. Blue follows behind straight to track 0.'
  },

  // --- ACT 3: YARD CHIEF (Levels 11 - 18) ---
  {
    id: 11,
    name: 'The Diamond Grid',
    subtitle: 'Interlocking Switches',
    difficulty: 'Medium',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 1, toTrack: 0, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 1, xNorm: 0.50, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 3, xNorm: 0.50, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'purple', carCount: 2, startTrack: 2, startXNorm: -0.32, speed: 1.1 }
    ],
    targetTimeSec: 45,
    hintDescription: 'Divert Red to Track 0. Divert Green to Track 3. Then bring Purple from Track 2 up to Track 1!'
  },
  {
    id: 12,
    name: 'Four-Car Congestion',
    subtitle: 'Heavy Articulation',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.28, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 2, xNorm: 0.28, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 2, xNorm: 0.58, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 3, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'blue', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'cyan', carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
      { id: 't3', color: 'orange', carCount: 3, startTrack: 1, startXNorm: 0.04, speed: 1.05 }
    ],
    targetTimeSec: 50,
    hintDescription: 'Hold the 4-car Blue train until Orange passes Track 1, then guide Blue down to Track 1 safely.'
  },
  {
    id: 13,
    name: 'Staggered Dispatch',
    subtitle: 'Timing is Everything',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.25, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 3, xNorm: 0.25, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'yellow', carCount: 2, startTrack: 0, startXNorm: -0.32, speed: 1.1 },
      { id: 't4', color: 'blue', carCount: 2, startTrack: 1, startXNorm: -0.32, speed: 1.1 }
    ],
    targetTimeSec: 55,
    hintDescription: 'Stagger your train starts: send Red across first to Track 2, then switch it back to Track 1.'
  },
  {
    id: 14,
    name: 'Full Pentad Depot',
    subtitle: '5-Track Yard Launch',
    difficulty: 'Hard',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.40, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 3, xNorm: 0.58, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 4, xNorm: 0.74, lengthNorm: 0.16, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'green', label: 'M3 Green' },
      { trackIndex: 3, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 4, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'yellow', carCount: 2, startTrack: 0, startXNorm: -0.30, speed: 1.0 },
      { id: 't3', color: 'green', carCount: 2, startTrack: 0, startXNorm: -0.55, speed: 1.0 },
      { id: 't4', color: 'blue', carCount: 3, startTrack: 0, startXNorm: -0.80, speed: 1.0 },
      { id: 't5', color: 'red', carCount: 2, startTrack: 0, startXNorm: -1.10, speed: 1.0 }
    ],
    targetTimeSec: 60,
    hintDescription: '5-train sequential sorting cascade! Step each train down to its respective target track as it passes each switch node.'
  },
  {
    id: 15,
    name: 'The Central Bypass',
    subtitle: 'Express Through-Line',
    difficulty: 'Hard',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 1, toTrack: 2, xNorm: 0.28, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 2, xNorm: 0.28, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 4, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 1, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 2, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 3, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 4, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'orange', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
      { id: 't3', color: 'blue', carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.9 }
    ],
    targetTimeSec: 50,
    hintDescription: 'Track 2 is the bottleneck! Let the Blue 4-car express go through, or funnel Orange and Green across the central spine.'
  },
  {
    id: 16,
    name: 'Dual Scissor Weave',
    subtitle: 'Weaving Lines',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 3, xNorm: 0.22, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 2, xNorm: 0.48, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 0, xNorm: 0.68, lengthNorm: 0.24, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 3, color: 'blue', label: 'M2 Blue' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'yellow', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
      { id: 't4', color: 'blue', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 0.95 }
    ],
    targetTimeSec: 55,
    hintDescription: 'Coordinate 4 trains simultaneously: Red stays on Track 1, Blue stays on Track 3, Purple weaves 0->1->2, Yellow weaves 2->3->0.'
  },
  {
    id: 17,
    name: 'Velocity Gradient',
    subtitle: 'Varying Train Speeds',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.30, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 1, xNorm: 0.30, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 3, xNorm: 0.60, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 1, color: 'green', label: 'M3 Green' },
      { trackIndex: 2, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 3, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1.3 }, // Fast
      { id: 't2', color: 'green', carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.8 }, // Heavy & Slow
      { id: 't3', color: 'cyan', carCount: 3, startTrack: 0, startXNorm: -0.32, speed: 1.0 }
    ],
    targetTimeSec: 45,
    hintDescription: 'The fast 2-car Red train can quickly slip past before the slow 4-car Green train reaches the midpoint.'
  },
  {
    id: 18,
    name: 'The Loop Shuttle',
    subtitle: 'Twin Crossover',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 3, xNorm: 0.24, lengthNorm: 0.28, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 0, xNorm: 0.24, lengthNorm: 0.28, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 2, xNorm: 0.58, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 2, color: 'red', label: 'M1 Red' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'green', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'blue', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
      { id: 't4', color: 'yellow', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
    ],
    targetTimeSec: 55,
    hintDescription: 'Top and bottom swap tracks using switches 1 and 2, while inner tracks 1 and 2 swap using switches 3 and 4.'
  },

  // --- ACT 4: MASTER DISPATCHER (Levels 19 - 25) ---
  {
    id: 19,
    name: 'Grand Junction Alpha',
    subtitle: '5-Track Interconnect',
    difficulty: 'Hard',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.20, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 4, toTrack: 2, xNorm: 0.20, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 1, xNorm: 0.50, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 3, xNorm: 0.50, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 3, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 4, color: 'yellow', label: 'M4 Yellow' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'blue', carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'purple', carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.9 },
      { id: 't4', color: 'yellow', carCount: 2, startTrack: 4, startXNorm: -0.32, speed: 1.1 }
    ],
    targetTimeSec: 60,
    hintDescription: 'Dispatch Purple straight through. Then route Red 0->2->1, Blue 4->2->3, and keep Yellow on 4.'
  },
  {
    id: 20,
    name: 'The Synchronized Quad',
    subtitle: 'Precision Arrival',
    difficulty: 'Hard',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 3, xNorm: 0.65, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 0, xNorm: 0.40, lengthNorm: 0.35, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'green', label: 'M3 Green' },
      { trackIndex: 1, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 2, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 3, color: 'cyan', label: 'M7 Cyan' }
    ],
    trains: [
      { id: 't1', color: 'cyan', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'orange', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
      { id: 't4', color: 'yellow', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
    ],
    targetTimeSec: 60,
    hintDescription: 'Green on Track 3 takes the long diagonal switch up to Track 0 while Cyan cascades down to Track 3.'
  },
  {
    id: 21,
    name: 'Five-Line Metronome',
    subtitle: 'Rhythm and Order',
    difficulty: 'Hard',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 4, toTrack: 3, xNorm: 0.22, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 2, toTrack: 0, xNorm: 0.70, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'red', label: 'M1 Red' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' },
      { trackIndex: 4, color: 'yellow', label: 'M4 Yellow' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'purple', carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'blue', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
      { id: 't4', color: 'green', carCount: 2, startTrack: 3, startXNorm: 0.05, speed: 1.1 },
      { id: 't5', color: 'yellow', carCount: 4, startTrack: 2, startXNorm: -0.32, speed: 0.9 }
    ],
    targetTimeSec: 65,
    hintDescription: 'Hold the central Yellow train until Purple and Red finish crossing the center switches.'
  },
  {
    id: 22,
    name: 'Chamber of Switches',
    subtitle: 'Multi-Branch Routing',
    difficulty: 'Hard',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 3, xNorm: 0.20, lengthNorm: 0.30, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 4, toTrack: 1, xNorm: 0.20, lengthNorm: 0.30, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 4, xNorm: 0.55, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 1, toTrack: 0, xNorm: 0.60, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 1, color: 'green', label: 'M3 Green' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 4, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'cyan', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'orange', carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.1 },
      { id: 't4', color: 'green', carCount: 4, startTrack: 4, startXNorm: -0.35, speed: 0.9 }
    ],
    targetTimeSec: 65,
    hintDescription: 'Long diagonals cross each other: tap Orange to wait 2 seconds while Cyan sweeps down to Track 3.'
  },
  {
    id: 23,
    name: 'Quad Car Ballet',
    subtitle: 'Multiple 4-Car Sets',
    difficulty: 'Expert',
    trackCount: 4,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 2, xNorm: 0.25, lengthNorm: 0.20, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 3, xNorm: 0.55, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 0, xNorm: 0.55, lengthNorm: 0.24, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'green', label: 'M3 Green' },
      { trackIndex: 3, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'red', carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
      { id: 't3', color: 'blue', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't4', color: 'green', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.0 }
    ],
    targetTimeSec: 65,
    hintDescription: 'Two 4-car trains cross each other in the middle. Brake Purple or Red to allow clean non-colliding passage.'
  },
  {
    id: 24,
    name: 'The Central Vortex',
    subtitle: 'Interchange Knot',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 1, toTrack: 0, xNorm: 0.22, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 3, toTrack: 4, xNorm: 0.22, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 1, xNorm: 0.44, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 3, xNorm: 0.44, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 0, toTrack: 2, xNorm: 0.68, lengthNorm: 0.20, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 1, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 2, color: 'red', label: 'M1 Red' },
      { trackIndex: 3, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 4, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'yellow', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't4', color: 'cyan', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.1 },
      { id: 't5', color: 'blue', carCount: 2, startTrack: 2, startXNorm: -0.32, speed: 1.1 }
    ],
    targetTimeSec: 70,
    hintDescription: 'Yellow diverts to Track 0, Green diverts to Track 4. Red on 0 takes Switch 5 into Track 2.'
  },
  {
    id: 25,
    name: 'Precision Dispatch 25',
    subtitle: 'Quarter Century Milestone',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.20, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 4, toTrack: 2, xNorm: 0.20, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 3, xNorm: 0.50, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 1, xNorm: 0.50, lengthNorm: 0.24, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 2, toTrack: 4, xNorm: 0.74, lengthNorm: 0.16, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 1, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 2, color: 'green', label: 'M3 Green' },
      { trackIndex: 3, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 4, color: 'red', label: 'M1 Red' }
    ],
    trains: [
      { id: 't1', color: 'red', carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.05 },
      { id: 't2', color: 'green', carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1.0 },
      { id: 't3', color: 'blue', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.0 },
      { id: 't4', color: 'orange', carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.9 }
    ],
    targetTimeSec: 70,
    hintDescription: 'Red sweeps 0->2->4 to reach bottom. Orange and Blue swap middle tracks safely.'
  },

  // --- ACT 5: GRAND METRO CONTROLLER (Levels 26 - 30) ---
  {
    id: 26,
    name: 'The Overpass Labyrinth',
    subtitle: 'High Density Routing',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.18, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 2, toTrack: 3, xNorm: 0.18, lengthNorm: 0.16, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 1, toTrack: 4, xNorm: 0.42, lengthNorm: 0.32, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 0, xNorm: 0.42, lengthNorm: 0.32, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 4, toTrack: 2, xNorm: 0.76, lengthNorm: 0.16, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' },
      { trackIndex: 4, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'red', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.05 },
      { id: 't3', color: 'yellow', carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1.0 },
      { id: 't4', color: 'cyan', carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.15 }
    ],
    targetTimeSec: 75,
    hintDescription: 'Long distance switch diagonals: Cyan stays straight on Track 1, Purple takes 0->1->4, Red goes 2->3->0, Yellow takes 4->2.'
  },
  {
    id: 27,
    name: 'Midnight Express Run',
    subtitle: 'Zero Margin for Error',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.22, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 4, toTrack: 2, xNorm: 0.22, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 0, xNorm: 0.52, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 2, toTrack: 4, xNorm: 0.52, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 1, toTrack: 3, xNorm: 0.35, lengthNorm: 0.28, initialState: 'straight', state: 'straight' },
      { id: 'sw6', fromTrack: 3, toTrack: 1, xNorm: 0.35, lengthNorm: 0.28, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 1, color: 'red', label: 'M1 Red' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' },
      { trackIndex: 4, color: 'orange', label: 'M6 Orange' }
    ],
    trains: [
      { id: 't1', color: 'orange', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.9 },
      { id: 't2', color: 'blue', carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.9 },
      { id: 't3', color: 'green', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
      { id: 't4', color: 'red', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
      { id: 't5', color: 'yellow', carCount: 2, startTrack: 2, startXNorm: -0.30, speed: 1.15 }
    ],
    targetTimeSec: 80,
    hintDescription: '5 heavy trains! Stagger the outer 4-car express sets, while inner Green and Red swap tracks.'
  },
  {
    id: 28,
    name: 'Hexagonal Switch Web',
    subtitle: 'Complex Multi-Branching',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.18, lengthNorm: 0.15, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.34, lengthNorm: 0.15, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 3, toTrack: 2, xNorm: 0.34, lengthNorm: 0.15, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 4, toTrack: 3, xNorm: 0.18, lengthNorm: 0.15, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 2, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw6', fromTrack: 2, toTrack: 4, xNorm: 0.58, lengthNorm: 0.22, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'cyan', label: 'M7 Cyan' },
      { trackIndex: 1, color: 'purple', label: 'M5 Purple' },
      { trackIndex: 2, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 3, color: 'orange', label: 'M6 Orange' },
      { trackIndex: 4, color: 'green', label: 'M3 Green' }
    ],
    trains: [
      { id: 't1', color: 'green', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'cyan', carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.95 },
      { id: 't3', color: 'purple', carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
      { id: 't4', color: 'orange', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
      { id: 't5', color: 'blue', carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.2 }
    ],
    targetTimeSec: 85,
    hintDescription: 'Green 0->1->2->4 takes the funnel to bottom. Cyan 4->3->2->0 takes the funnel to top. Blue shoots straight.'
  },
  {
    id: 29,
    name: 'The Four-Car Supergrid',
    subtitle: 'Maximum Articulation',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 2, xNorm: 0.20, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 3, xNorm: 0.20, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 3, toTrack: 1, xNorm: 0.48, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 4, toTrack: 2, xNorm: 0.48, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 2, toTrack: 0, xNorm: 0.72, lengthNorm: 0.18, initialState: 'straight', state: 'straight' },
      { id: 'sw6', fromTrack: 2, toTrack: 4, xNorm: 0.72, lengthNorm: 0.18, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 3, color: 'green', label: 'M3 Green' },
      { trackIndex: 4, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
      { id: 't2', color: 'green', carCount: 4, startTrack: 1, startXNorm: 0.04, speed: 0.95 },
      { id: 't3', color: 'blue', carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
      { id: 't4', color: 'red', carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.95 },
      { id: 't5', color: 'yellow', carCount: 3, startTrack: 2, startXNorm: -0.32, speed: 1.05 }
    ],
    targetTimeSec: 90,
    hintDescription: 'Four 4-car trains + 1 center train! Tap to pause trains and form a clean convoy without tail collisions.'
  },
  {
    id: 30,
    name: 'Grand Central Yardmaster',
    subtitle: 'The Ultimate Subway Challenge',
    difficulty: 'Expert',
    trackCount: 5,
    switches: [
      { id: 'sw1', fromTrack: 0, toTrack: 1, xNorm: 0.15, lengthNorm: 0.14, initialState: 'straight', state: 'straight' },
      { id: 'sw2', fromTrack: 1, toTrack: 2, xNorm: 0.30, lengthNorm: 0.14, initialState: 'straight', state: 'straight' },
      { id: 'sw3', fromTrack: 2, toTrack: 3, xNorm: 0.45, lengthNorm: 0.14, initialState: 'straight', state: 'straight' },
      { id: 'sw4', fromTrack: 3, toTrack: 4, xNorm: 0.60, lengthNorm: 0.14, initialState: 'straight', state: 'straight' },
      { id: 'sw5', fromTrack: 4, toTrack: 0, xNorm: 0.25, lengthNorm: 0.50, initialState: 'straight', state: 'straight' },
      { id: 'sw6', fromTrack: 3, toTrack: 1, xNorm: 0.62, lengthNorm: 0.22, initialState: 'straight', state: 'straight' },
      { id: 'sw7', fromTrack: 2, toTrack: 0, xNorm: 0.75, lengthNorm: 0.16, initialState: 'straight', state: 'straight' }
    ],
    tunnels: [
      { trackIndex: 0, color: 'red', label: 'M1 Red' },
      { trackIndex: 1, color: 'blue', label: 'M2 Blue' },
      { trackIndex: 2, color: 'green', label: 'M3 Green' },
      { trackIndex: 3, color: 'yellow', label: 'M4 Yellow' },
      { trackIndex: 4, color: 'purple', label: 'M5 Purple' }
    ],
    trains: [
      { id: 't1', color: 'purple', carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 1.0 },
      { id: 't2', color: 'yellow', carCount: 4, startTrack: 1, startXNorm: 0.04, speed: 1.0 },
      { id: 't3', color: 'red', carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 1.0 },
      { id: 't4', color: 'blue', carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
      { id: 't5', color: 'green', carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.1 }
    ],
    targetTimeSec: 95,
    hintDescription: 'The pinnacle of metro yard operations! Use speed controls, pause and release trains in choreography to avoid massive gridlock.'
  }
];
