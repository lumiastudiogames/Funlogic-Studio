export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  public width: number = 800;
  public height: number = 600;
  private resizeCallbacks: ((width: number, height: number) => void)[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;

    // Observe size of canvas container
    if (this.canvas.parentElement) {
      const observer = new ResizeObserver(() => this.resize());
      observer.observe(this.canvas.parentElement);
    } else {
      window.addEventListener('resize', () => this.resize());
    }

    // Initial sizing
    setTimeout(() => this.resize(), 10);
  }

  public onResize(cb: (width: number, height: number) => void) {
    this.resizeCallbacks.push(cb);
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    if (parentRect.width <= 0 || parentRect.height <= 0) return;

    // Cap DPR at 2 to preserve high performance & battery on mobile
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.floor(parentRect.width);
    const cssHeight = Math.floor(parentRect.height);

    this.width = cssWidth;
    this.height = cssHeight;

    // Internal buffer size
    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    // Layout style
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // Scale context to use logical CSS coordinates
    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);

    // Notify listeners
    for (const cb of this.resizeCallbacks) {
      cb(this.width, this.height);
    }
  }

  public getGameCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x: Math.max(0, Math.min(this.width, x)),
      y: Math.max(0, Math.min(this.height, y)),
    };
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
