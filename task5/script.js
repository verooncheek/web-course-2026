'use strict';

const pads      = [...document.querySelectorAll('.pad')];
const roundEl   = document.getElementById('round');
const messageEl = document.getElementById('message');
const startBtn  = document.getElementById('startBtn');
const resetBtn  = document.getElementById('resetBtn');

const state = {
  sequence: [],
  playerIndex: 0,
  round: 0,
  acceptingInput: false,
  playing: false,
};

const timers = [];
function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}
function clearTimers() {
  while (timers.length) clearTimeout(timers.pop());
}

let audioCtx = null;
const TONES = [440, 330, 220, 550]; 

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function beep(index, duration = 0.3) {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square'; 
  osc.frequency.value = TONES[index] || 440;
  
  const t = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function flash(index, ms = 400) {
  const pad = pads[index];
  pad.classList.add('active');
  beep(index);
  later(() => pad.classList.remove('active'), ms);
}

function randomStep() {
  return Math.floor(Math.random() * 4);
}

function setMessage(text) {
  messageEl.textContent = text;
}

function startGame() {
  ensureAudio();
  clearTimers();
  state.sequence = [];
  state.round = 0;
  state.playerIndex = 0;
  state.playing = true;
  state.acceptingInput = false;
  startBtn.disabled = true;
  roundEl.textContent = '0';
  setMessage('ВНИМАНИЕ...');
  nextRound();
}

function nextRound() {
  state.round += 1;
  roundEl.textContent = state.round;
  state.playerIndex = 0;
  state.sequence.push(randomStep());

  setMessage('СМОТРИ...');
  state.acceptingInput = false;

  const DELAY_START = 800;
  const DELAY_STEP  = 600;
  const FLASH_MS    = 400;

  later(() => {
    state.sequence.forEach((idx, i) => {
      later(() => flash(idx, FLASH_MS), i * DELAY_STEP);
    });

    const totalShow = state.sequence.length * DELAY_STEP;
    later(() => {
      state.acceptingInput = true;
      setMessage('ТВОЙ ХОД!');
    }, totalShow + 200);
  }, DELAY_START);
}

function handlePadClick(index) {
  if (!state.acceptingInput || !state.playing) return;

  flash(index, 200);
  const expected = state.sequence[state.playerIndex];

  if (index !== expected) {
    state.acceptingInput = false;
    state.playing = false;
    startBtn.disabled = false;
    setMessage(`GAME OVER! РАУНД ${state.round}`);
    document.body.style.animation = 'glitch 0.5s 2';
    setTimeout(() => document.body.style.animation = '', 1000);
    later(() => beep(0, 0.4), 100);
    later(() => beep(0, 0.6), 300); 
    return;
  }

  state.playerIndex += 1;

  if (state.playerIndex === state.sequence.length) {
    state.acceptingInput = false;
    setMessage('ОТЛИЧНО!');
    later(nextRound, 1000);
  }
}

function resetGame() {
  clearTimers();
  state.sequence = [];
  state.playerIndex = 0;
  state.round = 0;
  state.playing = false;
  state.acceptingInput = false;
  startBtn.disabled = false;
  roundEl.textContent = '0';
  setMessage('НАЖМИ СТАРТ');
  pads.forEach(p => p.classList.remove('active'));
  document.body.style.animation = '';
}

pads.forEach(pad => {
  pad.addEventListener('click', () => {
    ensureAudio();
    handlePadClick(Number(pad.dataset.index));
  });
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

resetGame();