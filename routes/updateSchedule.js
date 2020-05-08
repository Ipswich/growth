var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dateFormat = require ('dateformat');
const path = require('path');
var pug = require('pug');
const utils = require('../custom_node_modules/Utils.js')

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
            if (result != true){
              con.destroy();
              res.status(400).send("Invalid credentials!");
            }
            else {
              var sanitizedData = Object.assign({}, req.body);
              for (const key in sanitizedData){
                if (sanitizedData[key] == '') {
                  sanitizedData[key] = null
                }
                sanitizedData[key] = mysql.escape(sanitizedData[key])
              }
              //DO STUFF WITH ESCAPED DATA
              //Check if Schedule is enabled
              var query = "CALL getScheduleByID(" + sanitizedData.UpdateScheduleID + ")";
              con.query(query, (error, results, fields) => {
                if(error || results[0][0].Senabled == 0){
                  con.destroy();
                  res.status(500).send("Database error! Event not changed. (failed at scheduleID)");
                } else {
                  var dbschedule = results[0][0];
                  //Disable schedule
                  query = 'CALL DisableSchedule(' + dbschedule.scheduleID + ', ' + sanitizedData.username + ');'
                  con.query(query, (error, results, fields) => {
                    if (error){
                      con.destroy();
                      res.status(500).send("Database error! Event not changed. (failed at delete)");
                    } else {
                      var msg = {msg: "Event successfully removed!"};
                      //If marked for update, add new schedule with passed values.
                      if (sanitizedData.UpdateMode == "'Update'"){
                        if (dbschedule.scheduleType == 'Time'){
                          var query = "CALL addNewSchedule('Time', "+sanitizedData.UpdateEvent+", NULL, NULL, "+sanitizedData.UpdateOutput+", "+sanitizedData.UpdateOutputValue+", NULL, '"+utils.formatTimeStringForDB(sanitizedData.UpdateTrigger)+"', "+utils.formatDateString(sanitizedData.UpdateStartDate)+", "+utils.formatDateString(sanitizedData.UpdateEndDate)+", '1', "+sanitizedData.username+", NULL)";
                        }
                        else {
                          var query = "CALL addNewSchedule('Sensor', "+sanitizedData.UpdateEvent+", "+sanitizedData.UpdateName+", "+sanitizedData.UpdateSensorValue+", "+sanitizedData.UpdateOutput+", "+sanitizedData.UpdateOutputValue+", "+sanitizedData.UpdateComparator+", NULL, "+utils.formatDateString(sanitizedData.UpdateStartDate)+", "+utils.formatDateString(sanitizedData.UpdateEndDate)+", '1', "+sanitizedData.username+", NULL)";
                        }
                        con.query(query, (error, results, fields) => {
                          if (error){
                            console.log(query);
                            con.destroy();
                            res.status(500).send("Database error! Event not changed. (failed at update)");
                          }
                          msg = {msg: "Event successfully modified!"};
                        });
                      }
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
                              scheduleData.scheduleData[key].eventTriggerTime = utils.formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
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
                                  var packet = Object.assign({}, schedulesPug, currentConditionsPug, msg);
                                  res.status(200).send(packet);
                                })
                              })
                            })
                          })
                        })
                      })
                    }
                  });
                };
              });
            }
          });
        } else {
          con.destroy();
          res.status(400).send("Invalid credentials!");
        }
      });
  }), (err) => {
    res.status(500).send("Database error! Event not changed. (connection error)");
  };
});

module.exports = router;
