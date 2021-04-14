const asyncPipe = (...fns) => (arg) => fns.reduce((p, f) => p.then(f), Promise.resolve(arg))

const noRep = function(max, waiting, reuse) {
	const fillRange = (start, end) => Array(end - start + 1).fill().map((item, index) => start + index)
	let possible = fillRange(0, max - 1)
	let discarded = new Array
	this.next = () => {
		if (discarded.length > waiting || possible.length == 0) {
			possible = possible.concat(discarded.slice(0, reuse))
			discarded.splice(0, reuse)
		}
		const index = Math.floor(Math.random() * possible.length)
		const result = possible[index]
		possible.splice(index, 1)
		discarded.push(result)
		return result
	}
}

const deepMerge = (target, ...sources) => {
	function isObject(item) {
		return (item && typeof item === 'object' && !Array.isArray(item))
	}
	if (!sources.length) return target
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, {
					[key]: {}
				})
				deepMerge(target[key], source[key])
			} else {
				Object.assign(target, {
					[key]: source[key]
				})
			}
		}
	}
	return deepMerge(target, ...sources)
}

const loadBuffer = async (url, context) => {
	const response = await fetch(url)
	return context.decodeAudioData(await response.arrayBuffer())
}


export {
	asyncPipe,
	noRep,
	deepMerge,
	loadBuffer
}
