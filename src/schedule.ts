import { NoRepetition } from './helpers.js'
import { Pieces, Structure } from './types/Pieces.js'
import { ElementWith, PieceWith, PiecesWith } from './types/PiecesWith.js'
import {
	Item,
	Schedule,
	ScheduledPieces,
	Timestamp,
} from './types/Scheduled.js'
import { ScheduledSounds, Sounds } from './types/Sounds.js'

/**
 * Schedules timestamps for items of an array for a specified duration
 * @typeParam T - Type of passed items
 * @param items - An array of elements to schedule
 * @param duration - Available time for scheduling
 * @param offset - A time added to the scheduled time
 * @returns A {@link Schedule} array
 */
export const items = <T extends Array<Item> = Item[]>(
	items: T,
	duration: number,
	schedule: Timestamp[] | Timestamp = 0,
	structure?: Structure
): Array<T[number] & Schedule> => {
	if (typeof schedule === 'number') schedule = [schedule]
	const random = new NoRepetition(items.length, 1, 1)

	const indexMap = []
	const scheduledItems = []
	schedule.map((offset) => {
		let time: number = 0
		while (duration > time) {
			const index = random.next()

			if (indexMap[index] == undefined) {
				const newLength = scheduledItems.push({
					...items[index],
					schedule: [],
				})
				indexMap[index] = newLength - 1
			}

			scheduledItems[indexMap[index]].schedule.push(time + offset)
			time += structure?.metro || items[index].duration
		}
	})

	return scheduledItems
}

/**
 * Schedule the sounds of an element
 * @param element - Element to be scheduled
 * @param duration - Available time for scheduling
 * @param offset - A time added to the scheduled time
 * @returns A {@link Schedule | schedule}
 */
const element = (
	element: ElementWith<Sounds>,
	duration: number,
	schedule: Timestamp[]
): ElementWith<ScheduledSounds> => {
	const sounds = items<Sounds>(
		element.sounds,
		duration,
		schedule,
		element.structure
	)
	return {
		...element,
		sounds,
	}
}

/**
 * Schedule only {@link Pieces}
 * @param pieces - {@link Pieces} to schedule
 * @param duration - Available time for scheduling
 * @param offset - A time added to the scheduled time
 * @returns {@link PiecesWithSchedule}
 */
export const piecesOnly = (
	pieces: Pieces,
	duration: number,
	offset = 0
): ScheduledPieces => {
	return items<Pieces>(pieces, duration, [offset])
}

const piece = (piece: PieceWith<Sounds>): PieceWith<ScheduledSounds> => {
	return {
		...piece,
		elements: piece.elements.map((element) => {
			return schedule.element(element, piece.duration, piece.schedule)
		}),
	}
}

const pieces = (pieces: PiecesWith<Sounds>): PiecesWith<ScheduledSounds> => {
	return pieces.map((piece) => {
		return schedule.piece(piece)
	})
}

const schedule = {
	piecesOnly,
	pieces,
	piece,
	element,
	items,
}

export default schedule
