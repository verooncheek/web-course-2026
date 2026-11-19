import { createGameModel } from './model.js';
import { createGameView } from './view.js';
import { createGameController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = createGameModel();
  const view = createGameView();
  const controller = createGameController(model, view);
  controller.init();
});
