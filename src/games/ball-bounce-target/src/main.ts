import './index.css';
import { initGame } from './games/ball-bounce-target/game.js';

// Initialize the Ball Bounce Target Game
const stage = document.getElementById('game-stage');
if (stage) {
  initGame(stage);
}
