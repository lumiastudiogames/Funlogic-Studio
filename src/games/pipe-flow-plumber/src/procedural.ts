import { LevelConfig, PipeTileConfig, PipeType, Direction } from './types';
import { getPipeOpenings } from './levels';

const dr = [-1, 0, 1, 0]; // 0: Up, 1: Right, 2: Down, 3: Left
const dc = [0, 1, 0, -1];

export interface ProceduralOptions {
  rows?: number;
  cols?: number;
  levelNumber?: number;
  minPathLength?: number;
}

/**
 * Generates a guaranteed-solvable, procedurally generated pipe puzzle.
 */
export function generateProceduralLevel(options: ProceduralOptions = {}): LevelConfig {
  const levelNum = options.levelNumber || 1;

  // Determine grid size based on level difficulty
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

  // Target path length: scales with grid size to ensure interesting winding routes
  const totalCells = rows * cols;
  const desiredMinLen = options.minPathLength || Math.min(
    Math.max(4, Math.floor(totalCells * 0.45)),
    totalCells - 2
  );

  let bestPath: { r: number; c: number }[] | null = null;
  let startPos = { row: 0, col: 0 };
  let endPos = { row: rows - 1, col: cols - 1 };

  // Try multiple attempts to find an engaging, non-trivial path
  for (let attempt = 0; attempt < 80; attempt++) {
    // Pick start & end positions (at edges or opposite corners for natural plumbing layout)
    const corners = [
      { start: { row: 0, col: 0 }, end: { row: rows - 1, col: cols - 1 } },
      { start: { row: 0, col: cols - 1 }, end: { row: rows - 1, col: 0 } },
      { start: { row: 0, col: Math.floor(cols / 2) }, end: { row: rows - 1, col: Math.floor(cols / 2) } },
      { start: { row: Math.floor(rows / 2), col: 0 }, end: { row: Math.floor(rows / 2), col: cols - 1 } },
    ];
    const pair = corners[Math.floor(Math.random() * corners.length)];
    startPos = pair.start;
    endPos = pair.end;

    const visited = new Set<string>();
    visited.add(`${startPos.row},${startPos.col}`);
    const currentPath: { r: number; c: number }[] = [{ r: startPos.row, c: startPos.col }];

    const targetLen = Math.max(4, desiredMinLen - Math.floor(attempt / 10));

    if (findWindingPath(startPos, endPos, rows, cols, visited, currentPath, targetLen)) {
      bestPath = currentPath;
      break;
    }
  }

  // Fallback to simple Manhattan path if randomized winding search timed out
  if (!bestPath) {
    startPos = { row: 0, col: 0 };
    endPos = { row: rows - 1, col: cols - 1 };
    bestPath = generateFallbackPath(startPos, endPos);
  }

  // Initialize empty grid
  const grid: PipeTileConfig[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: PipeTileConfig[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        type: 'empty',
        rotation: 0,
      });
    }
    grid.push(row);
  }

  // Map to store correct path details
  const pathSet = new Set<string>();
  bestPath.forEach((p) => pathSet.add(`${p.r},${p.c}`));

  // 1. Configure START Tile
  const p0 = bestPath[0];
  const p1 = bestPath[1];
  const startOutDir = getDirection(p0.r, p0.c, p1.r, p1.c); // 0: Up, 1: Right, 2: Down, 3: Left
  const startRotSteps = (startOutDir - 1 + 4) % 4; // Start base opening is 1 (Right)
  const startRot = startRotSteps * 90;

  grid[p0.r][p0.c] = {
    type: 'start',
    rotation: startRot,
    correctRotation: startRot,
    locked: true,
  };

  // 2. Configure END Tile
  const pLast = bestPath[bestPath.length - 1];
  const pPrev = bestPath[bestPath.length - 2];
  const endInDir = getDirection(pPrev.r, pPrev.c, pLast.r, pLast.c);
  const endFacingDir = (endInDir + 2) % 4; // Opening must face incoming direction
  const endRotSteps = (endFacingDir - 3 + 4) % 4; // End base opening is 3 (Left)
  const endRot = endRotSteps * 90;

  grid[pLast.r][pLast.c] = {
    type: 'end',
    rotation: endRot,
    correctRotation: endRot,
    locked: true,
  };

  // 3. Configure Intermediate Tiles on the Path
  for (let i = 1; i < bestPath.length - 1; i++) {
    const curr = bestPath[i];
    const prev = bestPath[i - 1];
    const next = bestPath[i + 1];

    const inDir = getDirection(prev.r, prev.c, curr.r, curr.c);
    const outDir = getDirection(curr.r, curr.c, next.r, next.c);

    const d1 = ((inDir + 2) % 4) as Direction; // Entrance
    const d2 = outDir as Direction; // Exit

    let type: PipeType;
    let correctRot: number;

    // Check if straight or elbow
    if ((d1 + 2) % 4 === d2) {
      type = 'straight';
      // Straight base is [1, 3] (horizontal)
      correctRot = (d1 === 0 || d1 === 2) ? 90 : 0;
    } else {
      type = 'elbow';
      // Find rotation of elbow that gives openings [d1, d2]
      correctRot = findElbowRotation(d1, d2);
    }

    // Scramble: rotate by 90, 180, or 270 degrees away from correct rotation
    const scrambleStep = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const scrambledRot = (correctRot + scrambleStep * 90) % 360;

    grid[curr.r][curr.c] = {
      type,
      rotation: scrambledRot,
      correctRotation: correctRot,
      locked: false,
    };
  }

  // 4. Fill all non-path tiles with believable decoy/filler pipes
  const fillerTypes: PipeType[] = ['elbow', 'straight', 'elbow', 'straight', 'tee'];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!pathSet.has(`${r},${c}`)) {
        const randType = fillerTypes[Math.floor(Math.random() * fillerTypes.length)];
        const randRot = Math.floor(Math.random() * 4) * 90;
        grid[r][c] = {
          type: randType,
          rotation: randRot,
          correctRotation: randRot,
          locked: false,
        };
      }
    }
  }

  // 5. Calculate exact minimum moves required to solve this board
  let minRequiredClicks = 0;
  for (let i = 1; i < bestPath.length - 1; i++) {
    const curr = bestPath[i];
    const tile = grid[curr.r][curr.c];
    if (tile.correctRotation !== undefined && tile.rotation !== undefined) {
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
    start: { row: startPos.row, col: startPos.col, dir: startOutDir as Direction },
    end: { row: endPos.row, col: endPos.col, dir: endFacingDir as Direction },
    parMoves,
    grid,
  };
}

/**
 * Recursive randomized DFS to find a winding path with minimum length.
 */
function findWindingPath(
  curr: { row: number; col: number },
  target: { row: number; col: number },
  rows: number,
  cols: number,
  visited: Set<string>,
  path: { r: number; c: number }[],
  minLen: number
): boolean {
  if (curr.row === target.row && curr.col === target.col) {
    return path.length >= minLen;
  }

  // Shuffle directions: Up, Right, Down, Left
  const dirs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

  for (const d of dirs) {
    const nr = curr.row + dr[d];
    const nc = curr.col + dc[d];

    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      const key = `${nr},${nc}`;
      if (!visited.has(key)) {
        // If it's the target, only allow stepping on it if we've satisfied minLen - 1
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

/**
 * Simple guaranteed fallback path between two cells.
 */
function generateFallbackPath(
  start: { row: number; col: number },
  end: { row: number; col: number }
): { r: number; c: number }[] {
  const path: { r: number; c: number }[] = [{ r: start.row, c: start.col }];
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

function getDirection(r1: number, c1: number, r2: number, c2: number): Direction {
  if (r2 < r1) return 0; // Up
  if (c2 > c1) return 1; // Right
  if (r2 > r1) return 2; // Down
  return 3; // Left
}

function findElbowRotation(d1: Direction, d2: Direction): number {
  for (const rot of [0, 90, 180, 270]) {
    const openings = getPipeOpenings('elbow', rot);
    if (openings.includes(d1) && openings.includes(d2)) {
      return rot;
    }
  }
  return 0;
}
