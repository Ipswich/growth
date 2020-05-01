var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var pug = require('pug');
const path = require('path');
const moment = require('moment')
const utils = require('../custom_node_modules/Utils.js')


router.post('/', function(req, res, next) {
  const file = path.join(req.app.get('views'), '/updateEventMeta.pug');
  var fn = pug.compileFile(file);
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
      var sensorID = mysql.escape(req.body.data);
      //DO STUFF WITH ESCAPED DATA
      var query = "CALL getScheduleByID(" + sensorID + ")";
      con.query(query, (error, results, fields) => {
        if(error) {
          res.send("Database error!");
          con.destroy();
        } else {
          var schedule = {schedule: results[0][0]};
          var defaults = {};
          defaults.outputName = schedule.schedule.outputName;
          defaults.sensorValue = schedule.schedule.sensorValue;
          defaults.outputValue = schedule.schedule.outputValue;
          defaults.comparator = schedule.schedule.scheduleComparator;
          if(schedule.schedule.eventTriggerTime) {
            var triggerTime = moment(schedule.schedule.eventTriggerTime, "HH:mm:ss");
            defaults.eventTriggerTime = triggerTime.format('HH:mm');
          }
          if (schedule.schedule.scheduleStartDate) {
            defaults.scheduleStartDate = moment(schedule.schedule.scheduleStartDate).format("MM/DD/YYYY");
          } else {
            defaults.scheduleStartDate = false;
          }
          if (schedule.schedule.scheduleStartDate) {
            defaults.scheduleStopDate = moment(schedule.schedule.scheduleStopDate).format("MM/DD/YYYY");
          } else {
            defaults.scheduleStopDate = false;
          }


          con.query('CALL getEnabledSensorTypes()', (error, results, fields) => {
            var sensorTypes = {sensorTypes: results[0]};
            if(error) {
              res.send("Database error!");
              con.destroy();
            } else {
              con.query('CALL getEnabledOutputs()', (error, results, fields) => {
                if(error) {
                  res.send("Database error!");
                  con.destroy();
                } else {
                  var outputs = {outputs: results[0]};

                  for (let i = 0; i < outputs.outputs.length; i++){
                    if(schedule.schedule.outputID == outputs.outputs[i].outputID) {
                      defaults.output = outputs.outputs[i].outputName;
                    }
                  }
                  con.query('CALL getEnabledEvents()', (error, results, fields) => {
                    if(error) {
                      res.send("Database error!");
                      con.destroy();
                    } else {
                      var events = {events: results[0]};

                      //Get default event Type
                      for (let i = 0; i < events.events.length; i++){
                        if(schedule.schedule.eventID == events.events[i].eventID) {
                          defaults.eventName = events.events[i].eventName;
                        }
                      }
                      con.query('CALL getEnabledSensors()', (error, results, fields) => {
                        if(error) {
                          res.send("Database error!");
                          con.destroy();
                        } else {
                          var sensors = {sensors: results[0]}

                          //Get default sensor
                          for (let i = 0; i < sensors.sensors.length; i++){
                            if(schedule.schedule.sensorID == sensors.sensors[i].eventID) {
                              defaults.sensor = sensors.sensors[i].sensorType + " @ " + sensors.sensors[i].sensorLocation;
                            }
                          }
                          defaultData = {};
                          defaultData.defaults = defaults;
                          var data = Object.assign({}, defaultData, schedule, sensorTypes, outputs, events, sensors);
                          con.destroy();
                          var html = fn(data);
                          res.send(html);
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
}), (err) => {
  con.destroy();
  res.send("Database error!");
};

module.exports = router;
