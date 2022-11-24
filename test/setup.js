
const sinon = require('sinon')

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
