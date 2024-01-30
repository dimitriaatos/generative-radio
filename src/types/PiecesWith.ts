import { Element, PieceStructure } from './Pieces.js'
import { Schedule } from './Scheduled.js'
import { SoundsWithNodes } from './Sounds.js'

// Pieces with
export type ElementWith<S> = Element & { sounds: S }
export type PieceWith<S> = PieceStructure & {
	elements: ElementWith<S>[]
} & Schedule &
	(S extends SoundsWithNodes ? { gain: GainNode } : { gain?: never })
export type PiecesWith<S> = PieceWith<S>[]
