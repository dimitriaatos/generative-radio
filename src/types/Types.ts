import FreeSoundClient from 'freesound-client'

export const FreeSound = FreeSoundClient.default
export type FreeSoundType = InstanceType<typeof FreeSound>
