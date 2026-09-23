(() => {
  // sky-control---air-traffic-collision-avoidance/src/display.ts
  var DisplayManager = class {
    constructor(canvas) {
      this.dpr = 1;
      this.width = 800;
      this.height = 600;
      this.resizeCallbacks = [];
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
      if (this.canvas.parentElement) {
        const observer = new ResizeObserver(() => this.resize());
        observer.observe(this.canvas.parentElement);
      } else {
        window.addEventListener("resize", () => this.resize());
      }
      setTimeout(() => this.resize(), 10);
    }
    onResize(cb) {
      this.resizeCallbacks.push(cb);
    }
    resize() {
      const parent = this.canvas.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      if (parentRect.width <= 0 || parentRect.height <= 0) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.floor(parentRect.width);
      const cssHeight = Math.floor(parentRect.height);
      this.width = cssWidth;
      this.height = cssHeight;
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.canvas.style.width = `${cssWidth}px`;
      this.canvas.style.height = `${cssHeight}px`;
      this.ctx.resetTransform?.();
      this.ctx.scale(this.dpr, this.dpr);
      for (const cb of this.resizeCallbacks) {
        cb(this.width, this.height);
      }
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      return {
        x: Math.max(0, Math.min(this.width, x)),
        y: Math.max(0, Math.min(this.height, y))
      };
    }
    getContext() {
      return this.ctx;
    }
  };

  // sky-control---air-traffic-collision-avoidance/src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.ambientGain = null;
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
    setEnabled(enabled) {
      this.enabled = enabled;
    }
    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
    // Tactical click / button tap
    playClick() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
    // ATC Radio acknowledgement blip
    playRadioBlip() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(1200, t);
      osc1.frequency.setValueAtTime(1800, t + 0.03);
      osc2.type = "square";
      osc2.frequency.setValueAtTime(600, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.08);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.09);
      osc2.stop(t + 0.09);
    }
    // Waypoint draw line sound
    playWaypointTick() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.02);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    }
    // TCAS Caution (Amber warning)
    playWarningCaution() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(750, t);
      osc.frequency.setValueAtTime(950, t + 0.08);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    }
    // TCAS Critical Danger Siren (Traffic collision immediate)
    playCollisionWarning() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.linearRampToValueAtTime(450, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }
    // Runway Landing Success Chime
    playLandingSuccess() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = t + idx * 0.07;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.15, noteTime);
        gain.gain.exponentialRampToValueAtTime(1e-3, noteTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    }
    // Crash / Explosion Sound with High Impact Punch
    playExplosion() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(150, t);
      subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
      subGain.gain.setValueAtTime(0.6, t);
      subGain.gain.exponentialRampToValueAtTime(1e-3, t + 0.5);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(t);
      subOsc.stop(t + 0.55);
      const crunchSize = Math.floor(this.ctx.sampleRate * 0.15);
      const crunchBuffer = this.ctx.createBuffer(1, crunchSize, this.ctx.sampleRate);
      const crunchData = crunchBuffer.getChannelData(0);
      for (let i = 0; i < crunchSize; i++) {
        crunchData[i] = (Math.random() * 2 - 1) * (1 - i / crunchSize);
      }
      const crunchSource = this.ctx.createBufferSource();
      crunchSource.buffer = crunchBuffer;
      const crunchFilter = this.ctx.createBiquadFilter();
      crunchFilter.type = "highpass";
      crunchFilter.frequency.setValueAtTime(1200, t);
      const crunchGain = this.ctx.createGain();
      crunchGain.gain.setValueAtTime(0.4, t);
      crunchGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      crunchSource.connect(crunchFilter);
      crunchFilter.connect(crunchGain);
      crunchGain.connect(this.ctx.destination);
      crunchSource.start(t);
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(60, t + 0.8);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(5e-3, t + 0.85);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(t);
      whiteNoise.stop(t + 0.9);
    }
    // Radar Ping / Scanner wave
    playRadarPing() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    }
    // Level Win Fanfare
    playLevelWin() {
      if (!this.enabled) return;
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = [440, 554.37, 659.25, 880];
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.85);
      });
    }
  };
  var sound = new SoundManager();

  // sky-control---air-traffic-collision-avoidance/src/game-state.ts
  var PLANE_CONFIGS = {
    airliner: {
      name: "Boeing 777 Airliner",
      speed: 55,
      turnSpeed: 1.8,
      radius: 20,
      length: 44,
      wingspan: 42,
      color: "#38bdf8",
      // Sky blue
      accentColor: "#0284c7",
      canLand: true,
      scoreValue: 100
    },
    concorde: {
      name: "SST Concorde",
      speed: 85,
      turnSpeed: 1.4,
      radius: 19,
      length: 52,
      wingspan: 30,
      color: "#fbbf24",
      // Amber gold
      accentColor: "#d97706",
      canLand: true,
      scoreValue: 180
    },
    cargo: {
      name: "An-124 Heavy Cargo",
      speed: 40,
      turnSpeed: 1.2,
      radius: 24,
      length: 50,
      wingspan: 48,
      color: "#a855f7",
      // Purple
      accentColor: "#7e22ce",
      canLand: true,
      scoreValue: 140
    },
    cessna: {
      name: "Cessna 172 Skyhawk",
      speed: 48,
      turnSpeed: 2.4,
      radius: 16,
      length: 32,
      wingspan: 34,
      color: "#34d399",
      // Emerald
      accentColor: "#059669",
      canLand: true,
      scoreValue: 80
    },
    helicopter: {
      name: "Rescue Eurocopter",
      speed: 42,
      turnSpeed: 3.2,
      radius: 17,
      length: 34,
      wingspan: 28,
      color: "#f87171",
      // Red/Coral
      accentColor: "#dc2626",
      canLand: true,
      scoreValue: 120
    }
  };
  var CALLSIGNS_PREFIX = ["AA", "BA", "DL", "UA", "LH", "AF", "KL", "JL", "EK", "SK", "TP", "AZ"];
  var LEVELS = [
    {
      id: 1,
      title: "Sector 1: Coastal Approach",
      subtitle: "Basic vectoring & collision avoidance",
      difficulty: "Easy",
      description: "Guide commercial flights across the sector or land on Runway 09. Keep separation and manage flight levels.",
      targetSafelyManaged: 6,
      spawnIntervalMin: 5.5,
      spawnIntervalMax: 7.5,
      maxSimultaneousPlanes: 3,
      allowedPlaneTypes: ["airliner", "cessna"],
      runways: [
        { id: "rw1", name: "RWY 09", x: 0.5, y: 0.65, length: 240, heading: 0, type: "paved", active: true }
      ],
      beacons: [
        { id: "VOR1", name: "BAY", x: 0.3, y: 0.35, type: "VOR" },
        { id: "VOR2", name: "OAK", x: 0.7, y: 0.35, type: "VOR" }
      ]
    },
    {
      id: 2,
      title: "Sector 2: Twin Corridors",
      subtitle: "Altitude separation & crossing traffic",
      difficulty: "Easy",
      description: "Planes at different altitudes (FL100, FL200, FL300) can safely fly over each other without crashing!",
      targetSafelyManaged: 8,
      spawnIntervalMin: 4.5,
      spawnIntervalMax: 6.5,
      maxSimultaneousPlanes: 4,
      allowedPlaneTypes: ["airliner", "cessna", "cargo"],
      runways: [
        { id: "rw1", name: "RWY 27", x: 0.5, y: 0.7, length: 250, heading: Math.PI, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "NAV1", x: 0.25, y: 0.3, type: "VOR" },
        { id: "B2", name: "NAV2", x: 0.75, y: 0.3, type: "VOR" },
        { id: "B3", name: "CTR", x: 0.5, y: 0.45, type: "WAYPOINT" }
      ]
    },
    {
      id: 3,
      title: "Sector 3: Dual Runway Hub",
      subtitle: "Parallel landings & cargo heavies",
      difficulty: "Medium",
      description: "Heavy cargo freighters turn slowly. Coordinate landings between North and South parallel runways.",
      targetSafelyManaged: 10,
      spawnIntervalMin: 4,
      spawnIntervalMax: 6,
      maxSimultaneousPlanes: 5,
      allowedPlaneTypes: ["airliner", "cargo", "cessna"],
      runways: [
        { id: "rw1", name: "RWY 09L", x: 0.5, y: 0.52, length: 240, heading: 0, type: "paved", active: true },
        { id: "rw2", name: "RWY 09R", x: 0.5, y: 0.8, length: 240, heading: 0, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "ALP", x: 0.25, y: 0.25, type: "VOR" },
        { id: "B2", name: "BET", x: 0.75, y: 0.25, type: "VOR" }
      ]
    },
    {
      id: 4,
      title: "Sector 4: Supersonic Express",
      subtitle: "Fast concorde speeds & tight reactions",
      difficulty: "Medium",
      description: "Concorde SST aircraft cruise at high velocity. Plan turns early and utilize high altitude (FL300) bypass.",
      targetSafelyManaged: 12,
      spawnIntervalMin: 3.5,
      spawnIntervalMax: 5.5,
      maxSimultaneousPlanes: 5,
      allowedPlaneTypes: ["airliner", "concorde", "cargo"],
      runways: [
        { id: "rw1", name: "RWY 18", x: 0.5, y: 0.6, length: 260, heading: Math.PI / 2, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "FAST", x: 0.5, y: 0.2, type: "VOR" },
        { id: "B2", name: "WPT1", x: 0.2, y: 0.5, type: "WAYPOINT" },
        { id: "B3", name: "WPT2", x: 0.8, y: 0.5, type: "WAYPOINT" }
      ]
    },
    {
      id: 5,
      title: "Sector 5: Helipad Medevac",
      subtitle: "Helicopter hover & fast agile landings",
      difficulty: "Medium",
      description: "Helicopters land directly on designated Helipads (H). Maintain clear landing sectors for incoming jets.",
      targetSafelyManaged: 14,
      spawnIntervalMin: 3.2,
      spawnIntervalMax: 5,
      maxSimultaneousPlanes: 6,
      allowedPlaneTypes: ["airliner", "helicopter", "cessna", "cargo"],
      runways: [
        { id: "rw1", name: "RWY 27", x: 0.62, y: 0.7, length: 240, heading: Math.PI, type: "paved", active: true },
        { id: "h1", name: "HELI-PAD", x: 0.25, y: 0.7, length: 80, heading: 0, type: "helipad", active: true }
      ],
      beacons: [
        { id: "B1", name: "HOSP", x: 0.25, y: 0.45, type: "VOR" },
        { id: "B2", name: "CITY", x: 0.7, y: 0.35, type: "VOR" }
      ]
    },
    {
      id: 6,
      title: "Sector 6: Storm Front Turbulence",
      subtitle: "Navigating active squall line cells",
      difficulty: "Hard",
      description: "Storm zones cause turbulence. Vector airplanes around red weather radar echoes while keeping separation.",
      targetSafelyManaged: 15,
      spawnIntervalMin: 3,
      spawnIntervalMax: 4.8,
      maxSimultaneousPlanes: 6,
      allowedPlaneTypes: ["airliner", "concorde", "cessna", "cargo", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 09", x: 0.5, y: 0.75, length: 250, heading: 0, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "RADAR", x: 0.2, y: 0.25, type: "VOR" },
        { id: "B2", name: "STORM", x: 0.8, y: 0.25, type: "VOR" }
      ],
      stormZones: [
        { x: 0.5, y: 0.35, radius: 65 }
      ]
    },
    {
      id: 7,
      title: "Sector 7: Crosswind X-Runways",
      subtitle: "Intersecting runway operations",
      difficulty: "Hard",
      description: "Two intersecting runways require precise timing so planes on final approach never cross simultaneously.",
      targetSafelyManaged: 16,
      spawnIntervalMin: 2.8,
      spawnIntervalMax: 4.5,
      maxSimultaneousPlanes: 7,
      allowedPlaneTypes: ["airliner", "concorde", "cargo", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 09", x: 0.5, y: 0.65, length: 250, heading: 0, type: "paved", active: true },
        { id: "rw2", name: "RWY 18", x: 0.5, y: 0.65, length: 250, heading: Math.PI / 2, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "NORTH", x: 0.5, y: 0.18, type: "VOR" },
        { id: "B2", name: "WEST", x: 0.15, y: 0.5, type: "VOR" },
        { id: "B3", name: "EAST", x: 0.85, y: 0.5, type: "VOR" }
      ]
    },
    {
      id: 8,
      title: "Sector 8: Night Radar Matrix",
      subtitle: "High density transit corridors",
      difficulty: "Hard",
      description: "Transit airspace with multiple exit corridors. Direct through-traffic to exit gates while managing arrivals.",
      targetSafelyManaged: 18,
      spawnIntervalMin: 2.5,
      spawnIntervalMax: 4,
      maxSimultaneousPlanes: 7,
      allowedPlaneTypes: ["airliner", "concorde", "cessna", "cargo", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 27", x: 0.65, y: 0.75, length: 240, heading: Math.PI, type: "paved", active: true },
        { id: "h1", name: "HELIPAD", x: 0.22, y: 0.75, length: 80, heading: 0, type: "helipad", active: true }
      ],
      beacons: [
        { id: "B1", name: "NEXUS", x: 0.35, y: 0.35, type: "VOR" },
        { id: "B2", name: "POLAR", x: 0.65, y: 0.35, type: "VOR" }
      ],
      stormZones: [
        { x: 0.5, y: 0.2, radius: 50 }
      ]
    },
    {
      id: 9,
      title: "Sector 9: Mountain Ridge Pass",
      subtitle: "Confined airspace & twin storms",
      difficulty: "Hard",
      description: "Restricted flight zones on both flanks. Keep all traffic within the central corridor using strict altitude layers.",
      targetSafelyManaged: 20,
      spawnIntervalMin: 2.4,
      spawnIntervalMax: 3.8,
      maxSimultaneousPlanes: 8,
      allowedPlaneTypes: ["airliner", "concorde", "cargo", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 09", x: 0.5, y: 0.75, length: 260, heading: 0, type: "paved", active: true }
      ],
      beacons: [
        { id: "B1", name: "RIDGE", x: 0.5, y: 0.45, type: "VOR" }
      ],
      stormZones: [
        { x: 0.2, y: 0.35, radius: 60 },
        { x: 0.8, y: 0.35, radius: 60 }
      ]
    },
    {
      id: 10,
      title: "Sector 10: Quad Runway Terminal",
      subtitle: "International Mega Hub",
      difficulty: "Extreme",
      description: "Heavy traffic volume from all cardinal directions. Continuous flow management and quick vector drawing required.",
      targetSafelyManaged: 22,
      spawnIntervalMin: 2.2,
      spawnIntervalMax: 3.5,
      maxSimultaneousPlanes: 8,
      allowedPlaneTypes: ["airliner", "concorde", "cargo", "cessna", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 09L", x: 0.4, y: 0.58, length: 230, heading: 0, type: "paved", active: true },
        { id: "rw2", name: "RWY 09R", x: 0.4, y: 0.82, length: 230, heading: 0, type: "paved", active: true },
        { id: "h1", name: "H-PAD", x: 0.82, y: 0.7, length: 80, heading: 0, type: "helipad", active: true }
      ],
      beacons: [
        { id: "B1", name: "FIX-W", x: 0.2, y: 0.25, type: "VOR" },
        { id: "B2", name: "FIX-E", x: 0.8, y: 0.25, type: "VOR" }
      ]
    },
    {
      id: 11,
      title: "Sector 11: Cyclone Vortex",
      subtitle: "Dynamic weather & multiple crises",
      difficulty: "Extreme",
      description: "Large rotating storm cell in center. Rapid altitude reassignment is critical to prevent mid-air gridlock.",
      targetSafelyManaged: 25,
      spawnIntervalMin: 2,
      spawnIntervalMax: 3.2,
      maxSimultaneousPlanes: 9,
      allowedPlaneTypes: ["airliner", "concorde", "cargo", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 27", x: 0.5, y: 0.8, length: 260, heading: Math.PI, type: "paved", active: true },
        { id: "h1", name: "H-MED", x: 0.2, y: 0.8, length: 80, heading: 0, type: "helipad", active: true }
      ],
      beacons: [
        { id: "B1", name: "VORTEX", x: 0.5, y: 0.2, type: "VOR" }
      ],
      stormZones: [
        { x: 0.5, y: 0.45, radius: 80 }
      ]
    },
    {
      id: 12,
      title: "Sector 12: Grand Apex Metropolis",
      subtitle: "The Ultimate Air Traffic Master",
      difficulty: "Extreme",
      description: "Maximum density airspace with Concorde, Freighters, Airliners, and Medevac copters. Zero margin for error.",
      targetSafelyManaged: 30,
      spawnIntervalMin: 1.8,
      spawnIntervalMax: 2.8,
      maxSimultaneousPlanes: 10,
      allowedPlaneTypes: ["airliner", "concorde", "cargo", "cessna", "helicopter"],
      runways: [
        { id: "rw1", name: "RWY 09", x: 0.35, y: 0.65, length: 230, heading: 0, type: "paved", active: true },
        { id: "rw2", name: "RWY 27", x: 0.72, y: 0.65, length: 230, heading: Math.PI, type: "paved", active: true },
        { id: "h1", name: "H-ROOF", x: 0.5, y: 0.86, length: 80, heading: 0, type: "helipad", active: true }
      ],
      beacons: [
        { id: "B1", name: "APEX", x: 0.5, y: 0.3, type: "VOR" },
        { id: "B2", name: "CORR1", x: 0.15, y: 0.4, type: "WAYPOINT" },
        { id: "B3", name: "CORR2", x: 0.85, y: 0.4, type: "WAYPOINT" }
      ],
      stormZones: [
        { x: 0.3, y: 0.2, radius: 45 },
        { x: 0.7, y: 0.2, radius: 45 }
      ]
    }
  ];
  var GameState = class {
    constructor() {
      this.planes = [];
      this.particles = [];
      this.currentLevelId = 1;
      this.score = 0;
      this.planesSafelyManaged = 0;
      this.levelStartTime = 0;
      this.spawnTimer = 0;
      this.nextSpawnInterval = 4;
      this.selectedPlaneId = null;
      this.isDrawingPath = false;
      this.activeDrawingPath = [];
      this.isGameOver = false;
      this.isLevelWon = false;
      this.isPaused = false;
      this.totalFlightHours = 0;
      this.collisionsCount = 0;
      this.lastIncidentDetails = null;
      this.radarSweepAngle = 0;
      this.emergencyRadarWaveTimer = 0;
      // Collision Animation & Screen FX
      this.screenShake = 0;
      this.flashAlpha = 0;
      this.collisionSequenceTimer = 0;
      // Persistence
      this.save = {
        unlockedLevel: 1,
        highScores: {},
        stars: {},
        soundEnabled: true,
        totalPlanesRouted: 0
      };
      this.callsignCounter = 101;
      this.loadSave();
    }
    loadSave() {
      try {
        const stored = localStorage.getItem("sky_control_save");
        if (stored) {
          const parsed = JSON.parse(stored);
          this.save = { ...this.save, ...parsed };
        }
      } catch {
      }
    }
    writeSave() {
      try {
        localStorage.setItem("sky_control_save", JSON.stringify(this.save));
      } catch {
      }
    }
    getCurrentLevel() {
      return LEVELS.find((l) => l.id === this.currentLevelId) || LEVELS[0];
    }
    startLevel(levelId) {
      this.currentLevelId = levelId;
      this.planes = [];
      this.particles = [];
      this.score = 0;
      this.planesSafelyManaged = 0;
      this.levelStartTime = Date.now();
      this.spawnTimer = 1;
      this.nextSpawnInterval = 2;
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
    generateCallsign() {
      const pfx = CALLSIGNS_PREFIX[Math.floor(Math.random() * CALLSIGNS_PREFIX.length)];
      const num = this.callsignCounter++;
      return `${pfx}${num}`;
    }
    spawnPlane(width, height) {
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
      const altitude = Math.floor(Math.random() * 3) + 1;
      const plane = {
        id: "plane_" + Math.random().toString(36).substring(2, 9),
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
        status: "airborne",
        selected: false,
        warningLevel: "none",
        warningTimer: 0,
        trail: [],
        timeInAir: 0,
        bankAngle: 0,
        opacity: 1,
        fireTimer: 0
      };
      const targetX = width * 0.5 + (Math.random() * 100 - 50);
      const targetY = height * 0.5 + (Math.random() * 100 - 50);
      plane.targetHeading = Math.atan2(targetY - y, targetX - x);
      plane.heading = plane.targetHeading;
      this.planes.push(plane);
      sound.playRadioBlip();
    }
    selectPlane(id) {
      this.selectedPlaneId = id;
      for (const p of this.planes) {
        p.selected = p.id === id;
      }
      if (id) {
        sound.playClick();
      }
    }
    setPlaneAltitude(planeId, alt) {
      const plane = this.planes.find((p) => p.id === planeId);
      if (plane && plane.altitude !== alt) {
        plane.targetAltitude = alt;
        sound.playRadioBlip();
      }
    }
    turnPlaneRelative(planeId, angleDeltaRad) {
      const plane = this.planes.find((p) => p.id === planeId);
      if (plane) {
        plane.path = [];
        plane.targetHeading = (plane.targetHeading + angleDeltaRad + Math.PI * 4) % (Math.PI * 2);
        sound.playRadioBlip();
      }
    }
    directPlaneToRunway(planeId, runwayId, width, height) {
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
        { x: rX, y: rY }
      ];
      plane.targetRunwayId = runwayId;
      plane.targetAltitude = 1;
      sound.playRadioBlip();
    }
    activateEmergencyClearance(width, height) {
      this.emergencyRadarWaveTimer = 3;
      sound.playRadarPing();
      for (let i = 0; i < this.planes.length; i++) {
        const p = this.planes[i];
        if (p.status === "airborne") {
          p.warningLevel = "none";
          const safeAlt = i % 3 + 1;
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
        color: "#38bdf8",
        radius: 20,
        alpha: 1,
        decay: 0.35,
        type: "radar_wave"
      });
    }
    update(dt, width, height) {
      let showGameOverModal = false;
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 14);
      }
      if (this.flashAlpha > 0) {
        this.flashAlpha = Math.max(0, this.flashAlpha - dt * 2.8);
      }
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
      let landedPlane = null;
      this.radarSweepAngle = (this.radarSweepAngle + dt * 1.5) % (Math.PI * 2);
      if (this.emergencyRadarWaveTimer > 0) {
        this.emergencyRadarWaveTimer -= dt;
      }
      if (!this.isGameOver && !this.isLevelWon) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
          this.spawnPlane(width, height);
          this.nextSpawnInterval = level.spawnIntervalMin + Math.random() * (level.spawnIntervalMax - level.spawnIntervalMin);
          this.spawnTimer = this.nextSpawnInterval;
        }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= pt.decay * dt;
        if (pt.type === "debris" || pt.type === "spark") {
          pt.vx *= 0.96;
          pt.vy *= 0.96;
        }
        if (pt.rotation !== void 0 && pt.vRot !== void 0) {
          pt.rotation += pt.vRot * dt;
        }
        if (pt.growthRate) {
          pt.radius += pt.growthRate * dt;
        }
        if (pt.type === "radar_wave") {
          pt.radius += dt * 350;
        }
        if (pt.type === "debris" && Math.random() < 0.35 && pt.alpha > 0.3) {
          this.particles.push({
            x: pt.x,
            y: pt.y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            color: "#475569",
            radius: 2 + Math.random() * 3,
            alpha: 0.6,
            decay: 0.8,
            growthRate: 8,
            type: "smoke"
          });
        }
        if (pt.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
      for (let i = this.planes.length - 1; i >= 0; i--) {
        const plane = this.planes[i];
        plane.timeInAir += dt;
        if (plane.status === "collided") {
          plane.fireTimer = (plane.fireTimer || 0) + dt;
          plane.heading += (plane.spinSpeed || 6) * dt;
          plane.x += (plane.impactVx || 0) * dt;
          plane.y += (plane.impactVy || 0) * dt;
          plane.opacity = Math.max(0, (plane.opacity || 1) - dt * 0.45);
          if (Math.random() < 0.7) {
            const isFire = Math.random() < 0.6;
            this.particles.push({
              x: plane.x + (Math.random() - 0.5) * 10,
              y: plane.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 30,
              vy: (Math.random() - 0.5) * 30,
              color: isFire ? Math.random() < 0.5 ? "#f97316" : "#fbbf24" : "#334155",
              radius: isFire ? 4 + Math.random() * 4 : 5 + Math.random() * 6,
              alpha: 0.9,
              decay: isFire ? 1.2 : 0.6,
              growthRate: 14,
              type: isFire ? "fire" : "smoke"
            });
          }
          if (plane.opacity <= 0.05) {
            this.planes.splice(i, 1);
          }
          continue;
        }
        if (plane.altitude !== plane.targetAltitude) {
          const dir = plane.targetAltitude > plane.altitude ? 1 : -1;
          plane.altitudeProgress += dir * dt * 0.8;
          if (dir > 0 && plane.altitudeProgress >= 1) {
            plane.altitude = plane.altitude + 1;
            plane.altitudeProgress = 1;
          } else if (dir < 0 && plane.altitudeProgress <= 0) {
            plane.altitude = plane.altitude - 1;
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
        for (const runway of level.runways) {
          const rX = runway.x * width;
          const rY = runway.y * height;
          const distToRunway = Math.hypot(plane.x - rX, plane.y - rY);
          if (runway.type === "helipad" && plane.type === "helicopter") {
            if (distToRunway < 44 && plane.altitude === 1) {
              plane.status = "landed";
              this.handleSafeClearance(plane, true);
              landedPlane = plane;
              this.planes.splice(i, 1);
              break;
            }
          } else if (runway.type === "paved" && plane.type !== "helicopter") {
            let angleDiff = Math.abs(plane.heading - runway.heading);
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            angleDiff = Math.abs(angleDiff);
            if (distToRunway < 56 && plane.altitude === 1 && angleDiff < 0.75) {
              plane.status = "landed";
              this.handleSafeClearance(plane, true);
              landedPlane = plane;
              this.planes.splice(i, 1);
              break;
            }
          }
        }
        const outMargin = 45;
        if (plane.x < -outMargin || plane.x > width + outMargin || plane.y < -outMargin || plane.y > height + outMargin) {
          if (plane.timeInAir > 4) {
            plane.status = "exited";
            this.handleSafeClearance(plane, false);
            this.planes.splice(i, 1);
          }
        }
      }
      let hasCollision = false;
      let anyCaution = false;
      let anyCritical = false;
      if (!this.isGameOver) {
        for (let i = 0; i < this.planes.length; i++) {
          this.planes[i].warningLevel = "none";
        }
        for (let i = 0; i < this.planes.length; i++) {
          for (let j = i + 1; j < this.planes.length; j++) {
            const p1 = this.planes[i];
            const p2 = this.planes[j];
            if (p1.status !== "airborne" || p2.status !== "airborne") continue;
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const altDiff = Math.abs(p1.altitude - p2.altitude);
            if (altDiff === 0) {
              if (dist < 28) {
                this.triggerMidAirCollision(p1, p2);
                hasCollision = true;
                break;
              } else if (dist < 55) {
                p1.warningLevel = "critical";
                p2.warningLevel = "critical";
                anyCritical = true;
              } else if (dist < 95) {
                if (p1.warningLevel !== "critical") p1.warningLevel = "caution";
                if (p2.warningLevel !== "critical") p2.warningLevel = "caution";
                anyCaution = true;
              }
            } else if (altDiff === 1) {
              if (dist < 40) {
                if (p1.warningLevel === "none") p1.warningLevel = "caution";
                if (p2.warningLevel === "none") p2.warningLevel = "caution";
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
      let hasWon = false;
      if (this.planesSafelyManaged >= level.targetSafelyManaged && !this.isGameOver) {
        this.isLevelWon = true;
        hasWon = true;
        sound.playLevelWin();
        this.handleLevelCompleted();
      }
      return { hasCollision, hasWon, landedPlane, showGameOverModal };
    }
    triggerMidAirCollision(p1, p2) {
      this.isGameOver = true;
      this.collisionSequenceTimer = 2.4;
      this.screenShake = 18;
      this.flashAlpha = 0.9;
      this.collisionsCount++;
      p1.status = "collided";
      p2.status = "collided";
      p1.opacity = 1;
      p2.opacity = 1;
      p1.fireTimer = 0;
      p2.fireTimer = 0;
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      this.lastIncidentDetails = { p1: p1.callsign, p2: p2.callsign, x: midX, y: midY };
      const angleP1 = Math.atan2(p1.y - midY, p1.x - midX);
      const angleP2 = Math.atan2(p2.y - midY, p2.x - midX);
      p1.impactVx = Math.cos(angleP1) * 70;
      p1.impactVy = Math.sin(angleP1) * 70;
      p1.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 8);
      p2.impactVx = Math.cos(angleP2) * 70;
      p2.impactVy = Math.sin(angleP2) * 70;
      p2.spinSpeed = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 8);
      sound.playExplosion();
      this.particles.push({
        x: midX,
        y: midY,
        vx: 0,
        vy: 0,
        color: "#ffffff",
        radius: 12,
        alpha: 1,
        decay: 2.2,
        growthRate: 160,
        type: "ring"
      });
      this.particles.push({
        x: midX,
        y: midY,
        vx: 0,
        vy: 0,
        color: "#ef4444",
        radius: 8,
        alpha: 1,
        decay: 1.2,
        growthRate: 110,
        type: "ring"
      });
      for (let f = 0; f < 6; f++) {
        const angle = Math.PI * 2 * f / 6 + Math.random() * 0.4;
        const dist = 5 + Math.random() * 15;
        this.particles.push({
          x: midX + Math.cos(angle) * dist,
          y: midY + Math.sin(angle) * dist,
          vx: Math.cos(angle) * (20 + Math.random() * 30),
          vy: Math.sin(angle) * (20 + Math.random() * 30),
          color: f % 2 === 0 ? "#fbbf24" : "#f97316",
          radius: 14 + Math.random() * 10,
          alpha: 1,
          decay: 0.65 + Math.random() * 0.4,
          growthRate: 45 + Math.random() * 35,
          type: "fireball"
        });
      }
      for (let k = 0; k < 80; k++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 240;
        const colors = ["#ffffff", "#fef08a", "#fbbf24", "#f97316", "#ef4444"];
        this.particles.push({
          x: midX,
          y: midY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: 2 + Math.random() * 4,
          alpha: 1,
          decay: 0.7 + Math.random() * 1,
          type: "spark"
        });
      }
      const debrisTypes = ["wing", "fuselage", "engine", "wing"];
      for (let d = 0; d < 18; d++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 140;
        this.particles.push({
          x: midX,
          y: midY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: d % 2 === 0 ? "#38bdf8" : "#e2e8f0",
          radius: 6,
          length: 12 + Math.random() * 16,
          width: 4 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 14,
          alpha: 1,
          decay: 0.35 + Math.random() * 0.25,
          type: "debris",
          debrisType: debrisTypes[d % debrisTypes.length]
        });
      }
      this.particles.push({
        x: midX,
        y: midY,
        vx: 0,
        vy: 0,
        color: "#020617",
        radius: 42,
        alpha: 0.85,
        decay: 0.05,
        type: "scorch"
      });
    }
    handleSafeClearance(plane, isLanding) {
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
            color: "#cbd5e1",
            radius: 2 + Math.random() * 3,
            alpha: 0.8,
            decay: 0.9,
            type: "smoke"
          });
        }
      } else {
        sound.playRadioBlip();
      }
    }
    handleLevelCompleted() {
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
  };

  // sky-control---air-traffic-collision-avoidance/src/renderer.ts
  var GameRenderer = class {
    constructor(ctx) {
      this.animTimer = 0;
      this.ctx = ctx;
    }
    render(state, width, height, dt) {
      this.animTimer += dt;
      const ctx = this.ctx;
      const level = state.getCurrentLevel();
      ctx.save();
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake * 2.2;
        const shakeY = (Math.random() - 0.5) * state.screenShake * 2.2;
        ctx.translate(shakeX, shakeY);
      }
      this.renderAirspaceBackground(ctx, width, height, state);
      this.renderScorchMarks(ctx, state);
      if (level.stormZones) {
        for (const storm of level.stormZones) {
          this.renderStormCell(ctx, storm.x * width, storm.y * height, storm.radius);
        }
      }
      for (const beacon of level.beacons) {
        this.renderBeacon(ctx, beacon.x * width, beacon.y * height, beacon.name, beacon.type);
      }
      for (const runway of level.runways) {
        this.renderRunway(ctx, runway, width, height);
      }
      this.renderFlightPaths(ctx, state);
      for (const plane of state.planes) {
        this.renderPlaneShadow(ctx, plane);
      }
      for (const plane of state.planes) {
        this.renderPlaneTrails(ctx, plane);
      }
      for (const plane of state.planes) {
        this.renderPlaneBody(ctx, plane);
      }
      for (const plane of state.planes) {
        if (plane.status === "airborne") {
          this.renderTCASAlerts(ctx, plane);
        }
      }
      for (const plane of state.planes) {
        if (plane.status === "airborne") {
          this.renderFlightDataTag(ctx, plane, plane.id === state.selectedPlaneId);
        }
      }
      if (state.isDrawingPath && state.activeDrawingPath.length > 0) {
        this.renderUserDrawing(ctx, state.activeDrawingPath);
      }
      this.renderParticles(ctx, state);
      this.renderRadarSweep(ctx, width, height, state.radarSweepAngle);
      if (state.emergencyRadarWaveTimer > 0) {
        this.renderEmergencyWaveOverlay(ctx, width, height, state.emergencyRadarWaveTimer);
      }
      ctx.restore();
      if (state.flashAlpha > 0.01) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, state.flashAlpha * 0.95)})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }
    renderAirspaceBackground(ctx, width, height, _state) {
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, "#0f172a");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      const cx = width / 2;
      const cy = height / 2;
      const maxDim = Math.max(width, height);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let r = 80; r < maxDim; r += 90) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.font = "9px monospace";
        ctx.fillText(`${Math.floor(r / 10)}NM`, cx + r + 3, cy - 3);
      }
      ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
      ctx.restore();
    }
    renderScorchMarks(ctx, state) {
      ctx.save();
      for (const pt of state.particles) {
        if (pt.type === "scorch") {
          const radGrad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, pt.radius);
          radGrad.addColorStop(0, `rgba(0, 0, 0, ${pt.alpha * 0.95})`);
          radGrad.addColorStop(0.5, `rgba(15, 23, 42, ${pt.alpha * 0.7})`);
          radGrad.addColorStop(0.8, `rgba(180, 83, 9, ${pt.alpha * 0.4})`);
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    renderStormCell(ctx, x, y, radius) {
      ctx.save();
      const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      grad.addColorStop(0, "rgba(239, 68, 68, 0.35)");
      grad.addColorStop(0.5, "rgba(245, 158, 11, 0.25)");
      grad.addColorStop(0.8, "rgba(16, 185, 129, 0.15)");
      grad.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("\u26A1 SQUALL LINE", x, y - radius + 12);
      ctx.restore();
    }
    renderBeacon(ctx, x, y, name, type) {
      ctx.save();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      if (type === "VOR") {
        ctx.strokeRect(x - 5, y - 5, 10, 10);
        ctx.strokeRect(x - 2, y - 2, 4, 4);
      } else if (type === "WAYPOINT") {
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x + 5, y + 4);
        ctx.lineTo(x - 5, y + 4);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`\u25B2 ${name}`, x, y + 15);
      ctx.restore();
    }
    renderRunway(ctx, runway, width, height) {
      const rx = runway.x * width;
      const ry = runway.y * height;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(runway.heading);
      if (runway.type === "helipad") {
        const padRadius = 38;
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.beginPath();
        ctx.arc(0, 0, padRadius + 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, padRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, padRadius - 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, padRadius - 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        const beaconFlash = (Math.sin(this.animTimer * 6) + 1) * 0.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const lx = Math.cos(a) * (padRadius + 2);
          const ly = Math.sin(a) * (padRadius + 2);
          ctx.fillStyle = `rgba(248, 113, 113, ${0.4 + beaconFlash * 0.6})`;
          ctx.beginPath();
          ctx.arc(lx, ly, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
        ctx.fillRect(-6, -20, 12, 40);
        ctx.fillRect(-20, -6, 40, 12);
        ctx.fillStyle = "#f87171";
        ctx.font = '900 24px "Inter", system-ui, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H", 0, 0);
        ctx.fillStyle = "#fca5a5";
        ctx.font = "bold 9px monospace";
        ctx.fillText(runway.name, 0, padRadius + 18);
      } else {
        const len = runway.length;
        const wid = 44;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.fillRect(-len / 2 - 20, -wid / 2 - 8, len + 40, wid + 16);
        const asphaltGrad = ctx.createLinearGradient(0, -wid / 2, 0, wid / 2);
        asphaltGrad.addColorStop(0, "#090d16");
        asphaltGrad.addColorStop(0.2, "#0f172a");
        asphaltGrad.addColorStop(0.8, "#0f172a");
        asphaltGrad.addColorStop(1, "#090d16");
        ctx.fillStyle = asphaltGrad;
        ctx.fillRect(-len / 2, -wid / 2, len, wid);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.strokeRect(-len / 2, -wid / 2, len, wid);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        for (let c = -len / 2 - 14; c < -len / 2; c += 6) {
          ctx.beginPath();
          ctx.moveTo(c - 4, -wid / 3);
          ctx.lineTo(c, 0);
          ctx.lineTo(c - 4, wid / 3);
          ctx.stroke();
        }
        const approachPulse = this.animTimer * 4 % 1;
        const rabbitIndex = Math.floor(approachPulse * 7);
        for (let i = 0; i < 8; i++) {
          const dist = 30 + i * 22;
          const lx = -len / 2 - dist;
          ctx.strokeStyle = "rgba(203, 213, 225, 0.35)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lx, -12);
          ctx.lineTo(lx, 12);
          ctx.stroke();
          const isRabbit = i === 7 - rabbitIndex;
          ctx.fillStyle = isRabbit ? "#ffffff" : "rgba(52, 211, 153, 0.6)";
          ctx.beginPath();
          ctx.arc(lx, 0, isRabbit ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          if (isRabbit) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(lx, 0, 9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(-len / 2 - 2, -wid / 2, 4, wid);
        const reilFlash = Math.sin(this.animTimer * 8) > 0.3;
        if (reilFlash) {
          ctx.fillStyle = "#4ade80";
          ctx.beginPath();
          ctx.arc(-len / 2, -wid / 2 - 4, 3.5, 0, Math.PI * 2);
          ctx.arc(-len / 2, wid / 2 + 4, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#f8fafc";
        const keyCount = 10;
        const keyHeight = 2.4;
        const keySpacing = (wid - 10) / keyCount;
        for (let k = 0; k < keyCount; k++) {
          const ky = -wid / 2 + 5 + k * keySpacing;
          ctx.fillRect(-len / 2 + 4, ky, 18, keyHeight);
          ctx.fillRect(len / 2 - 22, ky, 18, keyHeight);
        }
        ctx.save();
        ctx.fillStyle = "#f8fafc";
        ctx.font = "900 13px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(-len / 2 + 36, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(runway.name.replace("RWY ", ""), 0, 0);
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-len / 2 + 65, -wid / 3, 24, 4);
        ctx.fillRect(-len / 2 + 65, wid / 3 - 4, 24, 4);
        ctx.fillRect(-len / 2 + 105, -wid / 4, 16, 2.5);
        ctx.fillRect(-len / 2 + 105, wid / 4 - 2.5, 16, 2.5);
        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([14, 12]);
        ctx.beginPath();
        ctx.moveTo(-len / 2 + 48, 0);
        ctx.lineTo(len / 2 - 30, 0);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let l = -len / 2 + 50; l < len / 2 - 30; l += 26) {
          const isEndPortion = l > len / 2 - 80;
          ctx.fillStyle = isEndPortion ? "#fbbf24" : "#f8fafc";
          ctx.beginPath();
          ctx.arc(l, 0, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(len / 2 - 2, -wid / 2, 4, wid);
        for (let ex = -len / 2; ex <= len / 2; ex += 22) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(ex, -wid / 2, 1.5, 0, Math.PI * 2);
          ctx.arc(ex, wid / 2, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`\u25B2 ${runway.name}`, 0, -wid / 2 - 8);
      }
      ctx.restore();
    }
    renderFlightPaths(ctx, state) {
      for (const plane of state.planes) {
        if (plane.status === "collided" || plane.path.length === 0) continue;
        const isSelected = plane.id === state.selectedPlaneId;
        ctx.save();
        ctx.strokeStyle = isSelected ? "#38bdf8" : "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(plane.x, plane.y);
        for (const pt of plane.path) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        for (let i = 0; i < plane.path.length; i++) {
          const wp = plane.path[i];
          ctx.fillStyle = isSelected ? "#38bdf8" : "rgba(56, 189, 248, 0.7)";
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
          ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
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
    renderPlaneShadow(ctx, plane) {
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
    renderPlaneTrails(ctx, plane) {
      if (plane.trail.length === 0) return;
      ctx.save();
      for (const t of plane.trail) {
        ctx.fillStyle = plane.type === "concorde" ? `rgba(251, 191, 36, ${t.alpha * 0.5})` : `rgba(255, 255, 255, ${t.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2 + (1 - t.alpha) * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    renderPlaneBody(ctx, plane) {
      const config = PLANE_CONFIGS[plane.type];
      ctx.save();
      ctx.translate(plane.x, plane.y);
      ctx.rotate(plane.heading);
      if (plane.opacity !== void 0) {
        ctx.globalAlpha = Math.max(0, plane.opacity);
      }
      if (Math.abs(plane.bankAngle) > 0.05) {
        ctx.transform(1, 0, plane.bankAngle * 0.25, 1, 0, 0);
      }
      if (plane.status === "collided") {
        const fireGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
        fireGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        fireGrad.addColorStop(0.3, "rgba(251, 191, 36, 0.85)");
        fireGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.65)");
        fireGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      const bodyColor = plane.status === "collided" ? "#1e293b" : config.color;
      const accentColor = plane.status === "collided" ? "#0f172a" : config.accentColor;
      if (plane.type === "helicopter") {
        ctx.save();
        const beamGrad = ctx.createRadialGradient(28, 0, 2, 45, 0, 25);
        beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
        beamGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(50, -16);
        ctx.lineTo(50, 16);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-24, 0);
        ctx.stroke();
        ctx.fillStyle = accentColor;
        ctx.fillRect(-18, -7, 3, 14);
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(-24, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const tailSpin = this.animTimer * 45;
        ctx.save();
        ctx.translate(-24, 0);
        ctx.rotate(tailSpin);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(4, 0);
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.stroke();
        ctx.restore();
        const cabinGrad = ctx.createLinearGradient(0, -9, 0, 9);
        cabinGrad.addColorStop(0, "#ffffff");
        cabinGrad.addColorStop(0.3, bodyColor);
        cabinGrad.addColorStop(1, accentColor);
        ctx.fillStyle = cabinGrad;
        ctx.beginPath();
        ctx.ellipse(3, 0, 16, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(0, -5, 4, 10);
        ctx.fillRect(-3, -2, 10, 4);
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.ellipse(12, 0, 5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(14, -1.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
        ctx.beginPath();
        ctx.arc(3, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(3, 0, 21.5, 0, Math.PI * 2);
        ctx.stroke();
        const rotorAngle = this.animTimer * 32;
        ctx.save();
        ctx.translate(3, 0);
        ctx.rotate(rotorAngle);
        for (let b = 0; b < 4; b++) {
          ctx.rotate(Math.PI / 2);
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(-1.5, 3, 3, 18);
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(-1.5, 17, 3, 4);
        }
        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (plane.type === "concorde") {
        if (plane.status !== "collided") {
          const flameLength = 12 + Math.sin(this.animTimer * 30) * 4;
          const flameGrad = ctx.createLinearGradient(-18, 0, -18 - flameLength, 0);
          flameGrad.addColorStop(0, "#60a5fa");
          flameGrad.addColorStop(0.3, "#f59e0b");
          flameGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
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
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.quadraticCurveTo(0, -16, -16, -18);
        ctx.lineTo(-20, -17);
        ctx.lineTo(-16, -6);
        ctx.lineTo(-24, 0);
        ctx.lineTo(-16, 6);
        ctx.lineTo(-20, 17);
        ctx.quadraticCurveTo(0, 16, 10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(-14, -14);
        ctx.moveTo(0, 4);
        ctx.lineTo(-14, 14);
        ctx.stroke();
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(-16, -6, 10, 3.5);
        ctx.fillRect(-16, 2.5, 10, 3.5);
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 1;
        ctx.strokeRect(-16, -6, 10, 3.5);
        ctx.strokeRect(-16, 2.5, 10, 3.5);
        const concordeGrad = ctx.createLinearGradient(0, -4, 0, 4);
        concordeGrad.addColorStop(0, "#ffffff");
        concordeGrad.addColorStop(0.4, bodyColor);
        concordeGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = concordeGrad;
        ctx.beginPath();
        ctx.moveTo(28, 0);
        ctx.lineTo(20, -2.5);
        ctx.lineTo(-22, -3.5);
        ctx.lineTo(-26, 0);
        ctx.lineTo(-22, 3.5);
        ctx.lineTo(20, 2.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(18, -1.5);
        ctx.lineTo(22, 0);
        ctx.lineTo(18, 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-26, 0);
        ctx.lineTo(-22, -1.5);
        ctx.closePath();
        ctx.fill();
      } else if (plane.type === "cargo") {
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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-2, -26.5, 5, 1.5);
        ctx.fillRect(-2, 25, 5, 1.5);
        const enginePositions = [-19, -11, 11, 19];
        for (const ey of enginePositions) {
          ctx.fillStyle = "#475569";
          ctx.fillRect(-2, ey > 0 ? ey - 2 : ey + 1, 6, 1.5);
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, ey - 2, 9, 4);
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(8, ey - 2, 2, 4);
          if (plane.status !== "collided") {
            ctx.fillStyle = "rgba(249, 115, 22, 0.6)";
            ctx.fillRect(-2, ey - 1, 2, 2);
          }
        }
        const cargoGrad = ctx.createLinearGradient(0, -9, 0, 9);
        cargoGrad.addColorStop(0, "#ffffff");
        cargoGrad.addColorStop(0.35, bodyColor);
        cargoGrad.addColorStop(1, "#6b21a8");
        ctx.fillStyle = cargoGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 7.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#475569";
        ctx.fillRect(-6, -8.5, 14, 2);
        ctx.fillRect(-6, 6.5, 14, 2);
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(17, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(16, 0, 4, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
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
      } else if (plane.type === "cessna") {
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
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(3, -12);
        ctx.lineTo(0, -3);
        ctx.moveTo(3, 12);
        ctx.lineTo(0, 3);
        ctx.stroke();
        const cessnaGrad = ctx.createLinearGradient(0, -4, 0, 4);
        cessnaGrad.addColorStop(0, "#ffffff");
        cessnaGrad.addColorStop(0.3, bodyColor);
        cessnaGrad.addColorStop(1, "#047857");
        ctx.fillStyle = cessnaGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(4, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(3, -1.5, 2, 3);
        ctx.fillStyle = accentColor;
        ctx.fillRect(-15, -7, 3, 14);
        const propAngle = this.animTimer * 40;
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.ellipse(16, 0, 1.5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.translate(16, 0);
        ctx.rotate(propAngle);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(0, 7);
        ctx.stroke();
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(-1, -7, 2, 2);
        ctx.fillRect(-1, 5, 2, 2);
        ctx.restore();
        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.arc(16, 0, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(4, -20);
        ctx.lineTo(1, -21);
        ctx.lineTo(-2, -20);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-2, 20);
        ctx.lineTo(1, 21);
        ctx.lineTo(4, 20);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, -22, 3, 2);
        ctx.fillRect(0, 20, 3, 2);
        for (const ey of [-10, 10]) {
          ctx.fillStyle = "#475569";
          ctx.fillRect(2, ey > 0 ? ey - 2 : ey + 1, 6, 1.5);
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(3, ey - 2.5, 10, 5);
          ctx.fillStyle = "#cbd5e1";
          ctx.fillRect(11, ey - 2.5, 2.5, 5);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(12, ey - 1, 2, 2);
          if (plane.status !== "collided") {
            ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
            ctx.fillRect(1, ey - 1, 2, 2);
          }
        }
        const fuselageGrad = ctx.createLinearGradient(0, -6, 0, 6);
        fuselageGrad.addColorStop(0, "#ffffff");
        fuselageGrad.addColorStop(0.3, bodyColor);
        fuselageGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = fuselageGrad;
        ctx.beginPath();
        ctx.ellipse(2, 0, 22, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = accentColor;
        ctx.fillRect(-10, -1, 22, 2);
        ctx.fillStyle = "#0f172a";
        for (let w = -8; w <= 12; w += 3) {
          ctx.fillRect(w, -3.2, 1.5, 1);
          ctx.fillRect(w, 2.2, 1.5, 1);
        }
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.moveTo(17, -2.5);
        ctx.lineTo(21, 0);
        ctx.lineTo(17, 2.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(18, -1.5, 2, 1.2);
        ctx.fillRect(18, 0.3, 2, 1.2);
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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-16, -0.8, 8, 1.6);
      }
      if (plane.status !== "collided") {
        const strobeTimer = this.animTimer * 10;
        const wingStrobe = Math.sin(strobeTimer) > 0.6;
        const beaconFlash = Math.sin(strobeTimer * 0.7) > 0.4;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, -config.wingspan * 0.48, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(0, config.wingspan * 0.48, 2, 0, Math.PI * 2);
        ctx.fill();
        if (wingStrobe) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-2, -config.wingspan * 0.48, 3, 0, Math.PI * 2);
          ctx.arc(-2, config.wingspan * 0.48, 3, 0, Math.PI * 2);
          ctx.arc(-config.length * 0.45, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        if (beaconFlash) {
          ctx.fillStyle = "#ff0000";
          ctx.beginPath();
          ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    renderTCASAlerts(ctx, plane) {
      if (plane.warningLevel === "none") return;
      const isCritical = plane.warningLevel === "critical";
      ctx.save();
      const r = isCritical ? 26 : 45;
      const pulse = (Math.sin(this.animTimer * (isCritical ? 14 : 6)) + 1) * 0.5;
      const color = isCritical ? `rgba(239, 68, 68, ${0.4 + pulse * 0.5})` : `rgba(245, 158, 11, ${0.3 + pulse * 0.4})`;
      ctx.strokeStyle = color;
      ctx.lineWidth = isCritical ? 2.5 : 1.5;
      ctx.setLineDash(isCritical ? [4, 4] : [8, 6]);
      ctx.beginPath();
      ctx.arc(plane.x, plane.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = isCritical ? "rgba(239, 68, 68, 0.85)" : "rgba(245, 158, 11, 0.85)";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isCritical ? "\u26A0\uFE0F TRAFFIC CRITICAL" : "CAUTION", plane.x, plane.y - r - 4);
      ctx.restore();
    }
    renderFlightDataTag(ctx, plane, isSelected) {
      ctx.save();
      const tagX = plane.x + 24;
      const tagY = plane.y - 20;
      ctx.strokeStyle = isSelected ? "#38bdf8" : "rgba(148, 163, 184, 0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plane.x + 8, plane.y - 8);
      ctx.lineTo(tagX - 4, tagY + 6);
      ctx.stroke();
      const altName = `FL${plane.altitude}00`;
      const spdName = `${Math.floor(plane.speed * 4)}KT`;
      ctx.fillStyle = isSelected ? "rgba(15, 23, 42, 0.95)" : plane.warningLevel === "critical" ? "rgba(239, 68, 68, 0.25)" : "rgba(15, 23, 42, 0.75)";
      ctx.strokeStyle = isSelected ? "#38bdf8" : plane.warningLevel === "critical" ? "#ef4444" : "#334155";
      ctx.lineWidth = 1;
      ctx.fillRect(tagX - 4, tagY - 12, 68, 26);
      ctx.strokeRect(tagX - 4, tagY - 12, 68, 26);
      ctx.fillStyle = isSelected ? "#38bdf8" : "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(plane.callsign, tagX, tagY - 2);
      ctx.fillStyle = plane.altitude === 3 ? "#a855f7" : plane.altitude === 2 ? "#38bdf8" : "#34d399";
      ctx.font = "8px monospace";
      ctx.fillText(`${altName} ${spdName}`, tagX, tagY + 9);
      if (isSelected) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(plane.x, plane.y, 22, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    renderUserDrawing(ctx, path) {
      ctx.save();
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
      const tip = path[path.length - 1];
      ctx.strokeStyle = "#22c55e";
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
    renderParticles(ctx, state) {
      ctx.save();
      for (const pt of state.particles) {
        if (pt.type === "scorch") {
          continue;
        }
        if (pt.type === "fireball") {
          const alpha = Math.max(0, pt.alpha);
          const grad = ctx.createRadialGradient(pt.x, pt.y, pt.radius * 0.1, pt.x, pt.y, pt.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
          grad.addColorStop(0.3, `rgba(251, 191, 36, ${alpha * 0.9})`);
          grad.addColorStop(0.65, `rgba(239, 68, 68, ${alpha * 0.75})`);
          grad.addColorStop(0.9, `rgba(30, 41, 59, ${alpha * 0.5})`);
          grad.addColorStop(1, "rgba(15, 23, 42, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (pt.type === "debris") {
          ctx.save();
          ctx.translate(pt.x, pt.y);
          if (pt.rotation !== void 0) {
            ctx.rotate(pt.rotation);
          }
          ctx.globalAlpha = Math.max(0, pt.alpha);
          const w = pt.width || 6;
          const l = pt.length || 14;
          if (pt.debrisType === "wing") {
            ctx.fillStyle = "#0284c7";
            ctx.strokeStyle = "#f97316";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-l / 2, -w / 2);
            ctx.lineTo(l / 2, 0);
            ctx.lineTo(-l / 2, w / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (pt.debrisType === "engine") {
            ctx.fillStyle = "#334155";
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.rect(-l / 3, -w / 2, l * 2 / 3, w);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fillStyle = "#e2e8f0";
            ctx.strokeStyle = "#f59e0b";
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
        } else if (pt.type === "ring") {
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 3 * pt.alpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (pt.type === "radar_wave") {
          ctx.strokeStyle = `rgba(56, 189, 248, ${pt.alpha * 0.6})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (pt.type === "spark") {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, pt.alpha);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x - pt.vx * 0.04, pt.y - pt.vy * 0.04);
          ctx.stroke();
        } else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, pt.alpha);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    renderRadarSweep(ctx, width, height, angle) {
      ctx.save();
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.hypot(width, height) / 2;
      const sweepGrad = ctx.createConicGradient(angle - 0.4, cx, cy);
      sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
      sweepGrad.addColorStop(0.9, "rgba(56, 189, 248, 0.08)");
      sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0.18)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
      ctx.restore();
    }
    renderEmergencyWaveOverlay(ctx, width, height, timeLeft) {
      ctx.save();
      ctx.fillStyle = `rgba(56, 189, 248, ${timeLeft * 0.05})`;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("\u{1F4E1} EMERGENCY RADAR CLEARANCE ACTIVE", width / 2, 40);
      ctx.restore();
    }
  };

  // sky-control---air-traffic-collision-avoidance/src/screen-manager.ts
  var ScreenManager = class {
    constructor(state, onStartLevel, onResize, onEmergencyScan) {
      this.currentScreen = "MAIN_MENU";
      this.adTimerInterval = null;
      this.adTimeRemaining = 5;
      this.state = state;
      this.onStartLevelCb = onStartLevel;
      this.onResizeCb = onResize;
      this.onEmergencyScanCb = onEmergencyScan;
      this.bindEvents();
      this.updateScreen();
    }
    setScreen(screen) {
      this.currentScreen = screen;
      this.updateScreen();
    }
    updateScreen() {
      const elMainMenu = document.getElementById("screen-main-menu");
      const elLevelSelect = document.getElementById("screen-level-select");
      const elHowToPlay = document.getElementById("screen-how-to-play");
      const elGameHud = document.getElementById("game-hud");
      const elFlightControls = document.getElementById("flight-controls-overlay");
      if (elMainMenu) elMainMenu.classList.toggle("hidden", this.currentScreen !== "MAIN_MENU");
      if (elLevelSelect) elLevelSelect.classList.toggle("hidden", this.currentScreen !== "LEVEL_SELECT");
      if (elHowToPlay) elHowToPlay.classList.toggle("hidden", this.currentScreen !== "HOW_TO_PLAY");
      if (elGameHud) elGameHud.classList.toggle("hidden", this.currentScreen !== "PLAYING");
      if (elFlightControls) elFlightControls.classList.toggle("hidden", this.currentScreen !== "PLAYING");
      if (this.currentScreen === "LEVEL_SELECT") {
        this.renderLevelGrid();
      } else if (this.currentScreen === "PLAYING") {
        this.onResizeCb();
      }
    }
    updateHUD() {
      if (this.currentScreen !== "PLAYING") return;
      const level = this.state.getCurrentLevel();
      const scoreEl = document.getElementById("hud-score-counter");
      if (scoreEl) scoreEl.textContent = this.state.score.toString();
      const planesEl = document.getElementById("hud-planes-counter");
      if (planesEl) planesEl.textContent = `${this.state.planesSafelyManaged}/${level.targetSafelyManaged}`;
      const lvlBadge = document.getElementById("hud-level-badge");
      if (lvlBadge) lvlBadge.textContent = `SECTOR ${level.id}`;
      const plane = this.state.planes.find((p) => p.id === this.state.selectedPlaneId);
      const flightBar = document.getElementById("flight-controls-bar");
      if (flightBar) {
        if (plane) {
          flightBar.classList.remove("opacity-0", "pointer-events-none");
          flightBar.classList.add("opacity-100", "pointer-events-auto");
          const callsignEl = document.getElementById("ctl-callsign");
          if (callsignEl) callsignEl.textContent = plane.callsign;
          const altValEl = document.getElementById("ctl-alt-val");
          if (altValEl) altValEl.textContent = `FL${plane.altitude}00`;
          for (const alt of [1, 2, 3]) {
            const btn = document.getElementById(`btn-alt-${alt}`);
            if (btn) {
              if (plane.altitude === alt) {
                btn.className = "px-2.5 py-1 text-xs font-black rounded-lg bg-sky-500 text-white shadow-sm ring-2 ring-sky-300 shrink-0";
              } else {
                btn.className = "px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700 active:scale-95 shrink-0";
              }
            }
          }
        } else {
          flightBar.classList.add("opacity-0", "pointer-events-none");
          flightBar.classList.remove("opacity-100", "pointer-events-auto");
        }
      }
    }
    renderLevelGrid() {
      const gridEl = document.getElementById("level-grid-container");
      if (!gridEl) return;
      gridEl.innerHTML = "";
      const unlocked = this.state.save.unlockedLevel;
      LEVELS.forEach((level) => {
        const isUnlocked = level.id <= unlocked;
        const stars = this.state.save.stars[level.id] || 0;
        const high = this.state.save.highScores[level.id] || 0;
        const card = document.createElement("button");
        card.className = isUnlocked ? "btn-tactile p-3 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-left flex flex-col justify-between transition-all hover:border-sky-500/50 hover:bg-slate-800 cursor-pointer shrink-0" : "p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left flex flex-col justify-between opacity-50 cursor-not-allowed shrink-0";
        const starsHtml = isUnlocked ? `<div class="flex gap-0.5 text-amber-400 text-xs">
            ${"\u2605".repeat(stars)}${"\u2606".repeat(3 - stars)}
           </div>` : `<span class="text-xs text-slate-500">\u{1F512} LOCKED</span>`;
        card.innerHTML = `
        <div class="flex items-start justify-between w-full mb-2">
          <div class="w-8 h-8 rounded-xl ${isUnlocked ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-slate-800 text-slate-500"} flex items-center justify-center font-black text-sm shrink-0">
            ${level.id}
          </div>
          ${starsHtml}
        </div>
        <div class="w-full">
          <h3 class="font-bold text-sm text-slate-100 truncate">${level.title}</h3>
          <p class="text-[11px] text-slate-400 truncate mb-1">${level.subtitle}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">
            <span class="px-1.5 py-0.5 rounded bg-slate-700/50 text-sky-300 font-semibold">${level.difficulty}</span>
            <span>Target: ${level.targetSafelyManaged} \u2708\uFE0F</span>
          </div>
        </div>
      `;
        if (isUnlocked) {
          card.addEventListener("click", () => {
            sound.playClick();
            this.onStartLevelCb(level.id);
            this.setScreen("PLAYING");
          });
        }
        gridEl.appendChild(card);
      });
    }
    showGameOverModal() {
      const modal = document.getElementById("modal-game-over");
      if (!modal) return;
      const scoreVal = document.getElementById("modal-gameover-score");
      if (scoreVal) scoreVal.textContent = this.state.score.toString();
      const planesVal = document.getElementById("modal-gameover-planes");
      if (planesVal) planesVal.textContent = this.state.planesSafelyManaged.toString();
      const incidentDetail = document.getElementById("modal-gameover-incident");
      if (incidentDetail && this.state.lastIncidentDetails) {
        incidentDetail.textContent = `Mid-Air Loss of Separation between ${this.state.lastIncidentDetails.p1} & ${this.state.lastIncidentDetails.p2} at FL100.`;
      }
      modal.classList.remove("hidden");
    }
    hideGameOverModal() {
      const modal = document.getElementById("modal-game-over");
      if (modal) modal.classList.add("hidden");
    }
    showLevelWinModal() {
      const modal = document.getElementById("modal-level-win");
      if (!modal) return;
      const timeInSeconds = Math.floor((Date.now() - this.state.levelStartTime) / 1e3);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "win", time: timeInSeconds }, "*");
      }
      const scoreVal = document.getElementById("modal-win-score");
      if (scoreVal) scoreVal.textContent = this.state.score.toString();
      const timeVal = document.getElementById("modal-win-time");
      if (timeVal) timeVal.textContent = `${timeInSeconds}s`;
      modal.classList.remove("hidden");
    }
    hideLevelWinModal() {
      const modal = document.getElementById("modal-level-win");
      if (modal) modal.classList.add("hidden");
    }
    showPauseModal() {
      this.state.isPaused = true;
      const modal = document.getElementById("modal-pause");
      if (modal) modal.classList.remove("hidden");
    }
    hidePauseModal() {
      this.state.isPaused = false;
      const modal = document.getElementById("modal-pause");
      if (modal) modal.classList.add("hidden");
    }
    // Rewarded Ad Modal (Emergency Radar Clearance Hint)
    showRewardedAdModal() {
      this.state.isPaused = true;
      const modal = document.getElementById("modal-rewarded-ad");
      if (!modal) return;
      modal.classList.remove("hidden");
      this.adTimeRemaining = 5;
      const countEl = document.getElementById("ad-countdown-text");
      const barEl = document.getElementById("ad-progress-bar");
      const claimBtn = document.getElementById("btn-claim-reward");
      if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.className = "w-full py-3 rounded-xl font-black text-sm bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed transition-all";
        claimBtn.textContent = "Scanning Airspace... (5s)";
      }
      if (this.adTimerInterval) clearInterval(this.adTimerInterval);
      this.adTimerInterval = window.setInterval(() => {
        this.adTimeRemaining--;
        if (countEl) countEl.textContent = `${this.adTimeRemaining}s`;
        if (barEl) barEl.style.width = `${(5 - this.adTimeRemaining) / 5 * 100}%`;
        if (this.adTimeRemaining <= 0) {
          if (this.adTimerInterval) clearInterval(this.adTimerInterval);
          if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.className = "btn-tactile w-full py-3 rounded-xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg cursor-pointer transition-all active:scale-95";
            claimBtn.textContent = "\u{1F680} Deploy Emergency Clearance!";
            sound.playRadarPing();
          }
        }
      }, 1e3);
    }
    hideRewardedAdModal() {
      if (this.adTimerInterval) clearInterval(this.adTimerInterval);
      const modal = document.getElementById("modal-rewarded-ad");
      if (modal) modal.classList.add("hidden");
      this.state.isPaused = false;
    }
    bindEvents() {
      const soundBtns = [document.getElementById("btn-sound-toggle"), document.getElementById("btn-sound-menu")];
      soundBtns.forEach((btn) => {
        btn?.addEventListener("click", () => {
          const isEnabled = sound.toggle();
          this.state.save.soundEnabled = isEnabled;
          this.state.writeSave();
          this.updateSoundIcons(isEnabled);
        });
      });
      document.getElementById("btn-menu-play")?.addEventListener("click", () => {
        sound.playClick();
        this.onStartLevelCb(this.state.save.unlockedLevel || 1);
        this.setScreen("PLAYING");
      });
      document.getElementById("btn-menu-levels")?.addEventListener("click", () => {
        sound.playClick();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-menu-how")?.addEventListener("click", () => {
        sound.playClick();
        this.setScreen("HOW_TO_PLAY");
      });
      document.getElementById("btn-levels-back")?.addEventListener("click", () => {
        sound.playClick();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-how-back")?.addEventListener("click", () => {
        sound.playClick();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-pause-menu")?.addEventListener("click", () => {
        sound.playClick();
        this.showPauseModal();
      });
      document.getElementById("btn-hud-hint")?.addEventListener("click", () => {
        sound.playClick();
        this.showRewardedAdModal();
      });
      document.getElementById("btn-pause-resume")?.addEventListener("click", () => {
        sound.playClick();
        this.hidePauseModal();
      });
      document.getElementById("btn-pause-restart")?.addEventListener("click", () => {
        sound.playClick();
        this.hidePauseModal();
        this.onStartLevelCb(this.state.currentLevelId);
      });
      document.getElementById("btn-pause-menu-quit")?.addEventListener("click", () => {
        sound.playClick();
        this.hidePauseModal();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-gameover-retry")?.addEventListener("click", () => {
        sound.playClick();
        this.hideGameOverModal();
        this.onStartLevelCb(this.state.currentLevelId);
      });
      document.getElementById("btn-gameover-menu")?.addEventListener("click", () => {
        sound.playClick();
        this.hideGameOverModal();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-win-next")?.addEventListener("click", () => {
        sound.playClick();
        this.hideLevelWinModal();
        const nextId = Math.min(12, this.state.currentLevelId + 1);
        this.onStartLevelCb(nextId);
      });
      document.getElementById("btn-win-menu")?.addEventListener("click", () => {
        sound.playClick();
        this.hideLevelWinModal();
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-claim-reward")?.addEventListener("click", () => {
        sound.playClick();
        this.hideRewardedAdModal();
        this.onEmergencyScanCb();
      });
      document.getElementById("btn-skip-reward")?.addEventListener("click", () => {
        sound.playClick();
        this.hideRewardedAdModal();
      });
      for (const alt of [1, 2, 3]) {
        document.getElementById(`btn-alt-${alt}`)?.addEventListener("click", () => {
          if (this.state.selectedPlaneId) {
            this.state.setPlaneAltitude(this.state.selectedPlaneId, alt);
            this.updateHUD();
          }
        });
      }
      document.getElementById("btn-turn-left")?.addEventListener("click", () => {
        if (this.state.selectedPlaneId) {
          this.state.turnPlaneRelative(this.state.selectedPlaneId, -Math.PI / 4);
        }
      });
      document.getElementById("btn-turn-right")?.addEventListener("click", () => {
        if (this.state.selectedPlaneId) {
          this.state.turnPlaneRelative(this.state.selectedPlaneId, Math.PI / 4);
        }
      });
      document.getElementById("btn-land-direct")?.addEventListener("click", () => {
        if (this.state.selectedPlaneId) {
          const level = this.state.getCurrentLevel();
          if (level.runways.length > 0) {
            const rw = level.runways[0];
            const parentRect = document.getElementById("canvas-container")?.getBoundingClientRect();
            const w = parentRect?.width || 800;
            const h = parentRect?.height || 600;
            this.state.directPlaneToRunway(this.state.selectedPlaneId, rw.id, w, h);
          }
        }
      });
    }
    updateSoundIcons(enabled) {
      const icons = document.querySelectorAll(".sound-icon-svg");
      icons.forEach((icon) => {
        if (enabled) {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
        } else {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`;
        }
      });
    }
  };

  // sky-control---air-traffic-collision-avoidance/src/main.ts
  var SkyControlApp = class {
    constructor() {
      this.lastTime = 0;
      this.isPointerDown = false;
      this.currentDrawingPlaneId = null;
      this.minWaypointDist = 14;
      this.canvas = document.getElementById("game-canvas");
      this.displayManager = new DisplayManager(this.canvas);
      this.state = new GameState();
      this.renderer = new GameRenderer(this.displayManager.getContext());
      this.screenManager = new ScreenManager(
        this.state,
        (levelId) => this.handleStartLevel(levelId),
        () => this.displayManager.resize(),
        () => this.handleEmergencyScan()
      );
      this.displayManager.onResize((w, h) => {
      });
      this.bindPointerEvents();
      this.startLoop();
    }
    handleStartLevel(levelId) {
      this.state.startLevel(levelId);
      this.screenManager.updateHUD();
      this.displayManager.resize();
    }
    handleEmergencyScan() {
      this.state.activateEmergencyClearance(this.displayManager.width, this.displayManager.height);
    }
    bindPointerEvents() {
      const canvas = this.canvas;
      const onPointerDown = (clientX, clientY) => {
        if (this.screenManager.currentScreen !== "PLAYING") return;
        if (this.state.isGameOver || this.state.isPaused) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        this.isPointerDown = true;
        let clickedPlane = null;
        for (const plane of this.state.planes) {
          const dist = Math.hypot(plane.x - coords.x, plane.y - coords.y);
          if (dist < 32) {
            clickedPlane = plane;
            break;
          }
        }
        if (clickedPlane) {
          this.state.selectPlane(clickedPlane.id);
          this.currentDrawingPlaneId = clickedPlane.id;
          this.state.isDrawingPath = true;
          this.state.activeDrawingPath = [{ x: clickedPlane.x, y: clickedPlane.y }];
          this.screenManager.updateHUD();
          sound.playRadioBlip();
        } else {
          if (this.state.selectedPlaneId) {
            const level = this.state.getCurrentLevel();
            let clickedRunway = null;
            for (const rw of level.runways) {
              const rx = rw.x * this.displayManager.width;
              const ry = rw.y * this.displayManager.height;
              if (Math.hypot(rx - coords.x, ry - coords.y) < 45) {
                clickedRunway = rw;
                break;
              }
            }
            if (clickedRunway) {
              this.state.directPlaneToRunway(
                this.state.selectedPlaneId,
                clickedRunway.id,
                this.displayManager.width,
                this.displayManager.height
              );
            } else {
              this.state.selectPlane(null);
              this.screenManager.updateHUD();
            }
          }
        }
      };
      const onPointerMove = (clientX, clientY) => {
        if (!this.isPointerDown || !this.state.isDrawingPath) return;
        const coords = this.displayManager.getGameCoordinates(clientX, clientY);
        const path = this.state.activeDrawingPath;
        if (path.length > 0) {
          const lastWp = path[path.length - 1];
          const dist = Math.hypot(coords.x - lastWp.x, coords.y - lastWp.y);
          if (dist >= this.minWaypointDist) {
            path.push({ x: coords.x, y: coords.y });
            sound.playWaypointTick();
          }
        }
      };
      const onPointerUp = () => {
        if (this.isPointerDown && this.state.isDrawingPath && this.currentDrawingPlaneId) {
          const plane = this.state.planes.find((p) => p.id === this.currentDrawingPlaneId);
          if (plane && this.state.activeDrawingPath.length > 1) {
            const cleanPath = [...this.state.activeDrawingPath];
            cleanPath.shift();
            plane.path = cleanPath;
            sound.playRadioBlip();
          }
        }
        this.isPointerDown = false;
        this.state.isDrawingPath = false;
        this.state.activeDrawingPath = [];
        this.currentDrawingPlaneId = null;
      };
      canvas.addEventListener("mousedown", (e) => {
        onPointerDown(e.clientX, e.clientY);
      });
      window.addEventListener("mousemove", (e) => {
        onPointerMove(e.clientX, e.clientY);
      });
      window.addEventListener("mouseup", () => {
        onPointerUp();
      });
      canvas.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length > 0) {
            onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
      window.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches.length > 0) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
      window.addEventListener("touchend", () => {
        onPointerUp();
      });
      window.addEventListener("touchcancel", () => {
        onPointerUp();
      });
    }
    startLoop() {
      const loop = (timestamp) => {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1e3, 0.1);
        this.lastTime = timestamp;
        if (this.screenManager.currentScreen === "PLAYING") {
          const result = this.state.update(
            dt,
            this.displayManager.width,
            this.displayManager.height
          );
          if (result.showGameOverModal) {
            this.screenManager.showGameOverModal();
          } else if (result.hasWon) {
            setTimeout(() => {
              this.screenManager.showLevelWinModal();
            }, 800);
          }
          this.screenManager.updateHUD();
          this.renderer.render(
            this.state,
            this.displayManager.width,
            this.displayManager.height,
            dt
          );
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new SkyControlApp();
  });
})();
