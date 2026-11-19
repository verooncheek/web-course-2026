import { playTone } from './sound.js';

export function createGameView() {
  const roundEl = document.getElementById('round');
  const messageEl = document.getElementById('message');
  const startBtn = document.getElementById('startBtn');
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
    flashPad(index, ms = 300, registerTimeout = null) {
      return new Promise(resolve => {
        const pad = pads[index];
        if (!pad) return resolve();

        pad.classList.add('active');
        playTone(index, ms / 1000);

        const timerId = setTimeout(() => {
          pad.classList.remove('active');
          resolve();
        }, ms);

        if (registerTimeout) {
          registerTimeout(timerId);
        }
      });
    },
    clearAllPads() {
      pads.forEach(p => p.classList.remove('active'));
    },
    getPads() {
      return pads;
    }
  };
}