
const sinon = require('sinon')
var app;

exports.mochaGlobalSetup = async function() {
}

exports.mochaGlobalTeardown = async function() {
}

exports.mochaHooks = {
  afterEach() {
    sinon.restore();
  }
}

module.exports = exports
