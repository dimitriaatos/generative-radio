import 'dotenv/config'
import { OfflineAudioContext } from 'node-web-audio-api'
import connect from './connect.js'
import load from './load/index.js'
import schedule from './schedule.js'
import { Pieces } from './types/Pieces.js'
import { PiecesWith } from './types/PiecesWith.js'
import { ScheduledPieces } from './types/Scheduled.js'
import { LoadedSounds, ScheduledSounds, Sounds } from './types/Sounds.js'
import { FreeSoundType } from './types/Types.js'

/**
 * Creates an instance of Generative Radio
 * @param param - Parameter object
 * @param param.freesound - A {@link FreeSound | freesound} instance
 * @param param.pieces - An array of {@link Pieces | pieces}
 * @param param.context - {@link AudioContext} or {@link OfflineAudioContext}
 */
const createGenerativeRadio = async ({
	freesound,
	pieces,
	context,
	debug = false,
}: {
	freesound: FreeSoundType
	pieces: Pieces
	context: OfflineAudioContext
	debug?: boolean
}): Promise<undefined> => {
	const availableTime = context.length / context.sampleRate

	const log = (...msgs: unknown[]) => {
		debug && console.log('- ', ...msgs)
	}

	// Schedule pieces (pieces only, no elements)
	log('Schedule pieces (pieces only, no elements)')
	const withSchedule: ScheduledPieces = schedule.piecesOnly(
		pieces,
		availableTime
	)
	// Load (freesound) the scheduled pieces (one query per element)
	log('Load (freesound) the scheduled pieces (one query per element)')
	const withSounds: PiecesWith<Sounds> = await load(freesound).pieces(
		withSchedule
	)
	// Schedule sounds of each element
	log('Schedule sounds of each element')
	const withScheduledSounds: PiecesWith<ScheduledSounds> =
		schedule.pieces(withSounds)

	// Load scheduled sounds
	log('Load scheduled sounds')
	const withLoadedSounds: PiecesWith<LoadedSounds> = await load(context).pieces(
		withScheduledSounds
	)

	// Create & connect audio nodes
	log('Create & connect audio nodes')
	connect(context).pieces(
		withLoadedSounds,
		context.destination,
		context.currentTime + 0.01
	)
}

export { load, schedule }

export default createGenerativeRadio
