import FreeSoundClient from 'freesound-client'

export const FreeSound = FreeSoundClient.default
export type FreeSoundType = InstanceType<typeof FreeSound>

export type Context = OfflineAudioContext | AudioContext

export const isContext = (param: Context): param is AudioContext => {
	return (param as AudioContext).outputLatency !== undefined
}

export const isOfflineContext = (
	param: Context
): param is OfflineAudioContext => {
	return (param as OfflineAudioContext).length !== undefined
}
