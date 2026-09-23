import { Block, LevelData, SolverMove } from './types';

interface InternalBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isKey: boolean;
}

interface State {
  blocks: InternalBlock[];
  parent: State | null;
  move: SolverMove | null;
  depth: number;
}

function stateToKey(blocks: InternalBlock[]): string {
  // Sort blocks by id to produce consistent keys
  const sorted = [...blocks].sort((a, b) => a.id.localeCompare(b.id));
  return sorted.map(b => `${b.id}:${b.x},${b.y}`).join('|');
}

function isOccupied(
  grid: (string | null)[][],
  x: number,
  y: number,
  w: number,
  h: number,
  excludeId: string,
  cols: number,
  rows: number
): boolean {
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const curX = x + c;
      const curY = y + r;
      if (curX < 0 || curX >= cols || curY < 0 || curY >= rows) {
        return true;
      }
      const occ = grid[curY][curX];
      if (occ !== null && occ !== excludeId) {
        return true;
      }
    }
  }
  return false;
}

export function solveLevel(level: LevelData, initialBlocks: Block[]): SolverMove[] | null {
  const cols = level.cols;
  const rows = level.rows;
  const exitRow = level.exitRow;

  const startBlocks: InternalBlock[] = initialBlocks.map(b => ({
    id: b.id,
    x: b.x,
    y: b.y,
    w: b.width,
    h: b.height,
    isKey: !!b.isKey,
  }));

  const keyBlock = startBlocks.find(b => b.isKey);
  if (!keyBlock) return null;

  // Check if already won
  if (keyBlock.y === exitRow && keyBlock.x + keyBlock.w >= cols) {
    return [];
  }

  const visited = new Set<string>();
  const queue: State[] = [
    {
      blocks: startBlocks,
      parent: null,
      move: null,
      depth: 0,
    },
  ];

  visited.add(stateToKey(startBlocks));

  let maxIterations = 25000;

  while (queue.length > 0 && maxIterations-- > 0) {
    const current = queue.shift()!;
    const currentKeyBlock = current.blocks.find(b => b.isKey)!;

    // Check goal: Red key has a clear path to exit or is at exit
    if (currentKeyBlock.y === exitRow && currentKeyBlock.x + currentKeyBlock.w >= cols) {
      // Reconstruct path
      const moves: SolverMove[] = [];
      let trace: State | null = current;
      while (trace && trace.move) {
        moves.unshift(trace.move);
        trace = trace.parent;
      }
      return moves;
    }

    // Build grid occupancy
    const grid: (string | null)[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    for (const b of current.blocks) {
      for (let r = 0; r < b.h; r++) {
        for (let c = 0; c < b.w; c++) {
          if (b.y + r < rows && b.x + c < cols) {
            grid[b.y + r][b.x + c] = b.id;
          }
        }
      }
    }

    // Generate possible moves for each block
    for (let i = 0; i < current.blocks.length; i++) {
      const b = current.blocks[i];
      const isHorizontal = b.w > b.h;
      const isVertical = b.h > b.w;
      const isSingle = b.w === 1 && b.h === 1;

      // Horizontal moves
      if (isHorizontal || isSingle) {
        // Slide left
        for (let dx = -1; ; dx--) {
          const newX = b.x + dx;
          if (newX < 0 || isOccupied(grid, newX, b.y, b.w, b.h, b.id, cols, rows)) {
            break;
          }
          const nextBlocks = current.blocks.map((item, idx) =>
            idx === i ? { ...item, x: newX } : item
          );
          const key = stateToKey(nextBlocks);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              blocks: nextBlocks,
              parent: current,
              move: {
                blockId: b.id,
                dx: dx,
                dy: 0,
                targetX: newX,
                targetY: b.y,
                description: `Move block to the left`,
              },
              depth: current.depth + 1,
            });
          }
        }

        // Slide right
        for (let dx = 1; ; dx++) {
          const newX = b.x + dx;
          if (newX + b.w > cols || isOccupied(grid, newX, b.y, b.w, b.h, b.id, cols, rows)) {
            break;
          }
          const nextBlocks = current.blocks.map((item, idx) =>
            idx === i ? { ...item, x: newX } : item
          );
          const key = stateToKey(nextBlocks);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              blocks: nextBlocks,
              parent: current,
              move: {
                blockId: b.id,
                dx: dx,
                dy: 0,
                targetX: newX,
                targetY: b.y,
                description: `Move block to the right`,
              },
              depth: current.depth + 1,
            });
          }
        }
      }

      // Vertical moves
      if (isVertical || isSingle) {
        // Slide up
        for (let dy = -1; ; dy--) {
          const newY = b.y + dy;
          if (newY < 0 || isOccupied(grid, b.x, newY, b.w, b.h, b.id, cols, rows)) {
            break;
          }
          const nextBlocks = current.blocks.map((item, idx) =>
            idx === i ? { ...item, y: newY } : item
          );
          const key = stateToKey(nextBlocks);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              blocks: nextBlocks,
              parent: current,
              move: {
                blockId: b.id,
                dx: 0,
                dy: dy,
                targetX: b.x,
                targetY: newY,
                description: `Move block up`,
              },
              depth: current.depth + 1,
            });
          }
        }

        // Slide down
        for (let dy = 1; ; dy++) {
          const newY = b.y + dy;
          if (newY + b.h > rows || isOccupied(grid, b.x, newY, b.w, b.h, b.id, cols, rows)) {
            break;
          }
          const nextBlocks = current.blocks.map((item, idx) =>
            idx === i ? { ...item, y: newY } : item
          );
          const key = stateToKey(nextBlocks);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              blocks: nextBlocks,
              parent: current,
              move: {
                blockId: b.id,
                dx: 0,
                dy: dy,
                targetX: b.x,
                targetY: newY,
                description: `Move block down`,
              },
              depth: current.depth + 1,
            });
          }
        }
      }
    }
  }

  return null;
}
