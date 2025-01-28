const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest');

module.exports = moduleNameMapper(tsconfig); 