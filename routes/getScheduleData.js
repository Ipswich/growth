var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var pug = require('pug');
const path = require('path');
const moment = require('moment')
const utils = require('../custom_node_modules/Utils.js')


router.post('/', function(req, res, next) {
  //Set variables for pug rendering (get file location, prep function)
  const file = path.join(req.app.get('views'), '/updateEventMeta.pug');
  var fn = pug.compileFile(file);
  //Get and escape scheduleID
  var scheduleID = mysql.escape(req.body.data);
  //If invalid scheduleID, send issue back to website.
  if (scheduleID < 0){
    res.status(400).send("Invalid ScheduleID!");
  } else {
    //Otherwise, get config data and create SQL Promise/Connection
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
        //DO STUFF WITH ESCAPED DATA
        var query = "CALL getScheduleByID(" + scheduleID + ")";
        //Query for scheduleID
        con.query(query, (error, results, fields) => {
          //If DB error, destroy connection and send issue back to website
          if(error) {
            res.status(500).send("Database error!");
            con.destroy();
          } else {
            //Parse results
            var schedule = {schedule: results[0][0]};
            var defaults = {};
            defaults.outputName = schedule.schedule.outputName;
            defaults.sensorValue = schedule.schedule.sensorValue;
            defaults.outputValue = schedule.schedule.outputValue;
            defaults.comparator = schedule.schedule.scheduleComparator;
            //If there is a trigger time, parse.
            if(schedule.schedule.eventTriggerTime) {
              var triggerTime = moment(schedule.schedule.eventTriggerTime, "HH:mm:ss");
              defaults.eventTriggerTime = triggerTime.format('HH:mm');
            }
            //If there is a schedule start date, parse.
            if (schedule.schedule.scheduleStartDate) {
              defaults.scheduleStartDate = moment(schedule.schedule.scheduleStartDate).format("MM/DD/YYYY");
            } else {
              defaults.scheduleStartDate = false;
            }
            //If there is a schedule stop date, parse.
            if (schedule.schedule.scheduleStopDate) {
              defaults.scheduleStopDate = moment(schedule.schedule.scheduleStopDate).format("MM/DD/YYYY");
            } else {
              defaults.scheduleStopDate = false;
            }
            //Get enabled sensor Types
            con.query('CALL getEnabledSensorTypes()', (error, results, fields) => {
              var sensorTypes = {sensorTypes: results[0]};
              if(error) {
                //Error on problem.
                res.status(500).send("Database error!");
                con.destroy();
              } else {
                //Get enabled outputs
                con.query('CALL getEnabledOutputs()', (error, results, fields) => {
                  if(error) {
                    //Error on problem.
                    res.status(500).send("Database error!");
                    con.destroy();
                  } else {
                    //Store results in object
                    var outputs = {outputs: results[0]};
                    for (let i = 0; i < outputs.outputs.length; i++){
                      if(schedule.schedule.outputID == outputs.outputs[i].outputID) {
                        defaults.output = outputs.outputs[i].outputName;
                      }
                    }
                    //Get enabled events
                    con.query('CALL getEnabledEvents()', (error, results, fields) => {
                      if(error) {
                        //Error on problem.
                        res.status(500).send("Database error!");
                        con.destroy();
                      } else {
                        //Store results in object
                        var events = {events: results[0]};
                        //Get default event Type
                        for (let i = 0; i < events.events.length; i++){
                          if(schedule.schedule.eventID == events.events[i].eventID) {
                            defaults.eventName = events.events[i].eventName;
                          }
                        }
                        //Get enabled sensors
                        con.query('CALL getEnabledSensors()', (error, results, fields) => {
                          if(error) {
                            //Error on problem.
                            res.status(500).send("Database error!");
                            con.destroy();
                          } else {
                            //Store results in object
                            var sensors = {sensors: results[0]}
                            //Get default sensor
                            for (let i = 0; i < sensors.sensors.length; i++) {
                              //Create sensor list for schedule, matching sensor Type with Location
                              if(schedule.schedule.sensorID == sensors.sensors[i].eventID) {
                                defaults.sensor = sensors.sensors[i].sensorType + " @ " + sensors.sensors[i].sensorLocation;
                              }
                            }
                            //Create data object for rendering html
                            defaultData = {};
                            defaultData.defaults = defaults;
                            var data = Object.assign({}, defaultData, schedule, sensorTypes, outputs, events, sensors);
                            //Close connection, render html, send to server!
                            con.destroy();
                            var html = fn(data);
                            res.status(200).send(html);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
      });
    });
  }
}), (err) => {
  //If promise fails, error
  res.status(500).send("Database error!");
};

module.exports = router;
