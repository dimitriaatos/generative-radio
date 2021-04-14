import Generative from './../src/index'
import pieces from './pieces.json'

const gen = new Generative(pieces)

gen.token = 'token'

document.querySelector('button').addEventListener('click', () => { gen.play(pieces) })

document.querySelector('input[type="range"]')
	.addEventListener('change', ({target: {value}}) => { gen.gain = value })