import {
  state
} from "./globals.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("freesound-ref").innerHTML = `Freesound. Accessed ${moment().format("MMMM DD, YYYY")}. http://www.freesound.org/.`;
});

import {
  playPieces,
  playElement
} from "./generativeradio.js";

window.play = (...args) => {
  let element = {
    search: {},
    structure: {}
  };
  args.forEach(arg => {
    if (typeof arg == "string") {
      element.search.text = arg;
    }
    if (typeof arg == "object") {
      element.search.options.filter.duration = arg;
    }
    if (typeof arg == "number") {
      element.structure.metro = arg;
    }
  });

  return new playElement(element);
}

const enablePlayButton = pieces => {
  const playButton = document.querySelector('#start')
  playButton.disabled = false
  playButton.addEventListener('click', () => {
    state.context.resume().then(
      () => {
        if (window.autoplay) window.autoplay.cut()
        window.autoplay = new playPieces(pieces)
      }
    )
  })
}

fetch("./js/pieces.json")
  .then(response => response.json())
  .then(enablePlayButton);