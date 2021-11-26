import { NoRepetition, safeChain, sec2ms } from './helpers'
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
		this.player
		this.nextPlayer
		this.newPlayerLoad
	}

	_makePlayer(index, mono, metro) {
		const sound = this.element.sounds[index]
		const fadeOptions = {}
		const maxDuration = mono && metro ?
			Math.min(metro, sound.duration) :
			(Math.min(safeChain('element.search.options.filter.duration.1', this), sound.duration) || sound.duration)
		
		const clippedFadePrec = Math.min(this.element.structure.fade || 0, 0.5)
		if (mono && metro) {
			fadeOptions.fadeDuration = clippedFadePrec * metro
		} else {
			fadeOptions.fadeDurationPrec = clippedFadePrec
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
			const {mono, metro, fade} = this.element.structure
			if (!this.element.structure.metro) {
				this.player = this._makePlayer(
					random.next(),
					mono,
					metro
				)
				while (this.playing) {
					await this.newPlayerLoad
					await this.player.play()
					this.started || (this.started = true) && resolve(true)

					this.nextPlayer = this._makePlayer(
						random.next(),
						mono,
						metro
					)
					this.newPlayerLoad = this.nextPlayer.load()
					await delay(sec2ms(this.player.maxDuration - 1.5 * this.player.fadeDuration))
					this.player = this.nextPlayer
				}
			} else {
				const metroInterval = mono ? metro * (1 - fade) : metro
				this.metro = setInterval(
					async () => {
						const player = this._makePlayer(
							random.next(),
							mono,
							metro
						)
						await player.play()
						this.started || resolve(true)
						this.started = true
					},
					sec2ms(metroInterval)
				)
			}
		})
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
	}

	cut() {
		state.debug && console.log('			element cut')
		this.started = false
		this.playing = false
		clearInterval(this.metro)
		state.allPlayers.forEach((player) => { player.stop() })
	}
}