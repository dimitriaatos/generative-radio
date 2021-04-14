import FreeSound from 'freesound-client'
window.AudioContext = window.AudioContext || window.webkitAudioContext

const context = new AudioContext()

const state = {
	debugging: false,
	allPlayers: new Set(),
	context,
	freesound: new FreeSound(),
	gainNode: context.createGain(),
	freesoundToken: ''
}

state.gainNode.connect(state.context.destination)

const defaults = {
	element: {
		search: {
			text: 'radio',
			options: {
				results: 150,
				filter: {
					duration: [0, 60]
				},
				sort: 'rating_desc'
			}
		},
		structure: {
			metro: 4
		}
	}
}

export {state, defaults}
