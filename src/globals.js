import FreeSound from 'freesound-client'

const state = {
	debugging: false,
	allPlayers: new Set(),
	freesound: new FreeSound(),
}

const initState = () => {
	window.AudioContext = window.AudioContext || window.webkitAudioContext
	state.context = new AudioContext()
	state.gainNode = state.context.createGain()
	state.gainNode.connect(state.context.destination)
}


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

export {state, defaults, initState}
