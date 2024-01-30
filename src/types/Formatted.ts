import { SearchTerm } from './Pieces.js'

// copied from freesound-client
export type FormattedOptions = {
	page?: number
	query?: string
	filter?: string
	sort?: string
	fields?: string
	group_by_pack?: 1 | 0
}

export type FormattedSearch = SearchTerm & {
	options: FormattedOptions
}
