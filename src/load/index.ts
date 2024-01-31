import { Context, FreeSoundType } from '../types/Types.js'
import { loadElement, loadPiece, loadPieces } from './freesound.js'
import {
	loadElementSounds,
	loadPieceSounds,
	loadPiecesSounds,
	loadSound,
} from './sounds.js'

type LoadParam = Context | FreeSoundType

const isAnyContext = (param: LoadParam): param is Context => {
	return (param as Context).sampleRate !== undefined
}

const isFreeSound = (param: LoadParam): param is FreeSoundType => {
	return (param as FreeSoundType).search !== undefined
}

export function load(param: Context): {
	sound: ReturnType<typeof loadSound>
	element: ReturnType<typeof loadElementSounds>
	piece: ReturnType<typeof loadPieceSounds>
	pieces: ReturnType<typeof loadPiecesSounds>
}

export function load(param: FreeSoundType): {
	element: ReturnType<typeof loadElement>
	piece: ReturnType<typeof loadPiece>
	pieces: ReturnType<typeof loadPieces>
}

/**
 * Returns loader functions
 * @param param - {@link FreeSound | freesound} for FreeSound API or {@link OfflineAudioContext} for loading audio files.
 * @returns Returns corresponding loaders for the passed {@link param}
 */
export function load(param: LoadParam) {
	if (isAnyContext(param)) {
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
