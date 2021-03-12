const request = require("supertest");
var app
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')

before(async (done) => {
  console.log(process.env.DB_PORT)
  await dbcalls.createTestDBStructure().then(() => {
    app = require("../app.js");
    app.once('started', () => {
      console.log("DONE")
      done()
    })
  })
})


describe('Some simple test', () => {
  it('should return true', () => {
    assert.strictEqual(true, true);
  });
});
