// const request = require("supertest");
var app //= require('../app.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const assert = require('assert')

before(async function() {
  await dbcalls.createTestDBStructure()
  await dbcalls.addTestDBData()
  app = require("../app.js");
  app.once('started', () => {
      done()
  })
})


describe('Some simple test', () => {
  it('should return true', () => {
    assert.strictEqual(true, true);
  });
});
