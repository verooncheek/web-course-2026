import { createSnakeModel } from './model.js';
import { createSnakeView } from './view.js';
import { createSnakeController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = createSnakeModel({
    cols: 20,
    rows: 20,
    moveInterval: 180,
    appleValue: 1,
  });

  const view = createSnakeView();
  const controller = createSnakeController(model, view);

  controller.init();
});