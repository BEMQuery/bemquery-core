/* global chai*/

'use strict';

import factory from '../src/factory';
import BEMQuery from '../src/BEMQuery';

import { SelectorEngine as SelectorEngine } from 'bemquery-selector-engine';

const expect = chai.expect;

describe( 'factory', () => {
	it( 'is a function', () => {
		expect( factory ).to.be.a( 'function' );
	} );

	it( 'returns a BEMQuery instance', () => {
		const result = factory( [] );

		expect( result ).to.be.an.instanceof( BEMQuery );
	} );

	it( 'creates SelectorEngine instance inside BEMQuery instance', () => {
		const result = factory( [] );

		expect( result.selectorEngine ).to.be.an.instanceof( SelectorEngine );
	} );
} );
