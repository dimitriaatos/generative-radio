import {deepMerge} from './helpers'
import {defaults, state} from './globals'

const formattingOptions = (options) => {
	options.fields = ['username','name','duration','created','url','license','previews'].join(',')
	if (options.filter) {
		if (options.filter.duration) {
			const dur = (i) => Number(options.filter.duration[i]) || '*'
			options.filter.duration = `[${dur(0)} TO ${dur(1)}]`
		}
		if (options.results) {
			options.page_size = (options.results > 150) ? 150 : options.results
		}
		const filterString = Object.entries(options.filter).map(([key, value]) => `${key}:${value}`).join(' ')
		options.filter = filterString
	}
	return options
}

const loadElement = async (element) => {
	if (!element.loaded) {
		element = deepMerge({}, defaults.element, element)
		const options = formattingOptions(element.search.options)

		const {results} = await state.freesound.textSearch(
			element.search.text,
			options
		)
		element.sounds = results
		element.loaded = true
		return element
	} else {
		return element
	}
}

const loadPiece = async (piece) => {
	if (!piece.loaded) {
		const elementPromises = piece.elements.map((element) => loadElement(element))
		const elements = await Promise.all(elementPromises)
		piece.loaded = true
		piece.elements = elements
		return piece
	} else { return piece }
}

export {formattingOptions, loadElement, loadPiece}
