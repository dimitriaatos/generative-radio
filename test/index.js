import Generative from './../src/index'
import pieces from './pieces.json'

const gen = new Generative(pieces)

gen.token = 'token'

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
	.addEventListener('change', ({target: {value}}) => { gen.gain = value })