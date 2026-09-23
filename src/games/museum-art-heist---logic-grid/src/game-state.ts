/**
 * Game State & Logic Grid Engine for Museum Art Heist
 */

export interface ItemInfo {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
  artist?: string;
  type?: string;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  story: string;
  detectives: ItemInfo[];
  paintings: ItemInfo[];
  clues: ItemInfo[];
  solution: { detectiveId: string; paintingId: string; clueId: string }[];
  cluesList: string[];
  stepHints: { target: 'AB' | 'AC' | 'BC'; row: number; col: number; val: 1 | 2; explanation: string }[];
}

export type CellValue = 0 | 1 | 2; // 0: Empty, 1: Cross (X), 2: Check (V)

export interface GridState {
  AB: CellValue[][]; // Detectives (rows) x Paintings (cols)
  AC: CellValue[][]; // Detectives (rows) x Clues (cols)
  BC: CellValue[][]; // Paintings (rows) x Clues (cols)
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Level 1: Mystery of the North Gallery",
    subtitle: "3 Detectives • 3 Artworks • 3 Clues",
    story: "In the dead of night, the alarm at the North Gallery sounded. Three priceless masterpieces disappeared, and three top criminal investigators took the case. Each found a crucial forensic clue left behind by the masked thief.",
    detectives: [
      { id: "sarah", name: "Det. Sarah Vance", icon: "🔍", desc: "Chief Homicide & Major Theft Inspector", color: "#38bdf8" },
      { id: "charles", name: "Insp. Charles Roux", icon: "🕵️‍♂️", desc: "Paris Senior Forensic Criminologist", color: "#fb923c" },
      { id: "elena", name: "Agent Elena Vega", icon: "🕶️", desc: "Interpol Anti-Trafficking Specialist", color: "#a855f7" }
    ],
    paintings: [
      { id: "starry", name: "Starry Night Stolen", icon: "🌌", desc: "Oil on canvas, 1889", color: "#60a5fa", artist: "Vincent V." },
      { id: "mona", name: "Golden Mona Lisa", icon: "🎨", desc: "Sublime Renaissance masterpiece", color: "#facc15", artist: "Leonardo D." },
      { id: "sunflower", name: "Twilight Sunflower", icon: "🌻", desc: "Rare Impressionist painting", color: "#f97316", artist: "Claude M." }
    ],
    clues: [
      { id: "glove", name: "Velvet Glove Fiber", icon: "🧤", desc: "Cobalt blue microfiber on the frame", color: "#818cf8" },
      { id: "footprint", name: "Muddy Boot Print #42", icon: "👞", desc: "Imported leather tread on hardwood", color: "#a3e635" },
      { id: "card", name: "Royal Joker Card", icon: "🃏", desc: "Gold playing card lodged in glass", color: "#f43f5e" }
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
      { target: 'AB', row: 0, col: 0, val: 2, explanation: "Clue 2 states: 'Starry Night Stolen' was assigned to Sarah Vance." },
      { target: 'BC', row: 1, col: 2, val: 2, explanation: "Clue 3 states: 'Golden Mona Lisa' left behind the Royal Joker Card." },
      { target: 'AC', row: 0, col: 0, val: 2, explanation: "By elimination in Clue 1, Sarah Vance must have found the Velvet Glove Fiber!" },
      { target: 'AB', row: 1, col: 2, val: 2, explanation: "Charles Roux is not assigned to Mona Lisa and Sarah has Starry Night, so Charles has the Sunflower." }
    ]
  },
  {
    id: 2,
    title: "Level 2: The Baroque Relics Hall",
    subtitle: "4 Detectives • 4 Artworks • 4 Clues",
    story: "Four paintings vanished simultaneously from the East and West wings. The museum summoned four forensic experts to cross-examine gathered evidence.",
    detectives: [
      { id: "sarah", name: "Det. Sarah Vance", icon: "🔍", desc: "Gold Magnifying Glass Awardee", color: "#38bdf8" },
      { id: "charles", name: "Insp. Charles Roux", icon: "🕵️‍♂️", desc: "Forensic Team Lead", color: "#fb923c" },
      { id: "elena", name: "Agent Elena Vega", icon: "🕶️", desc: "Interpol Task Force", color: "#a855f7" },
      { id: "kenji", name: "Specialist Kenji Sato", icon: "🔬", desc: "Ballistics & Security Expert", color: "#4ade80" }
    ],
    paintings: [
      { id: "portrait", name: "Imperial Portrait", icon: "👑", desc: "Baroque Royal Portrait", color: "#fbbf24", artist: "Diego V." },
      { id: "lady", name: "Lady with an Ermine", icon: "🦔", desc: "High Classical Portrait", color: "#f472b6", artist: "Leonardo D." },
      { id: "scream", name: "Midnight Scream", icon: "😱", desc: "Pure Expressionist Masterpiece", color: "#c084fc", artist: "Edvard M." },
      { id: "boat", name: "Moonlit Sailboat", icon: "⛵", desc: "Night Seascape", color: "#38bdf8", artist: "Rembrandt" }
    ],
    clues: [
      { id: "glove", name: "Velvet Glove Fiber", icon: "🧤", desc: "Rare textile threads", color: "#818cf8" },
      { id: "laser", name: "Severed Laser Wire", icon: "⚡", desc: "Bypassed alarm sensor", color: "#facc15" },
      { id: "perfume", name: "Rare French Perfume", icon: "🧪", desc: "Floral scent residue in room", color: "#fb7185" },
      { id: "key", name: "Lost Master Key", icon: "🗝️", desc: "Polished brass duplicate key", color: "#34d399" }
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
      { target: 'AC', row: 2, col: 1, val: 2, explanation: "Clue 1: Elena Vega found the Severed Laser Wire." },
      { target: 'BC', row: 2, col: 3, val: 2, explanation: "Clue 2: 'Midnight Scream' links to the Lost Master Key." },
      { target: 'AC', row: 3, col: 3, val: 2, explanation: "Clue 3: Kenji Sato found the Lost Master Key." },
      { target: 'AB', row: 0, col: 1, val: 2, explanation: "Clue 4: Sarah Vance investigates 'Lady with an Ermine'." }
    ]
  },
  {
    id: 3,
    title: "Level 3: Renaissance Masters Gallery",
    subtitle: "4 Detectives • 4 Artworks • 4 Clues",
    story: "A syndicate breached the climate-controlled vault. Subtle high-tech traces and chemical residues were detected on scene.",
    detectives: [
      { id: "sarah", name: "Det. Sarah Vance", icon: "🔍", desc: "Chief Inspector", color: "#38bdf8" },
      { id: "charles", name: "Insp. Charles Roux", icon: "🕵️‍♂️", desc: "Criminologist", color: "#fb923c" },
      { id: "elena", name: "Agent Elena Vega", icon: "🕶️", desc: "Interpol Liaison", color: "#a855f7" },
      { id: "kenji", name: "Specialist Kenji Sato", icon: "🔬", desc: "Forensic Scientist", color: "#4ade80" }
    ],
    paintings: [
      { id: "venus", name: "The Birth of Venus", icon: "🐚", desc: "Breathtaking Fresco", color: "#fda4af", artist: "Botticelli" },
      { id: "creation", name: "The Hidden Creation", icon: "✨", desc: "Sacred Ceiling Fragment", color: "#fef08a", artist: "Michelangelo" },
      { id: "anatomy", name: "Forbidden Anatomy", icon: "📜", desc: "Anatomical Sketch", color: "#93c5fd", artist: "Da Vinci" },
      { id: "garden", name: "Garden of Earthly Delights", icon: "🌺", desc: "Mysterious Triptych", color: "#86efac", artist: "Bosch" }
    ],
    clues: [
      { id: "wax", name: "Noble Sealing Wax", icon: "🕯️", desc: "Crimson wax seal residue", color: "#f43f5e" },
      { id: "lens", name: "Shattered Optical Lens", icon: "🔎", desc: "50mm anti-reflective glass", color: "#38bdf8" },
      { id: "chip", name: "Disabled Microchip", icon: "💾", desc: "Burned RFID tracking chip", color: "#fbbf24" },
      { id: "marble", name: "Ancient Marble Dust", icon: "🏛️", desc: "Carrara mineral residue", color: "#e2e8f0" }
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
      { target: 'BC', row: 0, col: 0, val: 2, explanation: "Clue 1: 'Birth of Venus' has Noble Sealing Wax." },
      { target: 'BC', row: 1, col: 2, val: 2, explanation: "Clue 2: 'The Hidden Creation' links to Disabled Microchip." },
      { target: 'AB', row: 0, col: 1, val: 2, explanation: "Clue 3: Sarah Vance investigates 'The Hidden Creation'." },
      { target: 'AC', row: 2, col: 1, val: 2, explanation: "Clue 4: Elena Vega found the Shattered Optical Lens." }
    ]
  },
  {
    id: 4,
    title: "Level 4: The Imperial Vault",
    subtitle: "5 Detectives • 5 Artworks • 5 Clues",
    story: "A global criminal syndicate replaced five historical masterpieces with flawless counterfeit replicas.",
    detectives: [
      { id: "sarah", name: "Det. Sarah Vance", icon: "🔍", desc: "Chief Inspector", color: "#38bdf8" },
      { id: "charles", name: "Insp. Charles Roux", icon: "🕵️‍♂️", desc: "Lead Forensic Lead", color: "#fb923c" },
      { id: "elena", name: "Agent Elena Vega", icon: "🕶️", desc: "Interpol Task Force", color: "#a855f7" },
      { id: "kenji", name: "Specialist Kenji Sato", icon: "🔬", desc: "Forensics", color: "#4ade80" },
      { id: "beatrice", name: "Dr. Beatrice Hall", icon: "💼", desc: "Forgery Specialist", color: "#f43f5e" }
    ],
    paintings: [
      { id: "pearl", name: "Girl with a Pearl Earring", icon: "💎", desc: "Dutch Master Portrait", color: "#38bdf8", artist: "Vermeer" },
      { id: "kiss", name: "The Golden Kiss", icon: "💋", desc: "Gold Leaf Symbolism", color: "#facc15", artist: "Klimt" },
      { id: "wave", name: "The Great Blue Wave", icon: "🌊", desc: "Japanese Woodblock Print", color: "#60a5fa", artist: "Hokusai" },
      { id: "guernica", name: "Guernica of Resistance", icon: "🕊️", desc: "Cubist Mural", color: "#94a3b8", artist: "Picasso" },
      { id: "wanderer", name: "Wanderer Above the Mist", icon: "🏔️", desc: "German Romanticism", color: "#cbd5e1", artist: "Friedrich" }
    ],
    clues: [
      { id: "hair", name: "Platinum Hair Strand", icon: "💇", desc: "Pure synthetic DNA", color: "#f1f5f9" },
      { id: "watch", name: "Swiss Watch Hand", icon: "⌚", desc: "Precision chronograph gear", color: "#fbbf24" },
      { id: "origami", name: "Dark Swan Origami", icon: "🦢", desc: "Folded silk paper", color: "#e879f9" },
      { id: "poison", name: "Rare Sedative Residue", icon: "🧪", desc: "Guards' sleeping agent toxin", color: "#4ade80" },
      { id: "coin", name: "Counterfeit Roman Coin", icon: "🪙", desc: "Lead-struck denarius", color: "#f97316" }
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
      { target: 'AB', row: 0, col: 0, val: 2, explanation: "Clue 1: Sarah Vance investigates Girl with a Pearl Earring." },
      { target: 'AC', row: 0, col: 0, val: 2, explanation: "Clue 2: Sarah Vance retrieved the Platinum Hair Strand." },
      { target: 'AB', row: 3, col: 2, val: 2, explanation: "Clue 3: Kenji Sato investigates 'The Great Blue Wave'." },
      { target: 'AC', row: 3, col: 2, val: 2, explanation: "Clue 3: Kenji Sato found the Dark Swan Origami." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Grand Heist of the Century",
    subtitle: "5 Detectives • 5 Artworks • 5 Clues • Master Detective",
    story: "The legendary thief 'Louvre Phantom' orchestrated the biggest art heist in history. Only a master mind cross-referencing all clues can solve this puzzle.",
    detectives: [
      { id: "sarah", name: "Det. Sarah Vance", icon: "🔍", desc: "Chief Inspector", color: "#38bdf8" },
      { id: "charles", name: "Insp. Charles Roux", icon: "🕵️‍♂️", desc: "Criminologist", color: "#fb923c" },
      { id: "elena", name: "Agent Elena Vega", icon: "🕶️", desc: "Interpol Lead", color: "#a855f7" },
      { id: "kenji", name: "Specialist Kenji Sato", icon: "🔬", desc: "Ballistics Expert", color: "#4ade80" },
      { id: "beatrice", name: "Dr. Beatrice Hall", icon: "💼", desc: "Forgery Specialist", color: "#f43f5e" }
    ],
    paintings: [
      { id: "garden", name: "Garden of Earthly Delights", icon: "🌺", desc: "Secret Triptych", color: "#4ade80", artist: "Bosch" },
      { id: "nightwatch", name: "The Night Watch", icon: "🛡️", desc: "Amsterdam Civic Guard", color: "#fb923c", artist: "Rembrandt" },
      { id: "lastsupper", name: "The Last Supper Restored", icon: "🍷", desc: "Secular Mural", color: "#facc15", artist: "Da Vinci" },
      { id: "medusa", name: "Raft of the Medusa", icon: "🌊", desc: "Romantic Drama", color: "#60a5fa", artist: "Géricault" },
      { id: "liberty", name: "Liberty Leading the People", icon: "🚩", desc: "Revolutionary Icon", color: "#f43f5e", artist: "Delacroix" }
    ],
    clues: [
      { id: "feather", name: "Albino Peacock Feather", icon: "🦚", desc: "Rare artifact left on scene", color: "#e2e8f0" },
      { id: "diamond", name: "Laser Diamond Cutter", icon: "💎", desc: "Sapphire-tipped glass cutter", color: "#38bdf8" },
      { id: "keycard", name: "Cloned Hacker Keycard", icon: "💳", desc: "Forged Level 5 security card", color: "#a855f7" },
      { id: "cologne", name: "Imperial Royal Cologne", icon: "🧴", desc: "Pure essence fragrance scent", color: "#fbbf24" },
      { id: "fuse", name: "Blown High-Voltage Fuse", icon: "🔌", desc: "Triggered power grid short-circuit", color: "#ef4444" }
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
      { target: 'BC', row: 1, col: 1, val: 2, explanation: "Clue 1: 'The Night Watch' links to the Laser Diamond Cutter." },
      { target: 'AC', row: 0, col: 1, val: 2, explanation: "Clue 2: Sarah Vance found the Laser Diamond Cutter." },
      { target: 'AB', row: 1, col: 4, val: 2, explanation: "Clue 3: Charles Roux investigates 'Liberty'." },
      { target: 'AC', row: 1, col: 0, val: 2, explanation: "Clue 3: Charles Roux found the Albino Peacock Feather." }
    ]
  }
];

export class GameEngine {
  public currentLevelIndex: number = 0;
  public gridState: GridState;
  public history: GridState[] = [];
  public cluesRead: Set<number> = new Set();
  public startTime: number = Date.now();
  public elapsedSeconds: number = 0;
  public timerInterval: number | null = null;
  public movesCount: number = 0;
  public isCompleted: boolean = false;
  public unlockedLevel: number = 1;
  public hintsUsed: number = 0;
  public activeTab: 'grid' | 'clues' | 'summary' = 'grid';
  public gridDisplayMode: 'modular' | 'unified' = 'modular';

  constructor() {
    this.loadProgress();
    this.gridState = this.createEmptyGrid(this.currentLevel.detectives.length);
  }

  public toggleGridDisplayMode() {
    this.gridDisplayMode = this.gridDisplayMode === 'modular' ? 'unified' : 'modular';
  }

  public get currentLevel(): LevelData {
    return LEVELS[this.currentLevelIndex] || LEVELS[0];
  }

  private loadProgress() {
    try {
      const savedUnlocked = localStorage.getItem('museum_heist_unlocked');
      if (savedUnlocked) {
        this.unlockedLevel = Math.max(1, parseInt(savedUnlocked, 10));
      }
    } catch {
      this.unlockedLevel = 1;
    }
  }

  public saveProgress() {
    try {
      localStorage.setItem('museum_heist_unlocked', String(this.unlockedLevel));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  public createEmptyGrid(n: number): GridState {
    const makeMatrix = () => Array.from({ length: n }, () => Array.from({ length: n }, () => 0 as CellValue));
    return {
      AB: makeMatrix(),
      AC: makeMatrix(),
      BC: makeMatrix()
    };
  }

  public startLevel(levelIndex: number) {
    this.currentLevelIndex = Math.max(0, Math.min(levelIndex, LEVELS.length - 1));
    const n = this.currentLevel.detectives.length;
    this.gridState = this.createEmptyGrid(n);
    this.history = [];
    this.cluesRead = new Set();
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.movesCount = 0;
    this.isCompleted = false;
    this.hintsUsed = 0;
    this.activeTab = 'grid';
  }

  public toggleCell(target: 'AB' | 'AC' | 'BC', row: number, col: number, manualVal?: CellValue) {
    if (this.isCompleted) return;

    // Save history for undo
    this.saveStateToHistory();

    const n = this.currentLevel.detectives.length;
    const current = this.gridState[target][row][col];
    let nextVal: CellValue;

    if (manualVal !== undefined) {
      nextVal = manualVal;
    } else {
      // Cycle: 0 (Empty) -> 1 (Cross) -> 2 (Check) -> 0
      if (current === 0) nextVal = 1;
      else if (current === 1) nextVal = 2;
      else nextVal = 0;
    }

    this.gridState[target][row][col] = nextVal;
    this.movesCount++;

    // Smart auto-deduction: if cell is CHECK (2), cross out other cells in the same row & col in that subgrid
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
      // Cross-matrix deduction propagation
      this.propagateDeductions();
    }

    // Check if won
    this.checkVictoryCondition();
  }

  private saveStateToHistory() {
    const cloneMatrix = (m: CellValue[][]) => m.map(row => [...row]);
    this.history.push({
      AB: cloneMatrix(this.gridState.AB),
      AC: cloneMatrix(this.gridState.AC),
      BC: cloneMatrix(this.gridState.BC)
    });
    // Cap history size
    if (this.history.length > 50) this.history.shift();
  }

  public undo(): boolean {
    if (this.history.length === 0 || this.isCompleted) return false;
    const previous = this.history.pop()!;
    this.gridState = previous;
    return true;
  }

  public resetGrid() {
    this.saveStateToHistory();
    const n = this.currentLevel.detectives.length;
    this.gridState = this.createEmptyGrid(n);
  }

  public toggleClueRead(index: number) {
    if (this.cluesRead.has(index)) {
      this.cluesRead.delete(index);
    } else {
      this.cluesRead.add(index);
    }
  }

  public propagateDeductions() {
    const n = this.currentLevel.detectives.length;
    let changed = true;
    let loops = 0;

    while (changed && loops < 5) {
      changed = false;
      loops++;

      // If AB[d][p] == 2 and AC[d][c] == 2 => BC[p][c] = 2
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

      // If BC[p][c] == 2 and AB[d][p] == 2 => AC[d][c] = 2
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

  public applyStepHint(): { message: string; applied: boolean } {
    const hints = this.currentLevel.stepHints;
    for (const h of hints) {
      if (this.gridState[h.target][h.row][h.col] !== h.val) {
        this.toggleCell(h.target, h.row, h.col, h.val);
        this.hintsUsed++;
        return { message: h.explanation, applied: true };
      }
    }
    // If all pre-defined hints are already filled, reveal any unassigned correct cell
    const lvl = this.currentLevel;
    for (const sol of lvl.solution) {
      const dIdx = lvl.detectives.findIndex(d => d.id === sol.detectiveId);
      const pIdx = lvl.paintings.findIndex(p => p.id === sol.paintingId);
      const cIdx = lvl.clues.findIndex(c => c.id === sol.clueId);

      if (this.gridState.AB[dIdx][pIdx] !== 2) {
        this.toggleCell('AB', dIdx, pIdx, 2);
        this.hintsUsed++;
        return { message: `Deduction: ${lvl.detectives[dIdx].name} investigates '${lvl.paintings[pIdx].name}'!`, applied: true };
      }
      if (this.gridState.AC[dIdx][cIdx] !== 2) {
        this.toggleCell('AC', dIdx, cIdx, 2);
        this.hintsUsed++;
        return { message: `Deduction: ${lvl.detectives[dIdx].name} found '${lvl.clues[cIdx].name}'!`, applied: true };
      }
      if (this.gridState.BC[pIdx][cIdx] !== 2) {
        this.toggleCell('BC', pIdx, cIdx, 2);
        this.hintsUsed++;
        return { message: `Deduction: '${lvl.paintings[pIdx].name}' links to '${lvl.clues[cIdx].name}'!`, applied: true };
      }
    }

    return { message: "You have already completed all essential deductions! Check the solution.", applied: false };
  }

  public checkVictoryCondition(): boolean {
    const lvl = this.currentLevel;
    let allMatchesFound = true;

    for (const sol of lvl.solution) {
      const dIdx = lvl.detectives.findIndex(d => d.id === sol.detectiveId);
      const pIdx = lvl.paintings.findIndex(p => p.id === sol.paintingId);
      const cIdx = lvl.clues.findIndex(c => c.id === sol.clueId);

      if (this.gridState.AB[dIdx][pIdx] !== 2 || 
          this.gridState.AC[dIdx][cIdx] !== 2 || 
          this.gridState.BC[pIdx][cIdx] !== 2) {
        allMatchesFound = false;
        break;
      }
    }

    if (allMatchesFound && !this.isCompleted) {
      this.isCompleted = true;
      this.elapsedSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
      
      // Unlock next level
      const nextLevel = this.currentLevelIndex + 2;
      if (nextLevel > this.unlockedLevel) {
        this.unlockedLevel = nextLevel;
        this.saveProgress();
      }

      // Platform notification
      this.notifyPlatformWin(this.elapsedSeconds);
      return true;
    }

    return false;
  }

  public notifyPlatformWin(timeInSeconds: number) {
    try {
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
      }
    } catch (e) {
      console.log('Platform postMessage win event sent', e);
    }
  }

  public getSummaryDeductions(): { detective: ItemInfo; painting?: ItemInfo; clue?: ItemInfo; isComplete: boolean }[] {
    const lvl = this.currentLevel;
    const n = lvl.detectives.length;
    const list = [];

    for (let d = 0; d < n; d++) {
      const det = lvl.detectives[d];
      let pFound: ItemInfo | undefined;
      let cFound: ItemInfo | undefined;

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
}

export const game = new GameEngine();
