// 25 Handcrafted Levels for Ball Bounce Target
// Coordinate system is normalized to 1000 x 1400 logic space for resolution-independent scaling

export const THEMES = {
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint Studio',
    bg: '#0f172a',
    gridColor: 'rgba(56, 189, 248, 0.12)',
    accent: '#38bdf8',
    deflectorFace: '#3b82f6',
    deflectorSide: '#1d4ed8',
    deflectorHighlight: '#93c5fd',
    ballColor: '#facc15',
    basketRim: '#f97316',
    basketNet: '#e2e8f0',
    obstacleFace: '#334155',
    obstacleSide: '#1e293b'
  },
  wood: {
    id: 'wood',
    name: 'Timber Workshop',
    bg: '#1c1917',
    gridColor: 'rgba(217, 119, 6, 0.12)',
    accent: '#f59e0b',
    deflectorFace: '#b45309',
    deflectorSide: '#78350f',
    deflectorHighlight: '#fde68a',
    ballColor: '#ef4444',
    basketRim: '#ea580c',
    basketNet: '#fef3c7',
    obstacleFace: '#44403c',
    obstacleSide: '#292524'
  },
  neon: {
    id: 'neon',
    name: 'Cyber Synth',
    bg: '#050510',
    gridColor: 'rgba(168, 85, 247, 0.16)',
    accent: '#a855f7',
    deflectorFace: '#06b6d4',
    deflectorSide: '#0891b2',
    deflectorHighlight: '#67e8f9',
    ballColor: '#22c55e',
    basketRim: '#ec4899',
    basketNet: '#fbcfe8',
    obstacleFace: '#1e1b4b',
    obstacleSide: '#0f0e26'
  },
  arcade: {
    id: 'arcade',
    name: 'Retro Pinball',
    bg: '#18181b',
    gridColor: 'rgba(239, 68, 68, 0.12)',
    accent: '#ef4444',
    deflectorFace: '#10b981',
    deflectorSide: '#047857',
    deflectorHighlight: '#6ee7b7',
    ballColor: '#fbbf24',
    basketRim: '#3b82f6',
    basketNet: '#ffffff',
    obstacleFace: '#27272a',
    obstacleSide: '#18181b'
  }
};

export const LEVELS = [
  // Tier 1: Easy (Levels 1 - 5)
  {
    id: 1,
    title: "First Bounce",
    difficulty: "Easy",
    theme: "blueprint",
    instruction: "Rotate the plank to 45° to bank the ball straight down into the hoop.",
    ball: { x: 180, y: 160, vx: 260, vy: 140 },
    basket: { x: 740, y: 1100, width: 140 },
    obstacles: [],
    deflectors: [
      { id: 'd1', x: 500, y: 480, length: 180, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 420, angle: -42 }
    ]
  },
  {
    id: 2,
    title: "Double Bank",
    difficulty: "Easy",
    theme: "blueprint",
    instruction: "Use 2 deflectors to zig-zag the ball safely to the basket below.",
    ball: { x: 150, y: 180, vx: 280, vy: 120 },
    basket: { x: 220, y: 1120, width: 140 },
    obstacles: [],
    deflectors: [
      { id: 'd1', x: 650, y: 420, length: 170, angle: 0 },
      { id: 'd2', x: 420, y: 780, length: 170, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 650, y: 440, angle: -50 },
      { id: 'd2', x: 400, y: 760, angle: 45 }
    ]
  },
  {
    id: 3,
    title: "Over the Wall",
    difficulty: "Easy",
    theme: "wood",
    instruction: "Bounce above the dividing wall to reach the target.",
    ball: { x: 160, y: 220, vx: 220, vy: -40 },
    basket: { x: 780, y: 1100, width: 140 },
    obstacles: [
      { x: 500, y: 780, width: 70, height: 500 }
    ],
    deflectors: [
      { id: 'd1', x: 340, y: 320, length: 170, angle: 15 },
      { id: 'd2', x: 700, y: 480, length: 170, angle: -20 }
    ],
    hints: [
      { id: 'd1', x: 360, y: 280, angle: 35 },
      { id: 'd2', x: 720, y: 520, angle: -45 }
    ]
  },
  {
    id: 4,
    title: "Precision Drop",
    difficulty: "Easy",
    theme: "wood",
    instruction: "Align the deflector so the ball drops straight through the gap.",
    ball: { x: 200, y: 180, vx: 300, vy: 160 },
    basket: { x: 500, y: 1140, width: 140 },
    obstacles: [
      { x: 260, y: 880, width: 200, height: 50 },
      { x: 740, y: 880, width: 200, height: 50 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 500, length: 170, angle: -30 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 460, angle: -52 }
    ]
  },
  {
    id: 5,
    title: "Triple Ricochet",
    difficulty: "Easy",
    theme: "wood",
    instruction: "Create a cascading three-point bounce sequence.",
    ball: { x: 140, y: 160, vx: 260, vy: 100 },
    basket: { x: 800, y: 1120, width: 140 },
    obstacles: [],
    deflectors: [
      { id: 'd1', x: 500, y: 340, length: 160, angle: 0 },
      { id: 'd2', x: 300, y: 640, length: 160, angle: 0 },
      { id: 'd3', x: 600, y: 880, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 350, angle: -45 },
      { id: 'd2', x: 320, y: 660, angle: 45 },
      { id: 'd3', x: 600, y: 900, angle: -40 }
    ]
  },

  // Tier 2: Medium (Levels 6 - 10)
  {
    id: 6,
    title: "The S-Curve",
    difficulty: "Medium",
    theme: "neon",
    instruction: "Curve around two protruding cyber towers into the basket.",
    ball: { x: 160, y: 150, vx: 240, vy: 120 },
    basket: { x: 180, y: 1120, width: 135 },
    obstacles: [
      { x: 380, y: 480, width: 340, height: 45 },
      { x: 620, y: 820, width: 340, height: 45 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 320, length: 160, angle: -20 },
      { id: 'd2', x: 220, y: 680, length: 160, angle: 20 },
      { id: 'd3', x: 540, y: 960, length: 160, angle: -15 }
    ],
    hints: [
      { id: 'd1', x: 740, y: 330, angle: -50 },
      { id: 'd2', x: 220, y: 660, angle: 42 },
      { id: 'd3', x: 520, y: 950, angle: -38 }
    ]
  },
  {
    id: 7,
    title: "Pillar Passage",
    difficulty: "Medium",
    theme: "neon",
    instruction: "Thread the needle between central barrier pillars.",
    ball: { x: 180, y: 160, vx: 280, vy: 140 },
    basket: { x: 800, y: 1120, width: 135 },
    obstacles: [
      { x: 500, y: 620, width: 70, height: 380 }
    ],
    deflectors: [
      { id: 'd1', x: 320, y: 420, length: 160, angle: 0 },
      { id: 'd2', x: 720, y: 780, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 340, y: 410, angle: 25 },
      { id: 'd2', x: 700, y: 760, angle: -45 }
    ]
  },
  {
    id: 8,
    title: "Steep Incline",
    difficulty: "Medium",
    theme: "neon",
    instruction: "Bounce sharply upward before gravity pulls the ball into the hoop.",
    ball: { x: 150, y: 300, vx: 320, vy: 200 },
    basket: { x: 780, y: 980, width: 135 },
    obstacles: [
      { x: 500, y: 900, width: 80, height: 340 }
    ],
    deflectors: [
      { id: 'd1', x: 420, y: 580, length: 170, angle: 0 },
      { id: 'd2', x: 620, y: 340, length: 170, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 410, y: 560, angle: -65 },
      { id: 'd2', x: 620, y: 320, angle: -30 }
    ]
  },
  {
    id: 9,
    title: "Bumper Alley",
    difficulty: "Medium",
    theme: "arcade",
    instruction: "Bounce between retro bumpers to gain horizontal reach.",
    ball: { x: 180, y: 180, vx: 250, vy: 150 },
    basket: { x: 500, y: 1120, width: 140 },
    obstacles: [
      { x: 320, y: 650, width: 50, height: 180 },
      { x: 680, y: 650, width: 50, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 420, length: 160, angle: 0 },
      { id: 'd2', x: 240, y: 840, length: 160, angle: 0 },
      { id: 'd3', x: 760, y: 840, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 440, angle: -45 },
      { id: 'd2', x: 230, y: 820, angle: 45 },
      { id: 'd3', x: 770, y: 820, angle: -45 }
    ]
  },
  {
    id: 10,
    title: "Target Vault",
    difficulty: "Medium",
    theme: "arcade",
    instruction: "The basket is shielded by a top roof; bank from underneath.",
    ball: { x: 140, y: 160, vx: 240, vy: 120 },
    basket: { x: 800, y: 850, width: 135 },
    obstacles: [
      { x: 800, y: 680, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 420, y: 380, length: 160, angle: 0 },
      { id: 'd2', x: 480, y: 920, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 420, y: 360, angle: 30 },
      { id: 'd2', x: 520, y: 900, angle: -58 }
    ]
  },

  // Tier 3: Hard (Levels 11 - 15)
  {
    id: 11,
    title: "Split Chasm",
    difficulty: "Hard",
    theme: "blueprint",
    instruction: "Navigate across two vertical barriers.",
    ball: { x: 150, y: 160, vx: 260, vy: 140 },
    basket: { x: 820, y: 1120, width: 130 },
    obstacles: [
      { x: 380, y: 550, width: 50, height: 450 },
      { x: 650, y: 750, width: 50, height: 450 }
    ],
    deflectors: [
      { id: 'd1', x: 280, y: 320, length: 150, angle: 0 },
      { id: 'd2', x: 510, y: 440, length: 150, angle: 0 },
      { id: 'd3', x: 740, y: 560, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 260, y: 310, angle: 25 },
      { id: 'd2', x: 510, y: 420, angle: 30 },
      { id: 'd3', x: 750, y: 580, angle: -45 }
    ]
  },
  {
    id: 12,
    title: "Ascending Steps",
    difficulty: "Hard",
    theme: "blueprint",
    instruction: "Staircase deflection against gravitational descent.",
    ball: { x: 140, y: 220, vx: 280, vy: 160 },
    basket: { x: 180, y: 1120, width: 130 },
    obstacles: [
      { x: 400, y: 800, width: 50, height: 350 },
      { x: 700, y: 600, width: 50, height: 350 }
    ],
    deflectors: [
      { id: 'd1', x: 550, y: 380, length: 150, angle: 0 },
      { id: 'd2', x: 820, y: 520, length: 150, angle: 0 },
      { id: 'd3', x: 550, y: 760, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 540, y: 380, angle: -40 },
      { id: 'd2', x: 820, y: 540, angle: -65 },
      { id: 'd3', x: 540, y: 760, angle: 45 }
    ]
  },
  {
    id: 13,
    title: "The Iron Box",
    difficulty: "Hard",
    theme: "wood",
    instruction: "Rebound off inside deflector angles into the enclosed chamber.",
    ball: { x: 160, y: 150, vx: 240, vy: 130 },
    basket: { x: 500, y: 920, width: 130 },
    obstacles: [
      { x: 380, y: 920, width: 40, height: 180 },
      { x: 620, y: 920, width: 40, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 380, length: 150, angle: 0 },
      { id: 'd2', x: 260, y: 680, length: 150, angle: 0 },
      { id: 'd3', x: 740, y: 680, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 360, angle: 35 },
      { id: 'd2', x: 260, y: 660, angle: -50 },
      { id: 'd3', x: 740, y: 660, angle: 50 }
    ]
  },
  {
    id: 14,
    title: "Double Cross",
    difficulty: "Hard",
    theme: "wood",
    instruction: "X-shaped flight trajectory over crossing obstacles.",
    ball: { x: 180, y: 180, vx: 260, vy: 140 },
    basket: { x: 200, y: 1120, width: 130 },
    obstacles: [
      { x: 500, y: 650, width: 300, height: 45 },
      { x: 500, y: 650, width: 45, height: 300 }
    ],
    deflectors: [
      { id: 'd1', x: 720, y: 380, length: 150, angle: 0 },
      { id: 'd2', x: 280, y: 880, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 700, y: 380, angle: -55 },
      { id: 'd2', x: 300, y: 860, angle: 45 }
    ]
  },
  {
    id: 15,
    title: "Labyrinth Gate",
    difficulty: "Hard",
    theme: "neon",
    instruction: "Weave through three floating neon platforms.",
    ball: { x: 140, y: 140, vx: 260, vy: 110 },
    basket: { x: 800, y: 1120, width: 130 },
    obstacles: [
      { x: 300, y: 460, width: 220, height: 40 },
      { x: 700, y: 660, width: 220, height: 40 },
      { x: 400, y: 880, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 600, y: 320, length: 150, angle: 0 },
      { id: 'd2', x: 420, y: 580, length: 150, angle: 0 },
      { id: 'd3', x: 700, y: 800, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 620, y: 310, angle: -45 },
      { id: 'd2', x: 400, y: 570, angle: 40 },
      { id: 'd3', x: 710, y: 790, angle: -40 }
    ]
  },

  // Tier 4: Expert (Levels 16 - 20)
  {
    id: 16,
    title: "High Velocity Arc",
    difficulty: "Expert",
    theme: "neon",
    instruction: "High initial launch speed requires soft angle deflectors.",
    ball: { x: 150, y: 200, vx: 380, vy: 190 },
    basket: { x: 500, y: 1140, width: 125 },
    obstacles: [
      { x: 500, y: 700, width: 60, height: 400 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 420, length: 150, angle: 0 },
      { id: 'd2', x: 320, y: 780, length: 150, angle: 0 },
      { id: 'd3', x: 680, y: 920, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 440, angle: -50 },
      { id: 'd2', x: 300, y: 760, angle: 45 },
      { id: 'd3', x: 680, y: 910, angle: -40 }
    ]
  },
  {
    id: 17,
    title: "Quantum Funnel",
    difficulty: "Expert",
    theme: "neon",
    instruction: "Deflect through a narrowing passage into the bottom chamber.",
    ball: { x: 200, y: 150, vx: 260, vy: 140 },
    basket: { x: 500, y: 1130, width: 125 },
    obstacles: [
      { x: 320, y: 700, width: 180, height: 40 },
      { x: 680, y: 700, width: 180, height: 40 },
      { x: 500, y: 880, width: 40, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 420, length: 150, angle: 0 },
      { id: 'd2', x: 260, y: 860, length: 150, angle: 0 },
      { id: 'd3', x: 740, y: 860, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 420, angle: -45 },
      { id: 'd2', x: 260, y: 840, angle: 50 },
      { id: 'd3', x: 740, y: 840, angle: -50 }
    ]
  },
  {
    id: 18,
    title: "Diamond Rebound",
    difficulty: "Expert",
    theme: "arcade",
    instruction: "Bounce symmetrically around a central diamond hazard.",
    ball: { x: 160, y: 160, vx: 250, vy: 130 },
    basket: { x: 500, y: 1140, width: 125 },
    obstacles: [
      { x: 500, y: 620, width: 160, height: 160 }
    ],
    deflectors: [
      { id: 'd1', x: 300, y: 400, length: 150, angle: 0 },
      { id: 'd2', x: 750, y: 620, length: 150, angle: 0 },
      { id: 'd3', x: 350, y: 900, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 320, y: 390, angle: 30 },
      { id: 'd2', x: 750, y: 640, angle: -60 },
      { id: 'd3', x: 360, y: 890, angle: 45 }
    ]
  },
  {
    id: 19,
    title: "Pinball Wizard",
    difficulty: "Expert",
    theme: "arcade",
    instruction: "Perform 4 fast ricochets between bumpers without loss of momentum.",
    ball: { x: 140, y: 150, vx: 290, vy: 120 },
    basket: { x: 820, y: 1120, width: 125 },
    obstacles: [
      { x: 420, y: 520, width: 50, height: 160 },
      { x: 620, y: 780, width: 50, height: 160 }
    ],
    deflectors: [
      { id: 'd1', x: 650, y: 320, length: 145, angle: 0 },
      { id: 'd2', x: 260, y: 560, length: 145, angle: 0 },
      { id: 'd3', x: 520, y: 740, length: 145, angle: 0 },
      { id: 'd4', x: 760, y: 920, length: 145, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 660, y: 330, angle: -45 },
      { id: 'd2', x: 250, y: 550, angle: 45 },
      { id: 'd3', x: 510, y: 730, angle: -45 },
      { id: 'd4', x: 770, y: 920, angle: 40 }
    ]
  },
  {
    id: 20,
    title: "The Fortress",
    difficulty: "Expert",
    theme: "wood",
    instruction: "The hoop is deep inside a fortress; calculate exact drop reflections.",
    ball: { x: 160, y: 160, vx: 260, vy: 140 },
    basket: { x: 800, y: 1100, width: 125 },
    obstacles: [
      { x: 660, y: 920, width: 40, height: 260 },
      { x: 800, y: 780, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 420, y: 400, length: 150, angle: 0 },
      { id: 'd2', x: 380, y: 840, length: 150, angle: 0 },
      { id: 'd3', x: 550, y: 1040, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 420, y: 400, angle: 30 },
      { id: 'd2', x: 370, y: 820, angle: -50 },
      { id: 'd3', x: 560, y: 1030, angle: -65 }
    ]
  },

  // Tier 5: Master (Levels 21 - 25)
  {
    id: 21,
    title: "Vortex Canyon",
    difficulty: "Master",
    theme: "neon",
    instruction: "Direct a continuous zig-zag through a steep vertical canyon.",
    ball: { x: 180, y: 140, vx: 260, vy: 150 },
    basket: { x: 500, y: 1150, width: 120 },
    obstacles: [
      { x: 300, y: 650, width: 50, height: 500 },
      { x: 700, y: 650, width: 50, height: 500 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 380, length: 140, angle: 0 },
      { id: 'd2', x: 420, y: 680, length: 140, angle: 0 },
      { id: 'd3', x: 580, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 360, angle: -40 },
      { id: 'd2', x: 440, y: 660, angle: 52 },
      { id: 'd3', x: 570, y: 910, angle: -52 }
    ]
  },
  {
    id: 22,
    title: "Infinity Loop",
    difficulty: "Master",
    theme: "blueprint",
    instruction: "Guide the ball along an intricate dual loop around barrier posts.",
    ball: { x: 150, y: 180, vx: 270, vy: 130 },
    basket: { x: 180, y: 1120, width: 120 },
    obstacles: [
      { x: 450, y: 520, width: 50, height: 260 },
      { x: 650, y: 820, width: 50, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 350, length: 140, angle: 0 },
      { id: 'd2', x: 260, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 780, y: 720, length: 140, angle: 0 },
      { id: 'd4', x: 460, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 670, y: 360, angle: -48 },
      { id: 'd2', x: 250, y: 600, angle: 45 },
      { id: 'd3', x: 770, y: 730, angle: -50 },
      { id: 'd4', x: 460, y: 950, angle: 40 }
    ]
  },
  {
    id: 23,
    title: "The Needle Hole",
    difficulty: "Master",
    theme: "wood",
    instruction: "Only a single high-precision trajectory can pass the needle hole.",
    ball: { x: 160, y: 160, vx: 280, vy: 140 },
    basket: { x: 800, y: 1120, width: 120 },
    obstacles: [
      { x: 500, y: 480, width: 450, height: 40 },
      { x: 500, y: 820, width: 450, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 820, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 820, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 820, y: 310, angle: -52 },
      { id: 'd2', x: 180, y: 650, angle: 48 },
      { id: 'd3', x: 810, y: 970, angle: -48 }
    ]
  },
  {
    id: 24,
    title: "Ball Bounce Target 24",
    difficulty: "Master",
    theme: "blueprint",
    instruction: "Use 3 deflectors to bounce the ball in a tight cascading drop.",
    ball: { x: 180, y: 160, vx: 260, vy: 140 },
    basket: { x: 620, y: 1120, width: 130 },
    obstacles: [],
    deflectors: [
      { id: 'd1', x: 460, y: 440, length: 160, angle: 0 },
      { id: 'd2', x: 520, y: 680, length: 160, angle: 0 },
      { id: 'd3', x: 510, y: 900, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 460, y: 420, angle: -42 },
      { id: 'd2', x: 520, y: 660, angle: 36 },
      { id: 'd3', x: 510, y: 880, angle: -24 }
    ]
  },
  {
    id: 25,
    title: "Grandmaster Challenge",
    difficulty: "Master",
    theme: "neon",
    instruction: "The ultimate geometry test: four precision deflections to sink the shot!",
    ball: { x: 140, y: 150, vx: 300, vy: 160 },
    basket: { x: 500, y: 1160, width: 120 },
    obstacles: [
      { x: 300, y: 600, width: 50, height: 260 },
      { x: 700, y: 600, width: 50, height: 260 },
      { x: 500, y: 880, width: 180, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 800, y: 520, length: 140, angle: 0 },
      { id: 'd3', x: 200, y: 780, length: 140, angle: 0 },
      { id: 'd4', x: 680, y: 980, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 350, angle: -38 },
      { id: 'd2', x: 800, y: 510, angle: -58 },
      { id: 'd3', x: 200, y: 760, angle: 45 },
      { id: 'd4', x: 670, y: 970, angle: -42 }
    ]
  },
  // Tier 3: Advanced Geometry & Funnels (Levels 26 - 35)
  {
    id: 26,
    title: "The Needle Chute",
    difficulty: "Hard",
    theme: "arcade",
    instruction: "Thread the ball through a narrow vertical chute using two steep deflections.",
    ball: { x: 180, y: 160, vx: 260, vy: 80 },
    basket: { x: 500, y: 1120, width: 125 },
    obstacles: [
      { x: 380, y: 700, width: 40, height: 360 },
      { x: 620, y: 700, width: 40, height: 360 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 340, length: 150, angle: 0 },
      { id: 'd2', x: 260, y: 520, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 330, angle: -50 },
      { id: 'd2', x: 260, y: 510, angle: 42 }
    ]
  },
  {
    id: 27,
    title: "Slalom Run",
    difficulty: "Hard",
    theme: "wood",
    instruction: "Weave between staggered posts to guide the ball toward the far basket.",
    ball: { x: 150, y: 180, vx: 300, vy: 100 },
    basket: { x: 820, y: 1100, width: 130 },
    obstacles: [
      { x: 450, y: 450, width: 60, height: 180 },
      { x: 600, y: 750, width: 60, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 650, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 300, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 500, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 650, y: 310, angle: -45 },
      { id: 'd2', x: 300, y: 610, angle: 48 },
      { id: 'd3', x: 500, y: 910, angle: -32 }
    ]
  },
  {
    id: 28,
    title: "Orbital Arc",
    difficulty: "Hard",
    theme: "blueprint",
    instruction: "Use a gentle upward bank to arc the ball over the central barrier.",
    ball: { x: 180, y: 220, vx: 240, vy: -30 },
    basket: { x: 780, y: 1080, width: 130 },
    obstacles: [
      { x: 500, y: 680, width: 80, height: 420 }
    ],
    deflectors: [
      { id: 'd1', x: 340, y: 360, length: 160, angle: 0 },
      { id: 'd2', x: 680, y: 440, length: 160, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 340, y: 340, angle: 32 },
      { id: 'd2', x: 680, y: 430, angle: -38 }
    ]
  },
  {
    id: 29,
    title: "Dual Barrier Matrix",
    difficulty: "Hard",
    theme: "neon",
    instruction: "Bank off the outer wall and through the middle corridor.",
    ball: { x: 140, y: 160, vx: 280, vy: 120 },
    basket: { x: 500, y: 1140, width: 125 },
    obstacles: [
      { x: 320, y: 620, width: 45, height: 320 },
      { x: 680, y: 620, width: 45, height: 320 },
      { x: 500, y: 400, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 780, y: 280, length: 140, angle: 0 },
      { id: 'd2', x: 220, y: 500, length: 140, angle: 0 },
      { id: 'd3', x: 500, y: 880, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 780, y: 270, angle: -60 },
      { id: 'd2', x: 220, y: 490, angle: 45 },
      { id: 'd3', x: 500, y: 870, angle: 0 }
    ]
  },
  {
    id: 30,
    title: "Canyon Ricochet",
    difficulty: "Hard",
    theme: "wood",
    instruction: "Bounce down the jagged canyon walls with precise angle control.",
    ball: { x: 160, y: 150, vx: 250, vy: 140 },
    basket: { x: 200, y: 1120, width: 130 },
    obstacles: [
      { x: 500, y: 550, width: 340, height: 50 },
      { x: 300, y: 850, width: 260, height: 50 }
    ],
    deflectors: [
      { id: 'd1', x: 780, y: 380, length: 150, angle: 0 },
      { id: 'd2', x: 240, y: 680, length: 150, angle: 0 },
      { id: 'd3', x: 700, y: 920, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 780, y: 360, angle: -48 },
      { id: 'd2', x: 240, y: 670, angle: 42 },
      { id: 'd3', x: 700, y: 910, angle: -52 }
    ]
  },
  {
    id: 31,
    title: "Laser Grid Alley",
    difficulty: "Hard",
    theme: "arcade",
    instruction: "Fast-moving pinball trajectory requiring 3 rapid bounces.",
    ball: { x: 180, y: 160, vx: 320, vy: 160 },
    basket: { x: 760, y: 1120, width: 125 },
    obstacles: [
      { x: 480, y: 520, width: 50, height: 260 },
      { x: 750, y: 780, width: 50, height: 220 }
    ],
    deflectors: [
      { id: 'd1', x: 620, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 280, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 620, y: 350, angle: -42 },
      { id: 'd2', x: 280, y: 630, angle: 38 },
      { id: 'd3', x: 520, y: 930, angle: -30 }
    ]
  },
  {
    id: 32,
    title: "Reflective Spiral",
    difficulty: "Hard",
    theme: "blueprint",
    instruction: "Create a clockwise spiral around the center block.",
    ball: { x: 150, y: 160, vx: 260, vy: 100 },
    basket: { x: 500, y: 1080, width: 130 },
    obstacles: [
      { x: 500, y: 600, width: 180, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 720, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 740, y: 780, length: 140, angle: 0 },
      { id: 'd3', x: 260, y: 780, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 720, y: 340, angle: -52 },
      { id: 'd2', x: 740, y: 770, angle: -78 },
      { id: 'd3', x: 260, y: 770, angle: 55 }
    ]
  },
  {
    id: 33,
    title: "Symmetric Split",
    difficulty: "Hard",
    theme: "neon",
    instruction: "Split the trajectory through symmetric neon gateposts.",
    ball: { x: 180, y: 150, vx: 240, vy: 140 },
    basket: { x: 820, y: 1100, width: 125 },
    obstacles: [
      { x: 360, y: 500, width: 50, height: 220 },
      { x: 640, y: 700, width: 50, height: 220 }
    ],
    deflectors: [
      { id: 'd1', x: 520, y: 340, length: 150, angle: 0 },
      { id: 'd2', x: 200, y: 680, length: 150, angle: 0 },
      { id: 'd3', x: 520, y: 920, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 330, angle: -36 },
      { id: 'd2', x: 200, y: 670, angle: 45 },
      { id: 'd3', x: 520, y: 910, angle: -28 }
    ]
  },
  {
    id: 34,
    title: "Bouncing Trapezoid",
    difficulty: "Hard",
    theme: "wood",
    instruction: "Guide the ball past horizontal shelves using high angles.",
    ball: { x: 160, y: 180, vx: 280, vy: 120 },
    basket: { x: 200, y: 1120, width: 130 },
    obstacles: [
      { x: 380, y: 420, width: 320, height: 40 },
      { x: 620, y: 740, width: 320, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 280, length: 150, angle: 0 },
      { id: 'd2', x: 220, y: 580, length: 150, angle: 0 },
      { id: 'd3', x: 740, y: 920, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 260, angle: -58 },
      { id: 'd2', x: 220, y: 570, angle: 44 },
      { id: 'd3', x: 740, y: 910, angle: -48 }
    ]
  },
  {
    id: 35,
    title: "Subterranean Drop",
    difficulty: "Hard",
    theme: "arcade",
    instruction: "A deep vertical shaft test requiring perfect bank alignment.",
    ball: { x: 180, y: 140, vx: 260, vy: 160 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 260, y: 640, width: 60, height: 340 },
      { x: 740, y: 640, width: 60, height: 340 }
    ],
    deflectors: [
      { id: 'd1', x: 600, y: 360, length: 150, angle: 0 },
      { id: 'd2', x: 400, y: 880, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 600, y: 340, angle: -44 },
      { id: 'd2', x: 400, y: 860, angle: 30 }
    ]
  },
  // Tier 4: Master Obstacles & Switchbacks (Levels 36 - 45)
  {
    id: 36,
    title: "Pinball Labyrinth",
    difficulty: "Master",
    theme: "arcade",
    instruction: "Navigate four staggered obstacles with three custom ricochets.",
    ball: { x: 150, y: 160, vx: 280, vy: 140 },
    basket: { x: 800, y: 1120, width: 125 },
    obstacles: [
      { x: 400, y: 400, width: 120, height: 40 },
      { x: 600, y: 600, width: 120, height: 40 },
      { x: 350, y: 800, width: 120, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 280, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 560, length: 140, angle: 0 },
      { id: 'd3', x: 580, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 270, angle: -52 },
      { id: 'd2', x: 200, y: 550, angle: 42 },
      { id: 'd3', x: 580, y: 930, angle: -34 }
    ]
  },
  {
    id: 37,
    title: "Vortex Descent",
    difficulty: "Master",
    theme: "neon",
    instruction: "Counter-rotate the plank sequence to spiral directly into the target.",
    ball: { x: 180, y: 160, vx: 240, vy: 120 },
    basket: { x: 180, y: 1100, width: 125 },
    obstacles: [
      { x: 500, y: 650, width: 60, height: 380 }
    ],
    deflectors: [
      { id: 'd1', x: 650, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 750, y: 700, length: 140, angle: 0 },
      { id: 'd3', x: 450, y: 950, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 650, y: 330, angle: -45 },
      { id: 'd2', x: 750, y: 690, angle: -75 },
      { id: 'd3', x: 450, y: 940, angle: -38 }
    ]
  },
  {
    id: 38,
    title: "Zenith Rebound",
    difficulty: "Master",
    theme: "blueprint",
    instruction: "Send the ball across the upper board before a steep downward plummet.",
    ball: { x: 140, y: 200, vx: 320, vy: -50 },
    basket: { x: 760, y: 1120, width: 125 },
    obstacles: [
      { x: 500, y: 750, width: 380, height: 50 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 280, length: 150, angle: 0 },
      { id: 'd2', x: 800, y: 480, length: 150, angle: 0 },
      { id: 'd3', x: 240, y: 880, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 260, angle: 18 },
      { id: 'd2', x: 800, y: 460, angle: -60 },
      { id: 'd3', x: 240, y: 870, angle: 45 }
    ]
  },
  {
    id: 39,
    title: "Tower of Deflection",
    difficulty: "Master",
    theme: "wood",
    instruction: "Bounce around a central wooden tower structure.",
    ball: { x: 160, y: 150, vx: 270, vy: 140 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 500, y: 550, width: 140, height: 260 },
      { x: 500, y: 850, width: 280, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 740, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 220, y: 680, length: 140, angle: 0 },
      { id: 'd3', x: 760, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 740, y: 340, angle: -50 },
      { id: 'd2', x: 220, y: 660, angle: 46 },
      { id: 'd3', x: 760, y: 910, angle: -48 }
    ]
  },
  {
    id: 40,
    title: "Triple Crossfire",
    difficulty: "Master",
    theme: "arcade",
    instruction: "Three precision angle deflections crossing through intersecting axes.",
    ball: { x: 180, y: 160, vx: 300, vy: 150 },
    basket: { x: 820, y: 1120, width: 125 },
    obstacles: [
      { x: 350, y: 520, width: 45, height: 220 },
      { x: 650, y: 720, width: 45, height: 220 }
    ],
    deflectors: [
      { id: 'd1', x: 580, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 660, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 580, y: 330, angle: -40 },
      { id: 'd2', x: 180, y: 650, angle: 44 },
      { id: 'd3', x: 520, y: 910, angle: -32 }
    ]
  },
  {
    id: 41,
    title: "Quantum Gate",
    difficulty: "Master",
    theme: "neon",
    instruction: "Pass through the illuminated portal opening with sub-degree accuracy.",
    ball: { x: 150, y: 170, vx: 260, vy: 120 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 260, y: 580, width: 40, height: 280 },
      { x: 740, y: 580, width: 40, height: 280 },
      { x: 500, y: 780, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 380, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 640, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 320, angle: -48 },
      { id: 'd2', x: 380, y: 630, angle: 36 },
      { id: 'd3', x: 640, y: 930, angle: -42 }
    ]
  },
  {
    id: 42,
    title: "The Great Divide",
    difficulty: "Master",
    theme: "wood",
    instruction: "Split the board with a high wall and bank twice to cross.",
    ball: { x: 160, y: 160, vx: 280, vy: 100 },
    basket: { x: 800, y: 1100, width: 125 },
    obstacles: [
      { x: 500, y: 700, width: 50, height: 460 }
    ],
    deflectors: [
      { id: 'd1', x: 340, y: 360, length: 150, angle: 0 },
      { id: 'd2', x: 720, y: 440, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 340, y: 340, angle: 36 },
      { id: 'd2', x: 720, y: 420, angle: -40 }
    ]
  },
  {
    id: 43,
    title: "Prism Refractor",
    difficulty: "Master",
    theme: "blueprint",
    instruction: "Refract the velocity vector across three sequential planks.",
    ball: { x: 180, y: 150, vx: 250, vy: 140 },
    basket: { x: 220, y: 1120, width: 125 },
    obstacles: [
      { x: 500, y: 460, width: 340, height: 40 },
      { x: 420, y: 780, width: 340, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 300, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 700, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 280, angle: -54 },
      { id: 'd2', x: 180, y: 600, angle: 45 },
      { id: 'd3', x: 700, y: 930, angle: -50 }
    ]
  },
  {
    id: 44,
    title: "Hourglass Passage",
    difficulty: "Master",
    theme: "arcade",
    instruction: "Squeeze the ball through the hourglass neck to score.",
    ball: { x: 150, y: 160, vx: 290, vy: 130 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 300, y: 640, width: 180, height: 50 },
      { x: 700, y: 640, width: 180, height: 50 },
      { x: 500, y: 880, width: 160, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 620, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 360, y: 780, length: 140, angle: 0 },
      { id: 'd3', x: 640, y: 980, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 620, y: 340, angle: -42 },
      { id: 'd2', x: 360, y: 760, angle: 36 },
      { id: 'd3', x: 640, y: 970, angle: -40 }
    ]
  },
  {
    id: 45,
    title: "Apex Horizon",
    difficulty: "Master",
    theme: "neon",
    instruction: "A four-plank masterpiece requiring complete board coverage.",
    ball: { x: 140, y: 150, vx: 300, vy: 150 },
    basket: { x: 780, y: 1120, width: 120 },
    obstacles: [
      { x: 380, y: 540, width: 50, height: 260 },
      { x: 650, y: 780, width: 50, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 520, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 800, y: 500, length: 140, angle: 0 },
      { id: 'd3', x: 200, y: 740, length: 140, angle: 0 },
      { id: 'd4', x: 520, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 310, angle: -38 },
      { id: 'd2', x: 800, y: 490, angle: -58 },
      { id: 'd3', x: 200, y: 730, angle: 45 },
      { id: 'd4', x: 520, y: 930, angle: -30 }
    ]
  },
  // Tier 5: Precision Acoustics & Anglecraft (Levels 46 - 55)
  {
    id: 46,
    title: "Echo Chambers",
    difficulty: "Master",
    theme: "blueprint",
    instruction: "Bounce between enclosed acoustic barriers without losing momentum.",
    ball: { x: 180, y: 160, vx: 270, vy: 140 },
    basket: { x: 500, y: 1140, width: 125 },
    obstacles: [
      { x: 350, y: 480, width: 40, height: 220 },
      { x: 650, y: 480, width: 40, height: 220 },
      { x: 500, y: 800, width: 260, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 500, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 220, y: 660, length: 140, angle: 0 },
      { id: 'd3', x: 780, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 500, y: 330, angle: -35 },
      { id: 'd2', x: 220, y: 650, angle: 46 },
      { id: 'd3', x: 780, y: 910, angle: -48 }
    ]
  },
  {
    id: 47,
    title: "Pyramid Cascade",
    difficulty: "Master",
    theme: "wood",
    instruction: "Cascade down the stepped pyramid blocks on the left side.",
    ball: { x: 160, y: 150, vx: 280, vy: 120 },
    basket: { x: 820, y: 1100, width: 125 },
    obstacles: [
      { x: 280, y: 500, width: 140, height: 40 },
      { x: 340, y: 720, width: 140, height: 40 },
      { x: 400, y: 940, width: 140, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 640, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 600, y: 860, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 640, y: 330, angle: -46 },
      { id: 'd2', x: 180, y: 610, angle: 42 },
      { id: 'd3', x: 600, y: 850, angle: -34 }
    ]
  },
  {
    id: 48,
    title: "Velocity Dampener",
    difficulty: "Master",
    theme: "arcade",
    instruction: "Control descent speed with a gentle upward angle before the final drop.",
    ball: { x: 180, y: 180, vx: 310, vy: 140 },
    basket: { x: 200, y: 1120, width: 125 },
    obstacles: [
      { x: 500, y: 580, width: 360, height: 45 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 360, length: 150, angle: 0 },
      { id: 'd2', x: 320, y: 740, length: 150, angle: 0 },
      { id: 'd3', x: 680, y: 940, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 340, angle: -50 },
      { id: 'd2', x: 320, y: 730, angle: 36 },
      { id: 'd3', x: 680, y: 930, angle: -48 }
    ]
  },
  {
    id: 49,
    title: "Cyber Lattice",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Thread through a cross-hatched neon lattice.",
    ball: { x: 140, y: 160, vx: 270, vy: 130 },
    basket: { x: 800, y: 1120, width: 120 },
    obstacles: [
      { x: 340, y: 460, width: 40, height: 180 },
      { x: 660, y: 680, width: 40, height: 180 },
      { x: 500, y: 900, width: 240, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 520, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 820, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 310, angle: -36 },
      { id: 'd2', x: 180, y: 630, angle: 45 },
      { id: 'd3', x: 520, y: 810, angle: -26 }
    ]
  },
  {
    id: 50,
    title: "Golden Ratio",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "Milestone level: 4 planks forming logarithmic spiral ricochets.",
    ball: { x: 160, y: 150, vx: 300, vy: 160 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 320, y: 600, width: 50, height: 260 },
      { x: 680, y: 600, width: 50, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 820, y: 520, length: 140, angle: 0 },
      { id: 'd3', x: 180, y: 780, length: 140, angle: 0 },
      { id: 'd4', x: 680, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 330, angle: -38 },
      { id: 'd2', x: 820, y: 510, angle: -58 },
      { id: 'd3', x: 180, y: 770, angle: 46 },
      { id: 'd4', x: 680, y: 950, angle: -42 }
    ]
  },
  {
    id: 51,
    title: "Zigzag Bastion",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "Weave down tightly packed ramparts.",
    ball: { x: 180, y: 160, vx: 260, vy: 140 },
    basket: { x: 220, y: 1120, width: 125 },
    obstacles: [
      { x: 450, y: 440, width: 360, height: 40 },
      { x: 550, y: 740, width: 360, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 280, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 580, length: 140, angle: 0 },
      { id: 'd3', x: 740, y: 900, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 270, angle: -55 },
      { id: 'd2', x: 200, y: 570, angle: 45 },
      { id: 'd3', x: 740, y: 890, angle: -50 }
    ]
  },
  {
    id: 52,
    title: "Neon Catapult",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Launch over the glowing skyline divider.",
    ball: { x: 150, y: 220, vx: 260, vy: -40 },
    basket: { x: 820, y: 1100, width: 125 },
    obstacles: [
      { x: 500, y: 680, width: 60, height: 400 }
    ],
    deflectors: [
      { id: 'd1', x: 340, y: 340, length: 150, angle: 0 },
      { id: 'd2', x: 720, y: 440, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 340, y: 330, angle: 35 },
      { id: 'd2', x: 720, y: 430, angle: -42 }
    ]
  },
  {
    id: 53,
    title: "Gravity Slingshot",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "Use gravity acceleration into a high-speed rebound.",
    ball: { x: 180, y: 140, vx: 280, vy: 180 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 380, y: 620, width: 50, height: 260 },
      { x: 620, y: 620, width: 50, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 650, y: 360, length: 140, angle: 0 },
      { id: 'd2', x: 280, y: 820, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 650, y: 340, angle: -46 },
      { id: 'd2', x: 280, y: 810, angle: 36 }
    ]
  },
  {
    id: 54,
    title: "Fortress Squeeze",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "A tight gate squeeze requiring exact deflector placement.",
    ball: { x: 160, y: 150, vx: 270, vy: 130 },
    basket: { x: 780, y: 1120, width: 125 },
    obstacles: [
      { x: 360, y: 480, width: 40, height: 240 },
      { x: 640, y: 720, width: 40, height: 240 },
      { x: 500, y: 920, width: 220, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 520, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 660, length: 140, angle: 0 },
      { id: 'd3', x: 540, y: 840, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 310, angle: -36 },
      { id: 'd2', x: 200, y: 650, angle: 45 },
      { id: 'd3', x: 540, y: 830, angle: -28 }
    ]
  },
  {
    id: 55,
    title: "Hyperbolic Flight",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Four successive bounces spanning all corners of the board.",
    ball: { x: 140, y: 160, vx: 310, vy: 140 },
    basket: { x: 200, y: 1120, width: 120 },
    obstacles: [
      { x: 500, y: 640, width: 50, height: 360 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 800, y: 480, length: 140, angle: 0 },
      { id: 'd3', x: 720, y: 820, length: 140, angle: 0 },
      { id: 'd4', x: 380, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 310, angle: -38 },
      { id: 'd2', x: 800, y: 470, angle: -58 },
      { id: 'd3', x: 720, y: 810, angle: -45 },
      { id: 'd4', x: 380, y: 950, angle: 32 }
    ]
  },
  // Tier 6: Grandmaster Mazes (Levels 56 - 65)
  {
    id: 56,
    title: "Titan Fortress",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "Heavily fortified stone pillar layout.",
    ball: { x: 180, y: 150, vx: 280, vy: 140 },
    basket: { x: 820, y: 1100, width: 125 },
    obstacles: [
      { x: 420, y: 450, width: 80, height: 180 },
      { x: 580, y: 750, width: 80, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 240, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 310, angle: -48 },
      { id: 'd2', x: 240, y: 610, angle: 45 },
      { id: 'd3', x: 520, y: 910, angle: -32 }
    ]
  },
  {
    id: 57,
    title: "Chromatic Drift",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Drift across vibrant cyber channels.",
    ball: { x: 150, y: 160, vx: 270, vy: 120 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 300, y: 620, width: 40, height: 320 },
      { x: 700, y: 620, width: 40, height: 320 }
    ],
    deflectors: [
      { id: 'd1', x: 620, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 380, y: 880, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 620, y: 330, angle: -42 },
      { id: 'd2', x: 380, y: 860, angle: 32 }
    ]
  },
  {
    id: 58,
    title: "Stealth Vector",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "Low-profile deflection sequence with minimal room for error.",
    ball: { x: 180, y: 160, vx: 290, vy: 140 },
    basket: { x: 200, y: 1120, width: 125 },
    obstacles: [
      { x: 480, y: 480, width: 340, height: 40 },
      { x: 520, y: 800, width: 340, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 300, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 720, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 280, angle: -54 },
      { id: 'd2', x: 200, y: 600, angle: 45 },
      { id: 'd3', x: 720, y: 930, angle: -50 }
    ]
  },
  {
    id: 59,
    title: "Singularity Well",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "Focus energy towards a central well.",
    ball: { x: 160, y: 150, vx: 260, vy: 130 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 500, y: 620, width: 160, height: 160 }
    ],
    deflectors: [
      { id: 'd1', x: 720, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 720, y: 800, length: 140, angle: 0 },
      { id: 'd3', x: 280, y: 800, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 720, y: 330, angle: -50 },
      { id: 'd2', x: 720, y: 790, angle: -75 },
      { id: 'd3', x: 280, y: 790, angle: 52 }
    ]
  },
  {
    id: 60,
    title: "Diamond Prism",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Four-plank diamond deflection pattern.",
    ball: { x: 150, y: 150, vx: 300, vy: 150 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 300, y: 620, width: 50, height: 260 },
      { x: 700, y: 620, width: 50, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 820, y: 520, length: 140, angle: 0 },
      { id: 'd3', x: 180, y: 760, length: 140, angle: 0 },
      { id: 'd4', x: 660, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 330, angle: -38 },
      { id: 'd2', x: 820, y: 510, angle: -58 },
      { id: 'd3', x: 180, y: 750, angle: 46 },
      { id: 'd4', x: 660, y: 950, angle: -42 }
    ]
  },
  {
    id: 61,
    title: "Ironclad Ledge",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "Bank off ironclad wooden platforms.",
    ball: { x: 180, y: 160, vx: 270, vy: 130 },
    basket: { x: 800, y: 1120, width: 125 },
    obstacles: [
      { x: 380, y: 460, width: 40, height: 200 },
      { x: 640, y: 720, width: 40, height: 200 }
    ],
    deflectors: [
      { id: 'd1', x: 540, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 540, y: 310, angle: -38 },
      { id: 'd2', x: 200, y: 630, angle: 45 },
      { id: 'd3', x: 520, y: 910, angle: -30 }
    ]
  },
  {
    id: 62,
    title: "Pulsar Bounce",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "High-tempo bouncing requiring three synced planks.",
    ball: { x: 160, y: 150, vx: 310, vy: 150 },
    basket: { x: 220, y: 1120, width: 125 },
    obstacles: [
      { x: 500, y: 560, width: 340, height: 45 }
    ],
    deflectors: [
      { id: 'd1', x: 740, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 280, y: 720, length: 140, angle: 0 },
      { id: 'd3', x: 700, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 740, y: 330, angle: -50 },
      { id: 'd2', x: 280, y: 710, angle: 38 },
      { id: 'd3', x: 700, y: 930, angle: -48 }
    ]
  },
  {
    id: 63,
    title: "Cascade Symphony",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "Rhythmic step-down sequence with precision elevation.",
    ball: { x: 180, y: 160, vx: 260, vy: 140 },
    basket: { x: 620, y: 1120, width: 130 },
    obstacles: [
      { x: 350, y: 640, width: 60, height: 300 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 380, length: 150, angle: 0 },
      { id: 'd2', x: 760, y: 620, length: 150, angle: 0 },
      { id: 'd3', x: 500, y: 900, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 360, angle: -40 },
      { id: 'd2', x: 760, y: 600, angle: -54 },
      { id: 'd3', x: 500, y: 880, angle: -24 }
    ]
  },
  {
    id: 64,
    title: "Fractal Gateway",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Complex branching obstacle matrix.",
    ball: { x: 140, y: 150, vx: 290, vy: 140 },
    basket: { x: 780, y: 1120, width: 120 },
    obstacles: [
      { x: 380, y: 520, width: 45, height: 240 },
      { x: 660, y: 740, width: 45, height: 240 }
    ],
    deflectors: [
      { id: 'd1', x: 520, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 520, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 520, y: 310, angle: -36 },
      { id: 'd2', x: 180, y: 630, angle: 45 },
      { id: 'd3', x: 520, y: 910, angle: -30 }
    ]
  },
  {
    id: 65,
    title: "The Monolith",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "Enormous central obstacle requiring perimeter navigation.",
    ball: { x: 160, y: 150, vx: 280, vy: 110 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 500, y: 620, width: 220, height: 260 }
    ],
    deflectors: [
      { id: 'd1', x: 740, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 760, y: 800, length: 140, angle: 0 },
      { id: 'd3', x: 260, y: 800, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 740, y: 330, angle: -50 },
      { id: 'd2', x: 760, y: 790, angle: -76 },
      { id: 'd3', x: 260, y: 790, angle: 52 }
    ]
  },
  // Tier 7: Apex Champion Gauntlet (Levels 66 - 75)
  {
    id: 66,
    title: "Nebula Gauntlet",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "First stage of the Apex Gauntlet: high velocity ricochet.",
    ball: { x: 180, y: 150, vx: 320, vy: 160 },
    basket: { x: 800, y: 1120, width: 120 },
    obstacles: [
      { x: 420, y: 480, width: 50, height: 220 },
      { x: 680, y: 740, width: 50, height: 220 }
    ],
    deflectors: [
      { id: 'd1', x: 600, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 220, y: 640, length: 140, angle: 0 },
      { id: 'd3', x: 540, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 600, y: 310, angle: -42 },
      { id: 'd2', x: 220, y: 630, angle: 45 },
      { id: 'd3', x: 540, y: 910, angle: -32 }
    ]
  },
  {
    id: 67,
    title: "Supernova Rebound",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Extreme rebound angles across neon walls.",
    ball: { x: 150, y: 160, vx: 290, vy: 140 },
    basket: { x: 220, y: 1120, width: 120 },
    obstacles: [
      { x: 480, y: 500, width: 340, height: 40 },
      { x: 520, y: 820, width: 340, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 300, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 720, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 280, angle: -55 },
      { id: 'd2', x: 200, y: 600, angle: 45 },
      { id: 'd3', x: 720, y: 930, angle: -50 }
    ]
  },
  {
    id: 68,
    title: "Aegis Peril",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "Navigate past staggered shield blocks.",
    ball: { x: 180, y: 150, vx: 270, vy: 130 },
    basket: { x: 820, y: 1100, width: 125 },
    obstacles: [
      { x: 380, y: 450, width: 60, height: 180 },
      { x: 620, y: 750, width: 60, height: 180 }
    ],
    deflectors: [
      { id: 'd1', x: 660, y: 320, length: 140, angle: 0 },
      { id: 'd2', x: 220, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 500, y: 920, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 660, y: 310, angle: -46 },
      { id: 'd2', x: 220, y: 610, angle: 46 },
      { id: 'd3', x: 500, y: 910, angle: -32 }
    ]
  },
  {
    id: 69,
    title: "Absolute Zero",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "Precision vector calculation down to decimal points.",
    ball: { x: 160, y: 160, vx: 280, vy: 130 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 300, y: 600, width: 45, height: 300 },
      { x: 700, y: 600, width: 45, height: 300 },
      { x: 500, y: 840, width: 200, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 640, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 380, y: 700, length: 140, angle: 0 },
      { id: 'd3', x: 640, y: 960, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 640, y: 330, angle: -45 },
      { id: 'd2', x: 380, y: 690, angle: 38 },
      { id: 'd3', x: 640, y: 950, angle: -42 }
    ]
  },
  {
    id: 70,
    title: "Solar Flare Drop",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "Accelerate down the solar chute into the basket.",
    ball: { x: 180, y: 140, vx: 300, vy: 170 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 260, y: 620, width: 60, height: 360 },
      { x: 740, y: 620, width: 60, height: 360 }
    ],
    deflectors: [
      { id: 'd1', x: 620, y: 360, length: 150, angle: 0 },
      { id: 'd2', x: 380, y: 880, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 620, y: 340, angle: -44 },
      { id: 'd2', x: 380, y: 860, angle: 32 }
    ]
  },
  {
    id: 71,
    title: "Event Horizon",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "Four-point perimeter orbital wrap.",
    ball: { x: 140, y: 150, vx: 310, vy: 150 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 320, y: 600, width: 50, height: 260 },
      { x: 680, y: 600, width: 50, height: 260 },
      { x: 500, y: 880, width: 180, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 800, y: 520, length: 140, angle: 0 },
      { id: 'd3', x: 200, y: 780, length: 140, angle: 0 },
      { id: 'd4', x: 680, y: 980, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 330, angle: -38 },
      { id: 'd2', x: 800, y: 510, angle: -58 },
      { id: 'd3', x: 200, y: 760, angle: 45 },
      { id: 'd4', x: 670, y: 970, angle: -42 }
    ]
  },
  {
    id: 72,
    title: "Timber Masterpiece",
    difficulty: "Grandmaster",
    theme: "wood",
    instruction: "The pinnacle of craftsman woodwork geometry.",
    ball: { x: 160, y: 160, vx: 280, vy: 120 },
    basket: { x: 800, y: 1100, width: 125 },
    obstacles: [
      { x: 500, y: 680, width: 60, height: 420 }
    ],
    deflectors: [
      { id: 'd1', x: 340, y: 360, length: 150, angle: 0 },
      { id: 'd2', x: 720, y: 440, length: 150, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 340, y: 340, angle: 36 },
      { id: 'd2', x: 720, y: 420, angle: -40 }
    ]
  },
  {
    id: 73,
    title: "Spectral Odyssey",
    difficulty: "Grandmaster",
    theme: "blueprint",
    instruction: "Three deep deflections weaving through staggered blueprint arches.",
    ball: { x: 180, y: 150, vx: 260, vy: 140 },
    basket: { x: 220, y: 1120, width: 125 },
    obstacles: [
      { x: 480, y: 460, width: 340, height: 40 },
      { x: 420, y: 780, width: 340, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 760, y: 300, length: 140, angle: 0 },
      { id: 'd2', x: 180, y: 620, length: 140, angle: 0 },
      { id: 'd3', x: 700, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 760, y: 280, angle: -54 },
      { id: 'd2', x: 180, y: 600, angle: 45 },
      { id: 'd3', x: 700, y: 930, angle: -50 }
    ]
  },
  {
    id: 74,
    title: "Omega Vector",
    difficulty: "Grandmaster",
    theme: "arcade",
    instruction: "Penultimate challenge: high speed pinball switchback.",
    ball: { x: 150, y: 160, vx: 310, vy: 140 },
    basket: { x: 800, y: 1120, width: 120 },
    obstacles: [
      { x: 400, y: 420, width: 140, height: 40 },
      { x: 620, y: 640, width: 140, height: 40 },
      { x: 360, y: 840, width: 140, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 680, y: 280, length: 140, angle: 0 },
      { id: 'd2', x: 200, y: 560, length: 140, angle: 0 },
      { id: 'd3', x: 580, y: 940, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 680, y: 270, angle: -52 },
      { id: 'd2', x: 200, y: 550, angle: 42 },
      { id: 'd3', x: 580, y: 930, angle: -34 }
    ]
  },
  {
    id: 75,
    title: "Grandmaster Infinite",
    difficulty: "Grandmaster",
    theme: "neon",
    instruction: "The ultimate 75th level culmination: four plank perfection into the basket!",
    ball: { x: 140, y: 150, vx: 320, vy: 160 },
    basket: { x: 500, y: 1140, width: 120 },
    obstacles: [
      { x: 300, y: 580, width: 50, height: 280 },
      { x: 700, y: 580, width: 50, height: 280 },
      { x: 500, y: 880, width: 200, height: 40 }
    ],
    deflectors: [
      { id: 'd1', x: 480, y: 340, length: 140, angle: 0 },
      { id: 'd2', x: 800, y: 520, length: 140, angle: 0 },
      { id: 'd3', x: 200, y: 780, length: 140, angle: 0 },
      { id: 'd4', x: 680, y: 980, length: 140, angle: 0 }
    ],
    hints: [
      { id: 'd1', x: 480, y: 330, angle: -38 },
      { id: 'd2', x: 800, y: 510, angle: -58 },
      { id: 'd3', x: 200, y: 760, angle: 45 },
      { id: 'd4', x: 670, y: 970, angle: -42 }
    ]
  }
];
