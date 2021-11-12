import { NoRepetition, sec2ms } from './helpers'
import { state } from './globals'
import { loadElement } from './loadingFunctions'
import delay from 'delay'
import playSound from './playSound'

export default class {
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
		const fadeOptions = {}
		const maxDuration = mono && metro ?
			Math.min(metro, sound.duration) :
			(this?.element?.search?.options?.filter?.duration[1] || sound.duration)
		
		const clippedFade = Math.min(this.element.structure.fade || 0, 0.5)
		if (mono && metro) {
			fadeOptions.fadeDurationPrec = clippedFade
		} else {
			fadeOptions.fadeDuration = clippedFade * (metro || 1)
		}
		const player = new playSound(
			sound,
			this.pieceGainNode,
			{
				...fadeOptions,
				maxDuration
			}
		)
		player.onstarted = () => {
			state.allPlayers.add(player)
			state.ontrigger({sound, numPlayers: state.allPlayers.size})
			this.onstarted()
		}
		player.onended = () => {
			state.allPlayers.delete(player)
			state.ontrigger({numPlayers: state.allPlayers.size})
		}
		return player
	}

	async play() {
		state.debug && console.log('			element start')
		this.playing = true
		this.element.loaded || this.load()
		const random = new NoRepetition(this.element.sounds.length, 1, 1)
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {
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
		this.element = await loadElement(this.element)
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