export type ColorId = 
  | 'teal'
  | 'purple'
  | 'blue'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'red'
  | 'violet'
  | 'lime';

export interface LiquidColorDef {
  id: ColorId;
  name: string;
  namePt: string;
  primary: string;
  gradientTop: string;
  gradientBottom: string;
  highlight: string;
  stream: string;
  glow: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  hint?: string;
  tubes: ColorId[][];
  parMoves: number;
}

export interface MoveStep {
  fromTubeIndex: number;
  toTubeIndex: number;
  color: ColorId;
  amount: number;
}

export interface TubeLayout {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rimRadius: number;
  innerRadius: number;
  bottomRadius: number;
}
