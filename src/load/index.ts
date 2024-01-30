import { FreeSoundType } from '../types/Types.js'
import { loadElement, loadPiece, loadPieces } from './freesound.js'
import {
	loadSound,
	loadPieceSounds,
	loadPiecesSounds,
	loadElementSounds,
} from './sounds.js'

const isContext = (
	param: OfflineAudioContext | FreeSoundType
): param is OfflineAudioContext => {
	return (param as OfflineAudioContext).length !== undefined
}

const isFreeSound = (
	param: OfflineAudioContext | FreeSoundType
): param is FreeSoundType => {
	return (param as FreeSoundType).search !== undefined
}

export function load(param: OfflineAudioContext): {
	sound: ReturnType<typeof loadSound>
	element: ReturnType<typeof loadElementSounds>
	piece: ReturnType<typeof loadPieceSounds>
	pieces: ReturnType<typeof loadPiecesSounds>
}

export function load(param: FreeSoundType): {
	pieces: ReturnType<typeof loadPieces>
	piece: ReturnType<typeof loadPiece>
	element: ReturnType<typeof loadElement>
}

/**
 * Returns loader functions
 * @param param - {@link FreeSound | freesound} for FreeSound API or {@link OfflineAudioContext} for loading audio files.
 * @returns Returns corresponding loaders for the passed {@link param}
 */
export function load(param: OfflineAudioContext | FreeSoundType) {
	if (isContext(param)) {
		return {
			sound: loadSound(param),
			element: loadElementSounds(param),
			piece: loadPieceSounds(param),
			pieces: loadPiecesSounds(param),
		}
	} else if (isFreeSound(param)) {
		return {
			pieces: loadPieces(param),
			piece: loadPiece(param),
			element: loadElement(param),
		}
	}
}

export default load
