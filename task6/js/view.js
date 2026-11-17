export function createSnakeView() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const recordEl = document.getElementById('record');
  const overlayEl = document.getElementById('overlay');
  const overlayTitleEl = overlayEl.querySelector('h2');
  const finalScoreEl = document.getElementById('finalScore');

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
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ff003c';

    ctx.beginPath();
    ctx.arc(px + cell / 2, py + cell / 2, cell / 2 - 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(px + cell / 2 - 1, py + 2, 3, 5);
  }

  function drawSnake(snake, direction, cell) {
    snake.forEach((seg, index) => {
      const px = seg.x * cell;
      const py = seg.y * cell;

      if (index === 0) {
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#00ffff';
      } else {
        ctx.shadowColor = '#00a5c5';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#00a5c5';
      }

      ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
    });

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    const head = snake[0];
    if (!head) return;

    const hx = head.x * cell;
    const hy = head.y * cell;
    ctx.fillStyle = '#0b0914';

    let e1;
    let e2;
    if (direction.x === 1) {
      e1 = [hx + 13, hy + 5];
      e2 = [hx + 13, hy + 13];
    } else if (direction.x === -1) {
      e1 = [hx + 5, hy + 5];
      e2 = [hx + 5, hy + 13];
    } else if (direction.y === 1) {
      e1 = [hx + 5, hy + 13];
      e2 = [hx + 13, hy + 13];
    } else {
      e1 = [hx + 5, hy + 5];
      e2 = [hx + 13, hy + 5];
    }

    ctx.fillRect(e1[0], e1[1], 3, 3);
    ctx.fillRect(e2[0], e2[1], 3, 3);
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

  return {
    render,
    updateHud,
    showGameOver,
    hideGameOver,
  };
}