function playPiece(piece) {
  return new Promise(function(resolve) {
    var elementPlayers = new Array;
    //start
    for (let i = 0; i < piece.elements.length; i++) {
      elementPlayers.push(new playElement(piece.elements[i]));
    }
    //stop
    setTimeout(
      function() {
        for (let i = 0; i < elementPlayers.length; i++) {
          elementPlayers[i].stop();
        }
        resolve();
      },
      piece.duration
    );
  });
}

function playElement(element) {
  var random = new noRep(element.sounds.length, 1, 1);
  var metro = setInterval(
    function() {
      buffer(element.sounds[random.next()].previews['preview-lq-mp3']);
    },
    element.structure.metro
  );
  this.stop = function() {
    clearInterval(metro);
  }
}

function noRep(max, waiting, reuse) {
  var possible = new Array;
  var discarded = new Array;
  for (var i = 0; i < max; i++) {
    possible.push(i)
  }
  this.next = function() {
    if (discarded.length > waiting || possible.length == 0) {
      possible = possible.concat(discarded.slice(0, reuse));
      discarded.splice(0, reuse);
    }
    var index = Math.floor(Math.random() * possible.length);
    var result = possible[index];
    possible.splice(index, 1);
    discarded.push(result);
    return result;
  }
}
