import { state, initState } from './globals'
import playElement from './playElement'
import playPieces from './playPieces'
import playPiece from './playPiece'

const GenerativeRadio = class {
	constructor(pieces) {
		initState()
		this.pieces = pieces.pieces
		this._playing = false
	}

	play(pieces) {
		state.debug && console.log('generative play')
		this.pieces = pieces || this.pieces
		if (!this._playing) {
			this.player = new playPieces(this.pieces)
			this._playing = true
		}
		return this
	}

	get playing() {
		return this._playing
	}

	stop() {
		state.debug && console.log('generative stop')
		this.player && this.player.cut()
		this._playing = false
		return this
	}

	set gain(newGain){
		state.gainNode.gain.value = newGain
	}

	set token(newToken){
		state.freesound.setToken(newToken)
	}

	set ontrigger(callback){
		state.ontrigger = callback
	}
	
	set debug(val) {
		state.debug = val
	}
}

export default GenerativeRadio
export { playPieces, playPiece, playElement }
