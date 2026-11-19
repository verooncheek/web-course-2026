export function createGameView() {
  const roundEl = document.getElementById('round');
  const messageEl = document.getElementById('message');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const pads = [...document.querySelectorAll('.pad')];

  return {
    updateRound(round) {
      roundEl.textContent = round;
    },

    setMessage(text) {
      messageEl.textContent = text;
    },

    setStartButtonDisabled(isDisabled) {
      startBtn.disabled = isDisabled;
    },
    
    flashPad(index, ms, schedule) {
      return new Promise(resolve => {
        const pad = pads[index];
        if (!pad) {
          resolve();
          return;
        }

        pad.classList.add('active');
        schedule(() => {
          pad.classList.remove('active');
          resolve();
        }, ms);
      });
    },

    clearAllPads() {
      pads.forEach(pad => pad.classList.remove('active'));
    },

    onStart(handler) {
      startBtn.addEventListener('click', handler);
    },

    onReset(handler) {
      resetBtn.addEventListener('click', handler);
    },

    onPadClick(handler) {
      pads.forEach(pad => {
        pad.addEventListener('click', () => handler(Number(pad.dataset.index)));
      });
    }
  };
}