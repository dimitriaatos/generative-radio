import { Options } from './types/Pieces.js'

export const options: Options = {
	fields: [
		'username',
		'name',
		'duration',
		'created',
		'url',
		'license',
		'previews',
		'tags',
	],
	filter: {
		duration: [0, 60],
	},
	// page_size: 150,
	results: 150,
	sort: 'rating_desc',
}

export const element = {
	search: {
		// text: 'radio',
		options,
	},
	structure: {
		// metro: 4
	},
} as const

export const fade = {
	durationPercentage: 0,
	duration: 0,
} as const

const defaults = {
	options,
	element,
	fade,
} as const

export default defaults
