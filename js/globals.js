import freesound from "./freesound.js";
window.AudioContext = window.AudioContext || window.webkitAudioContext;

const state = {
  allPlayers: new Set(),
  context: new AudioContext(),
  freesound: freesound(),
  freesoundToken: "PZnTCc2l8KUJCURXtIyU5hEuA30nDjItK9HTrSrk"
}

const defaults = {
  element: {
    search: {
      text: "radio",
      options: {
        results: 150,
        filter: {
          duration: [0, 60]
        },
        sort: "rating_desc"
      }
    },
    structure: {
      metro: 4
    }
  }
}

export {state, defaults};
