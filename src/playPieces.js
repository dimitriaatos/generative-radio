import { NoRepetition } from './helpers'
import { state } from './globals'
import playPiece from './playPiece'

export default class {
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