/* eslint no-console: 0 */
'use strict';

function checkSelectorEngine( selectorEngine ) {
	return typeof selectorEngine === 'object' && typeof selectorEngine.find === 'function';
}

function determineContext( context ) {
	if ( context instanceof BEMQuery ) { // eslint-disable-line no-use-before-define
		context = context.elements[ 0 ];
	}

	if ( !( context instanceof HTMLElement ) && context !== document ) {
		context = document;
	}

	return context;
}

function fetchElements( query, context, selectorEngine ) {
	if ( !query ) {
		throw new TypeError( 'Selector must be set.' );
	}

	if ( typeof query === 'string' ) {
		return selectorEngine.find( query, context ).elements;
	} else if ( query instanceof HTMLElement ) {
		return [
			query
		];
	} else if ( query instanceof BEMQuery ) { // eslint-disable-line no-use-before-define
		return query.elements;
	} else if ( typeof query === 'object' ) {
		return Array.from( query );
	} else {
		throw new TypeError( 'Selector must be a string, object, array or DOM element.' );
	}
}

function defineProperties( obj, elements ) {
	Object.defineProperty( obj, 'elements', {
		value: elements
	} );

	obj.elements.forEach( ( element, index ) => {
		Object.defineProperty( obj, index, {
			enumerable: true,
			get() {
				return new BEMQuery( this.elements[ index ], document, this.selectorEngine ); // eslint-disable-line no-use-before-define
			}
		} );
	}, obj );

	Object.defineProperty( obj, 'length', {
		enumerable: true,
		get() {
			return this.elements.length;
		}
	} );
}

/** Class representing elements collection. */
class BEMQuery {
	/**
	 * Creates elements collection.
	 *
	 * @param {String|Iterable|HTMLElement} query Selector or
	 * existing elements collection upon which the new elements collection
	 * should be created.
	 * @param {Document|HTMLElement|BEMQuery} context Context from which
	 * elements should be fetched.
	 * @param {SelectorEngine} selectorEngine BEM selector engine to be used
	 * by the current and descendant `BEMQuery` instances.
	 * @class
	 */
	constructor( query, context, selectorEngine ) {
		if ( !checkSelectorEngine( selectorEngine ) ) {
			throw new TypeError( 'SelectorEngine must be an object with find method defined.' );
		}

		this.selectorEngine = selectorEngine;

		context = determineContext( context );

		defineProperties( this, fetchElements( query, context, selectorEngine ) );
	}

	/**
	 * Gets element with given index.
	 *
	 * @param {Number} index Element's index.
	 * @return {BEMQuery} New BEMQuery instance with fetched element
	 * as an only element in the collection.
	 */
	get( index ) {
		index = Number( index );

		if ( Number.isNaN( index ) ) {
			throw new TypeError( 'Index must be a correct Number.' );
		} else if ( index < 0 ) {
			throw new RangeError( 'Index must be greater or equal to 0.' );
		} else if ( index > ( this.elements.length - 1 ) ) {
			throw new RangeError( 'Index cannot be greater than collection\'s length.' );
		}

		return new BEMQuery( this.elements[ index ], document, this.selectorEngine );
	}

	/**
	 * Executes callback on every element in the collection.
	 *
	 * @param {Function} callback Callback to be executed.
	 * @return {BEMQuery} Current `BEMQuery` instance.
	 */
	each( callback ) {
		if ( typeof callback !== 'function' ) {
			throw new TypeError( 'Callback must be a function.' );
		}

		const selectorEngine = this.selectorEngine;

		this.elements.forEach( ( element ) => {
			callback( new BEMQuery( element, document, selectorEngine ) );
		} );

		return this;
	}

	/**
	 * Returns iterator for contained elements.
	 *
	 * @return {Iterator} Returned iterator.
	 */
	[ Symbol.iterator ]() {
		let i = 0;
		const elements = this.elements;
		const selectorEngine = this.selectorEngine;

		return {
			next() {
				if ( i < elements.length ) {
					const element = elements[ i++ ];

					return {
						value: new BEMQuery( [ element ], document, selectorEngine ),
						done: false
					};
				}

				return {
					done: true
				};
			}
		};
	}
}

export default BEMQuery;
