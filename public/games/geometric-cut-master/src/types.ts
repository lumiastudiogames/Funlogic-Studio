// Type definitions for Geometric Cut Master
export interface Point {
  x: number;
  y: number;
}

export interface CutLevel {
  id: number;
  name: string;
  color: string;
  minAccuracy: number;
  hint: string;
  hintLine?: { x1: number; y1: number; x2: number; y2: number };
  vertices: Point[];
}
