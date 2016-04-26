/* global chai */

'use strict';

import * as bemquery from '../src/index';
import bemquery2 from '../src/index';

import factory from '../src/factory';
import BEMQuery from '../src/BEMQuery';

const expect = chai.expect;

describe( 'module', () => {
	it( 'exports factory', () => {
		expect( bemquery.default ).to.equal( factory );
		expect( bemquery2 ).to.equal( factory );
	} );

	it( 'exports BEMQuery', () => {
		expect( bemquery.BEMQuery ).to.equal( BEMQuery );
	} );
} );
