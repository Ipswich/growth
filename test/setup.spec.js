const request = require("supertest");
var app = require("../app.js");

before(async (done) => {
    app.once('started', () => {
      done()
    })
})


describe('Some simple test', () => {
  it('should return true', () => {
    assert.strictEqual(true, true);
  });
});
