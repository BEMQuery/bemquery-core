'use strict';

class Selector {
	constructor() {
		this.BEM = Selector.BEM;
		this.CSS = Selector.CSS;
	}
}

class Converter {
	convert() {
		return new Selector();
	}
}

function factory() {
	return new Converter();
}

export { Converter as Converter };
export { Selector as Selector };
export { factory as default };
