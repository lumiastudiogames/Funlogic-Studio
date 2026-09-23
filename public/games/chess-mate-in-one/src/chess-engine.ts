import { Piece, PieceColor, PieceType } from './types';

export type BoardArray = (Piece | null)[][]; // board[rank][file] where rank 0..7 (1..8), file 0..7 (a..h)

export interface MoveCoord {
  fromFile: number;
  fromRank: number;
  toFile: number;
  toRank: number;
  promotion?: PieceType;
}

export function fileToChar(f: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + f);
}

export function charToFile(c: string): number {
  return c.charCodeAt(0) - 'a'.charCodeAt(0);
}

export function squareToCoords(sq: string): { file: number; rank: number } {
  const f = charToFile(sq[0].toLowerCase());
  const r = parseInt(sq[1], 10) - 1;
  return { file: f, rank: r };
}

export function coordsToSquare(file: number, rank: number): string {
  return `${fileToChar(file)}${rank + 1}`;
}

export class ChessEngine {
  /**
   * Parse a FEN string (piece placement part) into an 8x8 BoardArray
   */
  public static parseFen(fen: string): BoardArray {
    const board: BoardArray = Array.from({ length: 8 }, () => Array(8).fill(null));
    const parts = fen.trim().split(' ');
    const rows = parts[0].split('/');

    // In FEN, rows start from rank 8 (top, index 7) down to rank 1 (bottom, index 0)
    for (let rIndex = 0; rIndex < 8; rIndex++) {
      const fenRow = rows[rIndex];
      const rank = 7 - rIndex;
      let file = 0;

      for (let i = 0; i < fenRow.length; i++) {
        const char = fenRow[i];
        if (char >= '1' && char <= '8') {
          file += parseInt(char, 10);
        } else {
          const color: PieceColor = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase() as PieceType;
          board[rank][file] = { type, color };
          file++;
        }
      }
    }

    return board;
  }

  public static cloneBoard(board: BoardArray): BoardArray {
    return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
  }

  public static getPiece(board: BoardArray, file: number, rank: number): Piece | null {
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    return board[rank][file];
  }

  /**
   * Returns all pseudo-legal moves for a piece at given coordinates
   */
  public static getPseudoMoves(board: BoardArray, file: number, rank: number): MoveCoord[] {
    const piece = this.getPiece(board, file, rank);
    if (!piece) return [];

    const moves: MoveCoord[] = [];
    const color = piece.color;
    const enemyColor: PieceColor = color === 'w' ? 'b' : 'w';

    const addMove = (tF: number, tR: number, promo?: PieceType) => {
      if (tF >= 0 && tF <= 7 && tR >= 0 && tR <= 7) {
        const target = board[tR][tF];
        if (!target || target.color === enemyColor) {
          moves.push({ fromFile: file, fromRank: rank, toFile: tF, toRank: tR, promotion: promo });
        }
      }
    };

    if (piece.type === 'p') {
      const dir = color === 'w' ? 1 : -1;
      const startRank = color === 'w' ? 1 : 6;
      const promoRank = color === 'w' ? 7 : 0;

      // 1-step forward
      const f1Rank = rank + dir;
      if (f1Rank >= 0 && f1Rank <= 7 && !board[f1Rank][file]) {
        if (f1Rank === promoRank) {
          ['q', 'r', 'b', 'n'].forEach(p => addMove(file, f1Rank, p as PieceType));
        } else {
          addMove(file, f1Rank);
        }

        // 2-step forward
        const f2Rank = rank + 2 * dir;
        if (rank === startRank && !board[f2Rank][file]) {
          addMove(file, f2Rank);
        }
      }

      // Diagonal captures
      [-1, 1].forEach(dFile => {
        const cFile = file + dFile;
        const cRank = rank + dir;
        if (cFile >= 0 && cFile <= 7 && cRank >= 0 && cRank <= 7) {
          const target = board[cRank][cFile];
          if (target && target.color === enemyColor) {
            if (cRank === promoRank) {
              ['q', 'r', 'b', 'n'].forEach(p => addMove(cFile, cRank, p as PieceType));
            } else {
              addMove(cFile, cRank);
            }
          }
        }
      });
    } else if (piece.type === 'n') {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      offsets.forEach(([dF, dR]) => addMove(file + dF, rank + dR));
    } else if (piece.type === 'b' || piece.type === 'r' || piece.type === 'q') {
      const directions: [number, number][] = [];
      if (piece.type === 'b' || piece.type === 'q') {
        directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
      }
      if (piece.type === 'r' || piece.type === 'q') {
        directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
      }

      directions.forEach(([dF, dR]) => {
        let curF = file + dF;
        let curR = rank + dR;
        while (curF >= 0 && curF <= 7 && curR >= 0 && curR <= 7) {
          const target = board[curR][curF];
          if (!target) {
            moves.push({ fromFile: file, fromRank: rank, toFile: curF, toRank: curR });
          } else {
            if (target.color === enemyColor) {
              moves.push({ fromFile: file, fromRank: rank, toFile: curF, toRank: curR });
            }
            break; // Ray blocked
          }
          curF += dF;
          curR += dR;
        }
      });
    } else if (piece.type === 'k') {
      for (let dF = -1; dF <= 1; dF++) {
        for (let dR = -1; dR <= 1; dR++) {
          if (dF === 0 && dR === 0) continue;
          addMove(file + dF, rank + dR);
        }
      }
    }

    return moves;
  }

  /**
   * Applies move on board and returns new board
   */
  public static makeMove(board: BoardArray, move: MoveCoord): BoardArray {
    const nextBoard = this.cloneBoard(board);
    const piece = nextBoard[move.fromRank][move.fromFile];
    if (!piece) return nextBoard;

    nextBoard[move.fromRank][move.fromFile] = null;

    if (move.promotion) {
      nextBoard[move.toRank][move.toFile] = { type: move.promotion, color: piece.color };
    } else {
      nextBoard[move.toRank][move.toFile] = piece;
    }

    return nextBoard;
  }

  /**
   * Find king of given color
   */
  public static findKing(board: BoardArray, color: PieceColor): { file: number; rank: number } | null {
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (p && p.type === 'k' && p.color === color) {
          return { file: f, rank: r };
        }
      }
    }
    return null;
  }

  /**
   * Checks if square (sqF, sqR) is attacked by opponent of defendingColor
   */
  public static isSquareAttacked(board: BoardArray, sqF: number, sqR: number, defendingColor: PieceColor): boolean {
    const attackerColor: PieceColor = defendingColor === 'w' ? 'b' : 'w';

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (!p || p.color !== attackerColor) continue;

        // Pawns attack diagonally only
        if (p.type === 'p') {
          const dir = attackerColor === 'w' ? 1 : -1;
          if (sqR === r + dir && (sqF === f - 1 || sqF === f + 1)) {
            return true;
          }
          continue;
        }

        // For other pieces, use pseudo moves without recursion
        const moves = this.getPseudoMoves(board, f, r);
        if (moves.some(m => m.toFile === sqF && m.toRank === sqR)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the King of given color is currently in check
   */
  public static isKingInCheck(board: BoardArray, color: PieceColor): boolean {
    const kingPos = this.findKing(board, color);
    if (!kingPos) return false;
    return this.isSquareAttacked(board, kingPos.file, kingPos.rank, color);
  }

  /**
   * Generates strictly legal moves for a given color
   */
  public static getLegalMoves(board: BoardArray, color: PieceColor): MoveCoord[] {
    const legalMoves: MoveCoord[] = [];

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (!p || p.color !== color) continue;

        const pseudoMoves = this.getPseudoMoves(board, f, r);
        for (const m of pseudoMoves) {
          const testBoard = this.makeMove(board, m);
          if (!this.isKingInCheck(testBoard, color)) {
            legalMoves.push(m);
          }
        }
      }
    }

    return legalMoves;
  }

  /**
   * Tests if the given color is in checkmate
   */
  public static isCheckmate(board: BoardArray, color: PieceColor): boolean {
    if (!this.isKingInCheck(board, color)) {
      return false;
    }
    const legalMoves = this.getLegalMoves(board, color);
    return legalMoves.length === 0;
  }

  /**
   * Validates if user's move leads to Checkmate against Black
   */
  public static isWinningCheckmate(board: BoardArray, move: MoveCoord): boolean {
    // 1. Must be a legal move for White
    const piece = this.getPiece(board, move.fromFile, move.fromRank);
    if (!piece || piece.color !== 'w') return false;

    const testBoard = this.makeMove(board, move);

    // White cannot leave their own king in check
    if (this.isKingInCheck(testBoard, 'w')) {
      return false;
    }

    // Must deliver checkmate to Black
    return this.isCheckmate(testBoard, 'b');
  }
}
