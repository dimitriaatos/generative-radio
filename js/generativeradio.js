import {
  noRep,
  loadBuffer
} from "./helpers.js";
import {
  state
} from "./globals.js";
import {
  playingNow
} from "./references.js";
import {
  formattingOptions,
  loadElement,
  loadPiece
} from "./loadingFunctions.js"

state.freesound.setToken(state.freesoundToken);

const playSound = function(url) {
  this.playing = true;
  this.source;
  this.onstarted;
  this.onended;
  new Promise((resolve, reject) => {
    loadBuffer(url, state.context).then(response => {
      if (this.playing) {
        const source = state.context.createBufferSource();
        source.buffer = response;
        source.connect(state.context.destination);
        source.start(0);
        resolve(source);
      } else {
        reject();
      }
    })
  }).then(source => {
    source.onended = this.onended;
    this.source = source;
    this.onstarted();
  });
  this.stop = () => {
    this.playing = false;
    this.source.stop();
  };
}


const playElement = function(element) {
  //loadPiece will resolve immediately if the piece is loaded.
  this.metro;
  loadElement(element).then(response => {
    element = response;
    let random = new noRep(element.sounds.length, 1, 1);
    this.metro = setInterval(
      () => {
        let sound = element.sounds[random.next()];
        let player = new playSound(sound.previews["preview-lq-mp3"]);
        player.onstarted = () => {
          state.allPlayers.add(player);
          playingNow({
            active: state.allPlayers.size,
            sound: sound,
            status: true
          })
        };
        player.onended = () => {
          state.allPlayers.delete(player);
          playingNow({
            active: state.allPlayers.size,
            sound: sound,
            status: false
          })
        }
      },
      element.structure.metro * 1000
    );
  })
  this.stop = () => {
    clearInterval(this.metro);
  }
  this.cut = () => {
    this.stop();
    state.allPlayers.forEach(player => {
      player.stop();
    })
  }
}

const playPiece = function(piece) {
  this.piece = piece;
  this.elementPlayers = [];
  this.onended;
  new Promise(resolve => {
    //loadPiece will resolve immediately if the piece is loaded.
    loadPiece(this.piece).then(response => {
      this.piece = response;
      //start
      this.piece.elements.forEach(element => {
        this.elementPlayers.push(new playElement(element));
      });
      //stop
      setTimeout(
        () => {
          this.elementPlayers.forEach(player => player.stop())
          resolve(piece);
        },
        piece.duration * 1000
      )
    })
  }).then(this.onended);
  this.stop = () => {
    this.elementPlayers.forEach(player => player.stop())
  };
  this.cut = () => {
    this.elementPlayers.forEach(player => player.cut())
  }
}

const playPieces = function(pieces) {
  this.norep = new noRep(pieces.length, 1, 1);
  this.piecePlayer;
  this.pieces = pieces;
  const sequence = () => {
    new Promise(resolve => {
      const index = this.norep.next();
      this.piecePlayer = new playPiece(this.pieces[index]);
      this.piecePlayer.onended = response => {
        this.pieces[index] = response;
        resolve();
      };
    }).then(sequence.bind(this));
  };
  sequence();
  this.stop = () => {
    this.piecePlayer.stop();
  };
  this.cut = () => {
    this.piecePlayer.cut();
  }
}

export {playPieces, playPiece, playElement}
