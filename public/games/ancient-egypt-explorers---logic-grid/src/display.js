/**
 * Universal Display and Resolution Manager for 2.5D Canvas
 */

export class DisplayManager {
  constructor(canvas, onResize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = 1;
    this.onResizeCallback = onResize;

    // Observa mudanças reais de tamanho do elemento pai (rotação, resize)
    const observer = new ResizeObserver(() => this.resize());
    if (this.canvas.parentElement) {
      observer.observe(this.canvas.parentElement);
    }
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    if (!this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    if (parentRect.width === 0 || parentRect.height === 0) return;

    // Teto de 2x para o DPR: economiza GPU e bateria mantendo alta nitidez
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.floor(parentRect.width);
    const cssHeight = Math.floor(parentRect.height);

    // 1. Resolução interna real do buffer gráfico
    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    // 2. Dimensão de layout na tela
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // 3. Normalização: desenha em coordenadas lógicas CSS
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    // 4. Notifica o renderizador
    if (this.onResizeCallback) {
      this.onResizeCallback(cssWidth, cssHeight);
    }
  }

  getGameCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  getContext() {
    return this.ctx;
  }

  getDpr() {
    return this.dpr;
  }
}
