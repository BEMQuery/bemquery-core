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

class SelectorEngine {
	find() {
		return {
			selector: SelectorEngine.selector,
			elements: Array.from( SelectorEngine.elements )
		};
	}
}

function factory() {
	return new SelectorEngine();
}

export { Converter as Converter };
export { Selector as Selector };
export { SelectorEngine as SelectorEngine };
export { factory as default };
