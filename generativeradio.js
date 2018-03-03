freesound.setToken(freesoundToken);
// var pieces;
loadJSON('piece.json');
var first = true;

function loadJSON(filename) {
    //formatting piece object so freesound can read it as a request
    function formatting(piecesList) {
        for (let j = 0; j < piecesList.length; j++) {
            var piece = piecesList[j];
            for (let i = 0; i < piece.elements.length; i++) {
                for (let key in piece.elements[i].search.options) {
                    if (piece.elements[i].search.options[key] == null){
                        delete options[key];
                    }
                }
                piece.elements[i].search.options.fields = 'username,name,duration,created,url,lisence,previews'
                if ('filter' in piece.elements[i].search.options) {
                    var filterString = new String;
                    for (let key in piece.elements[i].search.options.filter) {
                        filterString += key+':'+piece.elements[i].search.options.filter[key]+' ';
                    }
                    piece.elements[i].search.options.filter = filterString;
                }
                piecesList[j] = piece;
            }
        }
        return piecesList;
    }
    //XMLHttpRequest requesting JSON file
    var request = new XMLHttpRequest();
    request.addEventListener(
        'load',
        function () {
            var pieces = formatting(JSON.parse(this.responseText));
            loadSounds(pieces);
        }
    );
    request.open('GET', filename);
    request.send();
}
//calls loadSounds

function loadSounds(pieces){
    var random = new noRep(pieces.length, 1, 1);

    ! function choosePiece() {
        var currentPieceIndex = random.next();
        var piece = pieces[currentPieceIndex];
        var count = 0;
        //requesting sounds, triggers collect function
        for (let i = 0; i < piece.elements.length; i++) {
            if (typeof piece.elements[i].sounds == 'undefined') {
                freesound.textSearch(
                    piece.elements[i].search.text,
                    piece.elements[i].search.options,
                    function(response){
                        piece.elements[i].sounds = response.results;
                        pieces[currentPieceIndex].piece;
                        counter();
                    },
                    function(){alert('Error while searching...');}
                )
            }
            else {counter()}
        }
        //
        function counter() {
            count++;
            if (count == piece.elements.length) {
                //start
                var play = new playPiece(piece);
                //stop
                setTimeout(
                    function () {
                        play.stop();
                        choosePiece();
                    },
                    piece.duration
                );
            }
        }
    }()
}
//calls playPiece

window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

function buffer(link) {
  // Fix up prefixing
  var bufferLoader = new BufferLoader(
    context,
    [
      link
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(file) {
  if (first) {
          mess();
          first = false;
      }
  var source = context.createBufferSource();
  source.buffer = file[0];

  source.connect(context.destination);
  source.start(0);
}
