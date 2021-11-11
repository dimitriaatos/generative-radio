import { NoRepetition, sec2ms } from './helpers'
import { state, initState } from './globals'
import { loadPiece } from './loadingFunctions'
import delay from 'delay'
import smoothfade from 'smoothfade'
import playElement from './playElement'

const playPiece = class {
	constructor(piece){
		state.context.status != 'running' && state.context.resume()
		this.gain = state.context.createGain()
		this.gain.gain.setValueAtTime(0, state.context.currentTime)
		this.gain.connect(state.gainNode)
		this.playing = true
		this.piece = piece
		this.elementPlayers = []
		this.onended = () => {}
		this.fade = smoothfade(state.context, this.gain, {startValue: 0.001, fadeLength: this.piece.fade})
	}

	async play() {
		state.debug && console.log('		loading piece...')
		state.debug && console.log(`		${this.piece.elements.map((element) => element.search?.text || element.search?.sound).join(', ')}`)
		this.piece = await loadPiece(this.piece)
		state.debug && console.log('		piece loaded!')
		if (this.playing) {
			this.elementPlayers = this.piece.elements.map((element) => new playElement(element, this.gain))
			await Promise.any(this.elementPlayers.map((e) => e.play()))
			this.fade.fadeIn({targetValue: 1})
			this.stop(sec2ms(state.context.currentTime + this.piece.duration))
		}
	}

	async stop(timestamp){
		this.fade.fadeOut({targetValue: 0.001, startTime: timestamp})
		await delay(sec2ms(this.piece.duration + 2*this.piece.fade))
		state.debug && console.log('		piece stop')
		this.playing = false
		this.elementPlayers.forEach((player) => player.stop())
		this.elementPlayers = []
		this.onended(this.piece)
		return this
	}
	
	cut(){
		state.debug && console.log('		piece cut')
		this.playing = false
		this.elementPlayers.forEach((player) => player.cut())
		this.onended(this.piece)
		return this
	}
}

const playPieces = class {
	constructor(pieces, playing = true){
		this.noRepetition = new NoRepetition(pieces.length, 1, 1)
		this.piecePlayer
		this.playing = playing
		this.pieces = pieces
		const sequence = () => {
			new Promise((resolve) => {
				state.debug && console.log('	sequence pieces', this.playing)
				const index = this.noRepetition.next()
				this.piecePlayer = new playPiece(this.pieces[index])
				this.piecePlayer.onended = (response) => {
					this.pieces[index] = response
					resolve()
				}
				this.piecePlayer.play()
			}).then(() => { this.playing && sequence() })
		}
		sequence()
	}
	stop(){
		state.debug && console.log('	pieces stop')
		this.piecePlayer.stop()
		this.playing = false
		return this
	}
	cut(){
		state.debug && console.log('	pieces cut')
		this.piecePlayer.cut()
		this.playing = false
		return this
	}
}

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
