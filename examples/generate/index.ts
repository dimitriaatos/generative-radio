import 'dotenv/config'
import toWav from 'audiobuffer-to-wav'
import { default as FreeSound } from 'freesound-client'
import { OfflineAudioContext } from 'node-web-audio-api'
import { Buffer } from 'node:buffer'
import createGenerativeRadio from '../../src/index.js'
import { Pieces } from '../../src/types/Pieces.js'
import pieces from '../pieces.json' assert { type: 'json' }
import { Lame } from 'node-lame'

const start = Date.now()

const sampleRate = 44100
const channels = 2

const durationInMinutes = parseInt(process.argv?.[2])
const durationInSeconds = (durationInMinutes || 1) * 60

console.log(`Generate for ${durationInSeconds} seconds.`)

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
		console.log('- Encoding finished')
		const end = Date.now()
		console.log(`Execution time: ${(end - start) / 1000} s`)
	})
	.catch((error) => {
		console.error(error)
	})
