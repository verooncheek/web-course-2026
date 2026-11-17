import { createPostModel } from './model.js';
import { createPostView } from './view.js';
import { createPostController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = createPostModel();
  const view = createPostView();
  const controller = createPostController(model, view);

  controller.init();
});