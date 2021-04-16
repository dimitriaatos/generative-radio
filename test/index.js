import Generative from './../src/index'
import pieces from './pieces.json'

const gen = new Generative(pieces)

// The token is not hard coded to the front end code this way, but it is still public,
// in future versions the API calls will be handled on the server.
fetch(window.location.origin+'/token')
	.then(response => response.text())
	.then((token) => { gen.token = token })

gen.ontrigger = ({sound, numPlayers}) => {
	console.log(numPlayers + ' sounds playing.')
	if (sound) {
		console.log(sound.name + ' playing.')
		setInterval(
			() => { console.log(sound.name + ' stopped.') },
			sound.duration * 1000
		)
	}
}

document.querySelector('button').addEventListener('click', () => { gen.play() })

document.querySelector('input[type="range"]')
	.addEventListener('input', ({target: {value}}) => { gen.gain = value })