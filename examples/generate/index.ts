import toWav from 'audiobuffer-to-wav'
import 'dotenv/config'
import { default as FreeSound } from 'freesound-client'
import { OfflineAudioContext } from 'node-web-audio-api'
import { Buffer } from 'node:buffer'
import createGenerativeRadio from '../../src/index.js'
import { Pieces } from '../../src/types/Pieces.js'
import pieces from '../pieces.json' assert { type: 'json' }
import { Lame } from 'node-lame'

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

console.log('- Write to disc (generative.mp3)')
const buffer = Buffer.from(new Uint8Array(toWav(recording)))
const encoder = new Lame({
	output: './generative.mp3',
	bitrate: 128,
}).setBuffer(buffer)

encoder
	.encode()
	.then(() => {
		console.log('Encoding finished')
	})
	.catch((error) => {
		console.error(error)
	})
