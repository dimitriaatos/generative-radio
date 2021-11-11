import { loadBuffer, sec2ms } from './helpers'
import { state } from './globals'
import smoothfade from 'smoothfade'

export default class {
	constructor(sound, elementGainNode, options = {}) {
		options = {
			autoplay: false,
			fadeDurationPrec: 0,
			maxDuration: sound.duration,
			...options
		}
		Object.assign(this, options, {sound, elementGainNode})
		if (this.fadeDurationPrec) this.fadeDuration = this.maxDuration * this.fadeDurationPrec
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