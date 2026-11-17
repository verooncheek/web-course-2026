export function createSnakeController(model, view) {
  let animationFrameId = null;

  function startNewGame() {
    model.reset();
    const state = model.getState();
    view.hideGameOver();
    view.updateHud(state.score, state.record);
    view.render(state, model.getConfig());
  }

  function update(currentTime) {
    const state = model.getState();
    const config = model.getConfig();

    if (state.gameOver) return;

    if (state.lastMoveTime === 0) {
      state.lastMoveTime = currentTime;
      return;
    }

    const deltaTime = currentTime - state.lastMoveTime;
    if (deltaTime >= config.moveInterval) {
      state.lastMoveTime = currentTime;
      model.step();

      const updatedState = model.getState();
      view.updateHud(updatedState.score, updatedState.record);

      if (updatedState.gameOver) {
        view.showGameOver(updatedState.score, updatedState.win);
      }
    }
  }

  function gameLoop(currentTime) {
    update(currentTime);
    view.render(model.getState(), model.getConfig());
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  function handleKeyDown(event) {
    const keyMap = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };

    const nextDir = keyMap[event.key];
    if (!nextDir) return;

    event.preventDefault();
    model.setNextDirection(nextDir);
  }

  function init() {
    const restartBtn = document.getElementById('restartBtn');

    document.addEventListener('keydown', handleKeyDown);
    restartBtn.addEventListener('click', startNewGame);

    startNewGame();

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  return {
    init,
    startNewGame,
  };
}