export type Filter = {
	duration: number[]
}

type Sort =
	| 'score'
	| 'duration_desc'
	| 'duration_asc'
	| 'created_desc'
	| 'created_asc'
	| 'downloads_desc'
	| 'downloads_asc'
	| 'rating_desc'
	| 'rating_asc'

type Fields =
	| 'id'
	| 'url'
	| 'name'
	| 'tags'
	| 'description'
	| 'geotag'
	| 'created'
	| 'license'
	| 'type'
	| 'channels'
	| 'filesize'
	| 'bitrate'
	| 'bitdepth'
	| 'duration'
	| 'samplerate'
	| 'username'
	| 'pack'
	| 'download'
	| 'bookmark'
	| 'previews'
	| 'images'
	| 'num_downloads'
	| 'avg_rating'
	| 'num_ratings'
	| 'rate'
	| 'comments'
	| 'num_comments'
	| 'comment'
	| 'similar_sounds'
	| 'analysis'
	| 'analysis_stats'
	| 'analysis_frames'
	| 'ac_analysis'

export type Options = {
	fields?: Fields[]
	results?: number
	filter?: Filter
	sort?: Sort
}

export type Structure = {
	fade?: number
} & (
	| {
			mono: boolean
			metro?: number
	  }
	| {
			mono?: boolean
			metro: number
	  }
)

export type SearchTerm =
	| {
			text?: never
			sound: number
	  }
	| {
			text: string
			sound?: never
	  }

export type Search = SearchTerm & {
	options?: Options
}

export type ElementStructure = {
	structure: Structure
}

export type Element = ElementStructure & {
	search: Search
}

export type PieceStructure = {
	duration: number
	fade: number
}

export type Piece = PieceStructure & {
	elements: Element[]
}

export type Pieces = Piece[]
