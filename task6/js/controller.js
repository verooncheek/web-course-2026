const KEY_DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

export function createSnakeController(model, view) {
  let animationFrameId = null;
  let lastMoveTime = null;

  function stopLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function startLoop() {
    stopLoop();
    lastMoveTime = null;
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function update(currentTime) {
    if (lastMoveTime === null) {
      lastMoveTime = currentTime;
      return;
    }

    const { moveInterval } = model.getConfig();
    const deltaTime = currentTime - lastMoveTime;
    if (deltaTime < moveInterval) return;
    lastMoveTime = currentTime - (deltaTime % moveInterval);

    model.step();

    const state = model.getState();
    view.updateHud(state.score, state.record);

    if (state.gameOver) {
      view.showGameOver(state.score, state.win);
    }
  }

  function draw() {
    view.render(model.getState(), model.getConfig());
  }

  function gameLoop(currentTime) {
    update(currentTime);
    draw();

    if (model.getState().gameOver) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function startNewGame() {
    model.reset();
    const state = model.getState();
    view.hideGameOver();
    view.updateHud(state.score, state.record);
    draw();
    startLoop();
  }

  function handleKeyDown(key) {
    const direction = KEY_DIRECTIONS[key];
    if (!direction) return false;

    model.setNextDirection(direction);
    return true;
  }

  function init() {
    view.onKeyDown(handleKeyDown);
    view.onRestart(startNewGame);
    startNewGame();
  }

  return { init, startNewGame };
}