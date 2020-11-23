const request = require("supertest");
const app = require("../app");

setTimeout(function() {
  describe("GET /", function() {
    it("it should have status code 200", function(done) {
      request(app)
        .get("/")
        .expect(200, done);
    });
  });

  describe("GET INVALID ADDRESS", function() {
    it("it should have status code 404", function(done) {
      request(app)
        .get("/asdf")
        .expect(404, done);
    });
  });
  run();
}, 7000)
