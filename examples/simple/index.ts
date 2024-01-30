import 'dotenv/config'
import { default as FreeSound } from 'freesound-client'
import {
	OfflineAudioContext,
	AudioBufferSourceNode,
	AudioContext,
} from 'node-web-audio-api'
import createGenerativeRadio from '../../src/index.js'
import { Pieces } from '../../src/types/Pieces.js'
import pieces from './pieces.json' assert { type: 'json' }

const sampleRate = 44100
const channels = 2

const durationInSeconds = 30

const offlineContext = new OfflineAudioContext(
	channels,
	sampleRate * durationInSeconds,
	sampleRate
)

const context = new AudioContext()

const freesound = new FreeSound.default()
freesound.setToken(process.env.TOKEN as string)

await createGenerativeRadio({
	pieces: pieces as Pieces,
	freesound,
	context: offlineContext,
	debug: true,
})
console.log('- Loaded, start recording...')
const recording = await offlineContext.startRendering()
console.log('- Recording finished')
const player = new AudioBufferSourceNode(context, {
	buffer: recording,
})
player.connect(context.destination)
console.log('- Staring playback')
player.start()
