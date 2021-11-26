const asyncPipe = (...fns) => (arg) => fns.reduce((p, f) => p.then(f), Promise.resolve(arg))

const NoRepetition = class {
	constructor(max, waiting, reuse){
		const fillRange = (start, end) => Array(end - start + 1).fill(0).map((item, index) => start + index)
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

const loadBuffer = async (url, context) => await fetch(url)
	.then((response) => response.arrayBuffer())
	.then((arrayBuffer) => context.decodeAudioData(arrayBuffer))

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

const ms2sec = (t) => t / 1000
const sec2ms = (t) => t * 1000

const safeChain = (string, obj) => string.split('.').reduce((res, el) => res = res && res[el], obj)

export {
	safeChain,
	asyncPipe,
	NoRepetition,
	deepMerge,
	loadBuffer,
	deepClone,
	ms2sec,
	sec2ms
}
