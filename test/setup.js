
const sinon = require('sinon')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
var app;

exports.mochaGlobalSetup = async function() {
    await dbcalls.createTestDBStructure()
    await dbcalls.addTestDBData()
    await new Promise(function(resolve, reject) {
      app = require("../app.js");
      app.once('started', resolve);
    })
}

exports.mochaGlobalTeardown = async function() {
}

exports.mochaHooks = {
  afterEach() {
    sinon.restore();
  }
}

module.exports = exports
