function citation(sound) {
  let duration = (sound.duration < 1) ? "00:01" : moment(sound.duration, "ss").format("mm:ss");
  // return "\"" + sound.name + ",\" Freesound audio, " + duration + ", posted by \"" + sound.username + ",\" " + moment(sound.created).format("MMMM DD, YYYY")
  return `\"${sound.name},\" Freesound audio, ${duration}, posted by \"${sound.username},\" ${moment(sound.created).format("MMMM DD, YYYY")}`
}

function reference(sound) {
  let list = document.getElementById("sound-ref");
  let listItem = document.createElement("li");
  let link = document.createElement("a");

  link.innerHTML = citation(sound);
  link.setAttribute("href", sound.url);
  link.setAttribute("target", "_blank");
  listItem.appendChild(link);
  list.appendChild(listItem);
  setTimeout(function() {
      list.removeChild(listItem)
    },
    sound.duration * 1000
  )
}

function playingNow(args) {
  // const animation = document.getElementById("generative-radio-animation");
  const ref = document.getElementById("references");

  if (args.status == true) {
    reference(args.sound);
  }
  if (args.active != 0) {
    // animation.setAttribute("playing", "1");
    ref.setAttribute("display", "1");
  } else {
    // animation.setAttribute("playing", "0");
    ref.setAttribute("display", "0");
  }
}

export {playingNow};
