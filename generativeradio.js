freesound.setToken(freesoundToken);
// var pieces;
loadJSON('assets/js/gen_radio/piece.json');
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
                    function(){console.log('Error while searching...');}
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

function player(file) {
    if (first) {
        mess();
        first = false;
    }
    var player = document.createElement('audio');
    player.setAttribute('controls', 1);
    player.setAttribute('autoplay', 1);
    // player.setAttribute('loop', 1);
    player.style.position = 'absolute';
    player.style.left = Math.random()*window.innerWidth+'px';
    player.style.top = Math.random()*window.innerHeight+'px';
    player.setAttribute('src', file);
    document.body.appendChild(player);
    player.addEventListener('ended', function(){
        player.parentNode.removeChild(player);
    });
}
