export interface GridMetrics {
  boardX: number;
  boardY: number;
  boardSize: number;
  cellSize: number;
  gridPadding: number;
  cssWidth: number;
  cssHeight: number;
}

export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public dpr: number = 1;
  public cssWidth: number = 300;
  public cssHeight: number = 300;
  public onResizeCallback?: (metrics: GridMetrics) => void;

  public currentMetrics: GridMetrics = {
    boardX: 0,
    boardY: 0,
    boardSize: 300,
    cellSize: 60,
    gridPadding: 16,
    cssWidth: 300,
    cssHeight: 300
  };

  private gridSize: number = 5;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;

    const observer = new ResizeObserver(() => this.resize());
    if (this.canvas.parentElement) {
      observer.observe(this.canvas.parentElement);
    }
    // Immediate first resize
    setTimeout(() => this.resize(), 10);
  }

  public setGridSize(size: number) {
    this.gridSize = size;
    this.recalculateMetrics();
  }

  public resize() {
    if (!this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssWidth = Math.max(280, Math.floor(parentRect.width));
    this.cssHeight = Math.max(280, Math.floor(parentRect.height));

    this.canvas.width = Math.floor(this.cssWidth * this.dpr);
    this.canvas.height = Math.floor(this.cssHeight * this.dpr);

    this.canvas.style.width = `${this.cssWidth}px`;
    this.canvas.style.height = `${this.cssHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    this.ctx.scale(this.dpr, this.dpr);

    this.recalculateMetrics();
  }

  private recalculateMetrics() {
    const minDim = Math.min(this.cssWidth, this.cssHeight);
    const gridPadding = Math.max(12, Math.min(24, minDim * 0.04));
    const available = Math.min(minDim - gridPadding * 2, 560); // Max bound
    const boardSize = Math.floor(available);
    const cellSize = boardSize / this.gridSize;

    const boardX = Math.floor((this.cssWidth - boardSize) / 2);
    const boardY = Math.floor((this.cssHeight - boardSize) / 2);

    this.currentMetrics = {
      boardX,
      boardY,
      boardSize,
      cellSize,
      gridPadding,
      cssWidth: this.cssWidth,
      cssHeight: this.cssHeight
    };

    if (this.onResizeCallback) {
      this.onResizeCallback(this.currentMetrics);
    }
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getGameCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  public screenToGrid(clientX: number, clientY: number): { r: number; c: number } | null {
    const coords = this.getGameCoordinates(clientX, clientY);
    const { boardX, boardY, cellSize } = this.currentMetrics;

    const localX = coords.x - boardX;
    const localY = coords.y - boardY;

    if (localX < 0 || localY < 0) return null;

    const c = Math.floor(localX / cellSize);
    const r = Math.floor(localY / cellSize);

    if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
      return { r, c };
    }
    return null;
  }

  public gridToScreenCenter(r: number, c: number): { x: number; y: number } {
    const { boardX, boardY, cellSize } = this.currentMetrics;
    return {
      x: boardX + c * cellSize + cellSize / 2,
      y: boardY + r * cellSize + cellSize / 2
    };
  }
}
