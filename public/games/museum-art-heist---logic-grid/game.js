(() => {
  // museum-art-heist---logic-grid/src/game-state.ts
  var LEVELS = [
    {
      id: 1,
      title: "Level 1: Mystery of the North Gallery",
      subtitle: "3 Detectives \u2022 3 Artworks \u2022 3 Clues",
      story: "In the dead of night, the alarm at the North Gallery sounded. Three priceless masterpieces disappeared, and three top criminal investigators took the case. Each found a crucial forensic clue left behind by the masked thief.",
      detectives: [
        { id: "sarah", name: "Det. Sarah Vance", icon: "\u{1F50D}", desc: "Chief Homicide & Major Theft Inspector", color: "#38bdf8" },
        { id: "charles", name: "Insp. Charles Roux", icon: "\u{1F575}\uFE0F\u200D\u2642\uFE0F", desc: "Paris Senior Forensic Criminologist", color: "#fb923c" },
        { id: "elena", name: "Agent Elena Vega", icon: "\u{1F576}\uFE0F", desc: "Interpol Anti-Trafficking Specialist", color: "#a855f7" }
      ],
      paintings: [
        { id: "starry", name: "Starry Night Stolen", icon: "\u{1F30C}", desc: "Oil on canvas, 1889", color: "#60a5fa", artist: "Vincent V." },
        { id: "mona", name: "Golden Mona Lisa", icon: "\u{1F3A8}", desc: "Sublime Renaissance masterpiece", color: "#facc15", artist: "Leonardo D." },
        { id: "sunflower", name: "Twilight Sunflower", icon: "\u{1F33B}", desc: "Rare Impressionist painting", color: "#f97316", artist: "Claude M." }
      ],
      clues: [
        { id: "glove", name: "Velvet Glove Fiber", icon: "\u{1F9E4}", desc: "Cobalt blue microfiber on the frame", color: "#818cf8" },
        { id: "footprint", name: "Muddy Boot Print #42", icon: "\u{1F45E}", desc: "Imported leather tread on hardwood", color: "#a3e635" },
        { id: "card", name: "Royal Joker Card", icon: "\u{1F0CF}", desc: "Gold playing card lodged in glass", color: "#f43f5e" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "starry", clueId: "glove" },
        { detectiveId: "charles", paintingId: "sunflower", clueId: "footprint" },
        { detectiveId: "elena", paintingId: "mona", clueId: "card" }
      ],
      cluesList: [
        "1. Detective Sarah Vance did NOT find the Muddy Boot Print nor the Royal Joker Card.",
        "2. The case involving the painting 'Starry Night Stolen' was assigned directly to Sarah Vance.",
        "3. The theft of the 'Golden Mona Lisa' left behind the Royal Joker Card as forensic evidence.",
        "4. Inspector Charles Roux is NOT in charge of the 'Golden Mona Lisa' case."
      ],
      stepHints: [
        { target: "AB", row: 0, col: 0, val: 2, explanation: "Clue 2 states: 'Starry Night Stolen' was assigned to Sarah Vance." },
        { target: "BC", row: 1, col: 2, val: 2, explanation: "Clue 3 states: 'Golden Mona Lisa' left behind the Royal Joker Card." },
        { target: "AC", row: 0, col: 0, val: 2, explanation: "By elimination in Clue 1, Sarah Vance must have found the Velvet Glove Fiber!" },
        { target: "AB", row: 1, col: 2, val: 2, explanation: "Charles Roux is not assigned to Mona Lisa and Sarah has Starry Night, so Charles has the Sunflower." }
      ]
    },
    {
      id: 2,
      title: "Level 2: The Baroque Relics Hall",
      subtitle: "4 Detectives \u2022 4 Artworks \u2022 4 Clues",
      story: "Four paintings vanished simultaneously from the East and West wings. The museum summoned four forensic experts to cross-examine gathered evidence.",
      detectives: [
        { id: "sarah", name: "Det. Sarah Vance", icon: "\u{1F50D}", desc: "Gold Magnifying Glass Awardee", color: "#38bdf8" },
        { id: "charles", name: "Insp. Charles Roux", icon: "\u{1F575}\uFE0F\u200D\u2642\uFE0F", desc: "Forensic Team Lead", color: "#fb923c" },
        { id: "elena", name: "Agent Elena Vega", icon: "\u{1F576}\uFE0F", desc: "Interpol Task Force", color: "#a855f7" },
        { id: "kenji", name: "Specialist Kenji Sato", icon: "\u{1F52C}", desc: "Ballistics & Security Expert", color: "#4ade80" }
      ],
      paintings: [
        { id: "portrait", name: "Imperial Portrait", icon: "\u{1F451}", desc: "Baroque Royal Portrait", color: "#fbbf24", artist: "Diego V." },
        { id: "lady", name: "Lady with an Ermine", icon: "\u{1F994}", desc: "High Classical Portrait", color: "#f472b6", artist: "Leonardo D." },
        { id: "scream", name: "Midnight Scream", icon: "\u{1F631}", desc: "Pure Expressionist Masterpiece", color: "#c084fc", artist: "Edvard M." },
        { id: "boat", name: "Moonlit Sailboat", icon: "\u26F5", desc: "Night Seascape", color: "#38bdf8", artist: "Rembrandt" }
      ],
      clues: [
        { id: "glove", name: "Velvet Glove Fiber", icon: "\u{1F9E4}", desc: "Rare textile threads", color: "#818cf8" },
        { id: "laser", name: "Severed Laser Wire", icon: "\u26A1", desc: "Bypassed alarm sensor", color: "#facc15" },
        { id: "perfume", name: "Rare French Perfume", icon: "\u{1F9EA}", desc: "Floral scent residue in room", color: "#fb7185" },
        { id: "key", name: "Lost Master Key", icon: "\u{1F5DD}\uFE0F", desc: "Polished brass duplicate key", color: "#34d399" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "lady", clueId: "glove" },
        { detectiveId: "charles", paintingId: "boat", clueId: "perfume" },
        { detectiveId: "elena", paintingId: "portrait", clueId: "laser" },
        { detectiveId: "kenji", paintingId: "scream", clueId: "key" }
      ],
      cluesList: [
        "1. Agent Elena Vega found the Severed Laser Wire in her assigned case.",
        "2. The theft of 'Midnight Scream' features the Lost Master Key as physical evidence.",
        "3. Kenji Sato is NOT investigating 'Moonlit Sailboat' nor 'Imperial Portrait', and his clue was the Lost Master Key.",
        "4. 'Lady with an Ermine' was assigned to Sarah Vance, who found neither Laser Wire nor Perfume.",
        "5. Inspector Charles Roux located the vial of Rare French Perfume, but is not investigating 'Imperial Portrait'.",
        "6. In the theft of 'Imperial Portrait', neither Keys nor Gloves were found."
      ],
      stepHints: [
        { target: "AC", row: 2, col: 1, val: 2, explanation: "Clue 1: Elena Vega found the Severed Laser Wire." },
        { target: "BC", row: 2, col: 3, val: 2, explanation: "Clue 2: 'Midnight Scream' links to the Lost Master Key." },
        { target: "AC", row: 3, col: 3, val: 2, explanation: "Clue 3: Kenji Sato found the Lost Master Key." },
        { target: "AB", row: 0, col: 1, val: 2, explanation: "Clue 4: Sarah Vance investigates 'Lady with an Ermine'." }
      ]
    },
    {
      id: 3,
      title: "Level 3: Renaissance Masters Gallery",
      subtitle: "4 Detectives \u2022 4 Artworks \u2022 4 Clues",
      story: "A syndicate breached the climate-controlled vault. Subtle high-tech traces and chemical residues were detected on scene.",
      detectives: [
        { id: "sarah", name: "Det. Sarah Vance", icon: "\u{1F50D}", desc: "Chief Inspector", color: "#38bdf8" },
        { id: "charles", name: "Insp. Charles Roux", icon: "\u{1F575}\uFE0F\u200D\u2642\uFE0F", desc: "Criminologist", color: "#fb923c" },
        { id: "elena", name: "Agent Elena Vega", icon: "\u{1F576}\uFE0F", desc: "Interpol Liaison", color: "#a855f7" },
        { id: "kenji", name: "Specialist Kenji Sato", icon: "\u{1F52C}", desc: "Forensic Scientist", color: "#4ade80" }
      ],
      paintings: [
        { id: "venus", name: "The Birth of Venus", icon: "\u{1F41A}", desc: "Breathtaking Fresco", color: "#fda4af", artist: "Botticelli" },
        { id: "creation", name: "The Hidden Creation", icon: "\u2728", desc: "Sacred Ceiling Fragment", color: "#fef08a", artist: "Michelangelo" },
        { id: "anatomy", name: "Forbidden Anatomy", icon: "\u{1F4DC}", desc: "Anatomical Sketch", color: "#93c5fd", artist: "Da Vinci" },
        { id: "garden", name: "Garden of Earthly Delights", icon: "\u{1F33A}", desc: "Mysterious Triptych", color: "#86efac", artist: "Bosch" }
      ],
      clues: [
        { id: "wax", name: "Noble Sealing Wax", icon: "\u{1F56F}\uFE0F", desc: "Crimson wax seal residue", color: "#f43f5e" },
        { id: "lens", name: "Shattered Optical Lens", icon: "\u{1F50E}", desc: "50mm anti-reflective glass", color: "#38bdf8" },
        { id: "chip", name: "Disabled Microchip", icon: "\u{1F4BE}", desc: "Burned RFID tracking chip", color: "#fbbf24" },
        { id: "marble", name: "Ancient Marble Dust", icon: "\u{1F3DB}\uFE0F", desc: "Carrara mineral residue", color: "#e2e8f0" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "creation", clueId: "chip" },
        { detectiveId: "charles", paintingId: "venus", clueId: "wax" },
        { detectiveId: "elena", paintingId: "garden", clueId: "lens" },
        { detectiveId: "kenji", paintingId: "anatomy", clueId: "marble" }
      ],
      cluesList: [
        "1. 'The Birth of Venus' was stolen leaving behind traces of Noble Sealing Wax.",
        "2. The detective investigating 'The Hidden Creation' found the Disabled Microchip.",
        "3. Sarah Vance is the lead detective on 'The Hidden Creation'.",
        "4. Elena Vega found the Shattered Optical Lens, and the painting she investigates is NOT 'Forbidden Anatomy'.",
        "5. Kenji Sato uncovered Ancient Marble Dust at his crime scene.",
        "6. Inspector Charles Roux was NOT assigned to the 'Garden of Earthly Delights' case."
      ],
      stepHints: [
        { target: "BC", row: 0, col: 0, val: 2, explanation: "Clue 1: 'Birth of Venus' has Noble Sealing Wax." },
        { target: "BC", row: 1, col: 2, val: 2, explanation: "Clue 2: 'The Hidden Creation' links to Disabled Microchip." },
        { target: "AB", row: 0, col: 1, val: 2, explanation: "Clue 3: Sarah Vance investigates 'The Hidden Creation'." },
        { target: "AC", row: 2, col: 1, val: 2, explanation: "Clue 4: Elena Vega found the Shattered Optical Lens." }
      ]
    },
    {
      id: 4,
      title: "Level 4: The Imperial Vault",
      subtitle: "5 Detectives \u2022 5 Artworks \u2022 5 Clues",
      story: "A global criminal syndicate replaced five historical masterpieces with flawless counterfeit replicas.",
      detectives: [
        { id: "sarah", name: "Det. Sarah Vance", icon: "\u{1F50D}", desc: "Chief Inspector", color: "#38bdf8" },
        { id: "charles", name: "Insp. Charles Roux", icon: "\u{1F575}\uFE0F\u200D\u2642\uFE0F", desc: "Lead Forensic Lead", color: "#fb923c" },
        { id: "elena", name: "Agent Elena Vega", icon: "\u{1F576}\uFE0F", desc: "Interpol Task Force", color: "#a855f7" },
        { id: "kenji", name: "Specialist Kenji Sato", icon: "\u{1F52C}", desc: "Forensics", color: "#4ade80" },
        { id: "beatrice", name: "Dr. Beatrice Hall", icon: "\u{1F4BC}", desc: "Forgery Specialist", color: "#f43f5e" }
      ],
      paintings: [
        { id: "pearl", name: "Girl with a Pearl Earring", icon: "\u{1F48E}", desc: "Dutch Master Portrait", color: "#38bdf8", artist: "Vermeer" },
        { id: "kiss", name: "The Golden Kiss", icon: "\u{1F48B}", desc: "Gold Leaf Symbolism", color: "#facc15", artist: "Klimt" },
        { id: "wave", name: "The Great Blue Wave", icon: "\u{1F30A}", desc: "Japanese Woodblock Print", color: "#60a5fa", artist: "Hokusai" },
        { id: "guernica", name: "Guernica of Resistance", icon: "\u{1F54A}\uFE0F", desc: "Cubist Mural", color: "#94a3b8", artist: "Picasso" },
        { id: "wanderer", name: "Wanderer Above the Mist", icon: "\u{1F3D4}\uFE0F", desc: "German Romanticism", color: "#cbd5e1", artist: "Friedrich" }
      ],
      clues: [
        { id: "hair", name: "Platinum Hair Strand", icon: "\u{1F487}", desc: "Pure synthetic DNA", color: "#f1f5f9" },
        { id: "watch", name: "Swiss Watch Hand", icon: "\u231A", desc: "Precision chronograph gear", color: "#fbbf24" },
        { id: "origami", name: "Dark Swan Origami", icon: "\u{1F9A2}", desc: "Folded silk paper", color: "#e879f9" },
        { id: "poison", name: "Rare Sedative Residue", icon: "\u{1F9EA}", desc: "Guards' sleeping agent toxin", color: "#4ade80" },
        { id: "coin", name: "Counterfeit Roman Coin", icon: "\u{1FA99}", desc: "Lead-struck denarius", color: "#f97316" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "pearl", clueId: "hair" },
        { detectiveId: "charles", paintingId: "kiss", clueId: "watch" },
        { detectiveId: "elena", paintingId: "guernica", clueId: "poison" },
        { detectiveId: "kenji", paintingId: "wave", clueId: "origami" },
        { detectiveId: "beatrice", paintingId: "wanderer", clueId: "coin" }
      ],
      cluesList: [
        "1. Sarah Vance was assigned to the 'Girl with a Pearl Earring' theft.",
        "2. The case involving the Platinum Hair Strand was taken by Sarah Vance.",
        "3. Kenji Sato, specialist in Asian art cases, investigates 'The Great Blue Wave' and retrieved the Dark Swan Origami.",
        "4. The theft of 'The Golden Kiss' left a Swiss Watch Hand on the marble floor.",
        "5. Inspector Charles Roux is investigating the theft of 'The Golden Kiss'.",
        "6. Dr. Beatrice Hall found a Counterfeit Roman Coin at her crime scene.",
        "7. Agent Elena Vega is investigating 'Guernica of Resistance' and identified the Rare Sedative Residue.",
        "8. Beatrice Hall is NOT investigating 'Guernica' nor 'The Great Blue Wave'."
      ],
      stepHints: [
        { target: "AB", row: 0, col: 0, val: 2, explanation: "Clue 1: Sarah Vance investigates Girl with a Pearl Earring." },
        { target: "AC", row: 0, col: 0, val: 2, explanation: "Clue 2: Sarah Vance retrieved the Platinum Hair Strand." },
        { target: "AB", row: 3, col: 2, val: 2, explanation: "Clue 3: Kenji Sato investigates 'The Great Blue Wave'." },
        { target: "AC", row: 3, col: 2, val: 2, explanation: "Clue 3: Kenji Sato found the Dark Swan Origami." }
      ]
    },
    {
      id: 5,
      title: "Level 5: Grand Heist of the Century",
      subtitle: "5 Detectives \u2022 5 Artworks \u2022 5 Clues \u2022 Master Detective",
      story: "The legendary thief 'Louvre Phantom' orchestrated the biggest art heist in history. Only a master mind cross-referencing all clues can solve this puzzle.",
      detectives: [
        { id: "sarah", name: "Det. Sarah Vance", icon: "\u{1F50D}", desc: "Chief Inspector", color: "#38bdf8" },
        { id: "charles", name: "Insp. Charles Roux", icon: "\u{1F575}\uFE0F\u200D\u2642\uFE0F", desc: "Criminologist", color: "#fb923c" },
        { id: "elena", name: "Agent Elena Vega", icon: "\u{1F576}\uFE0F", desc: "Interpol Lead", color: "#a855f7" },
        { id: "kenji", name: "Specialist Kenji Sato", icon: "\u{1F52C}", desc: "Ballistics Expert", color: "#4ade80" },
        { id: "beatrice", name: "Dr. Beatrice Hall", icon: "\u{1F4BC}", desc: "Forgery Specialist", color: "#f43f5e" }
      ],
      paintings: [
        { id: "garden", name: "Garden of Earthly Delights", icon: "\u{1F33A}", desc: "Secret Triptych", color: "#4ade80", artist: "Bosch" },
        { id: "nightwatch", name: "The Night Watch", icon: "\u{1F6E1}\uFE0F", desc: "Amsterdam Civic Guard", color: "#fb923c", artist: "Rembrandt" },
        { id: "lastsupper", name: "The Last Supper Restored", icon: "\u{1F377}", desc: "Secular Mural", color: "#facc15", artist: "Da Vinci" },
        { id: "medusa", name: "Raft of the Medusa", icon: "\u{1F30A}", desc: "Romantic Drama", color: "#60a5fa", artist: "G\xE9ricault" },
        { id: "liberty", name: "Liberty Leading the People", icon: "\u{1F6A9}", desc: "Revolutionary Icon", color: "#f43f5e", artist: "Delacroix" }
      ],
      clues: [
        { id: "feather", name: "Albino Peacock Feather", icon: "\u{1F99A}", desc: "Rare artifact left on scene", color: "#e2e8f0" },
        { id: "diamond", name: "Laser Diamond Cutter", icon: "\u{1F48E}", desc: "Sapphire-tipped glass cutter", color: "#38bdf8" },
        { id: "keycard", name: "Cloned Hacker Keycard", icon: "\u{1F4B3}", desc: "Forged Level 5 security card", color: "#a855f7" },
        { id: "cologne", name: "Imperial Royal Cologne", icon: "\u{1F9F4}", desc: "Pure essence fragrance scent", color: "#fbbf24" },
        { id: "fuse", name: "Blown High-Voltage Fuse", icon: "\u{1F50C}", desc: "Triggered power grid short-circuit", color: "#ef4444" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "nightwatch", clueId: "diamond" },
        { detectiveId: "charles", paintingId: "liberty", clueId: "feather" },
        { detectiveId: "elena", paintingId: "lastsupper", clueId: "keycard" },
        { detectiveId: "kenji", paintingId: "medusa", clueId: "fuse" },
        { detectiveId: "beatrice", paintingId: "garden", clueId: "cologne" }
      ],
      cluesList: [
        "1. 'The Night Watch' vault glass was cut using the Laser Diamond Cutter.",
        "2. Sarah Vance is the lead detective on the case involving the Laser Diamond Cutter.",
        "3. Inspector Charles Roux is investigating the theft of 'Liberty Leading the People', where he retrieved an Albino Peacock Feather.",
        "4. The heist of 'The Last Supper Restored' involved breaking in with the Cloned Hacker Keycard.",
        "5. Agent Elena Vega took over the case of 'The Last Supper Restored'.",
        "6. Kenji Sato is investigating 'Raft of the Medusa' and found the Blown High-Voltage Fuse.",
        "7. Dr. Beatrice Hall is NOT investigating 'The Night Watch' nor 'Liberty Leading the People'.",
        "8. During the theft of 'Garden of Earthly Delights', the scent of Imperial Royal Cologne was detected."
      ],
      stepHints: [
        { target: "BC", row: 1, col: 1, val: 2, explanation: "Clue 1: 'The Night Watch' links to the Laser Diamond Cutter." },
        { target: "AC", row: 0, col: 1, val: 2, explanation: "Clue 2: Sarah Vance found the Laser Diamond Cutter." },
        { target: "AB", row: 1, col: 4, val: 2, explanation: "Clue 3: Charles Roux investigates 'Liberty'." },
        { target: "AC", row: 1, col: 0, val: 2, explanation: "Clue 3: Charles Roux found the Albino Peacock Feather." }
      ]
    }
  ];
  var GameEngine = class {
    constructor() {
      this.currentLevelIndex = 0;
      this.history = [];
      this.cluesRead = /* @__PURE__ */ new Set();
      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.timerInterval = null;
      this.movesCount = 0;
      this.isCompleted = false;
      this.unlockedLevel = 1;
      this.hintsUsed = 0;
      this.activeTab = "grid";
      this.gridDisplayMode = "modular";
      this.loadProgress();
      this.gridState = this.createEmptyGrid(this.currentLevel.detectives.length);
    }
    toggleGridDisplayMode() {
      this.gridDisplayMode = this.gridDisplayMode === "modular" ? "unified" : "modular";
    }
    get currentLevel() {
      return LEVELS[this.currentLevelIndex] || LEVELS[0];
    }
    loadProgress() {
      try {
        const savedUnlocked = localStorage.getItem("museum_heist_unlocked");
        if (savedUnlocked) {
          this.unlockedLevel = Math.max(1, parseInt(savedUnlocked, 10));
        }
      } catch {
        this.unlockedLevel = 1;
      }
    }
    saveProgress() {
      try {
        localStorage.setItem("museum_heist_unlocked", String(this.unlockedLevel));
      } catch (e) {
        console.warn("Storage save error", e);
      }
    }
    createEmptyGrid(n) {
      const makeMatrix = () => Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
      return {
        AB: makeMatrix(),
        AC: makeMatrix(),
        BC: makeMatrix()
      };
    }
    startLevel(levelIndex) {
      this.currentLevelIndex = Math.max(0, Math.min(levelIndex, LEVELS.length - 1));
      const n = this.currentLevel.detectives.length;
      this.gridState = this.createEmptyGrid(n);
      this.history = [];
      this.cluesRead = /* @__PURE__ */ new Set();
      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.movesCount = 0;
      this.isCompleted = false;
      this.hintsUsed = 0;
      this.activeTab = "grid";
    }
    toggleCell(target, row, col, manualVal) {
      if (this.isCompleted) return;
      this.saveStateToHistory();
      const n = this.currentLevel.detectives.length;
      const current = this.gridState[target][row][col];
      let nextVal;
      if (manualVal !== void 0) {
        nextVal = manualVal;
      } else {
        if (current === 0) nextVal = 1;
        else if (current === 1) nextVal = 2;
        else nextVal = 0;
      }
      this.gridState[target][row][col] = nextVal;
      this.movesCount++;
      if (nextVal === 2) {
        for (let c = 0; c < n; c++) {
          if (c !== col && this.gridState[target][row][c] !== 1) {
            this.gridState[target][row][c] = 1;
          }
        }
        for (let r = 0; r < n; r++) {
          if (r !== row && this.gridState[target][r][col] !== 1) {
            this.gridState[target][r][col] = 1;
          }
        }
        this.propagateDeductions();
      }
      this.checkVictoryCondition();
    }
    saveStateToHistory() {
      const cloneMatrix = (m) => m.map((row) => [...row]);
      this.history.push({
        AB: cloneMatrix(this.gridState.AB),
        AC: cloneMatrix(this.gridState.AC),
        BC: cloneMatrix(this.gridState.BC)
      });
      if (this.history.length > 50) this.history.shift();
    }
    undo() {
      if (this.history.length === 0 || this.isCompleted) return false;
      const previous = this.history.pop();
      this.gridState = previous;
      return true;
    }
    resetGrid() {
      this.saveStateToHistory();
      const n = this.currentLevel.detectives.length;
      this.gridState = this.createEmptyGrid(n);
    }
    toggleClueRead(index) {
      if (this.cluesRead.has(index)) {
        this.cluesRead.delete(index);
      } else {
        this.cluesRead.add(index);
      }
    }
    propagateDeductions() {
      const n = this.currentLevel.detectives.length;
      let changed = true;
      let loops = 0;
      while (changed && loops < 5) {
        changed = false;
        loops++;
        for (let d = 0; d < n; d++) {
          for (let p = 0; p < n; p++) {
            if (this.gridState.AB[d][p] === 2) {
              for (let c = 0; c < n; c++) {
                if (this.gridState.AC[d][c] === 2 && this.gridState.BC[p][c] !== 2) {
                  this.gridState.BC[p][c] = 2;
                  changed = true;
                }
                if (this.gridState.AC[d][c] === 1 && this.gridState.BC[p][c] === 0) {
                  this.gridState.BC[p][c] = 1;
                  changed = true;
                }
              }
            }
          }
        }
        for (let p = 0; p < n; p++) {
          for (let c = 0; c < n; c++) {
            if (this.gridState.BC[p][c] === 2) {
              for (let d = 0; d < n; d++) {
                if (this.gridState.AB[d][p] === 2 && this.gridState.AC[d][c] !== 2) {
                  this.gridState.AC[d][c] = 2;
                  changed = true;
                }
                if (this.gridState.AC[d][c] === 2 && this.gridState.AB[d][p] !== 2) {
                  this.gridState.AB[d][p] = 2;
                  changed = true;
                }
              }
            }
          }
        }
      }
    }
    applyStepHint() {
      const hints = this.currentLevel.stepHints;
      for (const h of hints) {
        if (this.gridState[h.target][h.row][h.col] !== h.val) {
          this.toggleCell(h.target, h.row, h.col, h.val);
          this.hintsUsed++;
          return { message: h.explanation, applied: true };
        }
      }
      const lvl = this.currentLevel;
      for (const sol of lvl.solution) {
        const dIdx = lvl.detectives.findIndex((d) => d.id === sol.detectiveId);
        const pIdx = lvl.paintings.findIndex((p) => p.id === sol.paintingId);
        const cIdx = lvl.clues.findIndex((c) => c.id === sol.clueId);
        if (this.gridState.AB[dIdx][pIdx] !== 2) {
          this.toggleCell("AB", dIdx, pIdx, 2);
          this.hintsUsed++;
          return { message: `Deduction: ${lvl.detectives[dIdx].name} investigates '${lvl.paintings[pIdx].name}'!`, applied: true };
        }
        if (this.gridState.AC[dIdx][cIdx] !== 2) {
          this.toggleCell("AC", dIdx, cIdx, 2);
          this.hintsUsed++;
          return { message: `Deduction: ${lvl.detectives[dIdx].name} found '${lvl.clues[cIdx].name}'!`, applied: true };
        }
        if (this.gridState.BC[pIdx][cIdx] !== 2) {
          this.toggleCell("BC", pIdx, cIdx, 2);
          this.hintsUsed++;
          return { message: `Deduction: '${lvl.paintings[pIdx].name}' links to '${lvl.clues[cIdx].name}'!`, applied: true };
        }
      }
      return { message: "You have already completed all essential deductions! Check the solution.", applied: false };
    }
    checkVictoryCondition() {
      const lvl = this.currentLevel;
      let allMatchesFound = true;
      for (const sol of lvl.solution) {
        const dIdx = lvl.detectives.findIndex((d) => d.id === sol.detectiveId);
        const pIdx = lvl.paintings.findIndex((p) => p.id === sol.paintingId);
        const cIdx = lvl.clues.findIndex((c) => c.id === sol.clueId);
        if (this.gridState.AB[dIdx][pIdx] !== 2 || this.gridState.AC[dIdx][cIdx] !== 2 || this.gridState.BC[pIdx][cIdx] !== 2) {
          allMatchesFound = false;
          break;
        }
      }
      if (allMatchesFound && !this.isCompleted) {
        this.isCompleted = true;
        this.elapsedSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1e3));
        const nextLevel = this.currentLevelIndex + 2;
        if (nextLevel > this.unlockedLevel) {
          this.unlockedLevel = nextLevel;
          this.saveProgress();
        }
        this.notifyPlatformWin(this.elapsedSeconds);
        return true;
      }
      return false;
    }
    notifyPlatformWin(timeInSeconds) {
      try {
        if (typeof window !== "undefined" && window.parent) {
          window.parent.postMessage({ type: "win", time: timeInSeconds }, "*");
        }
      } catch (e) {
        console.log("Platform postMessage win event sent", e);
      }
    }
    getSummaryDeductions() {
      const lvl = this.currentLevel;
      const n = lvl.detectives.length;
      const list = [];
      for (let d = 0; d < n; d++) {
        const det = lvl.detectives[d];
        let pFound;
        let cFound;
        for (let p = 0; p < n; p++) {
          if (this.gridState.AB[d][p] === 2) {
            pFound = lvl.paintings[p];
            break;
          }
        }
        for (let c = 0; c < n; c++) {
          if (this.gridState.AC[d][c] === 2) {
            cFound = lvl.clues[c];
            break;
          }
        }
        list.push({
          detective: det,
          painting: pFound,
          clue: cFound,
          isComplete: !!(pFound && cFound)
        });
      }
      return list;
    }
  };
  var game = new GameEngine();

  // museum-art-heist---logic-grid/src/audio.ts
  var SoundEngine = class {
    constructor() {
      this.ctx = null;
      this.muted = false;
      const savedMute = localStorage.getItem("museum_heist_muted");
      this.muted = savedMute === "true";
    }
    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    isMuted() {
      return this.muted;
    }
    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem("museum_heist_muted", String(this.muted));
      if (!this.muted) {
        this.playClick();
      }
      return this.muted;
    }
    playClick() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
    playPencil() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1800, this.ctx.currentTime + 0.04);
      osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }
    playCross() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    }
    playPin() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }
    playConnect() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.25);
      });
    }
    playHint() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.14, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.35);
      });
    }
    playWin() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const notes = [392, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + i * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.6);
      });
    }
    playError() {
      if (this.muted) return;
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }
  };
  var sound = new SoundEngine();

  // museum-art-heist---logic-grid/src/renderer.ts
  var BoardRenderer = class {
    constructor(canvas) {
      this.width = 800;
      this.height = 600;
      this.particles = [];
      this.cards = [];
      this.mouseX = -1;
      this.mouseY = -1;
      this.animFrameId = null;
      this.time = 0;
      this.selectedCard = null;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.initParticles();
      this.setupListeners();
    }
    setSize(w, h) {
      this.width = w;
      this.height = h;
      this.rebuildCards();
    }
    setupListeners() {
      this.canvas.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.checkHover();
      });
      this.canvas.addEventListener("mouseleave", () => {
        this.mouseX = -1;
        this.mouseY = -1;
        this.cards.forEach((c) => c.isHovered = false);
      });
      this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const hit = this.cards.find((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
        if (hit) {
          this.selectedCard = this.selectedCard?.id === hit.id ? null : hit;
          this.spawnBurst(hit.x + hit.w / 2, hit.y + hit.h / 2, hit.color);
        } else {
          this.selectedCard = null;
        }
      });
      this.canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;
          const hit = this.cards.find((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
          if (hit) {
            this.selectedCard = this.selectedCard?.id === hit.id ? null : hit;
            this.spawnBurst(hit.x + hit.w / 2, hit.y + hit.h / 2, hit.color);
          }
        }
      }, { passive: true });
    }
    checkHover() {
      this.cards.forEach((c) => {
        c.isHovered = this.mouseX >= c.x && this.mouseX <= c.x + c.w && this.mouseY >= c.y && this.mouseY <= c.y + c.h;
      });
    }
    initParticles() {
      this.particles = [];
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.1,
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.4 ? "rgba(250, 204, 21, " : "rgba(226, 232, 240, ",
          alpha: Math.random() * 0.6 + 0.2,
          life: Math.random() * 200,
          maxLife: 200 + Math.random() * 200
        });
      }
    }
    spawnBurst(x, y, color) {
      for (let i = 0; i < 16; i++) {
        const angle = Math.PI * 2 * i / 16 + Math.random() * 0.2;
        const speed = Math.random() * 3 + 1.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 2,
          color: color.startsWith("#") ? color : "#facc15",
          alpha: 1,
          life: 0,
          maxLife: 40 + Math.random() * 20
        });
      }
    }
    rebuildCards() {
      const lvl = game.currentLevel;
      const n = lvl.detectives.length;
      this.cards = [];
      const paddingX = Math.max(12, this.width * 0.03);
      const paddingY = Math.max(16, this.height * 0.05);
      const availableW = this.width - paddingX * 2;
      const colWidth = Math.min(220, (availableW - 32) / 3);
      const gapX = (availableW - colWidth * 3) / 2;
      const availableH = this.height - paddingY * 2 - 20;
      const cardHeight = Math.min(74, Math.max(50, (availableH - (n - 1) * 8) / n));
      const gapY = (availableH - cardHeight * n) / Math.max(1, n - 1);
      lvl.detectives.forEach((d, i) => {
        this.cards.push({
          id: d.id,
          type: "detective",
          name: d.name,
          icon: d.icon,
          desc: d.desc,
          color: d.color,
          x: paddingX,
          y: paddingY + 20 + i * (cardHeight + gapY),
          w: colWidth,
          h: cardHeight,
          isHovered: false
        });
      });
      lvl.paintings.forEach((p, i) => {
        this.cards.push({
          id: p.id,
          type: "painting",
          name: p.name,
          icon: p.icon,
          desc: p.artist || p.desc,
          color: p.color,
          x: paddingX + colWidth + gapX,
          y: paddingY + 20 + i * (cardHeight + gapY),
          w: colWidth,
          h: cardHeight,
          isHovered: false
        });
      });
      lvl.clues.forEach((c, i) => {
        this.cards.push({
          id: c.id,
          type: "clue",
          name: c.name,
          icon: c.icon,
          desc: c.desc,
          color: c.color,
          x: paddingX + (colWidth + gapX) * 2,
          y: paddingY + 20 + i * (cardHeight + gapY),
          w: colWidth,
          h: cardHeight,
          isHovered: false
        });
      });
    }
    start() {
      if (!this.animFrameId) {
        const loop = () => {
          this.time += 0.016;
          this.render();
          this.animFrameId = requestAnimationFrame(loop);
        };
        this.animFrameId = requestAnimationFrame(loop);
      }
    }
    stop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
      bgGrad.addColorStop(0, "#1e293b");
      bgGrad.addColorStop(0.6, "#0f172a");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridStep = 24;
      for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      this.renderColumnHeaders();
      this.renderEvidenceThreads();
      this.renderCards();
      this.renderParticles();
      if (game.isCompleted) {
        this.renderSolvedStamp();
      }
    }
    renderColumnHeaders() {
      const ctx = this.ctx;
      const paddingX = Math.max(12, this.width * 0.03);
      const availableW = this.width - paddingX * 2;
      const colWidth = Math.min(220, (availableW - 32) / 3);
      const gapX = (availableW - colWidth * 3) / 2;
      const headers = [
        { text: "DETECTIVES", icon: "\u{1F575}\uFE0F", x: paddingX + colWidth / 2, color: "#38bdf8" },
        { text: "STOLEN ARTWORKS", icon: "\u{1F3A8}", x: paddingX + colWidth + gapX + colWidth / 2, color: "#fbbf24" },
        { text: "FORENSIC CLUES", icon: "\u{1F52C}", x: paddingX + (colWidth + gapX) * 2 + colWidth / 2, color: "#f43f5e" }
      ];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 11px system-ui, sans-serif";
      headers.forEach((h) => {
        ctx.fillStyle = h.color;
        ctx.fillText(`${h.icon} ${h.text}`, h.x, 16);
      });
    }
    renderEvidenceThreads() {
      const ctx = this.ctx;
      const lvl = game.currentLevel;
      const n = lvl.detectives.length;
      for (let d = 0; d < n; d++) {
        for (let p = 0; p < n; p++) {
          if (game.gridState.AB[d][p] === 2) {
            const cardD = this.cards.find((c) => c.id === lvl.detectives[d].id);
            const cardP = this.cards.find((c) => c.id === lvl.paintings[p].id);
            if (cardD && cardP) {
              this.drawYarnThread(cardD.x + cardD.w - 10, cardD.y + cardD.h / 2, cardP.x + 10, cardP.y + cardP.h / 2, "#ef4444");
            }
          }
        }
      }
      for (let p = 0; p < n; p++) {
        for (let c = 0; c < n; c++) {
          if (game.gridState.BC[p][c] === 2) {
            const cardP = this.cards.find((card) => card.id === lvl.paintings[p].id);
            const cardC = this.cards.find((card) => card.id === lvl.clues[c].id);
            if (cardP && cardC) {
              this.drawYarnThread(cardP.x + cardP.w - 10, cardP.y + cardP.h / 2, cardC.x + 10, cardC.y + cardC.h / 2, "#ef4444");
            }
          }
        }
      }
    }
    drawYarnThread(x1, y1, x2, y2, color) {
      const ctx = this.ctx;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 + 10 + Math.sin(this.time * 2 + x1) * 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x1 + 1, y1 + 3);
      ctx.quadraticCurveTo(midX + 1, midY + 3, x2 + 1, y2 + 3);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(254, 240, 138, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();
    }
    renderCards() {
      const ctx = this.ctx;
      this.cards.forEach((card) => {
        const isSelected = this.selectedCard?.id === card.id;
        const isHovered = card.isHovered;
        const elev = isHovered || isSelected ? 3 : 0;
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.roundRect(card.x + 2, card.y + 4 + elev, card.w, card.h, 10);
        ctx.fill();
        const cardGrad = ctx.createLinearGradient(card.x, card.y - elev, card.x, card.y + card.h - elev);
        if (isSelected) {
          cardGrad.addColorStop(0, "#334155");
          cardGrad.addColorStop(1, "#1e293b");
        } else if (isHovered) {
          cardGrad.addColorStop(0, "#1e293b");
          cardGrad.addColorStop(1, "#0f172a");
        } else {
          cardGrad.addColorStop(0, "#182234");
          cardGrad.addColorStop(1, "#0b1120");
        }
        ctx.fillStyle = cardGrad;
        ctx.beginPath();
        ctx.roundRect(card.x, card.y - elev, card.w, card.h, 10);
        ctx.fill();
        ctx.strokeStyle = isSelected ? card.color : isHovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
        const pinX = card.x + 12;
        const pinY = card.y + 12 - elev;
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(pinX + 1, pinY + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        const pinGrad = ctx.createRadialGradient(pinX - 1, pinY - 1, 1, pinX, pinY, 4);
        pinGrad.addColorStop(0, "#f87171");
        pinGrad.addColorStop(0.7, "#dc2626");
        pinGrad.addColorStop(1, "#991b1b");
        ctx.fillStyle = pinGrad;
        ctx.beginPath();
        ctx.arc(pinX, pinY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${Math.min(22, Math.floor(card.h * 0.42))}px system-ui, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(card.icon, card.x + 24, card.y + card.h / 2 - elev);
        ctx.fillStyle = "#f8fafc";
        ctx.font = `bold ${Math.max(10, Math.min(13, Math.floor(card.w * 0.065)))}px system-ui, sans-serif`;
        ctx.fillText(card.name, card.x + 56, card.y + card.h * 0.38 - elev, card.w - 62);
        ctx.fillStyle = "#94a3b8";
        ctx.font = `${Math.max(9, Math.min(11, Math.floor(card.w * 0.052)))}px system-ui, sans-serif`;
        ctx.fillText(card.desc, card.x + 56, card.y + card.h * 0.68 - elev, card.w - 62);
      });
    }
    renderParticles() {
      const ctx = this.ctx;
      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;
        const currentAlpha = p.color.startsWith("rgba") ? p.alpha * (1 - p.life / p.maxLife) : 1 - p.life / p.maxLife;
        if (currentAlpha > 0) {
          ctx.fillStyle = p.color.startsWith("rgba") ? `${p.color}${Math.max(0, currentAlpha)})` : p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      this.particles = this.particles.filter((p) => p.life < p.maxLife);
    }
    renderSolvedStamp() {
      const ctx = this.ctx;
      const cx = this.width / 2;
      const cy = this.height / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.15);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
      ctx.lineWidth = 4;
      ctx.strokeRect(-160, -35, 320, 70);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-154, -29, 308, 58);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(34, 197, 94, 0.95)";
      ctx.font = "900 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CASE SOLVED!", 0, 0);
      ctx.restore();
    }
  };

  // museum-art-heist---logic-grid/src/display.ts
  var DisplayManager = class {
    constructor(canvas, onResize) {
      this.dpr = 1;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onResizeCallback = onResize;
      if (this.canvas.parentElement) {
        const observer = new ResizeObserver(() => this.resize());
        observer.observe(this.canvas.parentElement);
      } else {
        window.addEventListener("resize", () => this.resize());
      }
      setTimeout(() => this.resize(), 10);
    }
    resize() {
      if (!this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = Math.max(10, Math.floor(parentRect.width));
      const cssHeight = Math.max(10, Math.floor(parentRect.height));
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.canvas.style.width = `${cssWidth}px`;
      this.canvas.style.height = `${cssHeight}px`;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      if (this.onResizeCallback) {
        this.onResizeCallback(cssWidth, cssHeight, this.dpr);
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
    getDpr() {
      return this.dpr;
    }
  };

  // museum-art-heist---logic-grid/src/screen-manager.ts
  var ScreenController = class {
    constructor() {
      this.currentScreen = "MAIN_MENU";
      this.displayManager = null;
      this.renderer = null;
      this.timerInterval = null;
      this.hintCountdownInterval = null;
    }
    init() {
      this.setupDOM();
      this.setupEventListeners();
      this.updateScreenVisibility();
      this.updateSoundIcons();
    }
    setScreen(screen) {
      this.currentScreen = screen;
      this.updateScreenVisibility();
      sound.playClick();
      if (screen === "PLAYING") {
        this.startLevelTimer();
        if (this.displayManager) {
          setTimeout(() => this.displayManager?.resize(), 50);
        }
        if (this.renderer) {
          this.renderer.start();
        }
      } else {
        this.stopLevelTimer();
        if (this.renderer) {
          this.renderer.stop();
        }
      }
      if (screen === "LEVEL_SELECT") {
        this.renderLevelSelectGrid();
      }
    }
    setupDOM() {
      const canvas = document.getElementById("board-canvas");
      if (canvas) {
        this.renderer = new BoardRenderer(canvas);
        this.displayManager = new DisplayManager(canvas, (w, h) => {
          this.renderer?.setSize(w, h);
        });
      }
    }
    setupEventListeners() {
      document.getElementById("btn-play-now")?.addEventListener("click", () => {
        game.startLevel(Math.min(game.unlockedLevel - 1, LEVELS.length - 1));
        this.setScreen("PLAYING");
        this.renderPlayScreen();
      });
      document.getElementById("btn-level-select")?.addEventListener("click", () => {
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-how-to-play")?.addEventListener("click", () => {
        this.setScreen("HOW_TO_PLAY");
      });
      document.getElementById("btn-back-menu-from-levels")?.addEventListener("click", () => {
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-back-menu-from-tutorial")?.addEventListener("click", () => {
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-pause-menu")?.addEventListener("click", () => {
        this.setScreen("MAIN_MENU");
      });
      const soundButtons = ["btn-sound-toggle-menu", "btn-sound-toggle-hud"];
      soundButtons.forEach((id) => {
        document.getElementById(id)?.addEventListener("click", () => {
          sound.toggleMute();
          this.updateSoundIcons();
        });
      });
      document.getElementById("btn-undo")?.addEventListener("click", () => {
        if (game.undo()) {
          sound.playClick();
          this.renderPlayScreen();
        }
      });
      document.getElementById("btn-reset-grid")?.addEventListener("click", () => {
        game.resetGrid();
        sound.playPencil();
        this.renderPlayScreen();
      });
      document.getElementById("btn-hint")?.addEventListener("click", () => {
        this.openHintModal();
      });
      const tabs = ["grid", "clues", "summary"];
      tabs.forEach((tab) => {
        document.getElementById(`tab-btn-${tab}`)?.addEventListener("click", () => {
          game.activeTab = tab;
          sound.playClick();
          this.updateTabView();
        });
      });
      const openCluesTab = () => {
        game.activeTab = "clues";
        sound.playClick();
        this.updateTabView();
      };
      document.getElementById("btn-ticker-see-clues")?.addEventListener("click", (e) => {
        e.stopPropagation();
        openCluesTab();
      });
      document.getElementById("hud-ticker-banner")?.addEventListener("click", () => {
        openCluesTab();
      });
      document.getElementById("btn-close-hint")?.addEventListener("click", () => {
        this.closeHintModal();
      });
      document.getElementById("btn-claim-hint")?.addEventListener("click", () => {
        const result = game.applyStepHint();
        sound.playHint();
        this.closeHintModal();
        this.showToast(result.message);
        this.renderPlayScreen();
      });
      document.getElementById("btn-next-level")?.addEventListener("click", () => {
        const nextLvl = game.currentLevelIndex + 1;
        if (nextLvl < LEVELS.length) {
          game.startLevel(nextLvl);
          this.setScreen("PLAYING");
          this.renderPlayScreen();
        } else {
          this.setScreen("LEVEL_SELECT");
        }
      });
      window.addEventListener("resize", () => {
        if (this.currentScreen === "PLAYING") {
          this.updateTabView();
        }
      });
    }
    updateSoundIcons() {
      const isMuted = sound.isMuted();
      const soundIcons = document.querySelectorAll(".sound-icon");
      soundIcons.forEach((el) => {
        el.textContent = isMuted ? "\u{1F507}" : "\u{1F50A}";
      });
    }
    updateScreenVisibility() {
      const screens = {
        "MAIN_MENU": document.getElementById("screen-main-menu"),
        "LEVEL_SELECT": document.getElementById("screen-level-select"),
        "HOW_TO_PLAY": document.getElementById("screen-how-to-play"),
        "PLAYING": document.getElementById("screen-playing")
      };
      Object.entries(screens).forEach(([key, el]) => {
        if (el) {
          if (key === this.currentScreen) {
            el.classList.remove("hidden");
          } else {
            el.classList.add("hidden");
          }
        }
      });
    }
    updateTabView() {
      const tabGrid = document.getElementById("view-grid");
      const tabClues = document.getElementById("view-clues");
      const tabSummary = document.getElementById("view-summary");
      const tabBoard = document.getElementById("view-board");
      const btnGrid = document.getElementById("tab-btn-grid");
      const btnClues = document.getElementById("tab-btn-clues");
      const btnSummary = document.getElementById("tab-btn-summary");
      const activeClasses = ["bg-indigo-600", "text-white", "font-bold", "shadow-md", "shadow-indigo-600/30"];
      const inactiveClasses = ["bg-slate-800", "text-slate-300", "hover:bg-slate-700"];
      const setTabStyle = (btn, isActive) => {
        if (!btn) return;
        if (isActive) {
          btn.classList.add(...activeClasses);
          btn.classList.remove(...inactiveClasses);
        } else {
          btn.classList.remove(...activeClasses);
          btn.classList.add(...inactiveClasses);
        }
      };
      setTabStyle(btnGrid, game.activeTab === "grid");
      setTabStyle(btnClues, game.activeTab === "clues");
      setTabStyle(btnSummary, game.activeTab === "summary");
      const cluesBadge = document.getElementById("hud-clues-badge");
      const readCount = game.cluesRead.size;
      const totalClues = game.currentLevel.cluesList.length;
      if (cluesBadge) {
        cluesBadge.textContent = `${readCount}/${totalClues}`;
      }
      const cluesProgressBadge = document.getElementById("clues-progress-badge");
      if (cluesProgressBadge) {
        cluesProgressBadge.textContent = `${readCount}/${totalClues} Read`;
      }
      const tickerText = document.getElementById("hud-ticker-clue-text");
      if (tickerText && game.currentLevel.cluesList.length > 0) {
        let activeClueIdx = 0;
        for (let i = 0; i < totalClues; i++) {
          if (!game.cluesRead.has(i)) {
            activeClueIdx = i;
            break;
          }
        }
        tickerText.textContent = game.currentLevel.cluesList[activeClueIdx] || game.currentLevel.cluesList[0];
      }
      const isDesktop = window.innerWidth >= 1024;
      if (tabBoard) {
        if (isDesktop) {
          tabBoard.classList.remove("hidden");
          tabBoard.classList.add("block");
        } else {
          tabBoard.classList.add("hidden");
        }
      }
      if (tabGrid) {
        tabGrid.classList.toggle("hidden", game.activeTab !== "grid");
      }
      if (tabClues) {
        tabClues.classList.toggle("hidden", game.activeTab !== "clues");
      }
      if (tabSummary) {
        tabSummary.classList.toggle("hidden", game.activeTab !== "summary");
      }
      if (this.displayManager) {
        setTimeout(() => this.displayManager?.resize(), 30);
      }
      if (game.activeTab === "clues") {
        this.renderCluesTab();
      } else if (game.activeTab === "summary") {
        this.renderSummaryTab();
      }
    }
    renderPlayScreen() {
      const lvl = game.currentLevel;
      const lvlBadge = document.getElementById("hud-level-badge");
      if (lvlBadge) lvlBadge.textContent = `LEVEL ${lvl.id}`;
      const titleEl = document.getElementById("play-level-title");
      if (titleEl) titleEl.textContent = lvl.title;
      const subtitleEl = document.getElementById("play-level-subtitle");
      if (subtitleEl) subtitleEl.textContent = lvl.subtitle;
      this.renderLogicGridMatrix();
      this.renderCluesList();
      this.updateTabView();
      const winBanner = document.getElementById("win-banner");
      if (winBanner) {
        if (game.isCompleted) {
          winBanner.classList.remove("hidden");
          sound.playWin();
        } else {
          winBanner.classList.add("hidden");
        }
      }
      if (this.renderer) {
        this.renderer.rebuildCards();
      }
    }
    renderLogicGridMatrix() {
      const container = document.getElementById("logic-grid-container");
      if (!container) return;
      const lvl = game.currentLevel;
      const n = lvl.detectives.length;
      const isModular = game.gridDisplayMode === "modular";
      let html = `
      <div class="w-full flex flex-col items-center gap-2">
        <!-- Layout mode toolbar -->
        <div class="w-full max-w-4xl flex items-center justify-between px-1 py-1 text-xs">
          <span class="text-[11px] text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
            <span>\u26A1</span>
            <span>Adaptive Clue Grid</span>
          </span>
          <button id="btn-toggle-grid-mode" class="btn-tactile ml-auto px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
            <span>${isModular ? "\u{1F4F1} Adaptive Mode (No Scroll)" : "\u{1F4D0} Unified Matrix Mode"}</span>
            <span class="text-slate-400 text-[10px]">(Toggle)</span>
          </button>
        </div>
    `;
      if (isModular) {
        html += `
        <div class="w-full max-w-4xl flex flex-wrap gap-3 justify-center items-start">
          
          <!-- SUBGRID 1: Detectives x Paintings (AB) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">\u{1F575}\uFE0F</span>
                <span class="font-bold text-xs text-sky-300">Detectives</span>
                <span class="text-slate-500 font-bold text-xs">\xD7</span>
                <span class="text-sm">\u{1F3A8}</span>
                <span class="font-bold text-xs text-amber-300">Artworks</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-mono">1/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.paintings.map((p) => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${p.name}">
                        <div class="text-sm leading-none">${p.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${p.name.split(" ")[0]}</div>
                      </th>
                    `).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${d.name}">
                        <span class="text-sm">${d.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${d.name.split(" ")[1] || d.name}</span>
                      </th>
                      ${lvl.paintings.map((_, c) => this.renderCellHTML("AB", r, c, game.gridState.AB[r][c])).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SUBGRID 2: Detectives x Clues (AC) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">\u{1F575}\uFE0F</span>
                <span class="font-bold text-xs text-sky-300">Detectives</span>
                <span class="text-slate-500 font-bold text-xs">\xD7</span>
                <span class="text-sm">\u{1F52C}</span>
                <span class="font-bold text-xs text-rose-300">Clues</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono">2/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.clues.map((c) => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${c.name}">
                        <div class="text-sm leading-none">${c.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${c.name.split(" ")[0]}</div>
                      </th>
                    `).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${d.name}">
                        <span class="text-sm">${d.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${d.name.split(" ")[1] || d.name}</span>
                      </th>
                      ${lvl.clues.map((_, c) => this.renderCellHTML("AC", r, c, game.gridState.AC[r][c])).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SUBGRID 3: Paintings x Clues (BC) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">\u{1F3A8}</span>
                <span class="font-bold text-xs text-amber-300">Artworks</span>
                <span class="text-slate-500 font-bold text-xs">\xD7</span>
                <span class="text-sm">\u{1F52C}</span>
                <span class="font-bold text-xs text-rose-300">Clues</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-mono">3/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.clues.map((c) => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${c.name}">
                        <div class="text-sm leading-none">${c.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${c.name.split(" ")[0]}</div>
                      </th>
                    `).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.paintings.map((p, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-amber-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${p.name}">
                        <span class="text-sm">${p.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${p.name.split(" ")[0]}</span>
                      </th>
                      ${lvl.clues.map((_, c) => this.renderCellHTML("BC", r, c, game.gridState.BC[r][c])).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;
      } else {
        html += `
        <div class="inline-block min-w-full overflow-x-auto custom-scroll pb-2">
          <table class="border-collapse select-none text-xs sm:text-sm mx-auto">
            <thead>
              <tr>
                <th class="p-1 border border-transparent"></th>
                <th colspan="${n}" class="p-1.5 text-center font-bold text-amber-400 bg-slate-800/90 border border-slate-700 rounded-tl-lg">
                  \u{1F3A8} ARTWORKS
                </th>
                <th colspan="${n}" class="p-1.5 text-center font-bold text-rose-400 bg-slate-800/90 border border-slate-700 rounded-tr-lg">
                  \u{1F52C} FORENSIC CLUES
                </th>
              </tr>
              <tr>
                <th class="p-1 border border-transparent"></th>
                ${lvl.paintings.map((p) => `
                  <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-11 max-w-[44px] truncate" title="${p.name} (${p.artist || ""})">
                    <div class="text-sm sm:text-base leading-none">${p.icon}</div>
                    <div class="text-[9px] sm:text-[10px] text-slate-300 truncate w-full font-normal">${p.name.split(" ")[0]}</div>
                  </th>
                `).join("")}
                ${lvl.clues.map((c) => `
                  <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-11 max-w-[44px] truncate" title="${c.name}">
                    <div class="text-sm sm:text-base leading-none">${c.icon}</div>
                    <div class="text-[9px] sm:text-[10px] text-slate-300 truncate w-full font-normal">${c.name.split(" ")[0]}</div>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              ${lvl.detectives.map((d, r) => `
                <tr>
                  <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[100px] sm:min-w-[130px]" title="${d.name}">
                    <span class="text-sm">${d.icon}</span>
                    <span class="truncate">${d.name}</span>
                  </th>
                  ${lvl.paintings.map((_, c) => this.renderCellHTML("AB", r, c, game.gridState.AB[r][c])).join("")}
                  ${lvl.clues.map((_, c) => this.renderCellHTML("AC", r, c, game.gridState.AC[r][c])).join("")}
                </tr>
              `).join("")}
              <tr>
                <th colspan="${1 + n * 2}" class="p-1 bg-slate-900 border-x border-slate-700 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                  Cross-Reference: Artworks \u2794 Forensic Clues
                </th>
              </tr>
              ${lvl.paintings.map((p, r) => `
                <tr>
                  <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-amber-300 flex items-center gap-1 min-w-[100px] sm:min-w-[130px]" title="${p.name}">
                    <span class="text-sm">${p.icon}</span>
                    <span class="truncate">${p.name}</span>
                  </th>
                  <td colspan="${n}" class="border border-slate-800 bg-slate-950/70"></td>
                  ${lvl.clues.map((_, c) => this.renderCellHTML("BC", r, c, game.gridState.BC[r][c])).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
      }
      html += `</div>`;
      container.innerHTML = html;
      container.querySelectorAll(".logic-cell").forEach((cellEl) => {
        cellEl.addEventListener("click", () => {
          const target = cellEl.dataset.target;
          const row = parseInt(cellEl.dataset.row || "0", 10);
          const col = parseInt(cellEl.dataset.col || "0", 10);
          game.toggleCell(target, row, col);
          const nextVal = game.gridState[target][row][col];
          if (nextVal === 2) sound.playPencil();
          else if (nextVal === 1) sound.playCross();
          else sound.playClick();
          this.renderPlayScreen();
        });
      });
      document.getElementById("btn-toggle-grid-mode")?.addEventListener("click", () => {
        game.toggleGridDisplayMode();
        sound.playClick();
        this.renderPlayScreen();
      });
    }
    renderCellHTML(target, r, c, val) {
      let content = "";
      let bgClass = "bg-slate-900/90 hover:bg-slate-700/80";
      if (val === 1) {
        content = '<span class="text-rose-400 font-extrabold text-sm sm:text-base">\u2715</span>';
        bgClass = "bg-rose-950/40 hover:bg-rose-900/50";
      } else if (val === 2) {
        content = '<span class="text-emerald-400 font-extrabold text-base sm:text-lg">\u2713</span>';
        bgClass = "bg-emerald-950/60 ring-1 ring-emerald-500/50 hover:bg-emerald-900/60";
      }
      return `
      <td 
        data-target="${target}" 
        data-row="${r}" 
        data-col="${c}" 
        class="logic-cell grid-cell p-0 text-center w-8 sm:w-11 h-8 sm:h-11 border border-slate-700/80 cursor-pointer ${bgClass}"
      >
        <div class="w-full h-full flex items-center justify-center">${content}</div>
      </td>
    `;
    }
    renderCluesList() {
      const lvl = game.currentLevel;
      const containers = [
        document.getElementById("clues-list-container"),
        document.getElementById("tab-clues-list-container")
      ];
      containers.forEach((container) => {
        if (!container) return;
        container.innerHTML = lvl.cluesList.map((clue, idx) => {
          const isStruck = game.cluesRead.has(idx);
          return `
          <div 
            data-clue-idx="${idx}"
            class="clue-item p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${isStruck ? "bg-slate-900/60 border-slate-800 text-slate-500 line-through opacity-70" : "bg-slate-800/90 border-slate-700/80 text-slate-100 hover:border-indigo-500/60 shadow-sm"}"
          >
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <span class="w-6 h-6 rounded-lg ${isStruck ? "bg-slate-800 text-slate-500" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"} font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="text-xs sm:text-sm sm:text-base leading-relaxed text-slate-100 font-medium whitespace-normal break-words flex-1">${clue}</p>
            </div>
            <div class="px-2.5 py-1 rounded-lg text-xs font-bold ${isStruck ? "bg-slate-800 text-slate-500" : "bg-indigo-600 text-white shadow-sm"} shrink-0 flex items-center gap-1 mt-0.5">
              <span>${isStruck ? "\u2713 Read" : "Mark as Read"}</span>
            </div>
          </div>
        `;
        }).join("");
        container.querySelectorAll(".clue-item").forEach((itemEl) => {
          itemEl.addEventListener("click", () => {
            const idx = parseInt(itemEl.dataset.clueIdx || "0", 10);
            game.toggleClueRead(idx);
            sound.playClick();
            this.renderCluesList();
            this.updateTabView();
          });
        });
      });
    }
    renderCluesTab() {
      this.renderCluesList();
    }
    renderSummaryTab() {
      const summaryContainer = document.getElementById("summary-cards-container");
      if (!summaryContainer) return;
      const deductions = game.getSummaryDeductions();
      summaryContainer.innerHTML = deductions.map((d) => `
      <div class="p-3 rounded-xl border ${d.isComplete ? "bg-emerald-950/30 border-emerald-500/50" : "bg-slate-800/80 border-slate-700"} flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <div class="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-xl shrink-0">
            ${d.detective.icon}
          </div>
          <div>
            <h4 class="font-bold text-sm text-sky-200">${d.detective.name}</h4>
            <p class="text-xs text-slate-400">${d.detective.desc}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div class="px-3 py-1.5 rounded-lg ${d.painting ? "bg-amber-950/60 border border-amber-500/40 text-amber-200" : "bg-slate-900 border border-dashed border-slate-700 text-slate-500"} text-xs font-semibold flex items-center gap-1.5">
            <span>${d.painting ? d.painting.icon : "\u2753"}</span>
            <span>${d.painting ? d.painting.name : "Pending Artwork"}</span>
          </div>

          <span class="text-slate-500 font-bold">\u2794</span>

          <div class="px-3 py-1.5 rounded-lg ${d.clue ? "bg-rose-950/60 border border-rose-500/40 text-rose-200" : "bg-slate-900 border border-dashed border-slate-700 text-slate-500"} text-xs font-semibold flex items-center gap-1.5">
            <span>${d.clue ? d.clue.icon : "\u2753"}</span>
            <span>${d.clue ? d.clue.name : "Pending Clue"}</span>
          </div>
        </div>
      </div>
    `).join("");
    }
    renderLevelSelectGrid() {
      const gridEl = document.getElementById("level-select-grid");
      if (!gridEl) return;
      gridEl.innerHTML = LEVELS.map((lvl, index) => {
        const isUnlocked = lvl.id <= game.unlockedLevel;
        return `
        <button 
          data-lvl-idx="${index}"
          ${!isUnlocked ? "disabled" : ""}
          class="btn-tactile p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${isUnlocked ? "bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/40 text-slate-100 hover:border-amber-400 cursor-pointer" : "bg-slate-900/60 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed"}"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full ${isUnlocked ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-500"}">
              LEVEL ${lvl.id}
            </span>
            <span class="text-lg">${isUnlocked ? "\u{1F513}" : "\u{1F512}"}</span>
          </div>
          <h3 class="font-bold text-sm sm:text-base text-slate-100 mb-1">${lvl.title.split(": ")[1] || lvl.title}</h3>
          <p class="text-xs text-slate-400 line-clamp-2">${lvl.subtitle}</p>
        </button>
      `;
      }).join("");
      gridEl.querySelectorAll("button[data-lvl-idx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.lvlIdx || "0", 10);
          game.startLevel(idx);
          this.setScreen("PLAYING");
          this.renderPlayScreen();
        });
      });
    }
    startLevelTimer() {
      this.stopLevelTimer();
      const timerEl = document.getElementById("score-counter");
      const updateTimer = () => {
        if (game.isCompleted) return;
        const elapsed = Math.floor((Date.now() - game.startTime) / 1e3);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, "0");
        const secs = (elapsed % 60).toString().padStart(2, "0");
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      };
      updateTimer();
      this.timerInterval = window.setInterval(updateTimer, 1e3);
    }
    stopLevelTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
    openHintModal() {
      const modal = document.getElementById("hint-reward-modal");
      if (!modal) return;
      modal.classList.remove("hidden");
      const claimBtn = document.getElementById("btn-claim-hint");
      const progressEl = document.getElementById("hint-countdown-bar");
      const countdownText = document.getElementById("hint-countdown-text");
      if (claimBtn) claimBtn.disabled = true;
      if (progressEl) progressEl.style.width = "0%";
      let secondsLeft = 5;
      if (countdownText) countdownText.textContent = `Awaiting forensic analysis (${secondsLeft}s)...`;
      if (this.hintCountdownInterval) clearInterval(this.hintCountdownInterval);
      this.hintCountdownInterval = window.setInterval(() => {
        secondsLeft--;
        const pct = (5 - secondsLeft) / 5 * 100;
        if (progressEl) progressEl.style.width = `${pct}%`;
        if (secondsLeft > 0) {
          if (countdownText) countdownText.textContent = `Awaiting forensic analysis (${secondsLeft}s)...`;
        } else {
          if (countdownText) countdownText.textContent = `Analysis complete! Evidence revealed.`;
          if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.classList.remove("opacity-50", "cursor-not-allowed");
            claimBtn.classList.add("animate-pulse");
          }
          if (this.hintCountdownInterval) {
            clearInterval(this.hintCountdownInterval);
            this.hintCountdownInterval = null;
          }
        }
      }, 1e3);
    }
    closeHintModal() {
      const modal = document.getElementById("hint-reward-modal");
      if (modal) modal.classList.add("hidden");
      if (this.hintCountdownInterval) {
        clearInterval(this.hintCountdownInterval);
        this.hintCountdownInterval = null;
      }
    }
    showToast(msg) {
      const toast = document.getElementById("game-toast");
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.remove("hidden", "opacity-0");
      toast.classList.add("opacity-100");
      setTimeout(() => {
        toast.classList.add("opacity-0");
        setTimeout(() => toast.classList.add("hidden"), 300);
      }, 3500);
    }
  };
  var screenCtrl = new ScreenController();

  // museum-art-heist---logic-grid/src/main.ts
  function bootstrap() {
    screenCtrl.init();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
