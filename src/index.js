import { NoRepetition, loadBuffer } from './helpers'
import { state, initState } from './globals'
import { loadElement, loadPiece } from './loadingFunctions'
import delay from 'delay'
import smoothfade from 'smoothfade'

let ontrigger = () => {}
const ms2sec = t => t / 1000
const sec2ms = t => t * 1000

const playSound = class {
	constructor(sound, elementGainNode, options = {}) {
		options = {
			autoplay: false,
			fadeDurationPrec: 0,
			maxDuration: sound.duration,
			...options
		}
		Object.assign(this, options, {sound, elementGainNode})
		this.fadeDuration = this.maxDuration * this.fadeDurationPrec
		this.gain = state.context.createGain()
		this.onstarted = () => {}
		this.onended = () => {}
		this.source = state.context.createBufferSource()
		this.fade = smoothfade(state.context, this.gain, {startValue: 0.001, fadeLength: this.fadeDuration})
		
		this.source.onended = () => {
			this.onended()
			this.active = false
		}
		this.source.connect(this.gain)
		this.gain.connect(this.elementGainNode)
		this.autoplay && this.play()
	}

	async play() {
		this.active = true
		this.source.buffer || await this.load()
		state.debug && console.log('				sound start')
		this.source.start(0)
		this.fade.fadeIn({startTime: state.context.currentTime})
		this.fade.fadeOut({
			targetValue: 0.001,
			startTime: state.context.currentTime + this.maxDuration - this.fadeDuration
		})
		setTimeout(() => {
			this.stop()
		}, sec2ms(this.maxDuration))
		this.onstarted()
		return this.source
	}

	async load() {
		let buffer
		state.debug && console.log('				loading sound...')
		if (!this.source.buffer) buffer = await loadBuffer(
			this.sound.previews['preview-lq-mp3'],
			state.context
		)
		if (!this.source.buffer) this.source.buffer = buffer
		state.debug && console.log('				sound loaded!')
		return this.source
	}
	
	stop() {
		state.debug && console.log('				sound stop')
		this.active = false
		this.source.stop()
		this.onended()
		return this
	}
}

const playElement = class {
	constructor(element, pieceGainNode, options = {}) {
		//loadPiece will resolve immediately if the piece is loaded.
		this.onstarted = () => {}
		options = {autoplay: false, ...options}
		Object.assign(this, options, {element, pieceGainNode})
		this.metro
		this.autoplay && this.play()
		this.started = false
		this.playing = false
		this.index = 0
		this.players = []
		this.loading = []
	}

	_makePlayer(index, mono, metro) {
		const sound = this.element.sounds[index]
		const maxDuration = mono && metro ? Math.min(metro, sound.duration) : (this?.element?.search?.options?.filter?.duration[1] || sound.duration)
		const player = new playSound(
			sound,
			this.pieceGainNode,
			{
				fadeDurationPrec: Math.min(this.element.structure.fade || 0, 0.5) * (mono && metro ? metro : 1),
				maxDuration
			}
		)
		player.onstarted = () => {
			state.allPlayers.add(player)
			ontrigger({sound, numPlayers: state.allPlayers.size})
			this.onstarted()
		}
		player.onended = () => {
			state.allPlayers.delete(player)
			ontrigger({numPlayers: state.allPlayers.size})
		}
		return player
	}

	async play() {
		state.debug && console.log('			element start')
		this.playing = true
		this.element.loaded || this.load()
		const random = new NoRepetition(this.element.sounds.length, 1, 1)
		return new Promise(async(resolve, reject) => {
			if (!this.element.structure.metro) {
				this.players[this.index] = this._makePlayer(
					random.next(),
					this.element.structure.mono,
					this.element.structure.metro
				)
				while (this.playing) {
					await this.loading[this.nextIndex]
					await this.players[this.index].play()
					resolve()
					await delay(sec2ms(this.players?.[this.nextIndex]?.source?.fadeDuration || 0))
					this.players[this.nextIndex] = this._makePlayer(
						random.next(),
						this.element.structure.mono,
						this.element.structure.metro
					)
					this.loading[this.nextIndex] = this.players[this.nextIndex].load()
					await delay(sec2ms(this.players[this.index].maxDuration - 2 * this.players[this.index].fadeDuration))
					this.incrementIndex()
				}
			} else {
				const {mono, metro, fade} = this.element.structure
				const metroInterval = mono ? metro * (1 - fade) : metro
				this.metro = setInterval(
					async () => {
						const player = this._makePlayer(
							random.next(),
							mono,
							metro
						)
						await player.play()
						this.started || resolve()
						this.started = true
					},
					sec2ms(metroInterval)
				)
			}
		})
	}

	get nextIndex(){
		return (this.index + 1) % 2
	}

	incrementIndex(){
		return this.index = this.nextIndex
	}

	async load() {
		this.element = await loadElement(element)
		return this.element
	}
	
	stop() {
		state.debug && console.log('			element stop')
		this.started = false
		this.playing = false
		clearInterval(this.metro)
		return this
	}

	cut() {
		state.debug && console.log('			element cut')
		this.started = false
		this.playing = false
		clearInterval(this.metro)
		state.allPlayers.forEach((player) => { player.stop() })
		return this
	}
}

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
		state.debug && console.log(`		${this.piece.elements.map(element => element.search?.text || element.search?.sound).join(', ')}`)
		this.piece = await loadPiece(this.piece)
		state.debug && console.log('		piece loaded!')
		if (this.playing) {
			this.elementPlayers = this.piece.elements.map((element) => new playElement(element, this.gain))
			await Promise.any(this.elementPlayers.map(e => e.play()))
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
		ontrigger = callback
	}
	
	set debug(val) {
		state.debug = val
	}
}

export default GenerativeRadio
export { playPieces, playPiece, playElement }
