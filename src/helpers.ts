import { Timestamp } from './types/Scheduled.js'

/**
 * Returns an array containing all numbers between a specified min and max
 * @param min - Min number
 * @param max - Max number
 * @returns An array containing all integers between min and max
 */
const fillRange = (min: number, max: number): number[] =>
	Array(max - min + 1)
		.fill(0)
		.map((_, index) => min + index)

/**
 * Generates random numbers without repetition
 * @param max - Max number of the range to choose from
 * @param waiting - Steps to wait for making chosen number again probable
 * @param reuse - The number of discarded values to revive after waiting steps
 */
export const NoRepetition = class {
	waiting: number
	reuse: number
	possible: number[]
	discarded: number[]

	constructor(max: number, waiting: number, reuse: number) {
		this.waiting = waiting
		this.reuse = reuse
		this.possible = fillRange(0, max - 1)
		this.discarded = []
	}

	/**
	 * Returns the next random number without repetitions
	 * @returns A random number
	 */
	next(): number {
		if (this.discarded.length > this.waiting || this.possible.length == 0) {
			this.possible = this.possible.concat(this.discarded.slice(0, this.reuse))
			this.discarded.splice(0, this.reuse)
		}
		const index = Math.floor(Math.random() * this.possible.length)
		const result = this.possible[index]
		this.possible.splice(index, 1)
		this.discarded.push(result)
		return result
	}
}

type FadeParams = [duration: number, timestamp: Timestamp]

/**
 * Returns a function for creating fades
 * @param gainNode - The {@link GainNode} to be faded
 * @returns {@link fadeTo} function
 */
export const createFade = (
	gainNode: Readonly<GainNode>
): {
	fadeTo: typeof fadeTo
	fadeIn: typeof fadeIn
	fadeOut: typeof fadeOut
} => {
	/**
	 * Creates a gain fade
	 * @param target - Gain value to fade to
	 * @param duration - Duration of fade
	 * @param timestamp - Star time
	 */
	const fadeTo = (
		target: number,
		duration: number,
		timestamp: number
	): void => {
		gainNode.gain.setValueAtTime(gainNode.gain.value, timestamp)
		gainNode.gain.exponentialRampToValueAtTime(target, timestamp + duration)
	}
	const fadeIn = (...args: FadeParams) => fadeTo(1, ...args)
	const fadeOut = (...args: FadeParams) => fadeTo(0.001, ...args)

	return { fadeTo, fadeIn, fadeOut }
}
