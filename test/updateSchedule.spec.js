const request = require("supertest");
const app = require("../app");
const mysql = require("mysql");


var config = app.get('config')

new Promise((resolve, reject) => {
  var con = mysql.createConnection(config.database);
  con.connect((err) => {
    if(err){
      reject(err);
    }
      resolve(con);
    });
  }).then((con) => {
    var query = "SELECT * FROM `Schedules` WHERE `scheduleType` = 'Sensor' AND `Senabled` = 1 LIMIT 5;"
    con.query(query, (error, results, fields) => {
      sensorSchedules = results;
      // console.log(sensorSchedules);
      query = "SELECT * FROM `Schedules` WHERE `scheduleType` = 'Time' AND `Senabled` = 1 LIMIT 5;"
      con.query(query, (error, results, fields) => {
        timeSchedules = results;

        //TIME TESTS

        describe("POST updateSchedule.js - invalid username (time)", function() {
          it("it should have status code 400", function(done) {
            request(app)
            .post("/updateSchedule")
            .send({
              UpdateScheduleID: timeSchedules[0].scheduleID,
              UpdateMode: 'Update',
              UpdateEvent: '1',
              UpdateTrigger: '10:39 PM',
              UpdateOutput: '1',
              UpdateOutputValue: '100',
              UpdateStartDate: '',
              UpdateEndDate: '',
              username: '',
              password: 'admin'
            })
            .expect(400, done);
          });
        });

        describe("POST updateSchedule.js - invalid password (time)", function() {
          it("it should have status code 400", function(done) {
            request(app)
            .post("/updateSchedule")
            .send({
              UpdateScheduleID: timeSchedules[0].scheduleID,
              UpdateMode: 'Update',
              UpdateEvent: '1',
              UpdateTrigger: '10:39 PM',
              UpdateOutput: '1',
              UpdateOutputValue: '100',
              UpdateStartDate: '',
              UpdateEndDate: '',
              username: 'admin',
              password: ''
            })
            .expect(400, done);
          });
        });

        describe("POST updateSchedule.js - Valid input (no dates) (time)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: timeSchedules[0].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateTrigger: '10:39 PM',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST updateSchedule.js - Valid input (only start date) (time)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: timeSchedules[1].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateTrigger: '10:39 PM',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateStartDate: '05/08/20',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST updateSchedule.js - Valid input (only end date) (time)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: timeSchedules[2].scheduleID,
                UpdateMode: 'Disable',
                UpdateEvent: '1',
                UpdateTrigger: '10:39 PM',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateStartDate: '',
                UpdateEndDate: '05/08/20',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST updateSchedule.js - Valid input (both dates) (time)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: timeSchedules[3].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateTrigger: '10:39 PM',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateStartDate: '05/08/20',
                UpdateEndDate: '05/08/20',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST updateSchedule.js - Delete (time)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: timeSchedules[4].scheduleID,
                UpdateMode: 'Delete',
                UpdateEvent: '1',
                UpdateTrigger: '10:39 PM',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        //SENSOR TESTS

        describe("POST /updateSchedule.js - invalid username (sensor)", function() {
          it("it should have status code 400", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[0].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: '',
                password: 'admin'
              })
              .expect(400, done);
          });
        });

        describe("POST /updateSchedule.js - invalid password (sensor)", function() {
          it("it should have status code 400", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[0].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: 'admin',
                password: ''
              })
              .expect(400, done);
          });
        });

        describe("POST /updateSchedule.js - Valid input (no dates)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[0].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST /updateSchedule.js - Valid input (only start date)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[1].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '05/08/20',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST /updateSchedule.js - Valid input (only end date)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[2].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '',
                UpdateEndDate: '05/08/2020',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST /updateSchedule.js - Valid input (both dates)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[3].scheduleID,
                UpdateMode: 'Update',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '05/08/2020',
                UpdateEndDate: '05/08/2020',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });

        describe("POST /updateSchedule.js - Delete (sensor)", function() {
          it("it should have status code 200", function(done) {
            request(app)
              .post("/updateSchedule")
              .send({
                UpdateScheduleID: sensorSchedules[4].scheduleID,
                UpdateMode: 'Disable',
                UpdateEvent: '1',
                UpdateOutput: '1',
                UpdateOutputValue: '100',
                UpdateName: '1',
                UpdateComparator: '<',
                UpdateSensorValue: '75',
                UpdateStartDate: '',
                UpdateEndDate: '',
                username: 'admin',
                password: 'admin'
              })
              .expect(200, done);
          });
        });





        con.destroy();
      });
    });
  },
  (err) => {
    console.log("Could not connect to database! Could not get schedules!")
  });
