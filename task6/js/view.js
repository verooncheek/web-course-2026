export function createSnakeView() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const recordEl = document.getElementById('record');
  const overlayEl = document.getElementById('overlay');
  const overlayTitleEl = overlayEl.querySelector('h2');
  const finalScoreEl = document.getElementById('finalScore');
  const restartBtn = document.getElementById('restartBtn');

  function drawGrid(cols, rows, cell) {
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.12)';
    ctx.lineWidth = 1;

    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, canvas.height);
      ctx.stroke();
    }

    for (let j = 1; j < rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * cell);
      ctx.lineTo(canvas.width, j * cell);
      ctx.stroke();
    }
  }

  function drawApple(apple, cell) {
    const px = apple.x * cell;
    const py = apple.y * cell;

    ctx.shadowColor = '#ff003c';
    ctx.shadowBlur = cell * 0.6;
    ctx.fillStyle = '#ff003c';

    ctx.beginPath();
    ctx.arc(px + cell / 2, py + cell / 2, cell * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(px + cell * 0.45, py + cell * 0.1, cell * 0.1, cell * 0.25);
  }

  function drawEyes(head, direction, cell) {
    const hx = head.x * cell;
    const hy = head.y * cell;
    const size = cell * 0.15;
    const near = cell * 0.25;
    const far = cell * 0.65;

    ctx.fillStyle = '#0b0914';

    let eyes;
    if (direction.x === 1) {
      eyes = [[far, near], [far, far]];
    } else if (direction.x === -1) {
      eyes = [[near, near], [near, far]];
    } else if (direction.y === 1) {
      eyes = [[near, far], [far, far]];
    } else {
      eyes = [[near, near], [far, near]];
    }

    eyes.forEach(([dx, dy]) => ctx.fillRect(hx + dx, hy + dy, size, size));
  }

  function drawSnake(snake, direction, cell) {
    snake.forEach((seg, index) => {
      const isHead = index === 0;
      const color = isHead ? '#00ffff' : '#00a5c5';

      ctx.shadowColor = color;
      ctx.shadowBlur = isHead ? 14 : 6;
      ctx.fillStyle = color;
      ctx.fillRect(seg.x * cell + 1, seg.y * cell + 1, cell - 2, cell - 2);
    });

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    if (snake.length > 0) {
      drawEyes(snake[0], direction, cell);
    }
  }

  function render(state, config) {
    const cell = canvas.width / config.cols;

    ctx.fillStyle = '#0b0914';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(config.cols, config.rows, cell);
    drawApple(state.apple, cell);
    drawSnake(state.snake, state.direction, cell);
  }

  function updateHud(score, record) {
    scoreEl.textContent = String(score);
    recordEl.textContent = String(record);
  }

  function showGameOver(score, isWin) {
    finalScoreEl.textContent = String(score);
    overlayTitleEl.textContent = isWin ? 'ПОБЕДА!' : 'ИГРА ОКОНЧЕНА';
    overlayEl.classList.remove('hidden');
  }

  function hideGameOver() {
    overlayEl.classList.add('hidden');
  }

  function onKeyDown(handler) {
    document.addEventListener('keydown', event => {
      if (handler(event.key)) {
        event.preventDefault();
      }
    });
  }

  function onRestart(handler) {
    restartBtn.addEventListener('click', handler);
  }

  return {
    render,
    updateHud,
    showGameOver,
    hideGameOver,
    onKeyDown,
    onRestart
  };
}