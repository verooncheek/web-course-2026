export function createSnakeModel(config = {}) {
  const cols = config.cols ?? 20;
  const rows = config.rows ?? 20;
  const moveInterval = config.moveInterval ?? 180;
  let appleValue = config.appleValue ?? 1;

  const state = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    apple: { x: 0, y: 0 },
    growthPending: 0,
    score: 0,
    record: Number(localStorage.getItem('snake_record')) || 0,
    gameOver: false,
    win: false,
    lastMoveTime: 0,
  };

  function isOccupiedBySnake(x, y, body = state.snake) {
    return body.some(seg => seg.x === x && seg.y === y);
  }

  function spawnApple() {
    const freeCells = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (!isOccupiedBySnake(x, y)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      endGame(true);
      return;
    }

    state.apple = freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  function endGame(isWin) {
    state.gameOver = true;
    state.win = isWin;
    if (state.score > state.record) {
      state.record = state.score;
      localStorage.setItem('snake_record', String(state.record));
    }
  }

  function reset() {
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);

    state.snake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.growthPending = 0;
    state.score = 0;
    state.gameOver = false;
    state.win = false;
    state.lastMoveTime = 0;

    spawnApple();
  }

  function setNextDirection(dir) {
    const { x, y } = state.direction;
    if (dir.x !== 0 && x === -dir.x) return false;
    if (dir.y !== 0 && y === -dir.y) return false;

    state.nextDirection = { ...dir };
    return true;
  }

  function setAppleValue(value) {
    if (value >= 1) {
      appleValue = Math.floor(value);
    }
  }

  function step() {
    if (state.gameOver) return;

    state.direction = { ...state.nextDirection };

    const head = state.snake[0];
    const newHead = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y,
    };

    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
      endGame(false);
      return;
    }

    const willEat = newHead.x === state.apple.x && newHead.y === state.apple.y;
    const willGrow = willEat || state.growthPending > 0;

    const bodyToCheck = willGrow ? state.snake : state.snake.slice(0, -1);
    if (isOccupiedBySnake(newHead.x, newHead.y, bodyToCheck)) {
      endGame(false);
      return;
    }

    state.snake.unshift(newHead);

    if (willEat) {
      state.score += appleValue;
      state.growthPending += appleValue - 1;
      spawnApple();
    } else if (state.growthPending > 0) {
      state.growthPending -= 1;
    } else {
      state.snake.pop();
    }
  }

  return {
    getConfig: () => ({ cols, rows, moveInterval, appleValue }),
    getState: () => state,
    reset,
    step,
    setNextDirection,
    setAppleValue,
  };
}