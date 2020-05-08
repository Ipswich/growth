const request = require("supertest");
const app = require("../app");

describe("POST addTimeEvent.js - Valid input (no dates)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:39 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '',
        TimeEndDate: '',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addTimeEvent.js - Valid input (only start date)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:48 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '05/07/2020',
        TimeEndDate: '',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addTimeEvent.js - Valid input (only end date)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:48 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '',
        TimeEndDate: '05/07/2020',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addTimeEvent.js - Valid input (both dates)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:48 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '05/07/2020',
        TimeEndDate: '05/07/2020',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addTimeEvent.js - invalid username", function() {
  it("it should have status code 400", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:39 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '',
        TimeEndDate: '',
        username: '',
        password: 'admin'
      })
      .expect(400, done);
  });
});

describe("POST addTimeEvent.js - invalid password", function() {
  it("it should have status code 400", function(done) {
    request(app)
      .post("/addTimeEvent")
      .send({
        TimeEvent: '1',
        TimeTrigger: '10:39 PM',
        TimeOutput: '1',
        TimeOutputValue: '100',
        TimeStartDate: '',
        TimeEndDate: '',
        username: 'admin',
        password: ''
      })
      .expect(400, done);
  });
});
