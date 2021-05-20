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
				state.debug && console.log('				sound start', this.playing)
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
		state.debug && console.log('				sound stop')
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
		this.playing = true
		loadElement(element).then((response) => {
			if (this.playing) {
				state.debug && console.log('			element start')
				element = response
				const random = new NoRepetition(element.sounds.length, 1, 1)
				this.metro = setInterval(
					() => {
						state.debug && console.log('			element metro trigger!')
						const sound = element.sounds[random.next()]
						const player = new playSound(sound.previews['preview-lq-mp3'])
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
			}
		})
	}
	
	stop() {
		state.debug && console.log('			element stop')
		this.playing = false
		clearInterval(this.metro)
		return this
	}

	cut() {
		state.debug && console.log('			element cut')
		this.playing = false
		clearInterval(this.metro)
		state.allPlayers.forEach((player) => { player.stop() })
		return this
	}
}

const playPiece = class {
	constructor(piece){
		state.context.status != 'running' && state.context.resume()
		this.playing = true
		this.piece = piece
		this.elementPlayers = []
		this.onended
		new Promise((resolve, reject) => {
			state.debug && console.log('		piece start')
			//loadPiece will resolve immediately if the piece is loaded.
			loadPiece(this.piece).then((response) => {
				this.piece = response
				if (this.playing) {
					//start
					this.elementPlayers = this.piece.elements.map((element) => new playElement(element))
					//stop
					setTimeout(
						() => {
							if (this.playing) {
								this.elementPlayers.forEach((player) => player.stop())
								resolve(piece)
							} else {
								reject()
							}
						},
						piece.duration * 1000
					)
				}
			})
		}).then(() => { this.onended(this.piece) }).catch(()=>{})
	}
	stop(){
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
		this.pieces = pieces
		this.player
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
		ontrigger = callback
	}
	
	set debug(val) {
		state.debug = val
	}
}

export default GenerativeRadio
export { playPieces, playPiece, playElement }
