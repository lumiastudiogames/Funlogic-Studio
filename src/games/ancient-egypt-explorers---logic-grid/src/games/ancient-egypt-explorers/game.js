/**
 * Ancient Egypt Explorers - Logic Grid Module
 * Standalone game entry point
 */
export function render(container, onWin) {
  let startTime = Date.now();

  function checkWin(tempo) {
    const tempoEmSegundos = tempo || Math.floor((Date.now() - startTime) / 1000);
    if (typeof onWin === 'function') {
      onWin(tempoEmSegundos);
    }
    try {
      window.parent.postMessage({ type: 'win', time: tempoEmSegundos }, '*');
    } catch {
      // ignore
    }
  }

  // Integrates with the main engine
  import('../../main.ts').then((mod) => {
    if (mod && mod.render) {
      mod.render(container, checkWin);
    }
  });
}
