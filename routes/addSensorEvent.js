var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

var saltRounds = 10;


router.post('/', function(req, res, next) {
  var config = req.app.get('config');
  new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.database);
    con.connect((err) => {
      if(err){
        reject(err);
      }
        resolve(con);
      });
    }).then((con) => {
      var escapedUsername = mysql.escape(req.body.username);
      con.query('CALL getUser('+escapedUsername+')', (error, results, fields) => {
        if (results[0].length != 0){
          var hash = results[0][0].passhash;
          bcrypt.compare(req.body.password, hash, (err, result) => {
            if (result == true){
              var sanitizedData = Object.assign({}, req.body);
              for (const key in sanitizedData){
                if (sanitizedData[key] == ''){
                  sanitizedData[key] = null
                }
                sanitizedData[key] = mysql.escape(sanitizedData[key])
              }
              //DO STUFF WITH ESCAPED DATA
              var query = "CALL addNewSchedule('Sensor', "+sanitizedData.SensorEvent+", "+sanitizedData.SensorSensorName+", "+sanitizedData.SensorSensorValue+", "+sanitizedData.SensorOutput+", "+sanitizedData.SensorOutputValue+", "+sanitizedData.SensorComparator+", NULL, "+formatDateString(sanitizedData.SensorStartDate)+", "+formatDateString(sanitizedData.SensorEndDate)+", '1', "+sanitizedData.username+", NULL)";
              con.query(query, (error, results, fields) => {
                if(error){
                  con.destroy();
                  res.send("Database error! Event not added.");
                } else {
                  con.destroy();
                  res.send("Sensor event successfully added!");
                }
              });
            } else {
                con.destroy();
                res.send("Invalid credentials!");
            }
          });
        } else {
          con.destroy();
          res.send("Invalid credentials!");
        }
    });
  });
}), (err) => {
  con.destroy();
  res.send("Database error!")
};

function formatTimeString(input){
  var string = "";
  if (input == undefined || input == '' || input == null){
    return input;
  }
  input = input.substring(1, input.length-1);
  var destructed = input.split(" ");
  var time = destructed[0].split(":");
  if(destructed[0] == 'AM') {
    if(time[0] == '12'){
      time[0] = '00'
    }
  } else {
    if (time[0] != '12'){
      time[0] = parseInt(time[0]) + 12
    }
  }
  string = time[0] + ":" + time[1] + ":" + '00';
  return string
}

function formatDateString(input){
  if (input == 'NULL'){
    return input;
  }
  input = input.substring(1, input.length-1);
  var string = "";
  var destructed = input.split("/");
  string = "'" + destructed[2] + "-" + destructed[0] + "-" + destructed[1] + "'"
  return string;
}

module.exports = router;
