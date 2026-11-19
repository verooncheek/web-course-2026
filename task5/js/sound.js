let audioCtx = null;

const TONES = [440, 330, 220, 550];
const ERROR_TONE = 110;

function ensureAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function unlockAudio() {
  ensureAudio();
}

function beep(frequency, duration) {
  ensureAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';
  osc.frequency.value = frequency;

  const t = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export function playTone(index, duration = 0.3) {
  beep(TONES[index] ?? 440, duration);
}

export function playErrorTone() {
  beep(ERROR_TONE, 0.5);
}