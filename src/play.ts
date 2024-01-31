import { createFade } from './helpers.js'
import { ElementWith, PieceWith, PiecesWith } from './types/PiecesWith.js'
import { LoadedSounds } from './types/Sounds.js'
import { Context } from './types/Types.js'

const playElement =
	(context: Context) =>
	(
		element: ElementWith<LoadedSounds>,
		destination: AudioNode,
		offset: number
	): void => {
		const { metro, fade = 0 } = element.structure
		element.sounds.forEach((sound) => {
			const computedDuration = metro || sound.duration
			sound.schedule.forEach((timestamp) => {
				const source = context.createBufferSource()
				source.buffer = sound.buffer
				const gain = context.createGain()
				gain.connect(destination)
				source.connect(gain)
				const { fadeIn, fadeOut } = createFade(gain)

				source.start(offset + timestamp, 0, computedDuration)
				fadeIn(fade, offset + timestamp)
				fadeOut(fade, offset + timestamp + sound.duration - fade)
			})
		})
	}

const playPiece =
	(context: Context) =>
	(
		piece: PieceWith<LoadedSounds>,
		destination: AudioNode,
		offset: number
	): void => {
		const play = playElement(context)
		piece.schedule.forEach((timestamp) => {
			const gain = context.createGain()
			gain.connect(destination)

			const { fadeIn, fadeOut } = createFade(gain)
			fadeIn(piece.fade, offset + timestamp)
			fadeOut(piece.fade, offset + timestamp + piece.duration)
			piece.elements.forEach((element) => {
				play(element, gain, offset)
			})
		})
	}

const playPieces =
	(context: Context) =>
	(
		pieces: PiecesWith<LoadedSounds>,
		destination: AudioNode,
		offset: number
	): void => {
		const play = playPiece(context)
		pieces.forEach((piece) => play(piece, destination, offset))
	}

const play = (context: Context) => {
	return {
		pieces: playPieces(context),
		piece: playPiece(context),
		element: playElement(context),
	}
}

export default play
