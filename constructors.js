function playPiece(piece) {
    var elementPlayList = new Array;
    //start
    for (let i = 0; i < piece.elements.length; i++) {
        let elementPlay = new playElement(piece.elements[i]);
        elementPlayList.push(elementPlay);
    }
    //stop
    this.stop = function () {
        for (let i = 0; i < elementPlayList.length; i++) {
            elementPlayList[i].stop();
        }
    };
}

function playElement(element) {
    var random = new noRep(element.sounds.length, 1, 1);
    var metro = setInterval(
        function () {
            player(element.sounds[random.next()].previews['preview-lq-mp3']);
        },
        element.structure.metro
    );
    this.stop = function () {clearInterval(metro);}
}

function noRep(max, waiting, reuse){
    var possible = new Array;
    var discarded = new Array;
    for (var i = 0; i < max; i++) {possible.push(i)}
    this.next = function () {
        if (discarded.length > waiting || possible.length == 0) {
            possible = possible.concat(discarded.slice(0, reuse));
            discarded.splice(0, reuse);
        }
        var index = Math.floor(Math.random()*possible.length);
        var result = possible[index];
        possible.splice(index, 1);
        discarded.push(result);
        return result;
    }
}
