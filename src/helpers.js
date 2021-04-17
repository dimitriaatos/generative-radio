const asyncPipe = (...fns) => (arg) => fns.reduce((p, f) => p.then(f), Promise.resolve(arg))

const NoRepetition = class {
	constructor(max, waiting, reuse){
		const fillRange = (start, end) => Array(end - start + 1).fill().map((item, index) => start + index)
		this.waiting = waiting
		this.reuse = reuse
		this.possible = fillRange(0, max - 1)
		this.discarded = []
	}
	next() {
		if (this.discarded.length > this.waiting || this.possible.length == 0) {
			this.possible = this.possible.concat(this.discarded.slice(0, this.reuse))
			this.discarded.splice(0, this.reuse)
		}
		const index = Math.floor(Math.random() * this.possible.length)
		const result = this.possible[index]
		this.possible.splice(index, 1)
		this.discarded.push(result)
		return result
	}
}

const deepMerge = (target, ...sources) => {
	const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item))
	if (!sources.length) return target
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (let key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				deepMerge(target[key], source[key])
			} else { Object.assign(target, { [key]: source[key] }) }
		}
	}
	return deepMerge(target, ...sources)
}

const loadBuffer = async (url, context) => {
	const response = await fetch(url)
	const buffer = await response.arrayBuffer()
	return await new Promise((resolve, reject) => context.decodeAudioData(buffer, resolve, reject))
}


export {
	asyncPipe,
	NoRepetition,
	deepMerge,
	loadBuffer
}
