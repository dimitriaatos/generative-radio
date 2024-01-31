import 'dotenv/config'
import { default as FreeSound } from 'freesound-client'
import { OfflineAudioContext } from 'node-web-audio-api'
import createGenerativeRadio from '../../src/index.js'
import { Pieces } from '../../src/types/Pieces.js'
import pieces from '../pieces.json' assert { type: 'json' }
import { AudioContext } from 'node-web-audio-api'
import { AudioBufferSourceNode } from 'node-web-audio-api'

const sampleRate = 44100
const channels = 2

const durationInSeconds = 60

const offlineContext = new OfflineAudioContext(
	channels,
	sampleRate * durationInSeconds,
	sampleRate
)

const freesound = new FreeSound.default()
freesound.setToken(process.env.TOKEN as string)

console.log(`- Start playing generative radio for ${durationInSeconds} second`)

await createGenerativeRadio({
	pieces: pieces as Pieces,
	freesound,
	context: offlineContext,
	debug: true,
})

console.log('- Loaded, start recording...')
const recording = await offlineContext.startRendering()

const context = new AudioContext()

console.log('- Recording finished')
const player = new AudioBufferSourceNode(context, {
	buffer: recording,
})

player.connect(context.destination)
console.log('- Staring playback')
player.start()
