export class DisplayManager {
  constructor(canvas, onResize) {
    this.canvas = canvas;
    this.onResize = onResize;
    this.width = 800;
    this.height = 400;
    this.dpr = 1;

    this.initObserver();
  }

  initObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.canvas.parentElement || entry.target === this.canvas) {
          this.resize();
        }
      }
    });

    if (this.canvas.parentElement) {
      this.resizeObserver.observe(this.canvas.parentElement);
    }
    this.resizeObserver.observe(this.canvas);
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    this.width = Math.floor(rect.width);
    this.height = Math.floor(rect.height);

    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.resetTransform();
      ctx.scale(this.dpr, this.dpr);
    }

    if (this.onResize) {
      this.onResize(this.width, this.height);
    }
  }

  getGameCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x: Math.max(0, Math.min(this.width, x)),
      y: Math.max(0, Math.min(this.height, y)),
    };
  }

  getDimensions() {
    return { width: this.width, height: this.height, dpr: this.dpr };
  }
}
