import defaults from './defaults.js'
import { FormattedOptions } from './types/Formatted.js'
import { Options } from './types/Pieces.js'

const formatters = {
	fields: ([key, fields]: [string, Readonly<Options['fields']>]) => [
		key,
		fields.join(','),
	],
	/**
	 * @todo Figure out a safe way to handle duration filter
	 * @param param - Parameter array
	 * @param param.0 - Min duration
	 * @param param.1 - Max duration
	 * @returns Formatted duration
	 */
	duration: (
		key: 'duration',
		[min, max]: Readonly<Options['filter']['duration']>
	) => {
		if (min > max) [min, max] = [max, min]
		return [key, `[${min} TO ${max}]`]
	},
	results: ({ 1: results }: [string, number]) => ['page_size', results],
	filter: ([key, filter]: [string, Readonly<Options['filter']>]) => [
		key,
		Object.entries(filter)
			.map(([key, value]) => {
				const [formattedKey, formattedValue] = formatters.hasOwnProperty(key)
					? formatters[key](key, value)
					: [key, value]
				return `${formattedKey}:${formattedValue}`
			})
			.join(' '),
	],
} as const

/**
 * Formats element search options for a freesound query
 * @param options - Search {@link Options | options} of an element
 * @returns {@link FormattedOptions | Formatted options} for a freesound query
 * @todo Duration needs to be formatted alone and then as a property of filter
 */
export const formatOptions = (options: Readonly<Options>): FormattedOptions => {
	return Object.fromEntries(
		Object.entries(Object.assign({}, defaults.options, options)).map(
			([key, value]) => {
				const [formattedKey, formattedValue] = formatters.hasOwnProperty(key)
					? formatters[key]([key, value])
					: [key, value]
				return [formattedKey, formattedValue]
			}
		)
	)
}
