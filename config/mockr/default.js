'use strict';

const cwd = process.cwd();
const config = {};

config[ `${cwd}/tests/factory.js` ] = config[ `${cwd}/tests/module.js` ] = {
		'bemquery-selector-engine': `${cwd}/tests/support/mocks/bemquery-selector-engine.js`
};

module.exports = config;
