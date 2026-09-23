// Display and DPR Canvas Resolution Manager
export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private onResizeCallback?: (width: number, height: number) => void;

  constructor(canvas: HTMLCanvasElement, onResize?: (width: number, height: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onResizeCallback = onResize;

    const observer = new ResizeObserver(() => this.resize());
    if (this.canvas.parentElement) {
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
    if (parentRect.width <= 0 || parentRect.height <= 0) return;

    // Cap DPR at 2.0 to conserve GPU memory and battery while retaining crisp graphics
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.floor(parentRect.width);
    const cssHeight = Math.floor(parentRect.height);

    // 1. Internal physical pixel buffer
    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    // 2. CSS presentation size
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // 3. Normalized logical pixel scaling
    this.ctx.resetTransform();
    this.ctx.scale(this.dpr, this.dpr);

    if (this.onResizeCallback) {
      this.onResizeCallback(cssWidth, cssHeight);
    }
  }

  public getGameCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
