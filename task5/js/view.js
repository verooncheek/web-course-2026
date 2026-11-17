export function createGameModel() {
  let state = {
    sequence: [],
    playerIndex: 0,
    round: 0,
    acceptingInput: false,
    playing: false
  };

  let activeTimeouts = [];

  return {
    getState() {
      return state;
    },
    setState(newState) {
      state = { ...state, ...newState };
    },
    reset() {
      this.clearAllTimers();
      state = {
        sequence: [],
        playerIndex: 0,
        round: 0,
        acceptingInput: false,
        playing: false
      };
    },
    addTimeout(id) {
      activeTimeouts.push(id);
    },
    clearAllTimers() {
      activeTimeouts.forEach(id => clearTimeout(id));
      activeTimeouts = [];
    },
    addStep() {
      const randomStep = Math.floor(Math.random() * 4);
      state.sequence.push(randomStep);
    }
  };
}