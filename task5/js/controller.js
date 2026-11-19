import { playTone, playErrorTone, unlockAudio } from './sound.js';

const SHOW_START_DELAY = 800;
const SHOW_FLASH_MS = 400;
const SHOW_GAP_MS = 250;
const CLICK_FLASH_MS = 200;
const NEXT_ROUND_DELAY = 1000;

export function createGameController(model, view) {
  function schedule(callback, ms) {
    const id = setTimeout(() => {
      model.removeTimeout(id);
      callback();
    }, ms);
    model.addTimeout(id);
  }

  function wait(ms) {
    return new Promise(resolve => schedule(resolve, ms));
  }

  function flashPad(index, ms) {
    playTone(index, ms / 1000);
    return view.flashPad(index, ms, schedule);
  }

  async function playSequence() {
    view.setMessage('СМОТРИ...');
    model.setState({ acceptingInput: false });

    await wait(SHOW_START_DELAY);

    const { sequence } = model.getState();
    for (const padIndex of sequence) {
      if (!model.getState().playing) return;
      await flashPad(padIndex, SHOW_FLASH_MS);
      await wait(SHOW_GAP_MS);
    }

    if (model.getState().playing) {
      model.setState({ acceptingInput: true });
      view.setMessage('ТВОЙ ХОД!');
    }
  }

  function nextRound() {
    const { playing, round } = model.getState();
    if (!playing) return;

    model.setState({ round: round + 1, playerInput: [] });
    model.addStep();
    view.updateRound(model.getState().round);

    playSequence();
  }

  function startGame() {
    unlockAudio();
    model.reset();
    view.clearAllPads();
    view.updateRound(0);
    view.setStartButtonDisabled(true);
    model.setState({ playing: true });
    nextRound();
  }

  function resetGame() {
    model.reset();
    view.clearAllPads();
    view.setStartButtonDisabled(false);
    view.updateRound(0);
    view.setMessage('НАЖМИТЕ СТАРТ');
  }

  function endGame(round) {
    model.setState({ acceptingInput: false, playing: false });
    view.setStartButtonDisabled(false);
    view.setMessage(`ВЫ ДОШЛИ ДО УРОВНЯ ${round}`);
    playErrorTone();
  }

  async function handlePadClick(index) {
    const state = model.getState();
    if (!state.acceptingInput || !state.playing) return;

    flashPad(index, CLICK_FLASH_MS);

    const expected = state.sequence[state.playerInput.length];

    if (index !== expected) {
      endGame(state.round);
      return;
    }

    model.addPlayerInput(index);

    const { playerInput, sequence } = model.getState();
    if (playerInput.length === sequence.length) {
      model.setState({ acceptingInput: false });
      view.setMessage('ВЕРНО!');
      await wait(NEXT_ROUND_DELAY);
      nextRound();
    }
  }

  function init() {
    view.onStart(startGame);
    view.onReset(resetGame);
    view.onPadClick(handlePadClick);
    resetGame();
  }

  return { init };
}