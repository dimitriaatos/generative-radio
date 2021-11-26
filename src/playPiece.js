import { safeChain, sec2ms } from './helpers'
import { state } from './globals'
import { loadPiece } from './loadingFunctions'
import delay from 'delay'
import smoothfade from 'smoothfade'
import playElement from './playElement'

export default class {
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
		state.debug && console.log(`		${this.piece.elements.map((element) => safeChain('search.text', element) || safeChain('search.sound', element)).join(', ')}`)
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
	}
	
	cut(){
		state.debug && console.log('		piece cut')
		this.playing = false
		this.elementPlayers.forEach((player) => player.cut())
		this.onended(this.piece)
	}
}