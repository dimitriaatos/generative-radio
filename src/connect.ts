import { createFade } from './helpers.js'
import { ElementWith, PieceWith, PiecesWith } from './types/PiecesWith.js'
import { LoadedSounds } from './types/Sounds.js'

const connectElement =
	(context: OfflineAudioContext) =>
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

const connectPiece =
	(context: OfflineAudioContext) =>
	(
		piece: PieceWith<LoadedSounds>,
		destination: AudioNode,
		offset: number
	): void => {
		const connect = connectElement(context)
		piece.schedule.forEach((timestamp) => {
			const gain = context.createGain()
			gain.connect(destination)

			const { fadeIn, fadeOut } = createFade(gain)
			fadeIn(piece.fade, offset + timestamp)
			fadeOut(piece.fade, offset + timestamp + piece.duration)
			piece.elements.forEach((element) => {
				connect(element, gain, offset)
			})
		})
	}

const connectPieces =
	(context: OfflineAudioContext) =>
	(
		pieces: PiecesWith<LoadedSounds>,
		destination: AudioNode,
		offset: number
	): void => {
		const connect = connectPiece(context)
		pieces.forEach((piece) => connect(piece, destination, offset))
	}

const connect = (context: OfflineAudioContext) => {
	return {
		pieces: connectPieces(context),
		piece: connectPiece(context),
		element: connectElement(context),
	}
}

export default connect
