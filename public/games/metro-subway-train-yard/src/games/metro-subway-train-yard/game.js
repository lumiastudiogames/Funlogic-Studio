// Platform Modular Export for Metro Subway Train Yard
import { MetroSubwayGame } from '../../main';

export function render(container, onWin) {
  return new MetroSubwayGame(container, onWin);
}

export default { render };
