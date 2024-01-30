import { Sound } from 'freesound-client'
import { Schedule } from './Scheduled.js'

export type Sounds = Array<{ sound: Sound, duration: number }>
export type ScheduledSounds = Array<Sounds[number] & Schedule>
export type LoadedSounds = Array<
	ScheduledSounds[number] & { buffer: AudioBuffer }
>
export type SoundsWithNodes = Array<
	LoadedSounds[number] & {
		gain: GainNode
		source: AudioBufferSourceNode
	}
>
