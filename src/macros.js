var play = function() {

	for (arg in arguments) {
		if (typeof arg == 'string') {
			element.search.text = arg
		}
		if (typeof arg == 'object') {
			element.search.options.filter.duration = arg
		}
		if (typeof arg == 'number') {
			element.structure.metro = arg
		}
	}

	return new playElement(element)
}
