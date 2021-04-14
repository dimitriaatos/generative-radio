import Generative from './../src/index'
import pieces from './pieces.json'

const gen = new Generative(pieces)

document.querySelector('button').addEventListener('click', gen.play())

document.querySelector('input[type="range"]')
	.addEventListener('change', ({target: {value}}) => { gen.gain = value})