/**
 * DisplayManager handles DPR scaling, ResizeObserver, and coordinate conversion.
 */
export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private onResizeCallback?: (w: number, h: number) => void;

  constructor(canvas: HTMLCanvasElement, onResize?: (w: number, h: number) => void) {
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
    setTimeout(() => this.resize(), 0);
  }

  public resize() {
    if (!this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();

    // Cap DPR at 2.0 to save memory & GPU while remaining razor-sharp
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = parentRect.width;
    const cssHeight = parentRect.height;

    if (cssWidth === 0 || cssHeight === 0) return;

    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    if (this.onResizeCallback) {
      this.onResizeCallback(cssWidth, cssHeight);
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
}
