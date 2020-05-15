var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const path = require('path');
var pug = require('pug');
const utils = require('../custom_node_modules/Utils.js')

var saltRounds = 10;

router.post('/', function(req, res, next) {
  //Get config and web data from app
  var config = req.app.get('config');
  var web_data = req.app.get('web_data');
  //Create promise/connection to DB
  new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.database);
    con.connect((err) => {
      if(err){
        reject(err);
      }
        resolve(con);
      });
    }).then((con) => {
      //Get and escape username
      var escapedUsername = mysql.escape(req.body.username);
      //Query DB for username
      con.query('CALL getUser('+escapedUsername+')', (error, results, fields) => {
        //If error, error
        if (error) {
          con.destroy();
          res.status(500).send("Database error!");
        } else {
          //If results, compare hash
          if (results[0].length != 0){
            var hash = results[0][0].passhash;
            bcrypt.compare(req.body.password, hash, (err, result) => {
              //If no match, report that back.
              if (result != true){
                con.destroy();
                res.status(400).send("Invalid credentials!");
              } else {
                //Sanitize data
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
                        //setup paths
                        const schedules = path.join(req.app.get('views'), '/schedules.pug');
                        const currentConditions = path.join(req.app.get('views'), '/currentConditions.pug');
                        //Create pug render functions
                        var cSchedules = pug.compileFile(schedules);
                        var cCurrentConditions = pug.compileFile(currentConditions);

                        //grab Index Page Data
                        //Get last readings from sensors
                        con.query('CALL getSensorLastReadings()', (error, results, fields) => {
                          if(error){
                            //Error on problem.
                            con.destroy();
                            res.status(500).send("Database error! Website not updated.");
                          } else {
                            var sensorData = {sensorData: results[0]};
                            for (var key in sensorData.sensorData){
                              //Format logtime to be human readable
                              sensorData.sensorData[key].logTime = utils.dateFormat(sensorData.sensorData[key].logTime);
                            }
                            //Get enabled sensor types
                            con.query('CALL getEnabledSensorTypes()', (error, results, fields) => {
                              if(error){
                                //Error on problem.
                                con.destroy();
                                res.status(500).send("Database error! Website not updated.");
                              } else {
                                var sensorTypes = {sensorTypes: results[0]};
                                //Get enabled live schedules
                                con.query('CALL getEnabledLiveSchedules()', (error, results, fields) => {
                                  if(error){
                                    //Error on problem.
                                    con.destroy();
                                    res.status(500).send("Database error! Website not updated.");
                                  } else {
                                    var scheduleData = {scheduleData: results[0]};
                                    //Format trigger Time to be human readable
                                    for (var key in scheduleData.scheduleData){
                                      scheduleData.scheduleData[key].eventTriggerTime = utils.formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
                                    }
                                    //Get enabled outputs
                                    con.query('CALL getEnabledOutputs()', (error, results, fields) => {
                                      if(error){
                                        //Error on problem.
                                        con.destroy();
                                        res.status(500).send("Database error! Website not updated.");
                                      } else {
                                        var outputs = {outputs: results[0]};
                                        //Get enabled events
                                        con.query('CALL getEnabledEvents()', (error, results, fields) => {
                                          if(error){
                                            //Error on problem.
                                            con.destroy();
                                            res.status(500).send("Database error! Website not updated.");
                                          } else {
                                            var events = {events: results[0]};
                                            //Get enabled sensors
                                            con.query('CALL getEnabledSensors()', (error, results, fields) => {
                                              if(error){
                                                //Error on problem.
                                                con.destroy();
                                                res.status(500).send("Database error! Website not updated.");
                                              } else {
                                                var sensors = {sensors: results[0]};
                                                //Create data object for rendering html
                                                var data = Object.assign({}, web_data, sensorTypes, sensorData, scheduleData, outputs, events, sensors);
                                                con.destroy();
                                                //Render and add to object
                                                var schedulesPug = {schedules: cSchedules(data)};
                                                var currentConditionsPug = {currentConditions: cCurrentConditions(data)};
                                                var msg = {msg: "Time event successfully added!"};
                                                //Create packet, send.
                                                var packet = Object.assign({}, schedulesPug, currentConditionsPug, msg);
                                                res.status(200).send(packet);
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
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
        }
      });
  }), (err) => {
    res.status(500).send("Database error! Event not changed. (connection error)");
  };
});

module.exports = router;
