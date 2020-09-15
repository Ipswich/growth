var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const path = require('path');
var pug = require('pug');
const utils = require('../custom_node_modules/Utils.js')
const eventTriggers = require('../custom_node_modules/EventTriggers.js')

var saltRounds = 10;

router.post('/', function(req, res, next) {
  //Get config and web data from app
  var config = req.app.get('config');
  var web_data = req.app.get('web_data');
  var state = req.app.get('state');
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
                    con.query(query, async (error, results, fields) => {
                      if (error){
                        con.destroy();
                        res.status(500).send("Database error! Event not changed. (failed at delete)");
                      } else {
                        //Get output for scheduleID
                        for(let i = 0; i < state.outputState.getOutputState().length; i++){
                          //if current output ID matches passed schedule output ID
                          if (state.outputState.getOutputState()[i].outputID == dbschedule.outputID){
                            //set output to that output
                            var output = state.outputState.getOutputState()[i];
                          }
                        }
                        //If no more output schedules turn off device; else remove schedule from regardless
                        state.outputState.removeOutputSchedules(output.outputID, dbschedule.scheduleID);
                        // if(state.outputState.getOutputSchedulesLength(dbschedule.outputID) == 0){
                        //   eventTriggers.turnOffOutput(state, output);
                        // }
                        //Update response
                        var msg = "Event successfully removed!";
                        //If marked for update, add new schedule with passed values.
                        if (sanitizedData.UpdateMode == "'Update'"){
                          if (dbschedule.scheduleType == 'Time'){
                            var query = "CALL addNewSchedule('Time', "+sanitizedData.UpdateEvent+", NULL, NULL, "+sanitizedData.UpdateOutput+", "+sanitizedData.UpdateOutputValue+", NULL, '"+utils.formatTimeStringForDB(sanitizedData.UpdateTrigger)+"', "+utils.formatDateString(sanitizedData.UpdateStartDate)+", "+utils.formatDateString(sanitizedData.UpdateEndDate)+", '1', "+sanitizedData.username+", NULL)";
                          }
                          else {
                            var query = "CALL addNewSchedule('Sensor', "+sanitizedData.UpdateEvent+", "+sanitizedData.UpdateName+", "+sanitizedData.UpdateSensorValue+", "+sanitizedData.UpdateOutput+", "+sanitizedData.UpdateOutputValue+", "+sanitizedData.UpdateComparator+", NULL, "+utils.formatDateString(sanitizedData.UpdateStartDate)+", "+utils.formatDateString(sanitizedData.UpdateEndDate)+", '1', "+sanitizedData.username+", NULL)";
                          }
                          //Execute query
                          con.query(query, (error, results, fields) => {
                            if (error){
                              con.destroy();
                              res.status(500).send("Database error! Event not changed. (failed at update)");
                            }
                            //Update response
                            msg = "Event successfully modified!";
                          });
                        }
                        //Get index data
                        let indexData = await utils.getIndexData(req, con);
                        if(indexData.err){
                          res.status(500).send(indexData.err);
                        } else {
                          indexData.msg = msg;
                          res.status(200).send(indexData);
                        }
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
