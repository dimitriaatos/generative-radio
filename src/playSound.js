import { loadBuffer, sec2ms, Fade } from './helpers'
import { state } from './globals'
import delay from 'delay'

export default class {
	constructor(sound, elementGainNode, options = {}) {
		options = {
			autoplay: false,
			fadeDurationPrec: 0,
			fadeDuration: 0,
			maxDuration: sound.duration,
			...options
		}
		Object.assign(this, options, {sound, elementGainNode})
		if (this.fadeDurationPrec) this.fadeDuration = this.maxDuration * this.fadeDurationPrec
		this.gain = state.context.createGain()
		this.gain.gain.setValueAtTime(0.001, state.context.currentTime)
		this.onstarted = () => {}
		this.onended = () => {}
		this.source = state.context.createBufferSource()
		this.fade = new Fade(state.context, this.gain, this.fadeDuration)
		
		this.source.onended = () => {
			this.active = false
			this.onended()
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
		this.fade.fadeIn()
		delay(sec2ms(this.maxDuration - this.fadeDuration)).then(() => {
			this.fade.fadeOut()
		})
		delay(sec2ms(this.maxDuration)).then(this.stop)
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
		if (this) {
			state.debug && console.log('				sound stop')
			this.active = false
			this.source.stop()
			this.onended()
		}
	}
}