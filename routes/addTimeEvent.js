var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dateFormat = require ('dateformat');
const path = require('path');
var pug = require('pug');

var saltRounds = 10;

router.post('/', function(req, res, next) {
  var config = req.app.get('config');
  var web_data = req.app.get('web_data');
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
              var query = "CALL addNewSchedule('Time', "+sanitizedData.TimeEvent+", NULL, NULL, "+sanitizedData.TimeOutput+", "+sanitizedData.TimeOutputValue+", NULL, '"+formatTimeString(sanitizedData.TimeTrigger)+"', "+formatDateString(sanitizedData.TimeStartDate)+", "+formatDateString(sanitizedData.TimeEndDate)+", '1', "+sanitizedData.username+", NULL)";
              con.query(query, (error, results, fields) => {
                if(error){
                  con.destroy();
                  res.send("Database error! Event not added.");
                } else {
                  //Redo old pages
                  const schedules = path.join(req.app.get('views'), '/schedules.pug');
                  const currentConditions = path.join(req.app.get('views'), '/currentConditions.pug');
                  var cSchedules = pug.compileFile(schedules);
                  var cCurrentConditions = pug.compileFile(currentConditions);
                  //grab Index Page Data

                  con.query('CALL getSensorLastReadings()', (error, results, fields) => {
                      var sensorData = {sensorData: results[0]};
                      for (var key in sensorData.sensorData){
                        sensorData.sensorData[key].logTime = dateFormat(sensorData.sensorData[key].logTime, "mmmm d, h:MM:ss TT");
                      }
                      con.query('CALL getEnabledSensorTypes()', (error, results, fields) => {
                        var sensorTypes = {sensorTypes: results[0]};
                        con.query('CALL getEnabledLiveSchedules()', (error, results, fields) => {
                          var scheduleData = {scheduleData: results[0]};
                            for (var key in scheduleData.scheduleData){
                              scheduleData.scheduleData[key].eventTriggerTime = formatTimeStringH(scheduleData.scheduleData[key].eventTriggerTime);
                            }
                            con.query('CALL getEnabledOutputs()', (error, results, fields) => {
                              var outputs = {outputs: results[0]};
                              con.query('CALL getEnabledEvents()', (error, results, fields) => {
                                var events = {events: results[0]};
                                con.query('CALL getEnabledSensors()', (error, results, fields) => {
                                  var sensors = {sensors: results[0]};
                                  var data = Object.assign({}, web_data, sensorTypes, sensorData, scheduleData, outputs, events, sensors);
                                  con.destroy();
                                  var schedulesPug = {schedules: cSchedules(data)};
                                  var currentConditionsPug = {currentConditions: cCurrentConditions(data)};
                                  var msg = {msg: "Time event successfully added!"};
                                  var packet = Object.assign({}, schedulesPug, currentConditionsPug, msg);
                                  console.log(packet)
                                  console.log("done")
                                  res.send(packet);

                                })
                              })
                            })
                          })
                      })
                    })
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

//Format time string for readability.
function formatTimeStringH(input){
  if (input == null){
    return "";
  }
  var destructed = input.split(":");
  if(destructed[0] < 12){
    if (destructed[0] == 0){
      return ('12' + ':' + destructed[1] + ' AM');
    } else {
      return (destructed[0] + ':' + destructed[1] + ' AM');
    }
  } else {
    if (destructed[0] == 12){
      return (destructed[0] + ':' + destructed[1] + ' PM');
    } else{
      return ((destructed[0] - 12) + ':' + destructed[1] + ' PM');
    }
  }
}
module.exports = router;
