import { Sound } from 'freesound-client'
import { ElementWith, PieceWith, PiecesWith } from '../types/PiecesWith.js'
import { LoadedSounds, ScheduledSounds } from '../types/Sounds.js'

export const loadSound =
	(context: OfflineAudioContext) =>
	async (sound: Sound): Promise<AudioBuffer> => {
		return await fetch(sound.previews['preview-lq-mp3'])
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
	}

export const loadElementSounds =
	(context: OfflineAudioContext) =>
	async (
		element: ElementWith<ScheduledSounds>
	): Promise<ElementWith<LoadedSounds>> => {
		const load = loadSound(context)
		const sounds = await Promise.all(
			element.sounds.map(async (el) => ({
				...el,
				buffer: await load(el.sound),
			}))
		)

		return {
			...element,
			sounds,
		}
	}

export const loadPieceSounds =
	(context: OfflineAudioContext) =>
	async (
		piece: PieceWith<ScheduledSounds>
	): Promise<PieceWith<LoadedSounds>> => {
		const elements = await Promise.all(
			piece.elements.map(loadElementSounds(context))
		)
		return { ...piece, elements }
	}

export const loadPiecesSounds =
	(context: OfflineAudioContext) =>
	async (
		pieces: PiecesWith<ScheduledSounds>
	): Promise<PiecesWith<LoadedSounds>> => {
		const load = loadPieceSounds(context)
		return await Promise.all(pieces.map((piece) => load(piece)))
	}
