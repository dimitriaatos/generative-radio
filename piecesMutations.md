# Pieces mutations

## Piece

```typescript
type Pieces = [
	{
		elements: [
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
			}
		]
		duration: number
		fade: number
	}
]
```

## PiecesWithSchedule

Fill a predefined duration with a random selection of pieces,
results in a subset of pieces, each with an array of timestamps

```typescript
type PiecesWithSchedule = [
	// Filtered pieces
	//Piece with schedule
	{
		elements: [
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
			}
		]
		duration: number
		fade: number
		schedule: Timestamps[] //<---
	}
]
```

## PiecesWithLinks

Make a freesound API query for every element of every piece,
a `sounds` property is added to each elements containing the query response

```typescript
type PiecesWithLinks = [
	{
		elements: [
			// Element with sound metadata
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
				//---
				sounds: [
					{
						sound: Sound //<---
					}
				]
				//---
			}
		]
		duration: number
		fade: number
		schedule: Timestamps[]
	}
]
```

## PiecesWithScheduledElements

Fill the scheduled timeslot of each piece with a random selection of sounds,
results in elements with a subset of sounds each with an array of timestamps

```typescript
type PiecesWithScheduledElements = [
	{
		elements: [
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
				// Filtered sounds
				// Sounds with schedule
				sounds: [
					{
						sound: Sound //<---
						schedule: Timestamps[] //<---
					}
				]
			}
		]
		duration: number
		fade: number
		schedule: Timestamps[]
	}
]
```

## PiecesWithLoadedSounds

Fetching the audio buffer for each scheduled sound

```typescript
type PiecesWithLoadedSounds = [
	{
		elements: [
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
				// Loaded sounds with schedule
				sounds: [
					{
						buffer: AudioBuffer //<--
						sound: Sound
						schedule: Timestamps[]
					}
				]
			}
		]
		duration: number
		fade: number
		schedule: Timestamps[]
	}
]
```

## PiecesWithAudioNodes

Create a source and a gain node for each sound, and a master gain for each piece

```typescript
type PiecesWithAudioNodes = [
	{
		elements: [
			{
				search: {
					text?: string
					sound?: number
					options: {
						fields?: Fields[]
						results?: number
						filter?: Filter
						sort?: Sort
					}
				}
				structure: {
					duration: number
					fade: number
					metro: number
				}
				// sounds with audio nodes
				sounds: [
					{
						source: AudioBufferSourceNode //<--
						gain: GainNode //<--
						buffer: AudioBuffer
						sound: Sound
						schedule: Timestamps[]
					}
				]
			}
		]
		duration: number
		fade: number
		schedule: Timestamps[]
		gain: GainNode //<--
	}
]
```

```javascript
for (timestamp in schedule) {
	source.start(timestamp)
	const fadeDuration = sound.duration * fade
	fadeTo(1, fadeDuration, timestamp)
	fadeTo(0, fadeDuration, sound.duration - fadeDuration)
}
```
