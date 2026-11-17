import { playTone } from './sound.js';

export function createGameController(model, view) {
  function wait(ms) {
    return new Promise(resolve => {
      const id = setTimeout(resolve, ms);
      model.addTimeout(id);
    });
  }

  async function playSequence() {
    view.setMessage('СМОТРИ...');
    model.setState({ acceptingInput: false });

    await wait(800);

    const sequence = model.getState().sequence;
    for (let i = 0; i < sequence.length; i++) {
      if (!model.getState().playing) break;
      await view.flashPad(sequence[i], 400, id => model.addTimeout(id));
      await wait(250);
    }

    if (model.getState().playing) {
      model.setState({ acceptingInput: true });
      view.setMessage('ТВОЙ ХОД!');
    }
  }

  function nextRound() {
    const currentState = model.getState();
    if (!currentState.playing) return;

    model.setState({
      round: currentState.round + 1,
      playerIndex: 0
    });

    model.addStep();
    view.updateRound(model.getState().round);

    playSequence();
  }

  function startGame() {
    model.reset();
    view.clearAllPads();
    view.setStartButtonDisabled(true);
    model.setState({ playing: true });
    nextRound();
  }

  function resetGame() {
    model.reset();
    view.clearAllPads();
    view.setStartButtonDisabled(false);
    view.updateRound(0);
    view.setMessage('НАЖМИ СТАРТ');
  }

  async function handlePadClick(index) {
    const currentState = model.getState();
    if (!currentState.acceptingInput || !currentState.playing) return;

    view.flashPad(index, 200, id => model.addTimeout(id));

    const expected = currentState.sequence[currentState.playerIndex];

    if (index !== expected) {
      model.setState({ acceptingInput: false, playing: false });
      view.setStartButtonDisabled(false);
      view.setMessage(`ИГРА ОКОНЧЕНА! Раунд: ${currentState.round}`);
      playTone(0, 0.4);
      return;
    }

    const nextPlayerIndex = currentState.playerIndex + 1;
    model.setState({ playerIndex: nextPlayerIndex });

    if (nextPlayerIndex === currentState.sequence.length) {
      model.setState({ acceptingInput: false });
      view.setMessage('ВЕРНО!');
      await wait(1000);
      if (model.getState().playing) {
        nextRound();
      }
    }
  }

  function init() {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);

    view.getPads().forEach(pad => {
      pad.addEventListener('click', () => {
        const index = Number(pad.dataset.index);
        handlePadClick(index);
      });
    });

    resetGame();
  }

  return { init };
}