import { NoRepetition, loadBuffer } from './helpers'
import { state, initState } from './globals'
import { loadElement, loadPiece } from './loadingFunctions'

let ontrigger = () => {}

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
		this.onended()
		return this
	}
}

const playElement = class {
	constructor(element) {
		//loadPiece will resolve immediately if the piece is loaded.
		this.metro
		loadElement(element).then((response) => {
			element = response
			const random = new NoRepetition(element.sounds.length, 1, 1)
			this.metro = setInterval(
				() => {
					const sound = element.sounds[random.next()]
					let player = new playSound(sound.previews['preview-lq-mp3'])
					player.onstarted = () => {
						state.allPlayers.add(player)
						ontrigger({sound, numPlayers: state.allPlayers.size})
					}
					player.onended = () => {
						state.allPlayers.delete(player)
						ontrigger({numPlayers: state.allPlayers.size})
					}
				},
				element.structure.metro * 1000
			)
		})
	}
	
	stop() {
		clearInterval(this.metro)
		return this
	}

	cut() {
		this.stop()
		state.allPlayers.forEach((player) => { player.stop() })
		return this
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
				this.elementPlayers = this.piece.elements.map((element) => new playElement(element))
				//stop
				setTimeout(
					() => {
						this.elementPlayers.forEach((player) => player.stop())
						resolve(piece)
					},
					piece.duration * 1000
				)
			})
		}).then(() => { this.onended(this.piece) })
	}
	stop(){
		this.elementPlayers.forEach((player) => player.stop())
		this.onended(this.piece)
		return this
	}
	cut(){
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
				const index = this.noRepetition.next()
				this.piecePlayer = new playPiece(this.pieces[index])
				this.piecePlayer.onended = (response) => {
					this.pieces[index] = response
					resolve()
				}
			}).then(() => { this.playing && sequence() })
		}
		sequence()
	}
	stop(){
		this.piecePlayer.stop()
		this.playing = false
		return this
	}
	cut(){
		this.piecePlayer.cut()
		this.playing = false
		return this
	}
}

const GenerativeRadio = class {
	constructor(pieces) {
		initState()
		this.pieces = pieces
		this.player
		this.callback
	}

	play(pieces) {
		this.pieces = pieces || this.pieces
		this.player && this.player.cut()
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

	set token(newToken){
		state.freesound.setToken(newToken)
	}

	set ontrigger(callback){
		ontrigger = callback
	}
}

export default GenerativeRadio
export { playPieces, playPiece, playElement }
