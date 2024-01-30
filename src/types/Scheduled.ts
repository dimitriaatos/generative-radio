import { Piece } from './Pieces.js'

export type Timestamp = number
export type Schedule = { schedule: Timestamp[] }
export type ScheduleWithNodes = {
	schedule: {
		timestamp: Timestamp
		gain: GainNode
		source: AudioBufferSourceNode
	}[]
}

export type Item = {
	duration: number
	/* trunk-ignore(eslint/@typescript-eslint/no-explicit-any) */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

// Pieces scheduled only
export type ScheduledPiece = Piece & Schedule
export type ScheduledPieces = ScheduledPiece[]
