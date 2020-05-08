const request = require("supertest");
const app = require("../app");

describe("POST addSensorEvent.js - Valid input (no dates)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '',
        SensorEndDate: '',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addSensorEvent.js - Valid input (only start date)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '05/07/2020',
        SensorEndDate: '',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addSensorEvent.js - Valid input (only end date)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '',
        SensorEndDate: '05/07/2020',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addSensorEvent.js - Valid input (both dates)", function() {
  it("it should have status code 200", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '05/07/2020',
        SensorEndDate: '05/07/2020',
        username: 'admin',
        password: 'admin'
      })
      .expect(200, done);
  });
});

describe("POST addSensorEvent.js - invalid username", function() {
  it("it should have status code 400", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '',
        SensorEndDate: '',
        username: '',
        password: 'admin'
      })
      .expect(400, done);
  });
});

describe("POST addSensorEvent.js - invalid password", function() {
  it("it should have status code 400", function(done) {
    request(app)
      .post("/addSensorEvent")
      .send({
        SensorEvent: '1',
        SensorSensorName: '1',
        SensorComparator: '<',
        SensorSensorValue: '75',
        SensorOutput: '1',
        SensorOutputValue: '100',
        SensorStartDate: '',
        SensorEndDate: '',
        username: 'admin',
        password: ''
      })
      .expect(400, done);
  });
});
