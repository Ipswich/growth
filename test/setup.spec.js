const request = require("supertest");
var app
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')

before(async (done) => {
  await dbcalls.createTestDBStructure().then(() => {
    app = require("../app.js");
    app.once('started', () => {
      done()
    })
  })
})


describe('Some simple test', () => {
  it('should return true', () => {
    assert.strictEqual(true, true);
  });
});
