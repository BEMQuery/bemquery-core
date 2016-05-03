'use strict';

import bsc from 'bemquery-selector-converter';
import SelectorEngine from 'bemquery-selector-engine';
import BEMQuery from './BEMQuery';

/**
 * BEMQuery instance factory.
 *
 * @param {String|Iterable|HTMLElement} query Selector or
 * existing elements collection upon which the new elements collection
 * should be created.
 * @param {Document|HTMLElement|BEMQuery} context Context from which
 * elements should be fetched.
 * @return {BEMQuery} New BEMQuery instance.
 */
function factory( query, context = document ) {
	const converter = bsc();
	const selectorEngine = new SelectorEngine();
	const bemQuery = new BEMQuery( query, context, converter, selectorEngine );

	return bemQuery;
}

export default factory;
