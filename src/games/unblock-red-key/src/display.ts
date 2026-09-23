export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private cssWidth: number = 600;
  private cssHeight: number = 400;
  private onResizeCallback?: (w: number, h: number) => void;
  private observer: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, onResize?: (w: number, h: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onResizeCallback = onResize;

    if (this.canvas.parentElement) {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.canvas.parentElement);
    }
    // Initial resize trigger
    setTimeout(() => this.resize(), 10);
  }

  public resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    if (parentRect.width <= 0 || parentRect.height <= 0) return;

    // Cap DPR at 2.0 per universal gaming guidelines
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.cssWidth = parentRect.width;
    this.cssHeight = parentRect.height;

    // 1. Internal graphic buffer resolution
    this.canvas.width = Math.floor(this.cssWidth * this.dpr);
    this.canvas.height = Math.floor(this.cssHeight * this.dpr);

    // 2. CSS presentation size
    this.canvas.style.width = `${this.cssWidth}px`;
    this.canvas.style.height = `${this.cssHeight}px`;

    // 3. Coordinate normalization
    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);

    // 4. Notify layout
    if (this.onResizeCallback) {
      this.onResizeCallback(this.cssWidth, this.cssHeight);
    }
  }

  public getGameCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  public getDimensions(): { width: number; height: number; dpr: number } {
    return {
      width: this.cssWidth,
      height: this.cssHeight,
      dpr: this.dpr,
    };
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
