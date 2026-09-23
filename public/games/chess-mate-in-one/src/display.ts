/**
 * Universal Display & Canvas DPR Manager
 * Handles ResizeObserver, retina scaling up to 2x, and accurate touch/click mapping.
 */

export class DisplayManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1;
  private onResizeCallback?: (w: number, h: number) => void;
  private observer: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, onResize?: (w: number, h: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onResizeCallback = onResize;

    this.observer = new ResizeObserver(() => this.resize());
    if (this.canvas.parentElement) {
      this.observer.observe(this.canvas.parentElement);
    }

    // Initial resize
    setTimeout(() => this.resize(), 10);
  }

  public setResizeCallback(cb: (w: number, h: number) => void) {
    this.onResizeCallback = cb;
  }

  public resize() {
    if (!this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();

    // Cap DPR at 2x as instructed in Universal Game Manual
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.max(parentRect.width, 240);
    const cssHeight = Math.max(parentRect.height, 240);

    // 1. Real graphic buffer resolution
    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    // 2. CSS presentation size
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // 3. Coordinate normalization for CSS pixels
    this.ctx.scale(this.dpr, this.dpr);

    // 4. Notify game engine
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

  public getDpr(): number {
    return this.dpr;
  }

  public destroy() {
    this.observer.disconnect();
  }
}
