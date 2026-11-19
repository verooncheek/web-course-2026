function createInitialState() {
  return {
    sequence: [],
    playerInput: [],
    round: 0,
    acceptingInput: false,
    playing: false
  };
}

export function createGameModel() {
  let state = createInitialState();
  const activeTimeouts = new Set();

  function clearAllTimers() {
    activeTimeouts.forEach(id => clearTimeout(id));
    activeTimeouts.clear();
  }

  return {
    getState() {
      return state;
    },

    setState(newState) {
      state = { ...state, ...newState };
    },

    reset() {
      clearAllTimers();
      state = createInitialState();
    },

    addStep() {
      const randomStep = Math.floor(Math.random() * 4);
      state = { ...state, sequence: [...state.sequence, randomStep] };
    },

    addPlayerInput(index) {
      state = { ...state, playerInput: [...state.playerInput, index] };
    },

    addTimeout(id) {
      activeTimeouts.add(id);
    },

    removeTimeout(id) {
      activeTimeouts.delete(id);
    },

    clearAllTimers
  };
}
