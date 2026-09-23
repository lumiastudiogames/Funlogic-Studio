/**
 * Main application entry point (Pure Vanilla TS/JS + DOM + Canvas)
 */

import { screenCtrl } from './screen-manager';
import { game } from './game-state';

// Initialize when DOM is ready
function bootstrap() {
  screenCtrl.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

// Export for direct access if embedded
export { game, screenCtrl };
