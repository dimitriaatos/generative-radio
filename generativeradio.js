freesound.setToken(freesoundToken);
let first = true;

function loadJSON(filename) {
  return new Promise(function(resolve) {
    //XMLHttpRequest requesting JSON file
    var request = new XMLHttpRequest();
    request.addEventListener(
      'load',
      function() {
        resolve(JSON.parse(this.responseText));
      }
    );
    request.open('GET', filename);
    request.send();
  })
}

function reformatting(pieces) {
  for (let j = 0; j < pieces.length; j++) {
    var piece = pieces[j];
    for (let i = 0; i < piece.elements.length; i++) {
      for (let key in piece.elements[i].search.options) {
        if (piece.elements[i].search.options[key] == null) {
          delete options[key];
        }
      }
      piece.elements[i].search.options.fields = 'username,name,duration,created,url,lisence,previews'
      if ('filter' in piece.elements[i].search.options) {
        var filterString = new String;
        for (let key in piece.elements[i].search.options.filter) {
          filterString += key + ':' + piece.elements[i].search.options.filter[key] + ' ';
        }
        piece.elements[i].search.options.filter = filterString;
      }
      pieces[j] = piece;
    }
  }
  return pieces;
}

function loadPiece(args) {
  return new Promise(function(resolve, reject) {
    let piece = args.pieces[args.index];
    if (!piece.loaded) {
      let remainingRequests = piece.elements.length;
      for (let i = 0; i < piece.elements.length; i++) {
        freesound.textSearch(
          piece.elements[i].search.text,
          piece.elements[i].search.options,
          function(response) {
            piece.elements[i].sounds = response.results;
            --remainingRequests;
            if (remainingRequests <= 0) {
              args.pieces[args.index] = piece;
              args.pieces[args.index].loaded = true;
              resolve({
                pieces: args.pieces,
                index: args.index
              });
            }
          },
          function() {
            reject()
          }
        )
      }
    } else {
      resolve({
        pieces: args.pieces,
        index: args.index
      });
    }
  });
}

function loadAndPlay(args) {
  return new Promise(function (resolve) {
    loadPiece(args).then(function (response) {
      playPiece(response.pieces[response.index]).then(resolve)
    })
  });
}

function play(filename) {
  var norep;
  loadJSON(filename).then(function(response) {
    let pieces = reformatting(response);
    norep = new noRep(pieces.length, 1, 1);
    (function sequence(pieces) {
      new Promise(function (resolve) {
        loadAndPlay({pieces:pieces, index:norep.next()}).then(resolve);
      }).then(sequence.bind(this, pieces))
    })(pieces);
  })
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();

function buffer(link) {
  // Fix up prefixing
  var bufferLoader = new BufferLoader(
    context, [
      link
    ],
    finishedLoading
  );

  bufferLoader.load();
}

function finishedLoading(file) {
  if (first) {
    loaded();
    first = false;
  }
  var source = context.createBufferSource();
  source.buffer = file[0];

  source.connect(context.destination);
  source.start(0);
}
