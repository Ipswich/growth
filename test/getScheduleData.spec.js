const request = require("supertest");
const app = require("../app");
const mysql = require("mysql");


var config = app.get('config')
var validScheduleID;

new Promise((resolve, reject) => {
  var con = mysql.createConnection(config.database);
  con.connect((err) => {
    if(err){
      reject(err);
    }
      resolve(con);
    });
  }).then((con) => {
    var query = "SELECT * FROM `Schedules` LIMIT 1;"
    con.query(query, (error, results, fields) => {
      validScheduleID = {data: results[0].scheduleID};
      describe("POST getScheduleData.js - valid scheduleID", function() {
        it("it should have status code 200", function(done) {
          request(app)
            .post("/getScheduleData")
            .send(validScheduleID)
            .expect(200, done)
        });
      });
      con.destroy();
    });
  },
  (err) => {
    console.log("Could not connect to database! Could not get valid schedule ID")
  });

describe("POST getScheduleData.js - invalid scheduleID", function() {
  it("it should have status code 400", function(done) {
    request(app)
      .post("/getScheduleData")
      .send({data: -1})
      .expect(400, done)
  });
});
