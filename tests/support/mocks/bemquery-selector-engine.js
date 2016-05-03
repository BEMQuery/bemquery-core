'use strict';
class SelectorEngine {
	find() {
		return Array.from( SelectorEngine.elements );
	}
}

SelectorEngine.elements = [];

export { SelectorEngine as default };
