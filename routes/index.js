var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var dateFormat = require ('dateformat');
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
                      var web_data = req.app.get('web_data');
                      var data = Object.assign({}, web_data, sensorTypes, sensorData, scheduleData, outputs, events, sensors);
                      con.destroy();
                      res.render('index', data);
                    })
                  })
                })
              })
          })
    });
  },
  (err) => {
    con.destroy();
    res.render('error')
  });

});

module.exports = router;
