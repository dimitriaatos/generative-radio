import { noRep, loadBuffer } from './helpers.js'
import { state } from './globals.js'
// import {
// 	playingNow
// } from './references.js'
import { loadElement, loadPiece } from './loadingFunctions.js'

state.freesound.setToken(state.freesoundToken)

const playSound = class {
	constructor(url) {
		this.playing = true
		this.source
		this.onstarted
		this.onended
		new Promise((resolve, reject) => {
			loadBuffer(url, state.context).then((response) => {
				if (this.playing) {
					const source = state.context.createBufferSource()
					source.buffer = response
					source.connect(state.gainNode)
					source.start(0)
					resolve(source)
				} else {
					reject()
				}
			})
		}).then((source) => {
			source.onended = this.onended
			this.source = source
			this.onstarted()
		})
	}
	stop() {
		this.playing = false
		this.source.stop()
	}
}


const playElement = class {
	constructor(element) {
		//loadPiece will resolve immediately if the piece is loaded.
		this.metro
		loadElement(element).then((response) => {
			element = response
			let random = new noRep(element.sounds.length, 1, 1)
			this.metro = setInterval(
				() => {
					let sound = element.sounds[random.next()]
					let player = new playSound(sound.previews['preview-lq-mp3'])
					player.onstarted = () => {
						state.allPlayers.add(player)
					}
					player.onended = () => {
						state.allPlayers.delete(player)
					}
				},
				element.structure.metro * 1000
			)
		})
	}

	stop() {
		clearInterval(this.metro)
	}

	cut() {
		this.stop()
		state.allPlayers.forEach((player) => {
			player.stop()
		})
	}
}

const playPiece = class {
	constructor(piece){
		state.context.status != 'running' && state.context.resume()
		this.piece = piece
		this.elementPlayers = []
		this.onended
		new Promise((resolve) => {
			//loadPiece will resolve immediately if the piece is loaded.
			loadPiece(this.piece).then((response) => {
				this.piece = response
				//start
				this.piece.elements.forEach((element) => {
					this.elementPlayers.push(new playElement(element))
				})
				//stop
				setTimeout(
					() => {
						this.elementPlayers.forEach((player) => player.stop())
						resolve(piece)
					},
					piece.duration * 1000
				)
			})
		}).then(() => {
			this.onended(this.piece)
		})
	}
	stop(){
		this.elementPlayers.forEach((player) => player.stop())
	}
	cut(){
		this.elementPlayers.forEach((player) => player.cut())
	}
}

const playPieces = class {
	constructor(pieces){
		this.norep = new noRep(pieces.length, 1, 1)
		this.piecePlayer
		this.pieces = pieces
		const sequence = () => {
			new Promise((resolve) => {
				const index = this.norep.next()
				this.piecePlayer = new playPiece(this.pieces[index])
				this.piecePlayer.onended = (response) => {
					this.pieces[index] = response
					resolve()
				}
			}).then(() => {
				sequence()
			})
		}
		sequence()
	}
	stop(){
		this.piecePlayer.stop()
	}
	cut(){
		this.piecePlayer.cut()
	}
}

const GenerativeRadio = class {
	constructor(pieces) {
		this.pieces = pieces
		this.player
	}
	
	play(pieces) {
		this.pieces = pieces || this.pieces
		this.player = new playPieces(this.pieces)
		return this
	}

	stop() {
		this.player.cut()
		return this
	}

	set gain(newGain){
		state.gainNode.gain.value = newGain
	}

}

export default GenerativeRadio
export {playPieces, playPiece, playElement}
