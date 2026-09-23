/**
 * Lights Out Matrix Solver using Gaussian Elimination over GF(2).
 * Mathematically calculates exact minimal solutions and provides hints.
 */

export interface Point {
  r: number;
  c: number;
}

export class LightsOutSolver {
  /**
   * Builds the adjacency matrix A for an (n x m) grid over GF(2).
   */
  public static buildAdjacencyMatrix(rows: number, cols: number): number[][] {
    const N = rows * cols;
    const A: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        A[i][i] = 1; // Self toggle
        // Neighbors
        if (r > 0) A[(r - 1) * cols + c][i] = 1;
        if (r < rows - 1) A[(r + 1) * cols + c][i] = 1;
        if (c > 0) A[r * cols + (c - 1)][i] = 1;
        if (c < cols - 1) A[r * cols + (c + 1)][i] = 1;
      }
    }
    return A;
  }

  /**
   * Solves A * x = b over GF(2).
   * b is 1 where the light is currently OFF (since we want to turn ON all lamps: 0 flips to 1, 1 stays 1).
   * Returns an array of booleans representing the presses for each tile,
   * or null if unsolvable.
   */
  public static solve(board: boolean[][]): boolean[] | null {
    const rows = board.length;
    const cols = board[0].length;
    const N = rows * cols;

    const A = this.buildAdjacencyMatrix(rows, cols);
    const b = new Array(N).fill(0);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Goal is all ON (1). If a light is currently OFF (0), it needs a toggle (b = 1).
        // If already ON (1), it needs no toggle (b = 0).
        b[r * cols + c] = board[r][c] ? 0 : 1;
      }
    }

    // Augmented matrix [A | b]
    const M: number[][] = A.map((row, idx) => [...row, b[idx]]);

    const pivotCols: number[] = [];
    let lead = 0;

    for (let r = 0; r < N; r++) {
      if (lead >= N) break;
      let i = r;
      while (M[i][lead] === 0) {
        i++;
        if (i === N) {
          i = r;
          lead++;
          if (lead === N) break;
        }
      }
      if (lead >= N) break;

      // Swap rows
      const temp = M[i];
      M[i] = M[r];
      M[r] = temp;

      pivotCols.push(lead);

      // Eliminate
      for (let j = 0; j < N; j++) {
        if (j !== r && M[j][lead] === 1) {
          for (let k = 0; k <= N; k++) {
            M[j][k] = (M[j][k] ^ M[r][k]) & 1;
          }
        }
      }
      lead++;
    }

    // Check for inconsistent rows [0 0 ... 0 | 1]
    for (let r = 0; r < N; r++) {
      let allZeros = true;
      for (let c = 0; c < N; c++) {
        if (M[r][c] === 1) {
          allZeros = false;
          break;
        }
      }
      if (allZeros && M[r][N] === 1) {
        return null; // Unsolvable
      }
    }

    // Free variables
    const freeCols: number[] = [];
    for (let c = 0; c < N; c++) {
      if (!pivotCols.includes(c)) {
        freeCols.push(c);
      }
    }

    // Find best combination of free variables that minimizes moves (Hamming weight)
    const numFree = freeCols.length;
    let bestWeight = Infinity;
    let bestX: number[] | null = null;

    const totalCombinations = 1 << Math.min(numFree, 8); // At most 2^8 in standard boards
    for (let combo = 0; combo < totalCombinations; combo++) {
      const x = new Array(N).fill(0);
      for (let fi = 0; fi < numFree; fi++) {
        if ((combo >> fi) & 1) {
          x[freeCols[fi]] = 1;
        }
      }

      for (let pi = 0; pi < pivotCols.length; pi++) {
        const pcol = pivotCols[pi];
        let val = M[pi][N];
        for (let fi = 0; fi < numFree; fi++) {
          const fcol = freeCols[fi];
          if (M[pi][fcol] === 1 && x[fcol] === 1) {
            val ^= 1;
          }
        }
        x[pcol] = val;
      }

      const weight = x.reduce((sum, v) => sum + v, 0);
      if (weight < bestWeight) {
        bestWeight = weight;
        bestX = [...x];
      }
    }

    if (!bestX) return null;
    return bestX.map(v => v === 1);
  }

  /**
   * Returns a suggested next move (r, c) to advance towards victory.
   */
  public static getNextHint(board: boolean[][]): Point | null {
    const solution = this.solve(board);
    if (!solution) return null;

    const rows = board.length;
    const cols = board[0].length;

    // Pick first recommended tile to click
    for (let i = 0; i < solution.length; i++) {
      if (solution[i]) {
        return {
          r: Math.floor(i / cols),
          c: i % cols,
        };
      }
    }
    return null;
  }

  /**
   * Calculates minimum moves needed from current state.
   */
  public static getMinMovesRemaining(board: boolean[][]): number {
    const solution = this.solve(board);
    if (!solution) return 0;
    return solution.filter(Boolean).length;
  }
}
