/* global chai, sinon, fixture */

'use strict';

import BEMQuery from '../src/BEMQuery';
import { SelectorEngine } from './support/mocks/bemquery-selector-engine';

const expect = chai.expect;

describe( 'BEMQuery', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
	} );

	it( 'is a class', () => {
		expect( BEMQuery ).to.be.a( 'function' );
	} );

	it( 'requires proper type of selector', () => {
		const selectorEngine = new SelectorEngine();

		expect( () => {
			new BEMQuery( undefined, null, selectorEngine );
		} ).to.throw( TypeError, 'Selector must be set.' );

		expect( () => {
			new BEMQuery( 1, null, selectorEngine );
		} ).to.throw( TypeError, 'Selector must be a string, object, array or DOM element.' );
	} );

	it( 'requires proper type of SelectorEngine', () => {
		expect( () => {
			new BEMQuery( 'bogus', document, 1 );
		} ).to.throw( TypeError, 'SelectorEngine must be an object with find method defined.' );

		expect( () => {
			new BEMQuery( 'bogus', document, {} );
		} ).to.throw( TypeError, 'SelectorEngine must be an object with find method defined.' );
	} );

	it( 'creates immutable elements property based on the first parameter', () => {
		fixture.load( 'elements.html' );

		SelectorEngine.elements = [
			'hublabubla'
		];

		const selectorEngine1 = new SelectorEngine();

		// Selector.
		const bemQuery1 = new BEMQuery( 'bogus', document, selectorEngine1 );
		expect( bemQuery1.elements ).to.deep.equal( SelectorEngine.elements );

		const descriptor1 = Object.getOwnPropertyDescriptor( bemQuery1, 'elements' );
		expect( descriptor1.writable ).to.be.false;
		expect( descriptor1.configurable ).to.be.false;
		expect( descriptor1.enumerable ).to.be.false;

		// NodeList.
		const elements = document.querySelectorAll( '.block' );
		const bemQuery2 = new BEMQuery( elements, document, selectorEngine1 );
		expect( bemQuery2.elements ).to.deep.equal( Array.from( elements ) );

		const descriptor2 = Object.getOwnPropertyDescriptor( bemQuery2, 'elements' );
		expect( descriptor2.writable ).to.be.false;
		expect( descriptor2.configurable ).to.be.false;
		expect( descriptor2.enumerable ).to.be.false;

		// BEMQuery instance.
		SelectorEngine.elements = [];

		const bemQuery3 = new BEMQuery( bemQuery1, document, selectorEngine1 );
		expect( bemQuery3.elements ).to.deep.equal( bemQuery1.elements );

		const descriptor3 = Object.getOwnPropertyDescriptor( bemQuery3, 'elements' );
		expect( descriptor3.writable ).to.be.false;
		expect( descriptor3.configurable ).to.be.false;
		expect( descriptor3.enumerable ).to.be.false;
	} );

	it( 'changes context of searching based on second parameter', () => {
		fixture.load( 'elements.html' );

		const context1 = document.querySelector( '.block' );
		const context2 = document.querySelector( '.block__elem' );

		// Element as a context.
		const selectorEngine1 = new SelectorEngine();
		const spy1 = sinon.spy( selectorEngine1, 'find' );

		new BEMQuery( 'bogus', context1, selectorEngine1 );

		expect( spy1 ).to.have.been.calledWith( 'bogus', context1 );

		// BEMQuery instance as a context.
		SelectorEngine.elements = [
			context2,
			context1
		];

		const selectorEngine2 = new SelectorEngine();
		const spy2 = sinon.spy( selectorEngine2, 'find' );

		new BEMQuery( 'bogus', new BEMQuery( 'bogus', document, selectorEngine1 ), selectorEngine2 );

		expect( spy2 ).to.have.been.calledWith( 'bogus', context2 );

		// Fallback to document as a context.
		new BEMQuery( 'bogus', null, selectorEngine1 );

		expect( spy1 ).to.have.been.calledWith( 'bogus', document );
	} );

	it( 'has iterator returning new BEMQuery instance', () => {
		fixture.load( 'elements.html' );

		let i = 0;
		const elements = document.querySelectorAll( '.block' );

		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		expect( bemQuery ).has.property( Symbol.iterator );

		for ( let element of bemQuery ) { // eslint-disable-line prefer-const
			expect( element ).to.be.instanceof( BEMQuery );

			expect( element.elements ).to.have.lengthOf( 1 );
			expect( element.elements[ 0 ] ).to.equal( elements[ i++ ] );
		}
	} );

	it( 'has immutable numeric properties that return BEMQuery instances with proper element as collection', () => {
		fixture.load( 'elements.html' );

		const elements = Array.from( document.querySelectorAll( '.block' ) );

		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		elements.forEach( ( element, index ) => {
			expect( bemQuery[ index ] ).to.be.an.instanceof( BEMQuery );

			expect( bemQuery[ index ].elements[ 0 ] ).to.equal( element );

			const descriptor = Object.getOwnPropertyDescriptor( bemQuery, index );
			expect( descriptor.configurable ).to.be.false;
			expect( descriptor.enumerable ).to.be.true;
		} );
	} );

	it( 'has immutable length property that return collection\'s length', () => {
		fixture.load( 'elements.html' );

		const elements = Array.from( document.querySelectorAll( '.block' ) );

		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		expect( bemQuery.length ).to.equal( elements.length );

		const descriptor = Object.getOwnPropertyDescriptor( bemQuery, 'length' );
		expect( descriptor.configurable ).to.be.false;
		expect( descriptor.enumerable ).to.be.true;
	} );
} );

describe( 'BEMQuery#get', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
	} );

	it( 'returns new BEMQuery instance with correct element', () => {
		fixture.load( 'elements.html' );

		const elements = document.querySelectorAll( '.block' );
		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		expect( bemQuery.get( 0 ) ).to.be.an.instanceof( BEMQuery );
		expect( bemQuery.get( 0 ).elements[ 0 ] ).to.equal( elements[ 0 ] );
		expect( bemQuery.get( 1 ) ).to.be.an.instanceof( BEMQuery );
		expect( bemQuery.get( 1 ).elements[ 0 ] ).to.equal( elements[ 1 ] );
	} );

	it( 'throws error for wrong indexes', () => {
		fixture.load( 'elements.html' );

		const elements = document.querySelectorAll( '.block' );
		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		expect( () => {
			bemQuery.get( 'hublabubla' );
		} ).to.throw( TypeError, 'Index must be a correct Number.' );

		expect( () => {
			bemQuery.get( -1 );
		} ).to.throw( RangeError, 'Index must be greater or equal to 0.' );

		expect( () => {
			bemQuery.get( 999 );
		} ).to.throw( RangeError, 'Index cannot be greater than collection\'s length.' );
	} );
} );

describe( 'BEMQuery#each', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
	} );

	it( 'is fired once for every element', () => {
		fixture.load( 'elements.html' );

		const elements = document.querySelectorAll( '.block' );
		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( elements, document, selectorEngine );

		const called = [];
		const callback = ( element ) => {
			expect( element ).to.be.instanceof( BEMQuery );
			called.push( element.elements[ 0 ] );
		};

		bemQuery.each( callback );

		expect( called ).to.be.deep.equal( bemQuery.elements );
	} );

	it( 'throws error when callback is not a function', () => {
		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( [], document, selectorEngine );

		expect( () => {
			bemQuery.each( 'hublabubla' );
		} ).to.throw( TypeError, 'Callback must be a function.' );
	} );

	it( 'returns BEMQuery instance', () => {
		const selectorEngine = new SelectorEngine();
		const bemQuery = new BEMQuery( [], document, selectorEngine );

		const result = bemQuery.each( () => {} );

		expect( result ).to.be.equal( bemQuery );
	} );
} );
