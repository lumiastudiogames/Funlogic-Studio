/**
 * Display & Resize Management (Universal 2D/2.5D Game Standard)
 */

export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private onResizeCallback?: (w: number, h: number, dpr: number) => void;

  constructor(canvas: HTMLCanvasElement, onResize?: (w: number, h: number, dpr: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onResizeCallback = onResize;

    if (this.canvas.parentElement) {
      const observer = new ResizeObserver(() => this.resize());
      observer.observe(this.canvas.parentElement);
    } else {
      window.addEventListener('resize', () => this.resize());
    }

    // Initial sizing
    setTimeout(() => this.resize(), 10);
  }

  public resize() {
    if (!this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();

    // Cap DPR at 2.0 to save GPU and battery
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.max(10, Math.floor(parentRect.width));
    const cssHeight = Math.max(10, Math.floor(parentRect.height));

    // Internal buffer size
    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    // Layout CSS size
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // Normalization to CSS coordinates
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    if (this.onResizeCallback) {
      this.onResizeCallback(cssWidth, cssHeight, this.dpr);
    }
  }

  public getGameCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getDpr(): number {
    return this.dpr;
  }
}
