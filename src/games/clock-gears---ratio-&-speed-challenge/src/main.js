import './index.css';
import './games/gear-train/game.js';

function bootstrapGame() {
  const mount = document.getElementById('root') || document.body;
  if (window.GearTrainGame && mount && !mount.dataset.initialized) {
    mount.dataset.initialized = 'true';
    window.GearTrainGame.render(mount, (timeInSeconds) => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapGame);
} else {
  bootstrapGame();
}
