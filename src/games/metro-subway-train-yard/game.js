(() => {
  // src/games/metro-subway-train-yard/src/levels.ts
  var LEVELS = [
    // --- ACT 1: DEPOT APPRENTICE (Levels 1 - 5) ---
    {
      id: 1,
      name: "First Switch",
      subtitle: "Depot Induction",
      difficulty: "Easy",
      trackCount: 2,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.3, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "blue", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1 }
      ],
      targetTimeSec: 25,
      hintDescription: "Divert Red Train from Track 0 to Track 1 via Switch 1, and Blue Train from Track 1 to Track 0 via Switch 2. Tap a train to brake and avoid collisions!"
    },
    {
      id: 2,
      name: "Parallel Cross",
      subtitle: "Two-Way Turnout",
      difficulty: "Easy",
      trackCount: 2,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.3, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 0, xNorm: 0.55, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "green", label: "M3 Green" },
        { trackIndex: 1, color: "yellow", label: "M4 Yellow" }
      ],
      trains: [
        { id: "t1", color: "green", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "yellow", carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1 }
      ],
      targetTimeSec: 25,
      hintDescription: "Divert Yellow Train to Track 1 using Switch 1. Then divert Green Train to Track 0 using Switch 2."
    },
    {
      id: 3,
      name: "Three-Car Express",
      subtitle: "Longer Rolling Stock",
      difficulty: "Easy",
      trackCount: 2,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.4, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "purple", label: "M5 Purple" },
        { trackIndex: 1, color: "orange", label: "M6 Orange" }
      ],
      trains: [
        { id: "t1", color: "orange", carCount: 3, startTrack: 0, startXNorm: 0.04, speed: 1.05 },
        { id: "t2", color: "purple", carCount: 3, startTrack: 0, startXNorm: -0.32, speed: 1 }
      ],
      targetTimeSec: 30,
      hintDescription: "The Orange Train comes first: divert it down. Once its 3 cars clear the switch, flip it back to straight for the Purple Train!"
    },
    {
      id: 4,
      name: "Triple Platform",
      subtitle: "Introduction to 3 Tracks",
      difficulty: "Easy",
      trackCount: 3,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.32, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.56, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "green", carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "red", carCount: 2, startTrack: 0, startXNorm: -0.25, speed: 1 },
        { id: "t3", color: "blue", carCount: 2, startTrack: 0, startXNorm: -0.55, speed: 1 }
      ],
      targetTimeSec: 35,
      hintDescription: "Single line sequence: Green takes switch 1 then switch 2 to reach bottom. Red takes switch 1 only. Blue goes straight."
    },
    {
      id: 5,
      name: "Brake & Clearance",
      subtitle: "Traffic Control",
      difficulty: "Easy",
      trackCount: 3,
      switches: [
        { id: "sw1", fromTrack: 1, toTrack: 0, xNorm: 0.35, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.35, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 2, color: "blue", label: "M2 Blue" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "blue", carCount: 3, startTrack: 1, startXNorm: -0.35, speed: 1 },
        { id: "t3", color: "yellow", carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 0.9 }
      ],
      targetTimeSec: 35,
      hintDescription: "Tap the Yellow train to pause it while Red crosses track 0 safely. Then release Yellow and steer Blue to track 2."
    },
    // --- ACT 2: JUNCTION COORDINATOR (Levels 6 - 10) ---
    {
      id: 6,
      name: "Scissor Crossing",
      subtitle: "X-Junction Manifold",
      difficulty: "Medium",
      trackCount: 3,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 0, xNorm: 0.55, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 1, toTrack: 2, xNorm: 0.55, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "orange", label: "M6 Orange" },
        { trackIndex: 1, color: "purple", label: "M5 Purple" },
        { trackIndex: 2, color: "cyan", label: "M7 Cyan" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "cyan", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
        { id: "t3", color: "orange", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 0.95 }
      ],
      targetTimeSec: 40,
      hintDescription: "Dispatch Cyan first to track 2. Then divert Purple to track 1, and make sure Orange crosses to track 0."
    },
    {
      id: 7,
      name: "Four-Car Heavy Haul",
      subtitle: "Length Management",
      difficulty: "Medium",
      trackCount: 3,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.3, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 1, xNorm: 0.3, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 0, xNorm: 0.6, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "green", label: "M3 Green" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" }
      ],
      trains: [
        { id: "t1", color: "green", carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "red", carCount: 3, startTrack: 0, startXNorm: 0.04, speed: 1 },
        { id: "t3", color: "yellow", carCount: 2, startTrack: 1, startXNorm: 0.04, speed: 1.1 }
      ],
      targetTimeSec: 45,
      hintDescription: "A 4-car train takes longer to clear a switch. Tap to hold Green until Red has finished crossing track 1!"
    },
    {
      id: 8,
      name: "Quad Yard Gate",
      subtitle: "4-Track Grid Entrance",
      difficulty: "Medium",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 3, xNorm: 0.65, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.05 },
        { id: "t2", color: "yellow", carCount: 3, startTrack: 0, startXNorm: -0.35, speed: 1 },
        { id: "t3", color: "red", carCount: 2, startTrack: 0, startXNorm: -0.7, speed: 1 },
        { id: "t4", color: "blue", carCount: 2, startTrack: 0, startXNorm: -1, speed: 1 }
      ],
      targetTimeSec: 50,
      hintDescription: "Staircase turnout: Purple steps down to track 3, Yellow steps to track 2, Red steps to track 1, Blue stays straight."
    },
    {
      id: 9,
      name: "Double Inversion",
      subtitle: "Dual Reversible Tracks",
      difficulty: "Medium",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.3, lengthNorm: 0.25, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 1, xNorm: 0.3, lengthNorm: 0.25, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 0, xNorm: 0.6, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 3, xNorm: 0.6, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "green", label: "M3 Green" },
        { trackIndex: 1, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 2, color: "orange", label: "M6 Orange" },
        { trackIndex: 3, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "orange", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "green", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "cyan", carCount: 2, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
        { id: "t4", color: "red", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
      ],
      targetTimeSec: 50,
      hintDescription: "Hold tracks 1 and 2 briefly while trains on 0 and 3 cross over, then route all 4 trains to their target tunnel lines."
    },
    {
      id: 10,
      name: "Rush Hour Squeeze",
      subtitle: "High Frequency Shunting",
      difficulty: "Medium",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 1, toTrack: 0, xNorm: 0.3, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 3, xNorm: 0.3, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 0, toTrack: 2, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 2, color: "red", label: "M1 Red" },
        { trackIndex: 3, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
        { id: "t2", color: "blue", carCount: 4, startTrack: 1, startXNorm: -0.42, speed: 0.95 },
        { id: "t3", color: "green", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1 }
      ],
      targetTimeSec: 45,
      hintDescription: "Red goes straight to track 0 and then crosses to track 2. Blue follows behind straight to track 0."
    },
    // --- ACT 3: YARD CHIEF (Levels 11 - 18) ---
    {
      id: 11,
      name: "The Diamond Grid",
      subtitle: "Interlocking Switches",
      difficulty: "Medium",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 1, toTrack: 0, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 1, xNorm: 0.5, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 3, xNorm: 0.5, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "purple", label: "M5 Purple" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "green", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "purple", carCount: 2, startTrack: 2, startXNorm: -0.32, speed: 1.1 }
      ],
      targetTimeSec: 45,
      hintDescription: "Divert Red to Track 0. Divert Green to Track 3. Then bring Purple from Track 2 up to Track 1!"
    },
    {
      id: 12,
      name: "Four-Car Congestion",
      subtitle: "Heavy Articulation",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.28, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 2, xNorm: 0.28, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 2, xNorm: 0.58, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "orange", label: "M6 Orange" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 3, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "blue", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "cyan", carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
        { id: "t3", color: "orange", carCount: 3, startTrack: 1, startXNorm: 0.04, speed: 1.05 }
      ],
      targetTimeSec: 50,
      hintDescription: "Hold the 4-car Blue train until Orange passes Track 1, then guide Blue down to Track 1 safely."
    },
    {
      id: 13,
      name: "Staggered Dispatch",
      subtitle: "Timing is Everything",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.25, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 3, xNorm: 0.25, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "blue", label: "M2 Blue" },
        { trackIndex: 3, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "green", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "yellow", carCount: 2, startTrack: 0, startXNorm: -0.32, speed: 1.1 },
        { id: "t4", color: "blue", carCount: 2, startTrack: 1, startXNorm: -0.32, speed: 1.1 }
      ],
      targetTimeSec: 55,
      hintDescription: "Stagger your train starts: send Red across first to Track 2, then switch it back to Track 1."
    },
    {
      id: 14,
      name: "Full Pentad Depot",
      subtitle: "5-Track Yard Launch",
      difficulty: "Hard",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.4, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 3, xNorm: 0.58, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 4, xNorm: 0.74, lengthNorm: 0.16, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "green", label: "M3 Green" },
        { trackIndex: 3, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 4, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "yellow", carCount: 2, startTrack: 0, startXNorm: -0.3, speed: 1 },
        { id: "t3", color: "green", carCount: 2, startTrack: 0, startXNorm: -0.55, speed: 1 },
        { id: "t4", color: "blue", carCount: 3, startTrack: 0, startXNorm: -0.8, speed: 1 },
        { id: "t5", color: "red", carCount: 2, startTrack: 0, startXNorm: -1.1, speed: 1 }
      ],
      targetTimeSec: 60,
      hintDescription: "5-train sequential sorting cascade! Step each train down to its respective target track as it passes each switch node."
    },
    {
      id: 15,
      name: "The Central Bypass",
      subtitle: "Express Through-Line",
      difficulty: "Hard",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 1, toTrack: 2, xNorm: 0.28, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 2, xNorm: 0.28, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 4, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "orange", label: "M6 Orange" },
        { trackIndex: 1, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 2, color: "blue", label: "M2 Blue" },
        { trackIndex: 3, color: "purple", label: "M5 Purple" },
        { trackIndex: 4, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "orange", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
        { id: "t2", color: "green", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
        { id: "t3", color: "blue", carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.9 }
      ],
      targetTimeSec: 50,
      hintDescription: "Track 2 is the bottleneck! Let the Blue 4-car express go through, or funnel Orange and Green across the central spine."
    },
    {
      id: 16,
      name: "Dual Scissor Weave",
      subtitle: "Weaving Lines",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 3, xNorm: 0.22, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 2, xNorm: 0.48, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 0, xNorm: 0.68, lengthNorm: 0.24, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "purple", label: "M5 Purple" },
        { trackIndex: 3, color: "blue", label: "M2 Blue" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "yellow", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "red", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
        { id: "t4", color: "blue", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 0.95 }
      ],
      targetTimeSec: 55,
      hintDescription: "Coordinate 4 trains simultaneously: Red stays on Track 1, Blue stays on Track 3, Purple weaves 0->1->2, Yellow weaves 2->3->0."
    },
    {
      id: 17,
      name: "Velocity Gradient",
      subtitle: "Varying Train Speeds",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.3, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 1, xNorm: 0.3, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 3, xNorm: 0.6, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 1, color: "green", label: "M3 Green" },
        { trackIndex: 2, color: "orange", label: "M6 Orange" },
        { trackIndex: 3, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 2, startTrack: 0, startXNorm: 0.05, speed: 1.3 },
        // Fast
        { id: "t2", color: "green", carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.8 },
        // Heavy & Slow
        { id: "t3", color: "cyan", carCount: 3, startTrack: 0, startXNorm: -0.32, speed: 1 }
      ],
      targetTimeSec: 45,
      hintDescription: "The fast 2-car Red train can quickly slip past before the slow 4-car Green train reaches the midpoint."
    },
    {
      id: 18,
      name: "The Loop Shuttle",
      subtitle: "Twin Crossover",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 3, xNorm: 0.24, lengthNorm: 0.28, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 0, xNorm: 0.24, lengthNorm: 0.28, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 2, xNorm: 0.58, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 1, xNorm: 0.58, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 2, color: "red", label: "M1 Red" },
        { trackIndex: 3, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "green", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "blue", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "red", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
        { id: "t4", color: "yellow", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
      ],
      targetTimeSec: 55,
      hintDescription: "Top and bottom swap tracks using switches 1 and 2, while inner tracks 1 and 2 swap using switches 3 and 4."
    },
    // --- ACT 4: MASTER DISPATCHER (Levels 19 - 25) ---
    {
      id: 19,
      name: "Grand Junction Alpha",
      subtitle: "5-Track Interconnect",
      difficulty: "Hard",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.2, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 4, toTrack: 2, xNorm: 0.2, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 1, xNorm: 0.5, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 3, xNorm: 0.5, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "purple", label: "M5 Purple" },
        { trackIndex: 3, color: "blue", label: "M2 Blue" },
        { trackIndex: 4, color: "yellow", label: "M4 Yellow" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "blue", carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "purple", carCount: 4, startTrack: 2, startXNorm: 0.04, speed: 0.9 },
        { id: "t4", color: "yellow", carCount: 2, startTrack: 4, startXNorm: -0.32, speed: 1.1 }
      ],
      targetTimeSec: 60,
      hintDescription: "Dispatch Purple straight through. Then route Red 0->2->1, Blue 4->2->3, and keep Yellow on 4."
    },
    {
      id: 20,
      name: "The Synchronized Quad",
      subtitle: "Precision Arrival",
      difficulty: "Hard",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 3, xNorm: 0.65, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 0, xNorm: 0.4, lengthNorm: 0.35, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "green", label: "M3 Green" },
        { trackIndex: 1, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 2, color: "orange", label: "M6 Orange" },
        { trackIndex: 3, color: "cyan", label: "M7 Cyan" }
      ],
      trains: [
        { id: "t1", color: "cyan", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "green", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "orange", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
        { id: "t4", color: "yellow", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.05 }
      ],
      targetTimeSec: 60,
      hintDescription: "Green on Track 3 takes the long diagonal switch up to Track 0 while Cyan cascades down to Track 3."
    },
    {
      id: 21,
      name: "Five-Line Metronome",
      subtitle: "Rhythm and Order",
      difficulty: "Hard",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.22, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 4, toTrack: 3, xNorm: 0.22, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 2, xNorm: 0.45, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 2, toTrack: 0, xNorm: 0.7, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "purple", label: "M5 Purple" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "red", label: "M1 Red" },
        { trackIndex: 3, color: "green", label: "M3 Green" },
        { trackIndex: 4, color: "yellow", label: "M4 Yellow" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "purple", carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "blue", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.1 },
        { id: "t4", color: "green", carCount: 2, startTrack: 3, startXNorm: 0.05, speed: 1.1 },
        { id: "t5", color: "yellow", carCount: 4, startTrack: 2, startXNorm: -0.32, speed: 0.9 }
      ],
      targetTimeSec: 65,
      hintDescription: "Hold the central Yellow train until Purple and Red finish crossing the center switches."
    },
    {
      id: 22,
      name: "Chamber of Switches",
      subtitle: "Multi-Branch Routing",
      difficulty: "Hard",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 3, xNorm: 0.2, lengthNorm: 0.3, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 4, toTrack: 1, xNorm: 0.2, lengthNorm: 0.3, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 4, xNorm: 0.55, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 1, toTrack: 0, xNorm: 0.6, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "orange", label: "M6 Orange" },
        { trackIndex: 1, color: "green", label: "M3 Green" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 4, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "cyan", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "orange", carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "red", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.1 },
        { id: "t4", color: "green", carCount: 4, startTrack: 4, startXNorm: -0.35, speed: 0.9 }
      ],
      targetTimeSec: 65,
      hintDescription: "Long diagonals cross each other: tap Orange to wait 2 seconds while Cyan sweeps down to Track 3."
    },
    {
      id: 23,
      name: "Quad Car Ballet",
      subtitle: "Multiple 4-Car Sets",
      difficulty: "Expert",
      trackCount: 4,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.25, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 2, xNorm: 0.25, lengthNorm: 0.2, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 3, xNorm: 0.55, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 0, xNorm: 0.55, lengthNorm: 0.24, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "green", label: "M3 Green" },
        { trackIndex: 3, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "red", carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
        { id: "t3", color: "blue", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t4", color: "green", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1 }
      ],
      targetTimeSec: 65,
      hintDescription: "Two 4-car trains cross each other in the middle. Brake Purple or Red to allow clean non-colliding passage."
    },
    {
      id: 24,
      name: "The Central Vortex",
      subtitle: "Interchange Knot",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 1, toTrack: 0, xNorm: 0.22, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 3, toTrack: 4, xNorm: 0.22, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 1, xNorm: 0.44, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 3, xNorm: 0.44, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 0, toTrack: 2, xNorm: 0.68, lengthNorm: 0.2, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 1, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 2, color: "red", label: "M1 Red" },
        { trackIndex: 3, color: "blue", label: "M2 Blue" },
        { trackIndex: 4, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "yellow", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t2", color: "green", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "red", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t4", color: "cyan", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.1 },
        { id: "t5", color: "blue", carCount: 2, startTrack: 2, startXNorm: -0.32, speed: 1.1 }
      ],
      targetTimeSec: 70,
      hintDescription: "Yellow diverts to Track 0, Green diverts to Track 4. Red on 0 takes Switch 5 into Track 2."
    },
    {
      id: 25,
      name: "Precision Dispatch 25",
      subtitle: "Quarter Century Milestone",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.2, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 4, toTrack: 2, xNorm: 0.2, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 3, xNorm: 0.5, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 1, xNorm: 0.5, lengthNorm: 0.24, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 2, toTrack: 4, xNorm: 0.74, lengthNorm: 0.16, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "purple", label: "M5 Purple" },
        { trackIndex: 1, color: "orange", label: "M6 Orange" },
        { trackIndex: 2, color: "green", label: "M3 Green" },
        { trackIndex: 3, color: "blue", label: "M2 Blue" },
        { trackIndex: 4, color: "red", label: "M1 Red" }
      ],
      trains: [
        { id: "t1", color: "red", carCount: 3, startTrack: 0, startXNorm: 0.05, speed: 1.05 },
        { id: "t2", color: "green", carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1 },
        { id: "t3", color: "blue", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1 },
        { id: "t4", color: "orange", carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.9 }
      ],
      targetTimeSec: 70,
      hintDescription: "Red sweeps 0->2->4 to reach bottom. Orange and Blue swap middle tracks safely."
    },
    // --- ACT 5: GRAND METRO CONTROLLER (Levels 26 - 30) ---
    {
      id: 26,
      name: "The Overpass Labyrinth",
      subtitle: "High Density Routing",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.18, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 2, toTrack: 3, xNorm: 0.18, lengthNorm: 0.16, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 1, toTrack: 4, xNorm: 0.42, lengthNorm: 0.32, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 0, xNorm: 0.42, lengthNorm: 0.32, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 4, toTrack: 2, xNorm: 0.76, lengthNorm: 0.16, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "green", label: "M3 Green" },
        { trackIndex: 4, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "red", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.05 },
        { id: "t3", color: "yellow", carCount: 3, startTrack: 4, startXNorm: 0.05, speed: 1 },
        { id: "t4", color: "cyan", carCount: 2, startTrack: 1, startXNorm: 0.05, speed: 1.15 }
      ],
      targetTimeSec: 75,
      hintDescription: "Long distance switch diagonals: Cyan stays straight on Track 1, Purple takes 0->1->4, Red goes 2->3->0, Yellow takes 4->2."
    },
    {
      id: 27,
      name: "Midnight Express Run",
      subtitle: "Zero Margin for Error",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.22, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 4, toTrack: 2, xNorm: 0.22, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 0, xNorm: 0.52, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 2, toTrack: 4, xNorm: 0.52, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 1, toTrack: 3, xNorm: 0.35, lengthNorm: 0.28, initialState: "straight", state: "straight" },
        { id: "sw6", fromTrack: 3, toTrack: 1, xNorm: 0.35, lengthNorm: 0.28, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "blue", label: "M2 Blue" },
        { trackIndex: 1, color: "red", label: "M1 Red" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "green", label: "M3 Green" },
        { trackIndex: 4, color: "orange", label: "M6 Orange" }
      ],
      trains: [
        { id: "t1", color: "orange", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.9 },
        { id: "t2", color: "blue", carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.9 },
        { id: "t3", color: "green", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
        { id: "t4", color: "red", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
        { id: "t5", color: "yellow", carCount: 2, startTrack: 2, startXNorm: -0.3, speed: 1.15 }
      ],
      targetTimeSec: 80,
      hintDescription: "5 heavy trains! Stagger the outer 4-car express sets, while inner Green and Red swap tracks."
    },
    {
      id: 28,
      name: "Hexagonal Switch Web",
      subtitle: "Complex Multi-Branching",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.18, lengthNorm: 0.15, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.34, lengthNorm: 0.15, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 3, toTrack: 2, xNorm: 0.34, lengthNorm: 0.15, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 4, toTrack: 3, xNorm: 0.18, lengthNorm: 0.15, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 2, toTrack: 0, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw6", fromTrack: 2, toTrack: 4, xNorm: 0.58, lengthNorm: 0.22, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "cyan", label: "M7 Cyan" },
        { trackIndex: 1, color: "purple", label: "M5 Purple" },
        { trackIndex: 2, color: "blue", label: "M2 Blue" },
        { trackIndex: 3, color: "orange", label: "M6 Orange" },
        { trackIndex: 4, color: "green", label: "M3 Green" }
      ],
      trains: [
        { id: "t1", color: "green", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "cyan", carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.95 },
        { id: "t3", color: "purple", carCount: 3, startTrack: 1, startXNorm: 0.05, speed: 1.05 },
        { id: "t4", color: "orange", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
        { id: "t5", color: "blue", carCount: 2, startTrack: 2, startXNorm: 0.05, speed: 1.2 }
      ],
      targetTimeSec: 85,
      hintDescription: "Green 0->1->2->4 takes the funnel to bottom. Cyan 4->3->2->0 takes the funnel to top. Blue shoots straight."
    },
    {
      id: 29,
      name: "The Four-Car Supergrid",
      subtitle: "Maximum Articulation",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 2, xNorm: 0.2, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 3, xNorm: 0.2, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 3, toTrack: 1, xNorm: 0.48, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 4, toTrack: 2, xNorm: 0.48, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 2, toTrack: 0, xNorm: 0.72, lengthNorm: 0.18, initialState: "straight", state: "straight" },
        { id: "sw6", fromTrack: 2, toTrack: 4, xNorm: 0.72, lengthNorm: 0.18, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 3, color: "green", label: "M3 Green" },
        { trackIndex: 4, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 0.95 },
        { id: "t2", color: "green", carCount: 4, startTrack: 1, startXNorm: 0.04, speed: 0.95 },
        { id: "t3", color: "blue", carCount: 4, startTrack: 3, startXNorm: 0.04, speed: 0.95 },
        { id: "t4", color: "red", carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 0.95 },
        { id: "t5", color: "yellow", carCount: 3, startTrack: 2, startXNorm: -0.32, speed: 1.05 }
      ],
      targetTimeSec: 90,
      hintDescription: "Four 4-car trains + 1 center train! Tap to pause trains and form a clean convoy without tail collisions."
    },
    {
      id: 30,
      name: "Grand Central Yardmaster",
      subtitle: "The Ultimate Subway Challenge",
      difficulty: "Expert",
      trackCount: 5,
      switches: [
        { id: "sw1", fromTrack: 0, toTrack: 1, xNorm: 0.15, lengthNorm: 0.14, initialState: "straight", state: "straight" },
        { id: "sw2", fromTrack: 1, toTrack: 2, xNorm: 0.3, lengthNorm: 0.14, initialState: "straight", state: "straight" },
        { id: "sw3", fromTrack: 2, toTrack: 3, xNorm: 0.45, lengthNorm: 0.14, initialState: "straight", state: "straight" },
        { id: "sw4", fromTrack: 3, toTrack: 4, xNorm: 0.6, lengthNorm: 0.14, initialState: "straight", state: "straight" },
        { id: "sw5", fromTrack: 4, toTrack: 0, xNorm: 0.25, lengthNorm: 0.5, initialState: "straight", state: "straight" },
        { id: "sw6", fromTrack: 3, toTrack: 1, xNorm: 0.62, lengthNorm: 0.22, initialState: "straight", state: "straight" },
        { id: "sw7", fromTrack: 2, toTrack: 0, xNorm: 0.75, lengthNorm: 0.16, initialState: "straight", state: "straight" }
      ],
      tunnels: [
        { trackIndex: 0, color: "red", label: "M1 Red" },
        { trackIndex: 1, color: "blue", label: "M2 Blue" },
        { trackIndex: 2, color: "green", label: "M3 Green" },
        { trackIndex: 3, color: "yellow", label: "M4 Yellow" },
        { trackIndex: 4, color: "purple", label: "M5 Purple" }
      ],
      trains: [
        { id: "t1", color: "purple", carCount: 4, startTrack: 0, startXNorm: 0.04, speed: 1 },
        { id: "t2", color: "yellow", carCount: 4, startTrack: 1, startXNorm: 0.04, speed: 1 },
        { id: "t3", color: "red", carCount: 4, startTrack: 4, startXNorm: 0.04, speed: 1 },
        { id: "t4", color: "blue", carCount: 3, startTrack: 3, startXNorm: 0.05, speed: 1.05 },
        { id: "t5", color: "green", carCount: 3, startTrack: 2, startXNorm: 0.05, speed: 1.1 }
      ],
      targetTimeSec: 95,
      hintDescription: "The pinnacle of metro yard operations! Use speed controls, pause and release trains in choreography to avoid massive gridlock."
    }
  ];

  // src/games/metro-subway-train-yard/src/state.ts
  var STORAGE_KEY = "metro_subway_yard_save_v1";
  var GameStateManager = class {
    // initial free hints
    constructor() {
      this.currentLevelId = 1;
      this.hintsAvailable = 2;
      this.saveData = this.loadSave();
    }
    loadSave() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            unlockedLevel: parsed.unlockedLevel || 1,
            stars: parsed.stars || {},
            bestTimes: parsed.bestTimes || {}
          };
        }
      } catch {
      }
      return {
        unlockedLevel: 1,
        stars: {},
        bestTimes: {}
      };
    }
    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saveData));
      } catch {
      }
    }
    completeLevel(levelId, timeSec, targetTimeSec) {
      let stars = 1;
      if (timeSec <= targetTimeSec) stars = 3;
      else if (timeSec <= targetTimeSec * 1.4) stars = 2;
      const previousStars = this.saveData.stars[levelId] || 0;
      if (stars > previousStars) {
        this.saveData.stars[levelId] = stars;
      }
      const previousBest = this.saveData.bestTimes[levelId];
      if (!previousBest || timeSec < previousBest) {
        this.saveData.bestTimes[levelId] = timeSec;
      }
      const prevUnlocked = this.saveData.unlockedLevel;
      const nextLevel = Math.min(30, levelId + 1);
      this.saveData.unlockedLevel = Math.max(this.saveData.unlockedLevel, nextLevel);
      const isNewUnlock = this.saveData.unlockedLevel > prevUnlocked;
      this.save();
      return { stars, isNewUnlock };
    }
    getTotalStars() {
      return Object.values(this.saveData.stars).reduce((acc, s) => acc + s, 0);
    }
    getUnlockedLevel() {
      return this.saveData.unlockedLevel;
    }
    unlockAllForTesting() {
      this.saveData.unlockedLevel = 30;
      this.save();
    }
    resetProgress() {
      this.saveData = {
        unlockedLevel: 1,
        stars: {},
        bestTimes: {}
      };
      this.save();
    }
  };
  var gameState = new GameStateManager();

  // src/games/metro-subway-train-yard/src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.trainHumGain = null;
      this.trainHumOsc = null;
      this.isHumming = false;
      const savedMute = localStorage.getItem("metro_sound_muted");
      this.isMuted = savedMute === "true";
    }
    initCtx() {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtxClass();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("metro_sound_muted", String(this.isMuted));
      if (this.isMuted) {
        this.stopTrainHum();
      }
      return this.isMuted;
    }
    getIsMuted() {
      return this.isMuted;
    }
    playClick() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
    playSwitchToggle() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(480, now);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.06);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.09);
      osc2.stop(now + 0.09);
    }
    playTrainDispatch() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(480, now + 0.12);
      osc.frequency.linearRampToValueAtTime(640, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
    playTrainBrake() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(5e-3, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
    playTunnelArrival() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.2, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + i * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.35);
      });
    }
    playCollision() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      osc2.type = "square";
      osc2.frequency.setValueAtTime(220, now);
      osc2.frequency.exponentialRampToValueAtTime(50, now + 0.25);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    }
    playVictory() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },
        // C5
        { f: 659.25, t: 0.12, d: 0.12 },
        // E5
        { f: 783.99, t: 0.24, d: 0.12 },
        // G5
        { f: 1046.5, t: 0.36, d: 0.35 }
        // C6
      ];
      melody.forEach(({ f, t, d }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.28, now + t);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + t + d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    }
    updateTrainHum(movingTrainsCount) {
      if (this.isMuted || movingTrainsCount <= 0) {
        this.stopTrainHum();
        return;
      }
      this.initCtx();
      if (!this.ctx) return;
      if (!this.isHumming) {
        const now = this.ctx.currentTime;
        this.trainHumOsc = this.ctx.createOscillator();
        this.trainHumGain = this.ctx.createGain();
        this.trainHumOsc.type = "triangle";
        this.trainHumOsc.frequency.setValueAtTime(65, now);
        this.trainHumGain.gain.setValueAtTime(0.01, now);
        this.trainHumGain.gain.linearRampToValueAtTime(0.06 * Math.min(movingTrainsCount, 3), now + 0.2);
        this.trainHumOsc.connect(this.trainHumGain);
        this.trainHumGain.connect(this.ctx.destination);
        this.trainHumOsc.start(now);
        this.isHumming = true;
      } else if (this.trainHumGain) {
        const targetGain = 0.04 * Math.min(movingTrainsCount, 3);
        this.trainHumGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
      }
    }
    stopTrainHum() {
      if (this.isHumming && this.trainHumGain && this.trainHumOsc && this.ctx) {
        try {
          this.trainHumGain.gain.setTargetAtTime(1e-3, this.ctx.currentTime, 0.05);
          setTimeout(() => {
            if (this.trainHumOsc) {
              try {
                this.trainHumOsc.stop();
              } catch {
              }
              this.trainHumOsc.disconnect();
              this.trainHumOsc = null;
            }
            this.isHumming = false;
          }, 60);
        } catch {
        }
      }
      this.isHumming = false;
    }
  };
  var audio = new SoundManager();

  // src/games/metro-subway-train-yard/src/engine.ts
  var YardEngine = class {
    constructor(level, width, height) {
      this.width = 800;
      this.height = 500;
      this.tracksY = [];
      this.switches = [];
      this.trains = [];
      this.particles = [];
      this.dangerZones = [];
      this.speedMultiplier = 1;
      // 1x or 2x
      this.isPaused = false;
      this.gameTime = 0;
      // in seconds
      this.isCompleted = false;
      this.isGameOver = false;
      this.gameOverReason = "";
      // Geometry Constants & Dynamic Sizing
      this.CAR_LENGTH = 44;
      this.CAR_WIDTH = 22;
      this.CAR_GAP = 6;
      this.CAR_SPACING = 50;
      // CAR_LENGTH + CAR_GAP
      this.TUNNEL_X_NORM = 0.88;
      this.START_X_OFFSET = 30;
      this.level = JSON.parse(JSON.stringify(level));
      this.width = width;
      this.height = height;
      this.updateDimensions();
      this.init();
    }
    updateDimensions() {
      const scale = Math.max(0.62, Math.min(1.15, this.width / 720));
      this.CAR_LENGTH = Math.round(44 * scale);
      this.CAR_WIDTH = Math.round(22 * scale);
      this.CAR_GAP = Math.max(4, Math.round(6 * scale));
      this.CAR_SPACING = this.CAR_LENGTH + this.CAR_GAP;
    }
    init() {
      this.gameTime = 0;
      this.isCompleted = false;
      this.isGameOver = false;
      this.gameOverReason = "";
      this.particles = [];
      this.updateDimensions();
      this.recalculateTracks();
      this.switches = this.level.switches.map((sw) => ({
        ...sw,
        state: sw.initialState,
        animProgress: sw.initialState === "divert" ? 1 : 0
      }));
      this.trains = this.level.trains.map((t) => {
        const startX = this.width * t.startXNorm;
        const speed = (t.speed || 1) * (this.width * 0.135);
        const currentTrack = t.startTrack;
        const train = {
          id: t.id,
          color: t.color,
          carCount: t.carCount,
          speed,
          baseSpeed: speed,
          headX: startX,
          currentTrack,
          isMoving: true,
          // Auto starts moving, can be paused by tapping
          state: "MOVING",
          cars: [],
          pathHistory: [],
          enteredTimer: 0
        };
        const y = this.tracksY[currentTrack] || this.height * 0.5;
        for (let x = startX - (t.carCount * this.CAR_SPACING + 100); x <= startX; x += 2) {
          train.pathHistory.push({ x, y, angle: 0, trackIndex: currentTrack });
        }
        this.updateTrainCars(train);
        return train;
      });
    }
    recalculateTracks() {
      this.tracksY = [];
      const count = this.level.trackCount;
      if (count <= 0) return;
      const maxTrackGap = Math.min(105, Math.max(46, this.width * 0.22));
      const totalDesiredTracksHeight = count > 1 ? (count - 1) * maxTrackGap : 0;
      const availableH = this.height - 40;
      const actualGap = totalDesiredTracksHeight <= availableH && availableH > 150 ? maxTrackGap : count > 1 ? availableH / (count - 1) : 0;
      const startY = count > 1 ? Math.max(28, (this.height - (count - 1) * actualGap) / 2) : this.height / 2;
      for (let i = 0; i < count; i++) {
        this.tracksY.push(startY + i * actualGap);
      }
    }
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      const scaleX = width / this.width;
      const scaleY = height / this.height;
      this.width = width;
      this.height = height;
      this.updateDimensions();
      this.recalculateTracks();
      this.trains.forEach((train) => {
        train.headX *= scaleX;
        train.pathHistory = train.pathHistory.map((p) => ({
          x: p.x * scaleX,
          y: this.tracksY[p.trackIndex] || p.y * scaleY,
          angle: p.angle,
          trackIndex: p.trackIndex
        }));
        this.updateTrainCars(train);
      });
    }
    toggleSwitch(switchId) {
      const sw = this.switches.find((s) => s.id === switchId);
      if (!sw || this.isGameOver || this.isCompleted) return false;
      sw.state = sw.state === "straight" ? "divert" : "straight";
      audio.playSwitchToggle();
      const swX = this.width * sw.xNorm;
      const swY = this.tracksY[sw.fromTrack];
      this.spawnSparks(swX, swY, 12, "#38bdf8");
      return true;
    }
    toggleTrainMovement(trainId) {
      const train = this.trains.find((t) => t.id === trainId);
      if (!train || train.state === "ENTERED_TUNNEL" || train.state === "CRASHED" || this.isGameOver) {
        return false;
      }
      if (train.isMoving) {
        train.isMoving = false;
        train.state = "STOPPED";
        audio.playTrainBrake();
        if (train.cars.length > 0) {
          train.cars.forEach((car) => {
            this.spawnBrakeSparks(car.x, car.y + this.CAR_WIDTH * 0.4);
          });
        }
      } else {
        train.isMoving = true;
        train.state = "MOVING";
        audio.playTrainDispatch();
      }
      return true;
    }
    setSpeedMultiplier(mult) {
      this.speedMultiplier = mult;
    }
    setPaused(paused) {
      this.isPaused = paused;
      if (paused) {
        audio.stopTrainHum();
      }
    }
    update(dt) {
      if (this.isPaused || this.isGameOver || this.isCompleted) {
        this.updateParticles(dt);
        return;
      }
      const effectiveDt = dt * this.speedMultiplier;
      this.gameTime += effectiveDt;
      this.switches.forEach((sw) => {
        const target = sw.state === "divert" ? 1 : 0;
        if (sw.animProgress === void 0) sw.animProgress = target;
        sw.animProgress += (target - sw.animProgress) * Math.min(1, effectiveDt * 14);
      });
      let movingCount = 0;
      this.trains.forEach((train) => {
        if (train.state === "ENTERED_TUNNEL") {
          train.enteredTimer += effectiveDt;
          return;
        }
        if (train.state === "CRASHED" || !train.isMoving) {
          return;
        }
        movingCount++;
        const step = train.speed * effectiveDt;
        train.headX += step;
        const currentY = this.computeTrackYAtX(train.headX, train);
        const angle = this.computeTrackAngleAtX(train.headX, train);
        train.pathHistory.push({
          x: train.headX,
          y: currentY,
          angle,
          trackIndex: train.currentTrack
        });
        if (train.pathHistory.length > 1500) {
          train.pathHistory.splice(0, 500);
        }
        this.updateTrainCars(train);
        const tunnelX = this.width * this.TUNNEL_X_NORM;
        if (train.headX >= tunnelX) {
          this.checkTunnelArrival(train);
        }
      });
      audio.updateTrainHum(movingCount);
      this.checkCollisions();
      this.updateDangerZones();
      this.checkWinCondition();
      this.updateParticles(dt);
    }
    computeTrackYAtX(x, train) {
      const xNorm = x / this.width;
      for (const sw of this.switches) {
        const startX = sw.xNorm;
        const endX = sw.xNorm + sw.lengthNorm;
        if (xNorm >= startX && xNorm <= endX) {
          if (train.currentTrack === sw.fromTrack && sw.state === "divert") {
            const t = (xNorm - startX) / sw.lengthNorm;
            const smoothT = t * t * (3 - 2 * t);
            const yFrom = this.tracksY[sw.fromTrack];
            const yTo = this.tracksY[sw.toTrack];
            return yFrom + (yTo - yFrom) * smoothT;
          }
        } else if (xNorm > endX && train.currentTrack === sw.fromTrack && sw.state === "divert") {
          train.currentTrack = sw.toTrack;
        }
      }
      return this.tracksY[train.currentTrack] || this.height * 0.5;
    }
    computeTrackAngleAtX(x, train) {
      const delta = 3;
      const y1 = this.computeTrackYAtX(x - delta, train);
      const y2 = this.computeTrackYAtX(x + delta, train);
      return Math.atan2(y2 - y1, delta * 2);
    }
    updateTrainCars(train) {
      const cars = [];
      const history = train.pathHistory;
      const historyLen = history.length;
      if (historyLen === 0) return;
      const headPoint = history[historyLen - 1];
      cars.push({
        x: headPoint.x,
        y: headPoint.y,
        angle: headPoint.angle,
        trackIndex: headPoint.trackIndex,
        isEngine: true
      });
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
    findPointAtDistanceBehind(history, targetDist) {
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
      const first = history[0];
      const remainingDist = targetDist - accDist;
      return {
        x: first.x - remainingDist * Math.cos(first.angle),
        y: first.y - remainingDist * Math.sin(first.angle),
        angle: first.angle,
        trackIndex: first.trackIndex
      };
    }
    checkTunnelArrival(train) {
      if (train.state === "ENTERED_TUNNEL") return;
      const tunnel = this.level.tunnels.find((t) => t.trackIndex === train.currentTrack);
      if (tunnel && tunnel.color === train.color) {
        train.state = "ENTERED_TUNNEL";
        train.isMoving = false;
        audio.playTunnelArrival();
        const portalX = this.width * this.TUNNEL_X_NORM + 15;
        const portalY = this.tracksY[train.currentTrack];
        this.spawnCelebration(portalX, portalY, train.color);
      } else {
        train.state = "CRASHED";
        train.isMoving = false;
        this.isGameOver = true;
        this.gameOverReason = `Wrong Line! ${train.color.toUpperCase()} Train arrived at ${tunnel ? tunnel.color.toUpperCase() : "UNKNOWN"} Tunnel.`;
        audio.playCollision();
        this.spawnCrashExplosion(train.cars[0]?.x || 0, train.cars[0]?.y || 0);
        if (this.onCrashCallback) {
          this.onCrashCallback(this.gameOverReason);
        }
      }
    }
    checkCollisions() {
      if (this.isGameOver) return;
      const activeTrains = this.trains.filter((t) => t.state !== "ENTERED_TUNNEL");
      const collisionRadius = 26;
      for (let i = 0; i < activeTrains.length; i++) {
        for (let j = i + 1; j < activeTrains.length; j++) {
          const trainA = activeTrains[i];
          const trainB = activeTrains[j];
          for (const carA of trainA.cars) {
            for (const carB of trainB.cars) {
              const dist = Math.hypot(carA.x - carB.x, carA.y - carB.y);
              if (dist < collisionRadius) {
                trainA.state = "CRASHED";
                trainB.state = "CRASHED";
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
    checkWinCondition() {
      if (this.isGameOver || this.isCompleted) return;
      const allEntered = this.trains.every((t) => t.state === "ENTERED_TUNNEL");
      if (allEntered && this.trains.length > 0) {
        this.isCompleted = true;
        audio.playVictory();
        audio.stopTrainHum();
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            this.spawnCelebration(
              this.width * (0.3 + Math.random() * 0.5),
              this.height * (0.2 + Math.random() * 0.6),
              "yellow"
            );
          }, i * 180);
        }
        if (this.onWinCallback) {
          this.onWinCallback(Math.round(this.gameTime));
        }
      }
    }
    // Particle Generators
    spawnSparks(x, y, count, color) {
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
          type: "spark"
        });
      }
    }
    spawnBrakeSparks(x, y) {
      for (let i = 0; i < 4; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y,
          vx: (Math.random() - 0.5) * 50 - 20,
          vy: (Math.random() - 0.5) * 30 - 15,
          alpha: 1,
          life: 0,
          maxLife: 0.25 + Math.random() * 0.25,
          color: "#fbbf24",
          size: 1.5 + Math.random() * 2,
          type: "spark"
        });
      }
    }
    spawnCrashExplosion(x, y) {
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
          color: Math.random() > 0.5 ? "#ef4444" : "#f59e0b",
          size: 4 + Math.random() * 6,
          type: "fire"
        });
      }
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
          color: "#64748b",
          size: 6 + Math.random() * 12,
          type: "smoke"
        });
      }
    }
    spawnCelebration(x, y, colorKey) {
      const palette = ["#38bdf8", "#fbbf24", "#34d399", "#f472b6", "#a78bfa", "#f87171"];
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
          type: "confetti"
        });
      }
    }
    updateParticles(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          this.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.type === "smoke") {
          p.vy -= 15 * dt;
          p.size += 6 * dt;
        } else if (p.type === "confetti" || p.type === "spark") {
          p.vy += 120 * dt;
        }
        p.alpha = 1 - p.life / p.maxLife;
      }
    }
    // Trajectory simulation & Danger Zone Detection
    updateDangerZones() {
      this.dangerZones = [];
      if (this.isGameOver || this.isCompleted) return;
      const activeTrains = this.trains.filter((t) => t.state !== "ENTERED_TUNNEL" && t.state !== "CRASHED");
      if (activeTrains.length < 2) return;
      const futureSteps = [0.2, 0.4, 0.6, 0.8, 1, 1.25, 1.5, 1.8, 2.1, 2.5, 3, 3.5];
      const collisionRadius = 48;
      const projections = {};
      activeTrains.forEach((train) => {
        projections[train.id] = [];
        const isMoving = train.isMoving;
        const speed = isMoving ? train.speed : 0;
        let simHeadX = train.headX;
        let simTrack = train.currentTrack;
        const simHistory = [...train.pathHistory];
        let lastT = 0;
        futureSteps.forEach((targetT) => {
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
                  if (simTrack === sw.fromTrack && sw.state === "divert") {
                    const t = (xNorm - startX) / sw.lengthNorm;
                    const smoothT = t * t * (3 - 2 * t);
                    const yFrom = this.tracksY[sw.fromTrack];
                    const yTo = this.tracksY[sw.toTrack];
                    simY = yFrom + (yTo - yFrom) * smoothT;
                  }
                } else if (xNorm > endX && simTrack === sw.fromTrack && sw.state === "divert") {
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
          const simCars = [];
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
      for (let i = 0; i < activeTrains.length; i++) {
        for (let j = i + 1; j < activeTrains.length; j++) {
          const trainA = activeTrains[i];
          const trainB = activeTrains[j];
          const projA = projections[trainA.id];
          const projB = projections[trainB.id];
          let impactTime = null;
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
            const severity = impactTime <= 1.8 ? "DANGER" : "WARNING";
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
              pulsePhase: this.gameTime * 6 % (Math.PI * 2)
            });
          }
        }
      }
    }
    // Hit-testing optimized for mobile fingers and touchscreens
    getSwitchAt(x, y) {
      const hitRadius = Math.max(38, Math.min(52, this.width * 0.08));
      for (const sw of this.switches) {
        const swX = this.width * sw.xNorm;
        const yFrom = this.tracksY[sw.fromTrack];
        const yTo = this.tracksY[sw.toTrack];
        if (Math.hypot(x - swX, y - yFrom) < hitRadius) {
          return sw;
        }
        const indicatorY = yFrom + (yTo > yFrom ? -28 : 28);
        if (Math.hypot(x - swX, y - indicatorY) < hitRadius) {
          return sw;
        }
        const midX = swX + this.width * sw.lengthNorm * 0.35;
        const midY = (yFrom + yTo) / 2;
        if (Math.hypot(x - midX, y - midY) < hitRadius * 0.9) {
          return sw;
        }
      }
      return null;
    }
    getTrainAt(x, y) {
      const hitRadius = Math.max(38, Math.min(54, this.width * 0.085));
      for (const train of this.trains) {
        if (train.state === "ENTERED_TUNNEL" || train.state === "CRASHED") continue;
        for (const car of train.cars) {
          if (Math.hypot(x - car.x, y - car.y) < hitRadius) {
            return train;
          }
        }
      }
      return null;
    }
  };

  // src/games/metro-subway-train-yard/src/types.ts
  var METRO_COLORS = {
    red: {
      id: "red",
      name: "Red Line",
      badge: "M1",
      hex: "#ef4444",
      darkHex: "#991b1b",
      lightHex: "#fca5a5",
      glowHex: "rgba(239, 68, 68, 0.4)"
    },
    blue: {
      id: "blue",
      name: "Blue Line",
      badge: "M2",
      hex: "#3b82f6",
      darkHex: "#1e40af",
      lightHex: "#93c5fd",
      glowHex: "rgba(59, 130, 246, 0.4)"
    },
    green: {
      id: "green",
      name: "Green Line",
      badge: "M3",
      hex: "#10b981",
      darkHex: "#065f46",
      lightHex: "#6ee7b7",
      glowHex: "rgba(16, 185, 129, 0.4)"
    },
    yellow: {
      id: "yellow",
      name: "Yellow Line",
      badge: "M4",
      hex: "#eab308",
      darkHex: "#854d0e",
      lightHex: "#fde047",
      glowHex: "rgba(234, 179, 8, 0.4)"
    },
    purple: {
      id: "purple",
      name: "Purple Line",
      badge: "M5",
      hex: "#a855f7",
      darkHex: "#6b21a8",
      lightHex: "#d8b4fe",
      glowHex: "rgba(168, 85, 247, 0.4)"
    },
    orange: {
      id: "orange",
      name: "Orange Line",
      badge: "M6",
      hex: "#f97316",
      darkHex: "#9a3412",
      lightHex: "#fdba74",
      glowHex: "rgba(249, 115, 22, 0.4)"
    },
    cyan: {
      id: "cyan",
      name: "Cyan Line",
      badge: "M7",
      hex: "#06b6d4",
      darkHex: "#155e75",
      lightHex: "#67e8f9",
      glowHex: "rgba(6, 182, 212, 0.4)"
    }
  };

  // src/games/metro-subway-train-yard/src/renderer.ts
  var YardRenderer = class {
    constructor(ctx, engine) {
      this.showHintRoutes = false;
      this.frameCount = 0;
      this.ctx = ctx;
      this.engine = engine;
    }
    setEngine(engine) {
      this.engine = engine;
    }
    render() {
      this.frameCount++;
      const ctx = this.ctx;
      const { width, height } = this.engine;
      ctx.clearRect(0, 0, width, height);
      this.renderGround(ctx, width, height);
      this.renderTrackBeds(ctx);
      this.renderSwitchTurnouts(ctx);
      this.renderRails(ctx);
      this.renderDangerZones(ctx);
      this.renderSwitches(ctx);
      if (this.showHintRoutes) {
        this.renderHintRoutes(ctx);
      }
      this.renderTunnels(ctx);
      this.renderTrains(ctx);
      this.renderDangerAlertOverlays(ctx);
      this.renderParticles(ctx);
    }
    renderGround(ctx, width, height) {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#0a0f1d");
      bgGrad.addColorStop(0.35, "#0f172a");
      bgGrad.addColorStop(0.7, "#0b1120");
      bgGrad.addColorStop(1, "#050811");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
      const tileW = 28;
      const tileH = 14;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += tileH) {
        const rowOffset = Math.floor(y / tileH) % 2 === 0 ? 0 : tileW / 2;
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
      ctx.save();
      const bannerH = 22;
      const bannerGrad = ctx.createLinearGradient(0, 0, width, 0);
      bannerGrad.addColorStop(0, "rgba(30, 58, 138, 0.45)");
      bannerGrad.addColorStop(0.5, "rgba(14, 116, 144, 0.55)");
      bannerGrad.addColorStop(1, "rgba(30, 58, 138, 0.45)");
      ctx.fillStyle = bannerGrad;
      ctx.fillRect(0, 2, width, bannerH);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 2, width, bannerH);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = 'bold 9px "Outfit", system-ui, sans-serif';
      ctx.textAlign = "center";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("METRO CENTRAL TERMINAL  \u2022  PLATFORMS 1 - 4  \u2022  DISPATCH CONTROL", width / 2, 16);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = "rgba(100, 116, 139, 0.12)";
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
    renderTrackBeds(ctx) {
      const { width, tracksY } = this.engine;
      tracksY.forEach((y, idx) => {
        const platformY = y - 32;
        const platformH = 14;
        if (platformY > 20) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, platformY, width, platformH);
          ctx.fillStyle = "#eab308";
          ctx.fillRect(0, platformY + platformH - 3, width, 3);
          ctx.fillStyle = "#ca8a04";
          for (let sx = 8; sx < width; sx += 12) {
            ctx.fillRect(sx, platformY + platformH - 2.5, 3, 2);
          }
          if (width > 420) {
            ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
            ctx.font = "bold 7px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("STAND BEHIND YELLOW LINE", 140, platformY + 9);
          }
        }
        const ballastGrad = ctx.createLinearGradient(0, y - 18, 0, y + 18);
        ballastGrad.addColorStop(0, "#1e293b");
        ballastGrad.addColorStop(0.5, "#0f172a");
        ballastGrad.addColorStop(1, "#1e293b");
        ctx.fillStyle = ballastGrad;
        ctx.fillRect(0, y - 18, width, 36);
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        for (let bx = 12; bx < width - 60; bx += 22) {
          ctx.fillRect(bx + idx * 5 % 11, y - 14, 2, 2);
          ctx.fillRect(bx + idx * 7 % 13, y + 12, 2, 2);
        }
        const tieSpacing = 16;
        for (let x = 10; x < width - 70; x += tieSpacing) {
          ctx.fillStyle = "#334155";
          ctx.fillRect(x, y - 15, 6, 30);
          ctx.fillStyle = "#475569";
          ctx.fillRect(x, y - 15, 6, 2);
        }
        const pillarX = 75 + idx % 2 * 50;
        if (pillarX < width - 100) {
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(pillarX - 2, y - 36, 12, 22);
          ctx.fillStyle = "#475569";
          ctx.fillRect(pillarX, y - 36, 8, 20);
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(pillarX + 2, y - 34, 2, 2);
          ctx.fillRect(pillarX + 2, y - 20, 2, 2);
          const glow = ctx.createRadialGradient(pillarX + 4, y - 26, 2, pillarX + 4, y - 26, 18);
          glow.addColorStop(0, "rgba(251, 191, 36, 0.25)");
          glow.addColorStop(1, "rgba(251, 191, 36, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pillarX + 4, y - 26, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.save();
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.roundRect(8, y - 24, 52, 13, 3);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`LINE ${idx + 1}`, 14, y - 15);
        ctx.restore();
      });
    }
    renderSwitchTurnouts(ctx) {
      const { width, tracksY, switches } = this.engine;
      switches.forEach((sw) => {
        const startX = width * sw.xNorm;
        const endX = width * (sw.xNorm + sw.lengthNorm);
        const yFrom = tracksY[sw.fromTrack];
        const yTo = tracksY[sw.toTrack];
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
          ctx.fillStyle = "#334155";
          ctx.fillRect(-3, -15, 6, 30);
          ctx.restore();
        }
        const railOffsets = [-10, 10];
        railOffsets.forEach((offset) => {
          ctx.beginPath();
          for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            const curX = startX + (endX - startX) * t;
            const smoothT = t * t * (3 - 2 * t);
            const curY = yFrom + (yTo - yFrom) * smoothT + offset;
            if (i === 0) ctx.moveTo(curX, curY);
            else ctx.lineTo(curX, curY);
          }
          ctx.strokeStyle = sw.state === "divert" ? "#94a3b8" : "#475569";
          ctx.lineWidth = sw.state === "divert" ? 3.5 : 2;
          ctx.stroke();
          if (sw.state === "divert") {
            ctx.strokeStyle = "#f8fafc";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    }
    renderRails(ctx) {
      const { width, tracksY } = this.engine;
      const railOffsets = [-10, 10];
      tracksY.forEach((y) => {
        railOffsets.forEach((offset) => {
          const railY = y + offset;
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(0, railY + 1);
          ctx.lineTo(width - 40, railY + 1);
          ctx.stroke();
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, railY);
          ctx.lineTo(width - 40, railY);
          ctx.stroke();
          ctx.strokeStyle = "#f1f5f9";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, railY - 0.5);
          ctx.lineTo(width - 40, railY - 0.5);
          ctx.stroke();
        });
        const thirdRailY = y + 17;
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, thirdRailY);
        ctx.lineTo(width - 60, thirdRailY);
        ctx.stroke();
        for (let x = 40; x < width - 70; x += 80) {
          ctx.fillStyle = "#eab308";
          ctx.fillRect(x - 2, thirdRailY - 3, 5, 6);
        }
      });
    }
    renderSwitches(ctx) {
      const { width, tracksY, switches } = this.engine;
      switches.forEach((sw) => {
        const swX = width * sw.xNorm;
        const yFrom = tracksY[sw.fromTrack];
        const yTo = tracksY[sw.toTrack];
        const isDiverting = sw.state === "divert";
        const anim = sw.animProgress ?? (isDiverting ? 1 : 0);
        const bladeEndX = swX + 24;
        const bladeEndY = yFrom + (yTo - yFrom) * 0.22 * anim;
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(swX - 4, yFrom);
        ctx.lineTo(bladeEndX, bladeEndY);
        ctx.stroke();
        ctx.save();
        const indicatorY = yFrom + (yTo > yFrom ? -28 : 28);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(swX, indicatorY + 2, 22, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isDiverting ? "#0284c7" : "#334155";
        ctx.strokeStyle = isDiverting ? "#38bdf8" : "#64748b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(swX - 22, indicatorY - 14, 44, 28, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isDiverting ? "#38bdf8" : "#22c55e";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const arrowSymbol = isDiverting ? yTo > yFrom ? "\u2198" : "\u2197" : "\u2794";
        ctx.fillText(arrowSymbol, swX, indicatorY);
        if (isDiverting) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(swX - 25, indicatorY - 17, 50, 34, 11);
          ctx.stroke();
        }
        ctx.restore();
      });
    }
    renderTunnels(ctx) {
      const { width, height, tracksY } = this.engine;
      const tunnelX = width * this.engine.TUNNEL_X_NORM;
      const tunnelW = width - tunnelX;
      this.engine.level.tunnels.forEach((t) => {
        const y = tracksY[t.trackIndex];
        const colorScheme = METRO_COLORS[t.color] || METRO_COLORS.blue;
        const archH = 50;
        const abyssGrad = ctx.createRadialGradient(
          tunnelX + 25,
          y,
          5,
          tunnelX + 25,
          y,
          45
        );
        abyssGrad.addColorStop(0, "#000000");
        abyssGrad.addColorStop(0.7, "#020617");
        abyssGrad.addColorStop(1, "#090d16");
        ctx.fillStyle = abyssGrad;
        ctx.beginPath();
        ctx.roundRect(tunnelX, y - archH / 2, tunnelW + 10, archH, [18, 0, 0, 18]);
        ctx.fill();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(tunnelX, y - archH / 2, tunnelW + 10, archH, [18, 0, 0, 18]);
        ctx.stroke();
        ctx.strokeStyle = colorScheme.hex;
        ctx.lineWidth = 3;
        ctx.shadowColor = colorScheme.hex;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(tunnelX, y - archH / 2 + 1, tunnelW + 10, archH - 2, [16, 0, 0, 16]);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = colorScheme.darkHex;
        ctx.strokeStyle = colorScheme.lightHex;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(tunnelX + 6, y - 11, 40, 22, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(colorScheme.badge, tunnelX + 26, y);
      });
    }
    renderTrains(ctx) {
      this.engine.trains.forEach((train) => {
        if (train.state === "ENTERED_TUNNEL") {
          const fade = Math.max(0, 1 - train.enteredTimer * 2);
          if (fade <= 0) return;
          ctx.globalAlpha = fade;
        }
        const colorScheme = METRO_COLORS[train.color] || METRO_COLORS.blue;
        for (let i = 0; i < train.cars.length - 1; i++) {
          const c1 = train.cars[i];
          const c2 = train.cars[i + 1];
          ctx.strokeStyle = "#020617";
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.stroke();
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.stroke();
        }
        for (let i = train.cars.length - 1; i >= 0; i--) {
          const car = train.cars[i];
          const isHead = i === 0;
          const isTail = i === train.cars.length - 1;
          this.renderSingleCar(ctx, car, colorScheme, isHead, isTail, train.isMoving);
        }
        if (train.state === "STOPPED" && train.cars[0]) {
          this.renderTrainStopBadge(ctx, train.cars[0]);
        }
        ctx.globalAlpha = 1;
      });
    }
    renderSingleCar(ctx, car, colorScheme, isHead, isTail, isMoving) {
      const carL = this.engine.CAR_LENGTH;
      const carW = this.engine.CAR_WIDTH;
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.ellipse(0, 3, carL / 2 + 3, carW / 2 + 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-carL * 0.35, -carW * 0.5 - 2, 10, 4);
      ctx.fillRect(-carL * 0.35, carW * 0.5 - 2, 10, 4);
      ctx.fillRect(carL * 0.35 - 10, -carW * 0.5 - 2, 10, 4);
      ctx.fillRect(carL * 0.35 - 10, carW * 0.5 - 2, 10, 4);
      const carGrad = ctx.createLinearGradient(0, -carW / 2, 0, carW / 2);
      carGrad.addColorStop(0, "#e2e8f0");
      carGrad.addColorStop(0.35, "#94a3b8");
      carGrad.addColorStop(0.65, colorScheme.hex);
      carGrad.addColorStop(1, colorScheme.darkHex);
      ctx.fillStyle = carGrad;
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1.5;
      const cornerRadius = isHead ? [4, 10, 10, 4] : isTail ? [10, 4, 4, 10] : 4;
      ctx.beginPath();
      ctx.roundRect(-carL / 2, -carW / 2, carL, carW, cornerRadius);
      ctx.fill();
      ctx.stroke();
      const windowColor = "#fef08a";
      ctx.fillStyle = windowColor;
      const winW = 7;
      const winH = 4;
      [-12, 0, 12].forEach((wx) => {
        ctx.fillRect(wx - winW / 2, -carW / 2 + 3, winW, winH);
        ctx.fillRect(wx - winW / 2, carW / 2 - 7, winW, winH);
      });
      ctx.fillStyle = "#64748b";
      ctx.fillRect(-8, -3, 16, 6);
      if (isHead) {
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.roundRect(carL / 2 - 7, -carW / 2 + 4, 5, carW - 8, 2);
        ctx.fill();
        if (isMoving) {
          ctx.save();
          const lightGrad = ctx.createRadialGradient(
            carL / 2 + 5,
            0,
            2,
            carL / 2 + 65,
            0,
            60
          );
          lightGrad.addColorStop(0, "rgba(254, 240, 138, 0.45)");
          lightGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
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
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(carL / 2 - 1, -6, 2, 0, Math.PI * 2);
        ctx.arc(carL / 2 - 1, 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (isTail) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(-carL / 2 + 2, -6, 1.8, 0, Math.PI * 2);
        ctx.arc(-carL / 2 + 2, 6, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    renderTrainStopBadge(ctx, leadCar) {
      ctx.save();
      const pulse = 1 + Math.sin(this.frameCount * 0.1) * 0.08;
      ctx.translate(leadCar.x, leadCar.y - 28);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-24, -10, 48, 20, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("STOPPED", 0, 0);
      ctx.restore();
    }
    renderHintRoutes(ctx) {
      const { width, tracksY, switches, trains } = this.engine;
      ctx.save();
      trains.forEach((train) => {
        if (train.state === "ENTERED_TUNNEL") return;
        const colorScheme = METRO_COLORS[train.color] || METRO_COLORS.blue;
        ctx.strokeStyle = colorScheme.hex;
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -this.frameCount * 0.8;
        ctx.beginPath();
        const startX = train.headX;
        const startY = tracksY[train.currentTrack];
        ctx.moveTo(startX, startY);
        const tunnel = this.engine.level.tunnels.find((t) => t.color === train.color);
        if (tunnel) {
          const targetY = tracksY[tunnel.trackIndex];
          const tunnelX = width * this.engine.TUNNEL_X_NORM;
          ctx.bezierCurveTo(
            startX + (tunnelX - startX) * 0.4,
            startY,
            startX + (tunnelX - startX) * 0.6,
            targetY,
            tunnelX,
            targetY
          );
          ctx.stroke();
        }
      });
      ctx.restore();
    }
    renderDangerZones(ctx) {
      const { dangerZones } = this.engine;
      if (!dangerZones || dangerZones.length === 0) return;
      ctx.save();
      dangerZones.forEach((zone) => {
        const isCritical = zone.severity === "DANGER";
        const mainColor = isCritical ? "#ef4444" : "#f59e0b";
        const pulseSpeed = isCritical ? 0.25 : 0.15;
        const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * pulseSpeed);
        const radius = 32 + pulse * 8;
        const glowGrad = ctx.createRadialGradient(zone.x, zone.y, 2, zone.x, zone.y, radius * 1.5);
        glowGrad.addColorStop(0, isCritical ? "rgba(239, 68, 68, 0.45)" : "rgba(245, 158, 11, 0.35)");
        glowGrad.addColorStop(0.6, isCritical ? "rgba(239, 68, 68, 0.18)" : "rgba(245, 158, 11, 0.12)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        const wavePhase = this.frameCount * 0.04 % 1;
        const waveRadius = 15 + wavePhase * 35;
        ctx.strokeStyle = isCritical ? `rgba(239, 68, 68, ${0.8 * (1 - wavePhase)})` : `rgba(245, 158, 11, ${0.8 * (1 - wavePhase)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = isCritical ? 2.5 : 1.5;
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = -this.frameCount * 1.2;
        ctx.beginPath();
        ctx.rect(zone.x - radius, zone.y - 18, radius * 2, 36);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.save();
        ctx.beginPath();
        ctx.rect(zone.x - radius, zone.y - 18, radius * 2, 36);
        ctx.clip();
        ctx.strokeStyle = isCritical ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.25)";
        ctx.lineWidth = 4;
        const stripeOffset = this.frameCount * 1.5 % 20;
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
    renderDangerAlertOverlays(ctx) {
      const { dangerZones, trains } = this.engine;
      if (!dangerZones || dangerZones.length === 0) return;
      ctx.save();
      dangerZones.forEach((zone) => {
        const isCritical = zone.severity === "DANGER";
        const mainColor = isCritical ? "#ef4444" : "#f59e0b";
        const pulseSpeed = isCritical ? 0.25 : 0.15;
        const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * pulseSpeed);
        zone.trainsInvolved.forEach((tId) => {
          const train = trains.find((t) => t.id === tId);
          if (train && train.cars.length > 0 && train.state !== "ENTERED_TUNNEL" && train.state !== "CRASHED") {
            const leadCar = train.cars[0];
            ctx.strokeStyle = isCritical ? "rgba(239, 68, 68, 0.75)" : "rgba(245, 158, 11, 0.65)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -this.frameCount * 2;
            ctx.beginPath();
            ctx.moveTo(leadCar.x, leadCar.y);
            ctx.lineTo(zone.x, zone.y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = mainColor;
            ctx.lineWidth = 1.8;
            const reticleSize = 18 + pulse * 4;
            ctx.beginPath();
            ctx.arc(leadCar.x, leadCar.y, reticleSize, 0, Math.PI * 2);
            ctx.stroke();
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
        const badgeY = Math.max(24, zone.y - 34);
        const badgeW = Math.min(136, this.engine.width * 0.42);
        const badgeH = 24;
        const badgeX = Math.max(badgeW / 2 + 6, Math.min(this.engine.width - badgeW / 2 - 6, zone.x));
        ctx.save();
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = isCritical ? 10 : 5;
        ctx.fillStyle = isCritical ? "#7f1d1d" : "#78350f";
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 12);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        const alertIcon = isCritical ? "\u26A0\uFE0F" : "\u26A1";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(alertIcon, badgeX - badgeW / 2 + 6, badgeY);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9.5px monospace";
        ctx.textAlign = "left";
        const text = isCritical ? `CRASH IN ${zone.timeToImpact.toFixed(1)}s!` : `RISK: ${zone.timeToImpact.toFixed(1)}s`;
        ctx.fillText(text, badgeX - badgeW / 2 + 24, badgeY);
        const bracketSpan = 38;
        const bracketH = 22;
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(zone.x - bracketSpan + 6, zone.y - bracketH);
        ctx.lineTo(zone.x - bracketSpan, zone.y - bracketH);
        ctx.lineTo(zone.x - bracketSpan, zone.y + bracketH);
        ctx.lineTo(zone.x - bracketSpan + 6, zone.y + bracketH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(zone.x + bracketSpan - 6, zone.y - bracketH);
        ctx.lineTo(zone.x + bracketSpan, zone.y - bracketH);
        ctx.lineTo(zone.x + bracketSpan, zone.y + bracketH);
        ctx.lineTo(zone.x + bracketSpan - 6, zone.y + bracketH);
        ctx.stroke();
        if (zone.timeToImpact < 1.6) {
          ctx.fillStyle = "#fef08a";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TAP TRAIN OR SWITCH!", zone.x, badgeY + 20);
        }
        ctx.restore();
      });
      ctx.restore();
    }
    renderParticles(ctx) {
      this.engine.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        if (p.type === "confetti") {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 1.5);
        } else if (p.type === "fire") {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }
  };

  // src/games/metro-subway-train-yard/src/display.ts
  var DisplayManager = class {
    constructor(canvas, onResize) {
      this.dpr = 1;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onResizeCallback = onResize;
      const observer = new ResizeObserver(() => this.resize());
      if (this.canvas.parentElement) {
        observer.observe(this.canvas.parentElement);
      } else {
        window.addEventListener("resize", () => this.resize());
      }
      setTimeout(() => this.resize(), 10);
    }
    resize() {
      if (!this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      if (parentRect.width <= 0 || parentRect.height <= 0) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.floor(parentRect.width);
      const cssHeight = Math.floor(parentRect.height);
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.canvas.style.width = `${cssWidth}px`;
      this.canvas.style.height = `${cssHeight}px`;
      this.ctx.resetTransform();
      this.ctx.scale(this.dpr, this.dpr);
      if (this.onResizeCallback) {
        this.onResizeCallback(cssWidth, cssHeight);
      }
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    getContext() {
      return this.ctx;
    }
  };

  // src/games/metro-subway-train-yard/src/ui.ts
  var UIController = class {
    constructor(root) {
      this.currentScreen = "MAIN_MENU";
      this.adTimerInterval = null;
      this.adCountdownSec = 5;
      this.root = root;
      this.renderBaseLayout();
      this.attachEventListeners();
      this.setScreen("MAIN_MENU");
    }
    renderBaseLayout() {
      this.root.innerHTML = `
      <div id="game-stage" class="w-full max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[850px] mx-auto flex flex-col relative overflow-hidden bg-slate-950 sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-slate-800">
        
        <!-- 1. Header HUD -->
        <header id="game-hud" class="hidden w-full h-12 sm:h-14 bg-slate-900/95 backdrop-blur px-1.5 sm:px-4 border-b border-slate-800 flex items-center justify-between gap-1 sm:gap-2 shrink-0 z-20">
          
          <!-- Left: Menu / Level Badge -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button id="btn-pause-menu" class="btn-tactile w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 active:scale-95 text-slate-200" title="Pause Menu">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div id="hud-level-badge" class="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-full text-[10px] sm:text-xs font-black bg-blue-950/80 text-blue-400 border border-blue-800 shrink-0 tracking-wide">
              LEVEL 1
            </div>
          </div>

          <!-- Center: Trains remaining & Timer -->
          <div class="flex items-center gap-1 sm:gap-2 shrink-0">
            <div class="bg-slate-950 border border-slate-800 rounded-lg px-1.5 sm:px-3 py-0.5 text-center min-w-[42px] sm:min-w-[55px] shrink-0">
              <span class="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TRAINS</span>
              <span id="hud-trains-counter" class="font-black text-xs sm:text-base leading-none text-emerald-400">0/2</span>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-lg px-1.5 sm:px-3 py-0.5 text-center min-w-[38px] sm:min-w-[50px] shrink-0">
              <span class="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TIME</span>
              <span id="hud-time-counter" class="font-black text-xs sm:text-base leading-none text-slate-200">0s</span>
            </div>
          </div>

          <!-- Right: Controls & Tools -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <!-- Speed Multiplier (1x / 2x) -->
            <button id="btn-speed-toggle" class="btn-tactile w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-black text-amber-400 flex items-center justify-center gap-1 shrink-0" title="Speed Toggle">
              <span id="hud-speed-label">1x</span>
            </button>

            <!-- Hint Button (Rewarded Ad flow) -->
            <button id="btn-hint" class="btn-tactile w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 shrink-0 hover:bg-amber-500/30" title="Get Hint">
              <span>\u{1F4A1}</span>
              <span class="hidden sm:inline">HINT</span>
            </button>

            <!-- Quick Retry -->
            <button id="btn-retry" class="btn-tactile w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 hover:text-white" title="Restart Level">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Sound Toggle -->
            <button id="btn-sound-toggle" class="btn-tactile w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 hover:text-white" title="Sound Toggle">
              <span id="sound-icon" class="text-xs sm:text-sm">\u{1F50A}</span>
            </button>
          </div>
        </header>

        <!-- 2. Canvas Container (Flex-1) -->
        <div id="canvas-container" class="flex-1 w-full h-full relative overflow-hidden bg-slate-950 cursor-pointer touch-none">
          <canvas id="game-canvas" class="block w-full h-full touch-none"></canvas>
          
          <!-- Bottom Quick Help Bar -->
          <div id="game-quick-hint" class="hidden absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-slate-300 pointer-events-none shadow-lg text-center whitespace-nowrap max-w-[95%] truncate">
            \u{1F500} Tap switches to route \u2022 \u{1F687} Tap train to brake
          </div>
        </div>

        <!-- 3. Absolute Overlays & Screens -->
        
        <!-- Screen: Main Menu -->
        <div id="screen-main-menu" class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 z-30 overflow-y-auto">
          <div class="w-full flex justify-end">
            <button id="menu-btn-sound" class="btn-tactile px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-300">
              <span id="menu-sound-icon">\u{1F50A}</span>
              <span>Sound</span>
            </button>
          </div>

          <div class="flex flex-col items-center text-center my-auto py-2">
            <!-- Train Yard Logo Graphic -->
            <div class="relative mb-3 sm:mb-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/20">
                <div class="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl">
                  \u{1F687}
                </div>
              </div>
              <div class="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] rounded-full uppercase tracking-widest shadow">
                30 LEVELS
              </div>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
              METRO SUBWAY
            </h1>
            <p class="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1 sm:mb-2">
              TRAIN YARD DISPATCHER
            </p>
            <p class="text-xs sm:text-sm text-slate-400 max-w-sm mb-4 sm:mb-6 leading-relaxed">
              Switch multi-car subway trains across parallel yard tracks to their matching colored tunnel portals. Avoid collisions!
            </p>

            <!-- Menu Navigation Buttons -->
            <div class="flex flex-col gap-2.5 sm:gap-3 w-60 sm:w-72">
              <button id="menu-btn-play" class="btn-tactile w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                <span>\u25B6</span>
                <span id="menu-play-label">PLAY LEVEL 1</span>
              </button>

              <button id="menu-btn-levels" class="btn-tactile w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2">
                <span>\u{1F4D1}</span>
                <span>SELECT LEVEL</span>
              </button>

              <button id="menu-btn-how-to-play" class="btn-tactile w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2">
                <span>\u{1F4D6}</span>
                <span>HOW TO PLAY</span>
              </button>
            </div>
          </div>

          <!-- Footer Stats -->
          <div class="flex items-center gap-6 text-[11px] sm:text-xs text-slate-400 pt-2">
            <div>\u2B50 Stars: <span id="menu-total-stars" class="font-bold text-amber-400">0/90</span></div>
            <div>\u{1F687} Unlocked: <span id="menu-unlocked-level" class="font-bold text-blue-400">Level 1/30</span></div>
          </div>
        </div>

        <!-- Screen: Level Selector -->
        <div id="screen-level-select" class="hidden absolute inset-0 bg-slate-950 flex flex-col p-3 sm:p-6 z-30">
          <div class="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
            <button id="btn-back-from-levels" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1">
              <span>\u2190</span>
              <span>Back</span>
            </button>
            <h2 class="text-sm sm:text-lg font-black text-white">SELECT LEVEL (1 - 30)</h2>
            <div class="text-xs font-extrabold text-amber-400">
              \u2B50 <span id="levels-stars-count">0</span>/90
            </div>
          </div>

          <div id="levels-grid" class="flex-1 overflow-y-auto py-3 sm:py-4 grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-3 custom-scrollbar pr-1">
            <!-- Dynamically populated 30 level tiles -->
          </div>
        </div>

        <!-- Screen: How to Play -->
        <div id="screen-how-to-play" class="hidden absolute inset-0 bg-slate-950 flex flex-col p-3 sm:p-6 z-30 overflow-y-auto">
          <div class="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0 mb-3 sm:mb-4">
            <button id="btn-back-from-tutorial" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1">
              <span>\u2190</span>
              <span>Back</span>
            </button>
            <h2 class="text-sm sm:text-lg font-black text-white">HOW TO PLAY</h2>
            <div class="w-10"></div>
          </div>

          <div class="flex flex-col gap-3 sm:gap-4 max-w-xl mx-auto my-auto w-full">
            <!-- Step 1 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-950 border border-blue-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                \u{1F500}
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-blue-400 mb-0.5 sm:mb-1">1. TOGGLE TRACK SWITCHES</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Tap on any track switch point to flip the routing between straight-through rail and diagonal turnout curves. An LED arrow confirms the active path.
                </p>
              </div>
            </div>

            <!-- Step 2 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950 border border-amber-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                \u{1F687}
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-amber-400 mb-0.5 sm:mb-1">2. BRAKE & DISPATCH TRAINS</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Tap any train to trigger emergency brakes and pause its movement. Tap again to release! Longer 3-car and 4-car trains need extra track clearance.
                </p>
              </div>
            </div>

            <!-- Step 3 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                \u{1F3AF}
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-emerald-400 mb-0.5 sm:mb-1">3. REACH MATCHING TUNNELS</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Guide every subway train to its corresponding colored tunnel portal (Red Line to Red Tunnel, Blue to Blue, etc.) without collisions.
                </p>
              </div>
            </div>

            <button id="btn-tutorial-play" class="btn-tactile w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider mt-1 sm:mt-2 shadow-lg shadow-blue-600/20">
              Start Dispatching Now
            </button>
          </div>
        </div>

        <!-- Modal: Rewarded Ad Hint System -->
        <div id="modal-rewarded-hint" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2 sm:mb-3">
              \u{1F4A1}
            </div>
            <h3 class="text-base sm:text-lg font-black text-white mb-1">DISPATCHER HINT SPONSOR</h3>
            <p class="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4">
              Watch a quick 5-second simulated sponsor broadcast to reveal optimal track switch lines!
            </p>

            <!-- Video Ad simulation container -->
            <div class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col items-center">
              <div class="text-xs font-bold text-amber-400 mb-0.5">METRO TRANSIT NETWORK</div>
              <div class="text-[10px] sm:text-[11px] text-slate-400 mb-2">Automated Dispatch Safety Bulletin</div>
              <!-- Countdown bar -->
              <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div id="ad-progress-bar" class="h-full bg-amber-500 transition-all duration-1000 w-0"></div>
              </div>
              <div id="ad-timer-text" class="text-xs font-black text-slate-300">5s remaining...</div>
            </div>

            <div class="flex gap-2 w-full">
              <button id="btn-close-ad" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Cancel
              </button>
              <button id="btn-claim-hint" disabled class="btn-tactile flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow">
                Unlock Hint \u{1F4A1}
              </button>
            </div>
          </div>
        </div>

        <!-- Modal: Level Victory -->
        <div id="modal-level-win" class="hidden absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40" onclick="event.stopPropagation()">
          <div class="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center relative" onclick="event.stopPropagation()">
            <button id="btn-win-close" aria-label="Close" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold flex items-center justify-center text-sm active:scale-90 transition-all cursor-pointer">\u2715</button>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2 animate-bounce">
              \u{1F389}
            </div>
            <h3 class="text-lg sm:text-xl font-black text-white">YARD CLEARED!</h3>
            <p id="win-level-title" class="text-xs font-bold text-emerald-400 mb-2 sm:mb-3">Level 1 Complete</p>

            <!-- Stars Rating -->
            <div id="win-stars-display" class="text-xl sm:text-2xl mb-3 sm:mb-4 tracking-widest text-amber-400">
              \u2B50\u2B50\u2B50
            </div>

            <div class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex justify-around text-center">
              <div>
                <span class="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">YOUR TIME</span>
                <span id="win-time-val" class="font-black text-xs sm:text-sm text-slate-200">12s</span>
              </div>
              <div class="border-l border-slate-800"></div>
              <div>
                <span class="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">TARGET</span>
                <span id="win-target-val" class="font-black text-xs sm:text-sm text-amber-400">25s</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <button id="btn-win-next" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/30">
                Next Level \u2794
              </button>
              <div class="flex gap-2">
                <button id="btn-win-retry" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  Restart
                </button>
                <button id="btn-win-menu" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  Levels
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal: Crash / Level Failed -->
        <div id="modal-crash" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40" onclick="event.stopPropagation()">
          <div class="bg-slate-900 border border-red-500/40 rounded-3xl p-5 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center relative" onclick="event.stopPropagation()">
            <button id="btn-crash-close" aria-label="Close" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold flex items-center justify-center text-sm active:scale-90 transition-all cursor-pointer">\u2715</button>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2">
              \u{1F4A5}
            </div>
            <h3 class="text-lg sm:text-xl font-black text-red-400">TRAIN COLLISION!</h3>
            <p id="crash-reason-text" class="text-xs text-slate-300 my-2 leading-relaxed">
              Subway trains collided during shunting!
            </p>

            <div class="flex flex-col gap-2 w-full mt-2 sm:mt-3">
              <button id="btn-crash-retry" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-red-600/30">
                \u21BA Restart
              </button>
              <button id="btn-crash-menu" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Level Select
              </button>
            </div>
          </div>
        </div>

        <!-- Modal: Pause -->
        <div id="modal-pause" class="hidden absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-xs w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <h3 class="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4">GAME PAUSED</h3>
            
            <div class="flex flex-col gap-2 sm:gap-2.5 w-full">
              <button id="btn-pause-resume" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                Resume
              </button>
              <button id="btn-pause-restart" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Restart Level
              </button>
              <button id="btn-pause-levels" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Level Select
              </button>
              <button id="btn-pause-menu-main" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    setScreen(screen) {
      this.currentScreen = screen;
      const menuEl = document.getElementById("screen-main-menu");
      const levelSelectEl = document.getElementById("screen-level-select");
      const howToPlayEl = document.getElementById("screen-how-to-play");
      const gameHUDEl = document.getElementById("game-hud");
      const quickHintEl = document.getElementById("game-quick-hint");
      menuEl.classList.add("hidden");
      levelSelectEl.classList.add("hidden");
      howToPlayEl.classList.add("hidden");
      gameHUDEl.classList.add("hidden");
      quickHintEl.classList.add("hidden");
      this.closeAllModals();
      if (screen === "MAIN_MENU") {
        menuEl.classList.remove("hidden");
        this.updateMenuStats();
      } else if (screen === "LEVEL_SELECT") {
        levelSelectEl.classList.remove("hidden");
        this.renderLevelsGrid();
      } else if (screen === "HOW_TO_PLAY") {
        howToPlayEl.classList.remove("hidden");
      } else if (screen === "PLAYING") {
        gameHUDEl.classList.remove("hidden");
        quickHintEl.classList.remove("hidden");
      }
    }
    updateMenuStats() {
      const totalStars = gameState.getTotalStars();
      const unlocked = gameState.getUnlockedLevel();
      const starsEl = document.getElementById("menu-total-stars");
      const unlockedEl = document.getElementById("menu-unlocked-level");
      const playLabelEl = document.getElementById("menu-play-label");
      if (starsEl) starsEl.textContent = `${totalStars}/90`;
      if (unlockedEl) unlockedEl.textContent = `Level ${unlocked}/30`;
      if (playLabelEl) playLabelEl.textContent = `PLAY LEVEL ${unlocked}`;
    }
    renderLevelsGrid() {
      const grid = document.getElementById("levels-grid");
      const starsCount = document.getElementById("levels-stars-count");
      if (!grid) return;
      if (starsCount) starsCount.textContent = String(gameState.getTotalStars());
      grid.innerHTML = "";
      const unlockedLevel = gameState.getUnlockedLevel();
      LEVELS.forEach((lvl) => {
        const isUnlocked = lvl.id <= unlockedLevel;
        const stars = gameState.saveData.stars[lvl.id] || 0;
        const bestTime = gameState.saveData.bestTimes[lvl.id];
        const btn = document.createElement("button");
        btn.className = `btn-tactile p-1.5 sm:p-2 rounded-xl sm:rounded-2xl flex flex-col items-center justify-between border min-h-[54px] sm:min-h-[64px] ${isUnlocked ? "bg-slate-900 hover:bg-slate-800 border-slate-700 cursor-pointer" : "bg-slate-950 border-slate-800/60 opacity-45 cursor-not-allowed"}`;
        if (isUnlocked) {
          let starsStr = "";
          if (stars === 3) starsStr = "\u2B50\u2B50\u2B50";
          else if (stars === 2) starsStr = "\u2B50\u2B50";
          else if (stars === 1) starsStr = "\u2B50";
          else starsStr = "\u2606\u2606\u2606";
          btn.innerHTML = `
          <span class="text-xs font-black text-blue-400">${lvl.id}</span>
          <span class="text-[9px] tracking-tighter text-amber-400">${starsStr}</span>
          <span class="text-[8px] text-slate-500 font-mono">${bestTime ? `${bestTime}s` : `${lvl.trains.length} tr`}</span>
        `;
          btn.addEventListener("click", () => {
            audio.playClick();
            if (this.onStartLevel) {
              this.onStartLevel(lvl.id);
            }
          });
        } else {
          btn.innerHTML = `
          <span class="text-xs font-bold text-slate-600">${lvl.id}</span>
          <span class="text-xs">\u{1F512}</span>
          <span class="text-[8px] text-slate-700">Locked</span>
        `;
        }
        grid.appendChild(btn);
      });
    }
    updateHUD(level, clearedTrains, totalTrains, timeSec, speedMult) {
      const badge = document.getElementById("hud-level-badge");
      const counter = document.getElementById("hud-trains-counter");
      const timer = document.getElementById("hud-time-counter");
      const speed = document.getElementById("hud-speed-label");
      if (badge) badge.textContent = `LEVEL ${level.id}`;
      if (counter) counter.textContent = `${clearedTrains}/${totalTrains}`;
      if (timer) timer.textContent = `${timeSec}s`;
      if (speed) speed.textContent = `${speedMult}x`;
    }
    showWinModal(level, timeSec, stars) {
      const modal = document.getElementById("modal-level-win");
      const title = document.getElementById("win-level-title");
      const starsEl = document.getElementById("win-stars-display");
      const timeVal = document.getElementById("win-time-val");
      const targetVal = document.getElementById("win-target-val");
      if (title) title.textContent = `Level ${level.id}: ${level.name}`;
      if (starsEl) {
        starsEl.textContent = stars === 3 ? "\u2B50\u2B50\u2B50" : stars === 2 ? "\u2B50\u2B50" : "\u2B50";
      }
      if (timeVal) timeVal.textContent = `${timeSec}s`;
      if (targetVal) targetVal.textContent = `${level.targetTimeSec}s`;
      if (modal) modal.classList.remove("hidden");
    }
    showCrashModal(reason) {
      const modal = document.getElementById("modal-crash");
      const text = document.getElementById("crash-reason-text");
      if (text) text.textContent = reason;
      if (modal) modal.classList.remove("hidden");
    }
    showPauseModal() {
      const modal = document.getElementById("modal-pause");
      if (modal) modal.classList.remove("hidden");
    }
    openRewardedAdModal() {
      const modal = document.getElementById("modal-rewarded-hint");
      const bar = document.getElementById("ad-progress-bar");
      const timerText = document.getElementById("ad-timer-text");
      const claimBtn = document.getElementById("btn-claim-hint");
      if (!modal) return;
      modal.classList.remove("hidden");
      this.adCountdownSec = 5;
      if (claimBtn) claimBtn.disabled = true;
      if (bar) bar.style.width = "0%";
      if (timerText) timerText.textContent = `5s remaining...`;
      if (this.adTimerInterval) clearInterval(this.adTimerInterval);
      const startTime = Date.now();
      this.adTimerInterval = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1e3;
        const remaining = Math.max(0, Math.ceil(5 - elapsed));
        const pct = Math.min(100, elapsed / 5 * 100);
        if (bar) bar.style.width = `${pct}%`;
        if (timerText) timerText.textContent = remaining > 0 ? `${remaining}s remaining...` : "Sponsor Completed!";
        if (elapsed >= 5) {
          clearInterval(this.adTimerInterval);
          this.adTimerInterval = null;
          if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.classList.add("animate-bounce");
          }
        }
      }, 100);
    }
    closeAllModals() {
      ["modal-level-win", "modal-crash", "modal-pause", "modal-rewarded-hint"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
      if (this.adTimerInterval) {
        clearInterval(this.adTimerInterval);
        this.adTimerInterval = null;
      }
    }
    attachEventListeners() {
      document.getElementById("menu-btn-play")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onStartLevel) {
          this.onStartLevel(gameState.getUnlockedLevel());
        }
      });
      document.getElementById("menu-btn-levels")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("menu-btn-how-to-play")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("HOW_TO_PLAY");
      });
      document.getElementById("btn-back-from-levels")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-back-from-tutorial")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-tutorial-play")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onStartLevel) {
          this.onStartLevel(gameState.getUnlockedLevel());
        }
      });
      const updateSoundIcons = () => {
        const isMuted = audio.getIsMuted();
        const icon = isMuted ? "\u{1F507}" : "\u{1F50A}";
        const hudIcon = document.getElementById("sound-icon");
        const menuIcon = document.getElementById("menu-sound-icon");
        if (hudIcon) hudIcon.textContent = icon;
        if (menuIcon) menuIcon.textContent = icon;
      };
      document.getElementById("btn-sound-toggle")?.addEventListener("click", () => {
        audio.toggleMute();
        updateSoundIcons();
      });
      document.getElementById("menu-btn-sound")?.addEventListener("click", () => {
        audio.toggleMute();
        updateSoundIcons();
      });
      document.getElementById("btn-pause-menu")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onTogglePause) this.onTogglePause();
      });
      document.getElementById("btn-speed-toggle")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onToggleSpeed) this.onToggleSpeed();
      });
      document.getElementById("btn-retry")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onRetryLevel) this.onRetryLevel();
      });
      document.getElementById("btn-hint")?.addEventListener("click", () => {
        audio.playClick();
        this.openRewardedAdModal();
      });
      document.getElementById("btn-close-ad")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
      });
      document.getElementById("btn-claim-hint")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
        if (this.onActivateHint) this.onActivateHint();
      });
      document.getElementById("btn-win-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        audio.playClick();
        this.closeAllModals();
      });
      document.getElementById("btn-win-next")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
        if (this.onNextLevel) this.onNextLevel();
      });
      document.getElementById("btn-win-retry")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
        if (this.onRetryLevel) this.onRetryLevel();
      });
      document.getElementById("btn-win-menu")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-crash-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        audio.playClick();
        this.closeAllModals();
      });
      document.getElementById("btn-crash-retry")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
        if (this.onRetryLevel) this.onRetryLevel();
      });
      document.getElementById("btn-crash-menu")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-pause-resume")?.addEventListener("click", () => {
        audio.playClick();
        if (this.onTogglePause) this.onTogglePause();
      });
      document.getElementById("btn-pause-restart")?.addEventListener("click", () => {
        audio.playClick();
        this.closeAllModals();
        if (this.onRetryLevel) this.onRetryLevel();
      });
      document.getElementById("btn-pause-levels")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-pause-menu-main")?.addEventListener("click", () => {
        audio.playClick();
        this.setScreen("MAIN_MENU");
      });
    }
  };

  // src/games/metro-subway-train-yard/src/main.ts
  var MetroSubwayGame = class {
    constructor(root, onWin) {
      this.engine = null;
      this.renderer = null;
      this.animationFrameId = null;
      this.lastTime = 0;
      this.currentLevelIndex = 0;
      this.root = root;
      this.onWinCallback = onWin;
      this.ui = new UIController(this.root);
      this.canvas = document.getElementById("game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.displayManager = new DisplayManager(this.canvas, (w, h) => {
        if (this.engine) {
          this.engine.resize(w, h);
        }
      });
      this.setupUIHandlers();
      this.setupCanvasPointerInput();
      this.startRenderLoop();
    }
    setupUIHandlers() {
      this.ui.onStartLevel = (levelId) => {
        this.loadLevel(levelId);
      };
      this.ui.onRetryLevel = () => {
        this.loadLevel(this.currentLevelIndex + 1);
      };
      this.ui.onNextLevel = () => {
        const nextId = Math.min(30, this.currentLevelIndex + 2);
        this.loadLevel(nextId);
      };
      this.ui.onTogglePause = () => {
        if (!this.engine) return;
        const willPause = !this.engine.isPaused;
        this.engine.setPaused(willPause);
        if (willPause) {
          this.ui.showPauseModal();
        } else {
          this.ui.closeAllModals();
        }
      };
      this.ui.onToggleSpeed = () => {
        if (!this.engine) return;
        const newMult = this.engine.speedMultiplier === 1 ? 2 : 1;
        this.engine.setSpeedMultiplier(newMult);
        this.ui.updateHUD(
          this.engine.level,
          this.engine.trains.filter((t) => t.state === "ENTERED_TUNNEL").length,
          this.engine.trains.length,
          Math.floor(this.engine.gameTime),
          newMult
        );
      };
      this.ui.onActivateHint = () => {
        if (!this.renderer) return;
        this.renderer.showHintRoutes = true;
        setTimeout(() => {
          if (this.renderer) this.renderer.showHintRoutes = false;
        }, 7e3);
      };
    }
    setupCanvasPointerInput() {
      const handleTap = (clientX, clientY) => {
        if (!this.engine || this.engine.isGameOver || this.engine.isCompleted || this.engine.isPaused) {
          return;
        }
        const { x, y } = this.displayManager.getGameCoordinates(clientX, clientY);
        const sw = this.engine.getSwitchAt(x, y);
        if (sw) {
          this.engine.toggleSwitch(sw.id);
          return;
        }
        const train = this.engine.getTrainAt(x, y);
        if (train) {
          this.engine.toggleTrainMovement(train.id);
          return;
        }
      };
      this.canvas.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handleTap(e.clientX, e.clientY);
      });
    }
    loadLevel(levelId) {
      const targetId = Math.max(1, Math.min(30, levelId));
      this.currentLevelIndex = targetId - 1;
      const levelConfig = LEVELS[this.currentLevelIndex] || LEVELS[0];
      const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 500 };
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(240, Math.floor(rect.height));
      this.engine = new YardEngine(levelConfig, width, height);
      if (!this.renderer) {
        this.renderer = new YardRenderer(this.ctx, this.engine);
      } else {
        this.renderer.setEngine(this.engine);
        this.renderer.showHintRoutes = false;
      }
      this.engine.onWinCallback = (timeSec) => {
        const { stars } = gameState.completeLevel(levelConfig.id, timeSec, levelConfig.targetTimeSec);
        this.ui.showWinModal(levelConfig, timeSec, stars);
        if (this.onWinCallback) {
          this.onWinCallback(timeSec);
        }
        try {
          window.parent?.postMessage({ type: "win", time: timeSec }, "*");
        } catch {
        }
      };
      this.engine.onCrashCallback = (reason) => {
        this.ui.showCrashModal(reason);
      };
      this.ui.setScreen("PLAYING");
      this.ui.updateHUD(
        levelConfig,
        0,
        this.engine.trains.length,
        0,
        this.engine.speedMultiplier
      );
      this.displayManager.resize();
    }
    startRenderLoop() {
      this.lastTime = performance.now();
      const loop = (currentTime) => {
        const dt = Math.min(0.1, (currentTime - this.lastTime) / 1e3);
        this.lastTime = currentTime;
        if (this.engine) {
          this.engine.update(dt);
          if (this.renderer) {
            this.renderer.render();
          }
          const cleared = this.engine.trains.filter((t) => t.state === "ENTERED_TUNNEL").length;
          this.ui.updateHUD(
            this.engine.level,
            cleared,
            this.engine.trains.length,
            Math.floor(this.engine.gameTime),
            this.engine.speedMultiplier
          );
        }
        this.animationFrameId = requestAnimationFrame(loop);
      };
      this.animationFrameId = requestAnimationFrame(loop);
    }
    destroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      audio.stopTrainHum();
    }
  };
  function render(container, onWin) {
    return new MetroSubwayGame(container, onWin);
  }
  var rootElement = document.getElementById("root");
  if (rootElement) {
    render(rootElement);
  }
})();
