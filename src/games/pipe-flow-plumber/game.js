
function triggerPlatformWin(timeInSeconds) {
    const elapsed = Math.round(timeInSeconds || 45);
    try {
        if (typeof window.onWin === 'function') {
            window.onWin(elapsed);
        }
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'win', time: elapsed }, '*');
        }
    } catch(e) { console.error('Platform win notify error:', e); }
}
(() => {
  // pipe-flow-plumber/src/levels.ts
  function getPipeOpenings(type, rotationDeg) {
    const rotSteps = Math.floor((rotationDeg % 360 + 360) % 360 / 90);
    let base = [];
    switch (type) {
      case "straight":
        base = [1, 3];
        break;
      case "elbow":
        base = [1, 2];
        break;
      case "tee":
        base = [3, 1, 2];
        break;
      case "cross":
        base = [0, 1, 2, 3];
        break;
      case "start":
        base = [1];
        break;
      case "end":
        base = [3];
        break;
      default:
        return [];
    }
    return base.map((dir) => (dir + rotSteps) % 4);
  }
  var LEVELS = [
    // Level 1: Tutorial / Easy 3x3
    {
      id: 1,
      name: "First Steps",
      rows: 3,
      cols: 3,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 2, col: 2, dir: 2 },
      parMoves: 3,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 90 }
          // needs to connect Left to Bottom -> rot 90 (Bottom, Left)
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
          // needs vertical (Top, Bottom)
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "end", rotation: 90, locked: true }
          // receives from Top
        ]
      ]
    },
    // Level 2: S-Bend
    {
      id: 2,
      name: "Simple Curve",
      rows: 3,
      cols: 4,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 2, col: 3, dir: 1 },
      parMoves: 4,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "elbow", rotation: 0, correctRotation: 0 },
          // Right, Bottom
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 270 },
          // Top, Right
          { type: "elbow", rotation: 180, correctRotation: 0 },
          // Right, Bottom
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          // Top, Right
          { type: "end", rotation: 0, locked: true }
          // receives from left
        ]
      ]
    },
    // Level 3: T-Junctions & Decoys
    {
      id: 3,
      name: "T-Junction Split",
      rows: 4,
      cols: 4,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 3, col: 3, dir: 2 },
      parMoves: 5,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 90, correctRotation: 0 },
          // Left, Right, Bottom
          { type: "elbow", rotation: 180, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "straight", rotation: 90, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 270 },
          { type: "tee", rotation: 180, correctRotation: 180 },
          // Right, Left, Top
          { type: "elbow", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "end", rotation: 90, locked: true }
        ]
      ]
    },
    // Level 4: Pipeline Maze
    {
      id: 4,
      name: "The Crossway",
      rows: 4,
      cols: 5,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 3, col: 4, dir: 1 },
      parMoves: 6,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "tee", rotation: 90, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "end", rotation: 0, locked: true }
        ]
      ]
    },
    // Level 5: Pressure Valley
    {
      id: 5,
      name: "Pressure Valley",
      rows: 4,
      cols: 6,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 2, col: 5, dir: 1 },
      parMoves: 7,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 0, correctRotation: 180 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 270 },
          { type: "elbow", rotation: 0, correctRotation: 180 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 270 },
          { type: "end", rotation: 0, locked: true }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ]
      ]
    },
    // Level 6: Aqueduct Grid
    {
      id: 6,
      name: "Aqueduct Grid",
      rows: 4,
      cols: 6,
      start: { row: 1, col: 0, dir: 1 },
      end: { row: 1, col: 5, dir: 1 },
      parMoves: 8,
      grid: [
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "start", rotation: 0, locked: true },
          { type: "tee", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "tee", rotation: 270, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "end", rotation: 0, locked: true }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 180 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ]
      ]
    },
    // Level 7: Dual Branch
    {
      id: 7,
      name: "Dual Branch",
      rows: 4,
      cols: 7,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 3, col: 6, dir: 1 },
      parMoves: 10,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 180, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 90, correctRotation: 180 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 180 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "end", rotation: 0, locked: true }
        ]
      ]
    },
    // Level 8: THE SCREENSHOT REPLICA (8x4 Grid!)
    // Look at image_20260921_224454.webp:
    // 8 cols x 4 rows
    // Start at (0, 0)
    // End at (1, 7) or (2, 7)
    {
      id: 8,
      name: "Pipe Flow Plumber",
      rows: 4,
      cols: 8,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 1, col: 7, dir: 2 },
      parMoves: 9,
      grid: [
        // Row 0
        [
          { type: "start", rotation: 0, locked: true },
          { type: "elbow", rotation: 0, correctRotation: 0 },
          // Right, Bottom (connected to start)
          { type: "elbow", rotation: 0, correctRotation: 0 },
          // Bottom, Right
          { type: "straight", rotation: 0, correctRotation: 0 },
          // Left, Right
          { type: "tee", rotation: 0, correctRotation: 0 },
          // Left, Right, Bottom
          { type: "elbow", rotation: 90, correctRotation: 90 },
          // Left, Bottom
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 }
        ],
        // Row 1
        [
          { type: "elbow", rotation: 90, correctRotation: 90 },
          { type: "elbow", rotation: 270, correctRotation: 270 },
          // Top, Right
          { type: "elbow", rotation: 180, correctRotation: 180 },
          // Left, Top
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          // Top, Bottom
          { type: "elbow", rotation: 180, correctRotation: 0 },
          // Right, Bottom
          { type: "end", rotation: 90, locked: true }
          // nozzle spraying down
        ],
        // Row 2
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 270 },
          { type: "elbow", rotation: 180, correctRotation: 180 },
          { type: "elbow", rotation: 90, correctRotation: 90 },
          { type: "tee", rotation: 0, correctRotation: 180 },
          // In screenshot: grey T-junction highlighted in cyan with ⟳
          { type: "empty", rotation: 0 },
          { type: "tee", rotation: 270, correctRotation: 90 },
          // Grey T-junction at (2,6)
          { type: "elbow", rotation: 270, correctRotation: 180 }
          // Connects up to End
        ],
        // Row 3
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "empty", rotation: 0 }
        ]
      ]
    },
    // Level 9: Industrial Matrix
    {
      id: 9,
      name: "Industrial Matrix",
      rows: 4,
      cols: 8,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 3, col: 7, dir: 1 },
      parMoves: 12,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "elbow", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "elbow", rotation: 90, correctRotation: 270 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 180, correctRotation: 180 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 0, correctRotation: 180 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "end", rotation: 0, locked: true }
        ]
      ]
    },
    // Level 10: Grand Reservoir
    {
      id: 10,
      name: "Grand Reservoir",
      rows: 5,
      cols: 8,
      start: { row: 0, col: 0, dir: 1 },
      end: { row: 4, col: 7, dir: 1 },
      parMoves: 14,
      grid: [
        [
          { type: "start", rotation: 0, locked: true },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 180, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 180, correctRotation: 180 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "cross", rotation: 0, correctRotation: 0 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "tee", rotation: 0, correctRotation: 180 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 },
          { type: "empty", rotation: 0 },
          { type: "straight", rotation: 0, correctRotation: 90 }
        ],
        [
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "elbow", rotation: 270, correctRotation: 180 },
          { type: "empty", rotation: 0 },
          { type: "elbow", rotation: 0, correctRotation: 270 },
          { type: "straight", rotation: 90, correctRotation: 0 },
          { type: "end", rotation: 0, locked: true }
        ]
      ]
    }
  ];

  // pipe-flow-plumber/src/procedural.ts
  var dr = [-1, 0, 1, 0];
  var dc = [0, 1, 0, -1];
  function generateProceduralLevel(options = {}) {
    const levelNum = options.levelNumber || 1;
    let rows = options.rows;
    let cols = options.cols;
    if (!rows || !cols) {
      if (levelNum === 1) {
        rows = 3;
        cols = 3;
      } else if (levelNum <= 4) {
        rows = 4;
        cols = 4;
      } else if (levelNum <= 7) {
        rows = 4;
        cols = 5;
      } else if (levelNum <= 10) {
        rows = 5;
        cols = 5;
      } else {
        rows = 5;
        cols = 6;
      }
    }
    const totalCells = rows * cols;
    const desiredMinLen = options.minPathLength || Math.min(
      Math.max(4, Math.floor(totalCells * 0.45)),
      totalCells - 2
    );
    let bestPath = null;
    let startPos = { row: 0, col: 0 };
    let endPos = { row: rows - 1, col: cols - 1 };
    for (let attempt = 0; attempt < 80; attempt++) {
      const corners = [
        { start: { row: 0, col: 0 }, end: { row: rows - 1, col: cols - 1 } },
        { start: { row: 0, col: cols - 1 }, end: { row: rows - 1, col: 0 } },
        { start: { row: 0, col: Math.floor(cols / 2) }, end: { row: rows - 1, col: Math.floor(cols / 2) } },
        { start: { row: Math.floor(rows / 2), col: 0 }, end: { row: Math.floor(rows / 2), col: cols - 1 } }
      ];
      const pair = corners[Math.floor(Math.random() * corners.length)];
      startPos = pair.start;
      endPos = pair.end;
      const visited = /* @__PURE__ */ new Set();
      visited.add(`${startPos.row},${startPos.col}`);
      const currentPath = [{ r: startPos.row, c: startPos.col }];
      const targetLen = Math.max(4, desiredMinLen - Math.floor(attempt / 10));
      if (findWindingPath(startPos, endPos, rows, cols, visited, currentPath, targetLen)) {
        bestPath = currentPath;
        break;
      }
    }
    if (!bestPath) {
      startPos = { row: 0, col: 0 };
      endPos = { row: rows - 1, col: cols - 1 };
      bestPath = generateFallbackPath(startPos, endPos);
    }
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          type: "empty",
          rotation: 0
        });
      }
      grid.push(row);
    }
    const pathSet = /* @__PURE__ */ new Set();
    bestPath.forEach((p) => pathSet.add(`${p.r},${p.c}`));
    const p0 = bestPath[0];
    const p1 = bestPath[1];
    const startOutDir = getDirection(p0.r, p0.c, p1.r, p1.c);
    const startRotSteps = (startOutDir - 1 + 4) % 4;
    const startRot = startRotSteps * 90;
    grid[p0.r][p0.c] = {
      type: "start",
      rotation: startRot,
      correctRotation: startRot,
      locked: true
    };
    const pLast = bestPath[bestPath.length - 1];
    const pPrev = bestPath[bestPath.length - 2];
    const endInDir = getDirection(pPrev.r, pPrev.c, pLast.r, pLast.c);
    const endFacingDir = (endInDir + 2) % 4;
    const endRotSteps = (endFacingDir - 3 + 4) % 4;
    const endRot = endRotSteps * 90;
    grid[pLast.r][pLast.c] = {
      type: "end",
      rotation: endRot,
      correctRotation: endRot,
      locked: true
    };
    for (let i = 1; i < bestPath.length - 1; i++) {
      const curr = bestPath[i];
      const prev = bestPath[i - 1];
      const next = bestPath[i + 1];
      const inDir = getDirection(prev.r, prev.c, curr.r, curr.c);
      const outDir = getDirection(curr.r, curr.c, next.r, next.c);
      const d1 = (inDir + 2) % 4;
      const d2 = outDir;
      let type;
      let correctRot;
      if ((d1 + 2) % 4 === d2) {
        type = "straight";
        correctRot = d1 === 0 || d1 === 2 ? 90 : 0;
      } else {
        type = "elbow";
        correctRot = findElbowRotation(d1, d2);
      }
      const scrambleStep = Math.floor(Math.random() * 3) + 1;
      const scrambledRot = (correctRot + scrambleStep * 90) % 360;
      grid[curr.r][curr.c] = {
        type,
        rotation: scrambledRot,
        correctRotation: correctRot,
        locked: false
      };
    }
    const fillerTypes = ["elbow", "straight", "elbow", "straight", "tee"];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!pathSet.has(`${r},${c}`)) {
          const randType = fillerTypes[Math.floor(Math.random() * fillerTypes.length)];
          const randRot = Math.floor(Math.random() * 4) * 90;
          grid[r][c] = {
            type: randType,
            rotation: randRot,
            correctRotation: randRot,
            locked: false
          };
        }
      }
    }
    let minRequiredClicks = 0;
    for (let i = 1; i < bestPath.length - 1; i++) {
      const curr = bestPath[i];
      const tile = grid[curr.r][curr.c];
      if (tile.correctRotation !== void 0 && tile.rotation !== void 0) {
        const diffDeg = ((tile.correctRotation - tile.rotation) % 360 + 360) % 360;
        const clicks = Math.round(diffDeg / 90);
        minRequiredClicks += clicks;
      }
    }
    const parMoves = Math.max(2, minRequiredClicks);
    return {
      id: levelNum,
      name: `Level ${levelNum}`,
      rows,
      cols,
      start: { row: startPos.row, col: startPos.col, dir: startOutDir },
      end: { row: endPos.row, col: endPos.col, dir: endFacingDir },
      parMoves,
      grid
    };
  }
  function findWindingPath(curr, target, rows, cols, visited, path, minLen) {
    if (curr.row === target.row && curr.col === target.col) {
      return path.length >= minLen;
    }
    const dirs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    for (const d of dirs) {
      const nr = curr.row + dr[d];
      const nc = curr.col + dc[d];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const key = `${nr},${nc}`;
        if (!visited.has(key)) {
          if (nr === target.row && nc === target.col && path.length < minLen - 1) {
            continue;
          }
          visited.add(key);
          path.push({ r: nr, c: nc });
          if (findWindingPath({ row: nr, col: nc }, target, rows, cols, visited, path, minLen)) {
            return true;
          }
          path.pop();
          visited.delete(key);
        }
      }
    }
    return false;
  }
  function generateFallbackPath(start, end) {
    const path = [{ r: start.row, c: start.col }];
    let cr = start.row;
    let cc = start.col;
    while (cr !== end.row || cc !== end.col) {
      if (cr < end.row) {
        cr++;
      } else if (cr > end.row) {
        cr--;
      } else if (cc < end.col) {
        cc++;
      } else if (cc > end.col) {
        cc--;
      }
      path.push({ r: cr, c: cc });
    }
    return path;
  }
  function getDirection(r1, c1, r2, c2) {
    if (r2 < r1) return 0;
    if (c2 > c1) return 1;
    if (r2 > r1) return 2;
    return 3;
  }
  function findElbowRotation(d1, d2) {
    for (const rot of [0, 90, 180, 270]) {
      const openings = getPipeOpenings("elbow", rot);
      if (openings.includes(d1) && openings.includes(d2)) {
        return rot;
      }
    }
    return 0;
  }

  // pipe-flow-plumber/src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.waterGain = null;
      this.waterSource = null;
      const saved = localStorage.getItem("pipe_flow_sound");
      if (saved !== null) {
        this.isMuted = saved === "false";
      }
    }
    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    get muted() {
      return this.isMuted;
    }
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("pipe_flow_sound", String(!this.isMuted));
      if (this.isMuted && this.waterGain) {
        this.waterGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
      }
      return !this.isMuted;
    }
    playRotate() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(650, now + 0.01);
      clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.035);
      clickGain.gain.setValueAtTime(0.15, now + 0.01);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now + 0.01);
      clickOsc.stop(now + 0.04);
    }
    playWaterBurst() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.35;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(750, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);
      filter.Q.value = 3;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    }
    playLevelComplete() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(1e-3, noteTime + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.45);
      });
      setTimeout(() => this.playWaterBurst(), 200);
    }
    playClick() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.03);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    }
    playHint() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };
  var soundManager = new SoundManager();

  // pipe-flow-plumber/src/game.ts
  var GameManager = class {
    constructor() {
      this.currentLevelId = 1;
      this.moves = 0;
      this.bestMoves = {};
      this.levelStars = {};
      this.unlockedLevels = 1;
      this.isProcedural = true;
      this.grid = [];
      this.undoStack = [];
      this.isCompleted = false;
      this.loadSave();
      const defaultLevel = Math.min(this.unlockedLevels || 1, 10);
      this.loadLevel(defaultLevel, true);
    }
    loadSave() {
      try {
        const data = localStorage.getItem("pipe_flow_save");
        if (data) {
          const parsed = JSON.parse(data);
          this.unlockedLevels = Math.max(1, parsed.unlockedLevels || 1);
          this.bestMoves = parsed.bestMoves || {};
          this.levelStars = parsed.levelStars || {};
        }
      } catch {
        this.unlockedLevels = 1;
        this.bestMoves = {};
        this.levelStars = {};
      }
    }
    saveGame() {
      try {
        localStorage.setItem(
          "pipe_flow_save",
          JSON.stringify({
            unlockedLevels: this.unlockedLevels,
            bestMoves: this.bestMoves,
            levelStars: this.levelStars
          })
        );
      } catch {
      }
    }
    getTotalStars() {
      return Object.values(this.levelStars).reduce((acc, s) => acc + s, 0);
    }
    calculateStars(moves, parMoves) {
      const par = Math.max(2, parMoves || 3);
      if (moves <= par + 1) return 3;
      if (moves <= par + 4) return 2;
      return 1;
    }
    finishLevel() {
      this.isCompleted = true;
      const isNewBest = !this.bestMoves[this.currentLevelId] || this.moves < this.bestMoves[this.currentLevelId];
      if (isNewBest) {
        this.bestMoves[this.currentLevelId] = this.moves;
      }
      const par = this.currentLevelConfig?.parMoves || 4;
      const stars = this.calculateStars(this.moves, par);
      const prevStars = this.levelStars[this.currentLevelId] || 0;
      if (stars > prevStars) {
        this.levelStars[this.currentLevelId] = stars;
      }
      const nextId = this.currentLevelId + 1;
      if (nextId <= 10 && nextId > this.unlockedLevels) {
        this.unlockedLevels = nextId;
      }
      this.saveGame();
      soundManager.playLevelComplete();
      this.onLevelComplete?.(this.currentLevelId, this.moves, isNewBest, stars);
    }
    loadLevel(levelId, useProcedural = this.isProcedural) {
      let config;
      if (useProcedural) {
        config = generateProceduralLevel({ levelNumber: levelId });
      } else {
        config = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
      }
      this.currentLevelId = config.id;
      this.currentLevelConfig = config;
      this.moves = 0;
      this.undoStack = [];
      this.isCompleted = false;
      this.grid = [];
      for (let r = 0; r < config.rows; r++) {
        const row = [];
        for (let c = 0; c < config.cols; c++) {
          const cell = config.grid[r][c];
          const rot = cell.rotation % 360;
          row.push({
            row: r,
            col: c,
            type: cell.type,
            rotation: rot,
            displayRotation: rot,
            targetRotation: rot,
            isRotating: false,
            hasWater: false,
            waterFlowProgress: 0,
            locked: !!cell.locked,
            correctRotation: cell.correctRotation
          });
        }
        this.grid.push(row);
      }
      this.computeWaterFlow(false);
      this.onStateChange?.();
    }
    rotateTile(row, col) {
      if (this.isCompleted) return;
      const tile = this.grid[row]?.[col];
      if (!tile || tile.locked || tile.type === "empty") return;
      const prevRot = tile.targetRotation;
      const newRot = (prevRot + 90) % 360;
      tile.targetRotation = newRot;
      tile.rotation = newRot;
      tile.isRotating = true;
      this.undoStack.push({
        row,
        col,
        prevRotation: prevRot,
        newRotation: newRot
      });
      this.moves++;
      soundManager.playRotate();
      const reachedEnd = this.computeWaterFlow(true);
      this.onStateChange?.();
      if (reachedEnd && !this.isCompleted) {
        this.finishLevel();
      }
    }
    undo() {
      if (this.isCompleted || this.undoStack.length === 0) return;
      const lastMove = this.undoStack.pop();
      if (!lastMove) return;
      const tile = this.grid[lastMove.row]?.[lastMove.col];
      if (!tile) return;
      tile.targetRotation = lastMove.prevRotation;
      tile.rotation = lastMove.prevRotation;
      tile.isRotating = true;
      if (this.moves > 0) this.moves--;
      soundManager.playRotate();
      this.computeWaterFlow(true);
      this.onStateChange?.();
    }
    resetLevel(generateNewProcedural = true) {
      if (this.isProcedural && generateNewProcedural) {
        this.loadLevel(this.currentLevelId, true);
      } else {
        this.loadLevel(this.currentLevelId, false);
      }
    }
    nextLevel() {
      const nextId = this.currentLevelId + 1;
      this.loadLevel(nextId, this.isProcedural);
    }
    computeWaterFlow(playSoundEffect = false) {
      const config = this.currentLevelConfig;
      const rows = config.rows;
      const cols = config.cols;
      const prevWaterState = this.grid.map((row) => row.map((t) => t.hasWater));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this.grid[r][c].hasWater = false;
        }
      }
      const queue = [];
      const visited = /* @__PURE__ */ new Set();
      const startTile = this.grid[config.start.row][config.start.col];
      if (startTile) {
        startTile.hasWater = true;
        queue.push({ r: config.start.row, c: config.start.col });
        visited.add(`${config.start.row},${config.start.col}`);
      }
      let endTileConnected = false;
      const dr2 = [-1, 0, 1, 0];
      const dc2 = [0, 1, 0, -1];
      while (queue.length > 0) {
        const current = queue.shift();
        const tile = this.grid[current.r][current.c];
        const openings = getPipeOpenings(tile.type, tile.targetRotation);
        for (const dir of openings) {
          const nr = current.r + dr2[dir];
          const nc = current.c + dc2[dir];
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = this.grid[nr][nc];
            if (neighbor.type === "empty") continue;
            const requiredDir = (dir + 2) % 4;
            const neighborOpenings = getPipeOpenings(neighbor.type, neighbor.targetRotation);
            if (neighborOpenings.includes(requiredDir)) {
              const key = `${nr},${nc}`;
              if (!visited.has(key)) {
                visited.add(key);
                neighbor.hasWater = true;
                queue.push({ r: nr, c: nc });
                if (neighbor.type === "end") {
                  endTileConnected = true;
                }
              }
            }
          }
        }
      }
      if (playSoundEffect) {
        let newlyFilled = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (this.grid[r][c].hasWater && !prevWaterState[r][c]) {
              newlyFilled++;
            }
          }
        }
        if (newlyFilled > 0 && !endTileConnected) {
          soundManager.playWaterBurst();
        }
      }
      return endTileConnected;
    }
    getHint() {
      for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          const tile = this.grid[r][c];
          if (!tile.locked && tile.type !== "empty" && tile.correctRotation !== void 0 && tile.targetRotation % 360 !== tile.correctRotation % 360) {
            return { row: r, col: c, targetRot: tile.correctRotation };
          }
        }
      }
      return null;
    }
    applyHint() {
      const hint = this.getHint();
      if (!hint) return false;
      const tile = this.grid[hint.row]?.[hint.col];
      if (!tile) return false;
      this.undoStack.push({
        row: hint.row,
        col: hint.col,
        prevRotation: tile.targetRotation,
        newRotation: hint.targetRot
      });
      tile.targetRotation = hint.targetRot;
      tile.rotation = hint.targetRot;
      tile.isRotating = true;
      this.moves++;
      soundManager.playHint();
      const reachedEnd = this.computeWaterFlow(true);
      this.onStateChange?.();
      if (reachedEnd && !this.isCompleted) {
        this.finishLevel();
      }
      return true;
    }
  };

  // pipe-flow-plumber/src/renderer.ts
  var PipeRenderer = class {
    constructor(canvas) {
      this.dpr = 1;
      this.cssWidth = 0;
      this.cssHeight = 0;
      // Grid layout geometry
      this.rows = 4;
      this.cols = 8;
      this.tileSize = 70;
      this.tileGap = 10;
      this.gridOffsetX = 0;
      this.gridOffsetY = 0;
      // Hover and selection
      this.hoveredTile = null;
      // Dynamic animations
      this.particles = [];
      this.bubbles = [];
      this.animFrameId = 0;
      this.lastTime = 0;
      this.isCompleted = false;
      this.victoryPulse = 0;
      this.canvas = canvas;
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) throw new Error("Could not get Canvas 2D context");
      this.ctx = context;
      for (let i = 0; i < 40; i++) {
        this.bubbles.push({
          x: Math.random(),
          y: Math.random(),
          offset: Math.random() * Math.PI * 2,
          speed: 0.8 + Math.random() * 1.4,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.5
        });
      }
    }
    resize(containerWidth, containerHeight, rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cssWidth = Math.max(260, Math.floor(containerWidth));
      this.cssHeight = Math.max(260, Math.floor(containerHeight));
      const pixelWidth = Math.floor(this.cssWidth * this.dpr);
      const pixelHeight = Math.floor(this.cssHeight * this.dpr);
      if (this.canvas.width !== pixelWidth) {
        this.canvas.width = pixelWidth;
      }
      if (this.canvas.height !== pixelHeight) {
        this.canvas.height = pixelHeight;
      }
      const cssWidthStr = `${this.cssWidth}px`;
      const cssHeightStr = `${this.cssHeight}px`;
      if (this.canvas.style.width !== cssWidthStr) {
        this.canvas.style.width = cssWidthStr;
      }
      if (this.canvas.style.height !== cssHeightStr) {
        this.canvas.style.height = cssHeightStr;
      }
      const paddingX = Math.min(32, this.cssWidth * 0.06);
      const paddingY = Math.min(32, this.cssHeight * 0.06);
      const availableWidth = Math.max(120, this.cssWidth - paddingX * 2);
      const availableHeight = Math.max(120, this.cssHeight - paddingY * 2);
      const maxTileW = (availableWidth - (this.cols - 1) * 8) / this.cols;
      const maxTileH = (availableHeight - (this.rows - 1) * 8) / this.rows;
      this.tileSize = Math.max(24, Math.floor(Math.min(maxTileW, maxTileH, 84)));
      this.tileGap = Math.max(4, Math.floor(this.tileSize * 0.12));
      const totalGridW = this.cols * this.tileSize + (this.cols - 1) * this.tileGap;
      const totalGridH = this.rows * this.tileSize + (this.rows - 1) * this.tileGap;
      this.gridOffsetX = Math.floor((this.cssWidth - totalGridW) / 2);
      this.gridOffsetY = Math.floor((this.cssHeight - totalGridH) / 2);
    }
    safeRoundRect(ctx, x, y, w, h, r) {
      if (w <= 0 || h <= 0) return;
      const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
      if (typeof ctx.roundRect === "function") {
        try {
          ctx.roundRect(x, y, w, h, radius);
          return;
        } catch {
        }
      }
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }
    getTileAt(canvasX, canvasY) {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const x = this.gridOffsetX + c * (this.tileSize + this.tileGap);
          const y = this.gridOffsetY + r * (this.tileSize + this.tileGap);
          if (canvasX >= x && canvasX <= x + this.tileSize && canvasY >= y && canvasY <= y + this.tileSize) {
            return { row: r, col: c };
          }
        }
      }
      return null;
    }
    render(grid, timestamp) {
      const dt = this.lastTime ? Math.min((timestamp - this.lastTime) / 1e3, 0.1) : 0.016;
      this.lastTime = timestamp;
      const ctx = this.ctx;
      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
      if (this.isCompleted) {
        this.victoryPulse += dt * 4;
      }
      this.drawBoardBackground(ctx);
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const tile = grid[r][c];
          if (!tile) continue;
          if (Math.abs(tile.targetRotation - tile.displayRotation) > 0.05) {
            tile.displayRotation += (tile.targetRotation - tile.displayRotation) * 0.22;
            if (Math.abs(tile.targetRotation - tile.displayRotation) <= 0.05) {
              tile.displayRotation = tile.targetRotation;
              tile.isRotating = false;
            }
          }
          const x = this.gridOffsetX + c * (this.tileSize + this.tileGap);
          const y = this.gridOffsetY + r * (this.tileSize + this.tileGap);
          const isHovered = this.hoveredTile?.row === r && this.hoveredTile?.col === c;
          this.drawTile(ctx, tile, x, y, isHovered, timestamp);
        }
      }
      this.updateAndDrawParticles(ctx, dt, grid);
      ctx.restore();
    }
    drawBoardBackground(ctx) {
      const totalGridW = this.cols * this.tileSize + (this.cols - 1) * this.tileGap;
      const totalGridH = this.rows * this.tileSize + (this.rows - 1) * this.tileGap;
      const pad = 14;
      const bx = this.gridOffsetX - pad;
      const by = this.gridOffsetY - pad;
      const bw = totalGridW + pad * 2;
      const bh = totalGridH + pad * 2;
      const r = 24;
      ctx.save();
      ctx.beginPath();
      this.safeRoundRect(ctx, bx, by, bw, bh, r);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(203, 213, 225, 0.7)";
      ctx.stroke();
      const dotSpacing = 20;
      ctx.fillStyle = "rgba(148, 163, 184, 0.3)";
      for (let x = bx + 16; x < bx + bw - 10; x += dotSpacing) {
        for (let y = by + 16; y < by + bh - 10; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    drawTile(ctx, tile, x, y, isHovered, timestamp) {
      const size = this.tileSize;
      const radius = Math.min(14, size * 0.2);
      ctx.save();
      ctx.beginPath();
      this.safeRoundRect(ctx, x, y, size, size, radius);
      ctx.shadowColor = "rgba(15, 23, 42, 0.09)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      const tileGrad = ctx.createLinearGradient(x, y, x, y + size);
      tileGrad.addColorStop(0, "#f8fafc");
      tileGrad.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = tileGrad;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.stroke();
      if (isHovered && !tile.locked && tile.type !== "empty") {
        ctx.beginPath();
        this.safeRoundRect(ctx, x - 1, y - 1, size + 2, size + 2, radius + 1);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        const badgeR = 11;
        const bx = x + size - badgeR - 4;
        const by = y + badgeR + 4;
        ctx.beginPath();
        ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
        ctx.fillStyle = "#bae6fd";
        ctx.shadowColor = "rgba(14, 165, 233, 0.4)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "#0284c7";
        ctx.stroke();
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(timestamp * 3e-3);
        ctx.strokeStyle = "#0369a1";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 0, 5, -Math.PI * 0.7, Math.PI * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(3, 4);
        ctx.lineTo(6, 1);
        ctx.lineTo(6, 6);
        ctx.fillStyle = "#0369a1";
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
      if (tile.type !== "empty") {
        ctx.save();
        const cx = x + size / 2;
        const cy = y + size / 2;
        ctx.translate(cx, cy);
        const rad = tile.displayRotation * Math.PI / 180;
        ctx.rotate(rad);
        this.drawPipeGeometry(ctx, tile.type, size, tile.hasWater, timestamp, tile);
        ctx.restore();
        if (tile.type === "start") {
          this.drawStartFixture(ctx, x, y, size, tile.hasWater, timestamp);
        } else if (tile.type === "end") {
          this.drawEndFixture(ctx, x, y, size, tile.hasWater, timestamp);
        }
      }
    }
    drawPipeGeometry(ctx, type, size, hasWater, timestamp, tile) {
      const pipeW = size * 0.36;
      const r = pipeW / 2;
      const half = size / 2 + 1;
      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.2)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      ctx.beginPath();
      if (type === "straight") {
        ctx.rect(-half, -r, half * 2, pipeW);
      } else if (type === "elbow") {
        ctx.arc(half, half, half + r, Math.PI, Math.PI * 1.5);
        ctx.arc(half, half, half - r, Math.PI * 1.5, Math.PI, true);
        ctx.closePath();
      } else if (type === "tee") {
        ctx.rect(-half, -r, half * 2, pipeW);
        ctx.rect(-r, 0, pipeW, half);
      } else if (type === "cross") {
        ctx.rect(-half, -r, half * 2, pipeW);
        ctx.rect(-r, -half, pipeW, half * 2);
      } else if (type === "start") {
        ctx.rect(-r * 0.6, -r, half + r * 0.6, pipeW);
      } else if (type === "end") {
        ctx.rect(-half, -r, half + r * 0.6, pipeW);
      }
      const baseGrad = ctx.createLinearGradient(0, -r, 0, r);
      baseGrad.addColorStop(0, "#94a3b8");
      baseGrad.addColorStop(0.25, "#cbd5e1");
      baseGrad.addColorStop(0.65, "#64748b");
      baseGrad.addColorStop(1, "#334155");
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.restore();
      this.drawFlanges(ctx, type, half, r, pipeW);
      if (hasWater) {
        this.drawWaterFlow(ctx, type, size, half, r, timestamp, tile);
      }
    }
    drawFlanges(ctx, type, half, r, pipeW) {
      const flangeThickness = 4;
      const flangeW = pipeW * 1.14;
      const flangeR = flangeW / 2;
      const drawRing = (cx, cy, isVertical) => {
        ctx.save();
        ctx.beginPath();
        if (isVertical) {
          ctx.roundRect(cx - flangeThickness / 2, cy - flangeR, flangeThickness, flangeW, 2);
        } else {
          ctx.roundRect(cx - flangeR, cy - flangeThickness / 2, flangeW, flangeThickness, 2);
        }
        const ringGrad = isVertical ? ctx.createLinearGradient(0, cy - flangeR, 0, cy + flangeR) : ctx.createLinearGradient(cx - flangeR, 0, cx + flangeR, 0);
        ringGrad.addColorStop(0, "#cbd5e1");
        ringGrad.addColorStop(0.3, "#f1f5f9");
        ringGrad.addColorStop(0.8, "#64748b");
        ringGrad.addColorStop(1, "#334155");
        ctx.fillStyle = ringGrad;
        ctx.fill();
        ctx.restore();
      };
      if (type === "straight") {
        drawRing(-half + 2, 0, true);
        drawRing(half - 2, 0, true);
      } else if (type === "elbow") {
        drawRing(half - 2, 0, true);
        drawRing(0, half - 2, false);
      } else if (type === "tee") {
        drawRing(-half + 2, 0, true);
        drawRing(half - 2, 0, true);
        drawRing(0, half - 2, false);
      } else if (type === "cross") {
        drawRing(-half + 2, 0, true);
        drawRing(half - 2, 0, true);
        drawRing(0, -half + 2, false);
        drawRing(0, half - 2, false);
      }
    }
    drawWaterFlow(ctx, type, size, half, r, timestamp, tile) {
      const innerW = r * 1.62;
      const innerR = innerW / 2;
      ctx.save();
      ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = this.isCompleted ? 14 : 7;
      ctx.beginPath();
      if (type === "straight") {
        ctx.rect(-half, -innerR, half * 2, innerW);
      } else if (type === "elbow") {
        ctx.arc(half, half, half + innerR, Math.PI, Math.PI * 1.5);
        ctx.arc(half, half, half - innerR, Math.PI * 1.5, Math.PI, true);
        ctx.closePath();
      } else if (type === "tee") {
        ctx.rect(-half, -innerR, half * 2, innerW);
        ctx.rect(-innerR, 0, innerW, half);
      } else if (type === "cross") {
        ctx.rect(-half, -innerR, half * 2, innerW);
        ctx.rect(-innerR, -half, innerW, half * 2);
      } else if (type === "start") {
        ctx.rect(-innerR * 0.4, -innerR, half + innerR * 0.4, innerW);
      } else if (type === "end") {
        ctx.rect(-half, -innerR, half + innerR * 0.4, innerW);
      }
      const waterGrad = ctx.createLinearGradient(0, -innerR, 0, innerR);
      waterGrad.addColorStop(0, "#38bdf8");
      waterGrad.addColorStop(0.22, "#e0f2fe");
      waterGrad.addColorStop(0.55, "#0284c7");
      waterGrad.addColorStop(1, "#0369a1");
      ctx.fillStyle = waterGrad;
      ctx.fill();
      const wavePhase = timestamp * 7e-3;
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      if (type === "straight" || type === "tee" || type === "cross" || type === "start" || type === "end") {
        const waveY = -innerR * 0.35 + Math.sin(wavePhase + tile.col) * 1.2;
        ctx.moveTo(-half, waveY);
        ctx.quadraticCurveTo(0, waveY + Math.cos(wavePhase) * 1.5, half, waveY);
        ctx.stroke();
      } else if (type === "elbow") {
        const arcR = half;
        ctx.beginPath();
        ctx.arc(half, half, arcR, Math.PI, Math.PI * 1.5);
        ctx.stroke();
      }
      for (let b = 0; b < 3; b++) {
        const bubbleTime = (timestamp * 1e-3 * 1.2 + b * 0.33 + tile.row * 0.2 + tile.col * 0.4) % 1;
        const bx = -half + bubbleTime * half * 2;
        const by = Math.sin(bubbleTime * Math.PI * 4 + b) * innerR * 0.4;
        if (bx > -half + 4 && bx < half - 4) {
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fill();
        }
      }
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.beginPath();
      ctx.moveTo(-half + 2, -innerR * 0.55);
      ctx.lineTo(half - 2, -innerR * 0.55);
      ctx.stroke();
      ctx.restore();
    }
    drawStartFixture(ctx, x, y, size, hasWater, timestamp) {
      const cx = x + size * 0.32;
      const cy = y + size * 0.5;
      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.25)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(cx - 5, cy - 16, 10, 16);
      ctx.beginPath();
      ctx.roundRect(cx - 14, cy - 20, 28, 8, 3);
      const wheelGrad = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0);
      wheelGrad.addColorStop(0, "#1d4ed8");
      wheelGrad.addColorStop(0.4, "#60a5fa");
      wheelGrad.addColorStop(0.8, "#1e40af");
      ctx.fillStyle = wheelGrad;
      ctx.fill();
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = "#2563eb";
      ctx.textAlign = "center";
      ctx.fillText("START", x + size / 2, y + size - 4);
      ctx.restore();
    }
    drawEndFixture(ctx, x, y, size, hasWater, timestamp) {
      const cx = x + size * 0.65;
      const cy = y + size * 0.5;
      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.25)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#0d9488";
      ctx.fillRect(cx - 5, cy - 12, 10, 24);
      ctx.beginPath();
      ctx.arc(cx + 4, cy + 4, 10, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.strokeStyle = "#0f766e";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.stroke();
      if (hasWater) {
        ctx.beginPath();
        ctx.moveTo(cx + 4, cy + 12);
        ctx.quadraticCurveTo(cx + 8, cy + 24, cx + 4, cy + size * 0.45);
        ctx.lineWidth = 4.5;
        ctx.strokeStyle = "#38bdf8";
        ctx.stroke();
        const dropY = cy + 14 + timestamp * 0.04 % 16;
        ctx.beginPath();
        ctx.arc(cx + 4, dropY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#0284c7";
        ctx.fill();
        if (this.isCompleted && Math.random() < 0.4) {
          this.spawnSplashParticle(cx + 4, cy + size * 0.45);
        }
      } else {
        ctx.beginPath();
        ctx.arc(cx + 4, cy + 14, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#0d9488";
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = "#0d9488";
      ctx.textAlign = "center";
      ctx.fillText("END", x + size / 2, y + size - 4);
      ctx.restore();
    }
    spawnSplashParticle(x, y) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.PI * 0.1 + Math.random() * Math.PI * 0.8;
        const speed = 40 + Math.random() * 80;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: -Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          alpha: 1,
          color: Math.random() > 0.4 ? "#38bdf8" : "#e0f2fe",
          life: 0,
          maxLife: 0.4 + Math.random() * 0.3
        });
      }
    }
    updateAndDrawParticles(ctx, dt, grid) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          this.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 180 * dt;
        p.alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }
    }
  };

  // pipe-flow-plumber/src/main.ts
  window.addEventListener("error", (e) => {
    if (typeof e.message === "string" && (e.message.includes("ResizeObserver loop completed with undelivered notifications") || e.message.includes("ResizeObserver loop limit exceeded"))) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
  var App = class {
    constructor() {
      this.resizeRafId = null;
      this.lastWidth = 0;
      this.lastHeight = 0;
      // Rewarded Ad timer
      this.adTimerInterval = null;
      const el = document.getElementById("app");
      if (!el) throw new Error("#app root element not found");
      this.appEl = el;
      this.game = new GameManager();
      this.renderLayout();
      this.initCanvasAndRenderer();
      this.bindEvents();
      this.updateHUD();
      this.game.onStateChange = () => {
        this.updateHUD();
        this.renderer.isCompleted = this.game.isCompleted;
      };
      this.game.onLevelComplete = (levelId, moves, isNewBest, stars) => {
        this.showVictoryModal(levelId, moves, isNewBest, stars);
      };
      this.startLoop();
    }
    renderLayout() {
      this.appEl.innerHTML = `
      <div id="game-card" class="lab-card w-full max-w-5xl mx-auto flex flex-col overflow-hidden relative border border-slate-200 shadow-2xl">
        
        <!-- TIER 1: TOP NAVIGATION -->
        <header class="header-glass w-full px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 shrink-0 border-b border-white/10">
          
          <!-- Left: Main Menu & Brand -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button id="btn-main-menu" class="btn-tactile-dark px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center gap-1.5 text-cyan-300 font-bold text-xs cursor-pointer shadow-sm" title="Main Menu">
              <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span class="text-[11px] sm:text-xs">MENU</span>
            </button>

            <!-- Pipe Flow Icon & Title -->
            <div class="flex items-center gap-1.5">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/30 shrink-0">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1">
                  <h1 class="text-xs sm:text-base font-extrabold text-white tracking-tight leading-none">
                    Pipe Flow Plumber
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Level Badge & Quick Utilities -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <!-- LEVEL Pill -->
            <button id="btn-levels-badge" class="bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 rounded-xl px-2 sm:px-2.5 py-1 text-center shrink-0 transition-all cursor-pointer" title="Select Level">
              <span class="block text-[7px] sm:text-[8px] font-bold text-cyan-400 uppercase tracking-wider">LEVEL</span>
              <span id="level-badge" class="font-black text-xs sm:text-sm text-white leading-none">1</span>
            </button>

            <!-- HINT Button -->
            <button id="btn-hint" class="btn-tactile-dark bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 sm:px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0 font-bold text-xs border border-amber-500/30 cursor-pointer" title="Get Hint">
              <svg class="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
              <span class="text-[10px] hidden sm:inline">HINT</span>
            </button>

            <!-- SOUND Toggle Button -->
            <button id="btn-sound" class="btn-tactile-dark w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center justify-center shrink-0 cursor-pointer" title="Sound (M)">
              <svg id="sound-icon-on" class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <svg id="sound-icon-off" class="w-3.5 h-3.5 text-rose-400 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>

            <!-- HELP / TUTORIAL Button -->
            <button id="btn-help" class="btn-tactile-dark w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center justify-center shrink-0 cursor-pointer" title="Instructions">
              <svg class="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- TIER 2: STATS & ACTION CONTROLS -->
        <div class="w-full bg-slate-900/95 border-b border-white/10 px-2.5 sm:px-5 py-1.5 flex items-center justify-between gap-1 text-xs shrink-0 select-none">
          <!-- Left: Counters (Moves, Target 3\u2B50, Best) -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- MOVES Counter -->
            <div class="bg-slate-800/90 border border-white/10 rounded-lg px-2 py-0.5 text-center min-w-[48px] sm:min-w-[56px]">
              <span class="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider">MOVES</span>
              <span id="moves-counter" class="font-extrabold text-xs sm:text-sm text-white leading-none">0</span>
            </div>

            <!-- PAR / TARGET 3-STARS Counter -->
            <div class="bg-slate-800/90 border border-amber-400/30 rounded-lg px-2 py-0.5 text-center min-w-[52px] sm:min-w-[62px]" title="Maximum moves for 3 stars">
              <span class="block text-[7px] sm:text-[8px] font-bold text-amber-400 uppercase tracking-wider">TARGET 3\u2B50</span>
              <span id="par-counter" class="font-extrabold text-xs sm:text-sm text-amber-300 leading-none">\u2264 4</span>
            </div>

            <!-- BEST Counter -->
            <div class="bg-slate-800/90 border border-white/10 rounded-lg px-2 py-0.5 text-center min-w-[48px] sm:min-w-[56px] hidden xs:block">
              <span class="block text-[7px] sm:text-[8px] font-bold text-emerald-400 uppercase tracking-wider">BEST</span>
              <span id="best-counter" class="font-extrabold text-xs sm:text-sm text-emerald-300 leading-none">-</span>
            </div>
          </div>

          <!-- Right: Undo and Reset buttons -->
          <div class="flex items-center gap-1 sm:gap-1.5">
            <!-- UNDO Button -->
            <button id="btn-undo" class="btn-tactile-dark bg-slate-800/90 hover:bg-slate-700 text-white px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 font-bold text-[11px] border border-white/15 disabled:opacity-40 disabled:pointer-events-none cursor-pointer" title="Undo Move (Z)">
              <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M3 7v6h6"/>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
              </svg>
              <span>UNDO</span>
            </button>

            <!-- RESET Button -->
            <button id="btn-reset" class="btn-tactile-dark bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 font-bold text-[11px] border border-amber-500/30 cursor-pointer" title="Reset Level (R)">
              <svg class="w-3 h-3 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>RESET \u{1F3B2}</span>
            </button>
          </div>
        </div>

        <!-- SUBTITLE BANNER -->
        <div class="w-full bg-slate-100/90 border-b border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 select-none">
          <span class="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          <span>Rotate pipes by 90\xB0 \u2022 Connect <strong>START</strong> to <strong>DRAIN</strong></span>
        </div>

        <!-- MAIN CANVAS PLAYGROUND -->
        <div id="canvas-container" class="relative w-full h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center board-grid-pattern overflow-hidden touch-none select-none">
          <canvas id="game-canvas" class="block rounded-2xl cursor-pointer"></canvas>
        </div>

        <!-- FOOTER: Level Quick Navigation -->
        <footer class="w-full bg-white px-3 sm:px-6 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div class="flex items-center gap-1.5 font-medium">
            <button id="btn-prev-level" class="btn-tactile px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer">
              \u25C0 <span class="hidden sm:inline">Prev</span>
            </button>
            <span id="level-name-display" class="px-2 py-0.5 font-bold text-slate-800 bg-slate-100 rounded-md">
              Level 1
            </span>
            <button id="btn-next-level" class="btn-tactile px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer">
              <span class="hidden sm:inline">Next</span> \u25B6
            </button>
            <button id="btn-quick-new" class="btn-tactile ml-1 px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 rounded-lg font-bold flex items-center gap-1 cursor-pointer text-xs" title="Generate new puzzle">
              \u{1F3B2} <span>New Board</span>
            </button>
          </div>

          
        </footer>
      </div>

      <!-- MODALS CONTAINER -->
      <div id="modal-container" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm hidden">
      </div>
    `;
      this.levelBadgeEl = document.getElementById("level-badge");
      this.movesCounterEl = document.getElementById("moves-counter");
      this.parCounterEl = document.getElementById("par-counter");
      this.bestCounterEl = document.getElementById("best-counter");
      this.btnMainMenu = document.getElementById("btn-main-menu");
      this.btnUndo = document.getElementById("btn-undo");
      this.btnReset = document.getElementById("btn-reset");
      this.btnSound = document.getElementById("btn-sound");
      this.btnLevels = document.getElementById("btn-levels-badge");
      this.btnHint = document.getElementById("btn-hint");
      this.btnHelp = document.getElementById("btn-help");
      this.canvasContainer = document.getElementById("canvas-container");
      this.canvas = document.getElementById("game-canvas");
      this.modalContainer = document.getElementById("modal-container");
    }
    initCanvasAndRenderer() {
      this.renderer = new PipeRenderer(this.canvas);
      this.handleResize();
      const gameCard = document.getElementById("game-card") || this.canvasContainer;
      const ro = new ResizeObserver(() => {
        if (this.resizeRafId !== null) {
          cancelAnimationFrame(this.resizeRafId);
        }
        this.resizeRafId = requestAnimationFrame(() => {
          this.resizeRafId = null;
          this.handleResize();
        });
      });
      ro.observe(gameCard);
      window.addEventListener("resize", () => {
        if (this.resizeRafId !== null) cancelAnimationFrame(this.resizeRafId);
        this.resizeRafId = requestAnimationFrame(() => {
          this.resizeRafId = null;
          this.handleResize();
        });
      });
    }
    handleResize() {
      const width = this.canvasContainer.clientWidth;
      const height = this.canvasContainer.clientHeight;
      if (width <= 0 || height <= 0) return;
      if (Math.abs(width - this.lastWidth) < 2 && Math.abs(height - this.lastHeight) < 2) {
        return;
      }
      this.lastWidth = width;
      this.lastHeight = height;
      const config = this.game.currentLevelConfig;
      this.renderer.resize(width, height, config.rows, config.cols);
    }
    bindEvents() {
      this.btnMainMenu.addEventListener("click", () => {
        soundManager.playClick();
        this.showMainMenuModal();
      });
      this.btnUndo.addEventListener("click", () => this.game.undo());
      this.btnReset.addEventListener("click", () => {
        soundManager.playClick();
        this.game.resetLevel(true);
        this.handleResize();
      });
      this.btnSound.addEventListener("click", () => {
        soundManager.playClick();
        const enabled = soundManager.toggleMute();
        this.updateSoundIcon(enabled);
      });
      this.btnLevels.addEventListener("click", () => {
        soundManager.playClick();
        this.showLevelsModal();
      });
      this.btnHelp.addEventListener("click", () => {
        soundManager.playClick();
        this.showHowToPlayModal();
      });
      this.btnHint.addEventListener("click", () => {
        soundManager.playClick();
        this.showRewardedAdModal();
      });
      const btnPrev = document.getElementById("btn-prev-level");
      const btnNext = document.getElementById("btn-next-level");
      const btnQuickNew = document.getElementById("btn-quick-new");
      btnQuickNew?.addEventListener("click", () => {
        soundManager.playClick();
        this.game.resetLevel(true);
        this.handleResize();
      });
      btnPrev?.addEventListener("click", () => {
        if (this.game.currentLevelId > 1) {
          soundManager.playClick();
          this.game.loadLevel(this.game.currentLevelId - 1, true);
          this.handleResize();
        }
      });
      btnNext?.addEventListener("click", () => {
        if (this.game.currentLevelId < this.game.unlockedLevels) {
          soundManager.playClick();
          this.game.loadLevel(this.game.currentLevelId + 1, true);
          this.handleResize();
        }
      });
      const handlePointer = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;
        const tile = this.renderer.getTileAt(canvasX, canvasY);
        if (tile) {
          this.game.rotateTile(tile.row, tile.col);
        }
      };
      this.canvas.addEventListener("click", (e) => {
        handlePointer(e.clientX, e.clientY);
      });
      this.canvas.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        this.renderer.hoveredTile = this.renderer.getTileAt(canvasX, canvasY);
      });
      this.canvas.addEventListener("mouseleave", () => {
        this.renderer.hoveredTile = null;
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "z" || e.key === "Z" || e.key === "u" || e.key === "U") {
          this.game.undo();
        } else if (e.key === "r" || e.key === "R") {
          this.game.resetLevel(true);
          this.handleResize();
        } else if (e.key === "m" || e.key === "M") {
          const enabled = soundManager.toggleMute();
          this.updateSoundIcon(enabled);
        } else if (e.key === "h" || e.key === "H") {
          this.showRewardedAdModal();
        } else if (e.key === "Escape") {
          this.closeModal();
        }
      });
    }
    updateHUD() {
      this.levelBadgeEl.textContent = String(this.game.currentLevelId);
      this.movesCounterEl.textContent = String(this.game.moves);
      const par = this.game.currentLevelConfig.parMoves;
      if (this.parCounterEl) {
        this.parCounterEl.textContent = `\u2264 ${par + 1}`;
      }
      const best = this.game.bestMoves[this.game.currentLevelId];
      this.bestCounterEl.textContent = best !== void 0 ? String(best) : "-";
      this.btnUndo.disabled = this.game.undoStack.length === 0 || this.game.isCompleted;
      const levelNameEl = document.getElementById("level-name-display");
      if (levelNameEl) {
        levelNameEl.textContent = `${this.game.currentLevelConfig.name} (${this.game.currentLevelId}/${LEVELS.length})`;
      }
      const btnPrev = document.getElementById("btn-prev-level");
      const btnNext = document.getElementById("btn-next-level");
      if (btnPrev) btnPrev.disabled = this.game.currentLevelId <= 1;
      if (btnNext) btnNext.disabled = this.game.currentLevelId >= this.game.unlockedLevels;
    }
    updateSoundIcon(enabled) {
      const onIcon = document.getElementById("sound-icon-on");
      const offIcon = document.getElementById("sound-icon-off");
      if (onIcon && offIcon) {
        if (enabled) {
          onIcon.classList.remove("hidden");
          offIcon.classList.add("hidden");
        } else {
          onIcon.classList.add("hidden");
          offIcon.classList.remove("hidden");
        }
      }
    }
    startLoop() {
      const renderLoop = (time) => {
        this.renderer.render(this.game.grid, time);
        requestAnimationFrame(renderLoop);
      };
      requestAnimationFrame(renderLoop);
    }
    // --- MODALS ---
    closeModal() {
      if (this.adTimerInterval) {
        clearInterval(this.adTimerInterval);
        this.adTimerInterval = null;
      }
      this.modalContainer.classList.add("hidden");
      this.modalContainer.innerHTML = "";
    }
    // 1. Main Menu
    showMainMenuModal() {
      const unlocked = this.game.unlockedLevels;
      const totalStars = this.game.getTotalStars();
      const maxStars = LEVELS.length * 3;
      const isMuted = soundManager.muted;
      this.modalContainer.innerHTML = `
      <div class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200 flex flex-col relative overflow-hidden">
        <!-- Close button top right -->
        <button id="menu-close-btn" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-white/10 transition-colors">
          \u2715
        </button>

        <!-- Brand Icon / Header -->
        <div class="flex flex-col items-center text-center mt-2 mb-5">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-3 border border-cyan-400/30">
            <svg class="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight leading-none">
            PIPE FLOW PLUMBER
          </h2>
          <span class="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-wider">
            Hydraulic Engineering Puzzle
          </span>
        </div>

        <!-- Player Progress Cards -->
        <div class="grid grid-cols-2 gap-2.5 mb-5">
          <div class="bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-center">
            <span class="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">Stars</span>
            <div class="flex items-center justify-center gap-1 mt-0.5">
              <span class="text-base">\u2B50</span>
              <span class="text-lg font-black text-amber-300">${totalStars}</span>
              <span class="text-xs text-slate-400">/ ${maxStars}</span>
            </div>
          </div>
          <div class="bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-center">
            <span class="block text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Unlocked Levels</span>
            <div class="flex items-center justify-center gap-1 mt-0.5">
              <span class="text-lg font-black text-white">${unlocked}</span>
              <span class="text-xs text-slate-400">/ ${LEVELS.length}</span>
            </div>
          </div>
        </div>

        <!-- Main Actions -->
        <div class="flex flex-col gap-2.5">
          <button id="menu-btn-play" class="btn-tactile w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center justify-center gap-2">
            <span>\u25B6 CONTINUE LEVEL ${this.game.currentLevelId}</span>
          </button>

          <button id="menu-btn-levels" class="btn-tactile-dark w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/15 cursor-pointer flex items-center justify-center gap-2">
            <span>\u{1F5FA}\uFE0F SELECT LEVEL</span>
          </button>

          <button id="menu-btn-procedural" class="btn-tactile-dark w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer flex items-center justify-center gap-2">
            <span>\u{1F3B2} NEW PUZZLE</span>
          </button>

          <div class="grid grid-cols-2 gap-2 mt-1">
            <button id="menu-btn-help" class="btn-tactile-dark py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-1.5">
              <span>\u2753 How to Play</span>
            </button>
            <button id="menu-btn-sound" class="btn-tactile-dark py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-1.5">
              <span>${isMuted ? "\u{1F507} Sound: Off" : "\u{1F50A} Sound: On"}</span>
            </button>
          </div>
        </div>

        
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("menu-close-btn")?.addEventListener("click", () => this.closeModal());
      document.getElementById("menu-btn-play")?.addEventListener("click", () => {
        this.closeModal();
      });
      document.getElementById("menu-btn-levels")?.addEventListener("click", () => {
        this.closeModal();
        this.showLevelsModal();
      });
      document.getElementById("menu-btn-procedural")?.addEventListener("click", () => {
        soundManager.playClick();
        this.closeModal();
        this.game.resetLevel(true);
        this.handleResize();
      });
      document.getElementById("menu-btn-help")?.addEventListener("click", () => {
        this.closeModal();
        this.showHowToPlayModal();
      });
      document.getElementById("menu-btn-sound")?.addEventListener("click", () => {
        soundManager.playClick();
        const enabled = soundManager.toggleMute();
        this.updateSoundIcon(enabled);
        const btnSound = document.getElementById("menu-btn-sound");
        if (btnSound) {
          btnSound.textContent = enabled ? "\u{1F50A} Sound: On" : "\u{1F507} Sound: Off";
        }
      });
    }
    // 2. Level Select Modal
    showLevelsModal() {
      const unlocked = this.game.unlockedLevels;
      const current = this.game.currentLevelId;
      const totalStars = this.game.getTotalStars();
      const maxStars = LEVELS.length * 3;
      let gridHtml = "";
      LEVELS.forEach((level) => {
        const isLocked = level.id > unlocked;
        const isCurrent = level.id === current;
        const best = this.game.bestMoves[level.id];
        const stars = this.game.levelStars[level.id] || 0;
        const starsDisplay = isLocked ? "" : stars === 3 ? "\u2B50\u2B50\u2B50" : stars === 2 ? '\u2B50\u2B50<span class="opacity-30">\u2B50</span>' : stars === 1 ? '\u2B50<span class="opacity-30">\u2B50\u2B50</span>' : '<span class="opacity-30">\u2B50\u2B50\u2B50</span>';
        gridHtml += `
        <button 
          data-level="${level.id}"
          class="level-card-btn relative p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${isCurrent ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-cyan-400 ring-offset-2" : isLocked ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm cursor-pointer hover:border-blue-300"}"
          ${isLocked ? "disabled" : ""}
        >
          <span class="text-[10px] font-bold uppercase tracking-wider ${isCurrent ? "text-blue-100" : "text-slate-400"}">
            Level
          </span>
          <span class="text-xl sm:text-2xl font-black leading-tight">
            ${isLocked ? "\u{1F512}" : level.id}
          </span>
          ${!isLocked ? `<span class="text-[10px] mt-0.5 tracking-tighter">${starsDisplay}</span>` : ""}
          <span class="text-[9px] mt-0.5 font-semibold ${isCurrent ? "text-blue-100" : "text-slate-500"}">
            ${isLocked ? "Locked" : best !== void 0 ? `Best: ${best}` : "Available"}
          </span>
        </button>
      `;
      });
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 leading-none">Select Level</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-slate-500">${unlocked} of ${LEVELS.length} unlocked</span>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                \u2B50 ${totalStars} / ${maxStars}
              </span>
            </div>
          </div>
          <button id="modal-close-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer">
            \u2715
          </button>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2.5 overflow-y-auto py-2 pr-1">
          ${gridHtml}
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <button id="modal-menu-btn" class="btn-tactile px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
            Main Menu
          </button>
          <button id="modal-cancel-btn" class="btn-tactile px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
            Back to Game
          </button>
        </div>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("modal-close-btn")?.addEventListener("click", () => this.closeModal());
      document.getElementById("modal-cancel-btn")?.addEventListener("click", () => this.closeModal());
      document.getElementById("modal-menu-btn")?.addEventListener("click", () => {
        this.closeModal();
        this.showMainMenuModal();
      });
      this.modalContainer.querySelectorAll(".level-card-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lvl = parseInt(btn.getAttribute("data-level") || "1", 10);
          soundManager.playClick();
          this.game.loadLevel(lvl, true);
          this.handleResize();
          this.closeModal();
        });
      });
    }
    // 3. Rewarded Ad Modal for Hints
    showRewardedAdModal() {
      let timeLeft = 5;
      const totalTime = 5;
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
          \u{1F4A1}
        </div>

        <h3 class="text-lg font-extrabold text-slate-900">Unlock Hint</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">
          Wait 5 seconds to align a pipe connection for you!
        </p>

        <!-- Progress bar -->
        <div class="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
          <div id="ad-progress-bar" class="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-0 transition-all duration-300"></div>
        </div>
        <span id="ad-timer-label" class="text-xs font-bold text-slate-400 block mb-5">
          Loading hint: 5s remaining...
        </span>

        <div class="flex items-center justify-center gap-2">
          <button id="btn-skip-ad" class="btn-tactile px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer">
            Cancel
          </button>
          <button id="btn-claim-hint" class="btn-tactile px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/30 disabled:opacity-40 disabled:pointer-events-none cursor-pointer" disabled>
            Use Hint! \u{1F4A1}
          </button>
        </div>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      const progressBar = document.getElementById("ad-progress-bar");
      const timerLabel = document.getElementById("ad-timer-label");
      const btnClaim = document.getElementById("btn-claim-hint");
      const btnSkip = document.getElementById("btn-skip-ad");
      btnSkip.addEventListener("click", () => this.closeModal());
      this.adTimerInterval = window.setInterval(() => {
        timeLeft--;
        const percent = Math.min(100, Math.floor((totalTime - timeLeft) / totalTime * 100));
        progressBar.style.width = `${percent}%`;
        if (timeLeft > 0) {
          timerLabel.textContent = `Loading hint: ${timeLeft}s remaining...`;
        } else {
          clearInterval(this.adTimerInterval);
          this.adTimerInterval = null;
          timerLabel.textContent = "Hint unlocked!";
          timerLabel.classList.add("text-emerald-500");
          btnClaim.disabled = false;
        }
      }, 1e3);
      btnClaim.addEventListener("click", () => {
        this.closeModal();
        this.game.applyHint();
      });
    }
    // 4. How to Play Illustrated Tutorial
    showHowToPlayModal() {
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in duration-200">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 class="text-xl font-extrabold text-slate-900 leading-none">How to Play</h2>
          <button id="help-close-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer">
            \u2715
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <!-- Card 1 -->
          <div class="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              \u27F3
            </div>
            <h4 class="text-xs font-bold text-blue-900 uppercase">1. Rotate Pipes</h4>
            <p class="text-[11px] text-blue-700/80 mt-1 leading-relaxed">
              Click or tap any pipe to rotate it 90\xB0 clockwise.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              \u{1F4A7}
            </div>
            <h4 class="text-xs font-bold text-cyan-900 uppercase">2. Fluid Flow</h4>
            <p class="text-[11px] text-cyan-700/80 mt-1 leading-relaxed">
              Water continuously flows from the blue <strong>START</strong> valve through connected pipes.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              \u{1F3AF}
            </div>
            <h4 class="text-xs font-bold text-emerald-900 uppercase">3. Reach Drain</h4>
            <p class="text-[11px] text-emerald-700/80 mt-1 leading-relaxed">
              Connect the pipeline to the green <strong>DRAIN</strong> valve to win!
            </p>
          </div>
        </div>

        <!-- Rating criteria notice -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 mb-5">
          <span class="font-bold block mb-1">\u2B50 Star Rating System:</span>
          \u2022 <strong>3 Stars:</strong> Complete within target moves (Par + 1 move)<br>
          \u2022 <strong>2 Stars:</strong> Complete within Par + 4 moves<br>
          \u2022 <strong>1 Star:</strong> Complete the pipeline
        </div>

        <button id="help-got-it-btn" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 cursor-pointer">
          Got it, let's play!
        </button>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("help-close-btn")?.addEventListener("click", () => this.closeModal());
      document.getElementById("help-got-it-btn")?.addEventListener("click", () => this.closeModal());
    }
    // 5. Level Victory Modal
    showVictoryModal(levelId, moves, isNewBest, stars = 3) {
      const hasNext = levelId < LEVELS.length;
      const par = this.game.currentLevelConfig.parMoves;
      const threeStarTarget = par + 1;
      const starIcons = [
        stars >= 1 ? "\u2B50" : '<span class="opacity-25 grayscale">\u2B50</span>',
        stars >= 2 ? "\u2B50" : '<span class="opacity-25 grayscale">\u2B50</span>',
        stars >= 3 ? "\u2B50" : '<span class="opacity-25 grayscale">\u2B50</span>'
      ];
      const starMessage = stars === 3 ? "Perfect! Maximum efficiency achieved." : stars === 2 ? "Great job! Close to optimal moves." : "Pipeline connected! Try fewer rotations for 3 \u2B50.";
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/30">
          \u{1F30A}
        </div>

        <h3 class="text-2xl font-black text-slate-900">Pipeline Connected!</h3>
        <p class="text-xs font-semibold text-slate-500 mt-0.5">
          Level ${levelId} Cleared Successfully
        </p>

        <!-- Dynamic Star Rating -->
        <div class="flex items-center justify-center gap-2 my-3.5">
          <span class="text-3xl ${stars >= 1 ? "animate-bounce" : ""}">${starIcons[0]}</span>
          <span class="text-4xl ${stars >= 2 ? "animate-bounce" : ""}" style="animation-delay: 0.1s">${starIcons[1]}</span>
          <span class="text-3xl ${stars >= 3 ? "animate-bounce" : ""}" style="animation-delay: 0.2s">${starIcons[2]}</span>
        </div>

        <p class="text-xs font-medium text-slate-600 mb-4">
          ${starMessage}
        </p>

        <!-- Stats Breakdown -->
        <div class="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-5 flex items-center justify-around">
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Your Moves</span>
            <span class="text-lg font-black text-slate-800">${moves}</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold text-amber-500 uppercase">Target 3\u2B50</span>
            <span class="text-lg font-black text-amber-600">\u2264 ${threeStarTarget}</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Best Record</span>
            <span class="text-lg font-black text-emerald-600">
              ${this.game.bestMoves[levelId] || moves}
              ${isNewBest ? '<span class="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-full ml-0.5 font-bold">NEW!</span>' : ""}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          ${hasNext ? `<button id="btn-victory-next" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 cursor-pointer">
                  Next Level \u25B6
                </button>` : `<button id="btn-victory-levels" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 cursor-pointer">
                  All Levels Cleared! \u{1F389}
                </button>`}
          <button id="btn-victory-replay" class="btn-tactile w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
            Play Again \u{1F3B2}
          </button>
          <button id="btn-victory-main-menu" class="btn-tactile w-full py-2 rounded-2xl bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer">
            Main Menu
          </button>
        </div>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("btn-victory-next")?.addEventListener("click", () => {
        this.closeModal();
        this.game.nextLevel();
        this.handleResize();
      });
      document.getElementById("btn-victory-replay")?.addEventListener("click", () => {
        this.closeModal();
        this.game.resetLevel(true);
        this.handleResize();
      });
      document.getElementById("btn-victory-levels")?.addEventListener("click", () => {
        this.closeModal();
        this.showLevelsModal();
      });
      document.getElementById("btn-victory-main-menu")?.addEventListener("click", () => {
        this.closeModal();
        this.showMainMenuModal();
      });
    }
  };
  function startApp() {
    try {
      new App();
    } catch (err) {
      console.error("Error starting game:", err);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
