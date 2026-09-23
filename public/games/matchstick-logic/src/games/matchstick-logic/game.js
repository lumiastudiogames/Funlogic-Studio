/**
 * Matchstick Logic modular integration entry
 */
export function render(container, onWin) {
  let startTime = Date.now();
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'win') {
      if (typeof onWin === 'function') {
        onWin(event.data.time || Math.floor((Date.now() - startTime) / 1000));
      }
    }
  });
}
