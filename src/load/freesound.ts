import { SoundCollection } from 'freesound-client'
import { formatOptions } from '../format.js'
import { Element } from '../types/Pieces.js'
import { ElementWith, PieceWith, PiecesWith } from '../types/PiecesWith.js'
import { ScheduledPiece, ScheduledPieces } from '../types/Scheduled.js'
import { Sounds } from '../types/Sounds.js'
import { FreeSoundType } from '../types/Types.js'

const parseFreesound = ({ results }: SoundCollection): Sounds => {
	return results.map((sound) => ({ sound, duration: sound.duration }))
}
/**
 * Returns an element loader
 * @param freesound - A {@link FreeSound | freesound} instance
 * @returns An element loader function
 */
export const loadElement =
	(freesound: FreeSoundType) =>
	/**
	 * Loads sounds of an element from freesound
	 * @async
	 * @param element - Element to load
	 * @returns Freesound results
	 */
	async (element: Element): Promise<ElementWith<Sounds>> => {
		const options = formatOptions(element.search.options)
		let response
		if (element.search.text !== undefined) {
			response = await freesound.textSearch(element.search.text, options)
		}
		if (element.search.sound !== undefined) {
			const sound = await freesound.getSound(element.search.sound)
			response = await sound.getSimilar(options)
		}
		return { ...element, sounds: parseFreesound(response) }
	}

/**
 * Returns single piece loader
 * @param freesound - A {@link FreeSound | freesound} instance
 * @returns A piece loader function
 */
export const loadPiece =
	(freesound: FreeSoundType) =>
	/**
	 * Load a piece
	 * @async
	 * @param piece - A piece to load
	 * @returns Loaded piece promise
	 */
	async (piece: ScheduledPiece): Promise<PieceWith<Sounds>> => {
		const load = loadElement(freesound)
		const elements = await Promise.all(piece.elements.map(load))
		return { ...piece, elements }
	}

/**
 * Returns a loader for an array of pieces
 * @param freesound - A {@link FreeSound | freesound} instance
 * @returns A pieces loader function
 */
export const loadPieces =
	(freesound: FreeSoundType) =>
	/**
	 * Loads Pieces
	 * @async
	 * @param pieces - Pieces to load
	 * @returns Loaded pieces promise
	 */
	async (pieces: ScheduledPieces): Promise<PiecesWith<Sounds>> => {
		const load = loadPiece(freesound)
		const loadedPieces = await Promise.all(pieces.map(load))
		return loadedPieces
	}
