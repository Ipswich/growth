var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var utils = require('../custom_node_modules/Utils.js');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
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
      //Get last Sensor readings
      con.query('CALL getSensorLastReadings()', (error, results, fields) => {
        if(error) {
        //Error on problem.
        res.status(500).send("Database error!");
        con.destroy();
        } else {
          var sensorData = {sensorData: results[0]};
          //Format log time for human readability
          for (var key in sensorData.sensorData){
            sensorData.sensorData[key].logTime = utils.dateFormat(sensorData.sensorData[key].logTime);
          }
          //Get enabled sensor types
          con.query('CALL getEnabledSensorTypes()', (error, results, fields) => {
            if(error) {
            //Error on problem.
            res.status(500).send("Database error!");
            con.destroy();
            } else {
              var sensorTypes = {sensorTypes: results[0]};
              //Get enabled live schedules
              con.query('CALL getEnabledLiveSchedules()', (error, results, fields) => {
                if(error) {
                //Error on problem.
                res.status(500).send("Database error!");
                con.destroy();
                } else {
                  var scheduleData = {scheduleData: results[0]};
                  //Format trigger Time for human readability.
                  for (var key in scheduleData.scheduleData) {
                    scheduleData.scheduleData[key].eventTriggerTime = utils.formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
                  }
                  //Get enabled outputs
                  con.query('CALL getEnabledOutputs()', (error, results, fields) => {
                    if(error) {
                    //Error on problem.
                    res.status(500).send("Database error!");
                    con.destroy();
                    } else {
                      var outputs = {outputs: results[0]};
                      //Get enabled events
                      con.query('CALL getEnabledEvents()', (error, results, fields) => {
                        if(error) {
                        //Error on problem.
                        res.status(500).send("Database error!");
                        con.destroy();
                        } else {
                          var events = {events: results[0]};
                          //Get enabled sensors
                          con.query('CALL getEnabledSensors()', (error, results, fields) => {
                            if(error) {
                            //Error on problem.
                            res.status(500).send("Database error!");
                            con.destroy();
                            } else {
                              //Create data object for rendering html
                              var sensors = {sensors: results[0]};
                              var web_data = req.app.get('web_data');
                              //Close connection, render html, send to server!
                              con.destroy();
                              var data = Object.assign({}, web_data, sensorTypes, sensorData, scheduleData, outputs, events, sensors);
                              res.status(200).render('index', data);
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
  },
  (err) => {
    res.status(500).render('error')
  });

});

module.exports = router;
