var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', async function(req, res, next) {
  var state = req.app.get('state');
  //Get and escape username
  var escapedUsername = mysql.escape(req.body.username);
  //Query DB for username
  let userResults = await dbcalls.getUser(escapedUsername).catch(() => {
    res.status(500).send("Database error! Could not update event.")
  })     
  //If results, compare hash
  if (userResults.length == 0){
    // Error on no results from database
    res.status(400).send("Invalid credentials!");
  } else {
    var hash = userResults[0].passhash;
    bcrypt.compare(req.body.password, hash, async (err, result) => {
      //If no match, report that back.
      if (result != true){
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
        let scheduleResults = await dbcalls.getScheduleByID(sanitizedData.UpdateScheduleID)
        .catch(() => {
          res.status(500).send("Database error! Event not changed. (failed at scheduleID)");              
        })            
        if(scheduleResults[0].Senabled == 0){
          res.status(500).send("Database error! Event not changed. (failed at scheduleID)");
        } else {
          var dbschedule = scheduleResults[0];
          //Disable schedule
          await dbcalls.disableSchedule(dbschedule.scheduleID, sanitizedData.username)
          .catch(() => {
            res.status(500).send("Database error! Event not changed. (failed at delete)");
          })
          //Get output for scheduleID
          for(let i = 0; i < state.outputState.getOutputState().length; i++){
            //if current output ID matches passed schedule output ID
            if (state.outputState.getOutputState()[i].outputID == dbschedule.outputID){
              //set output to that output
              var output = state.outputState.getOutputState()[i];
            }
          }
          //Remove schedule (turns off output if no other schedules for that output)
          state.outputState.removeOutputSchedules(output.outputID, dbschedule.scheduleID);
          //Update response message
          var msg = "Event successfully removed!";
          //If marked for update, add new schedule with passed values.
          if (sanitizedData.UpdateMode == "'Update'"){
            // Update time schedule
            if (dbschedule.scheduleType == 'Time'){
              dbcalls.addNewSchedule("'Time'",sanitizedData.UpdateEvent, null, null, sanitizedData.UpdateOutput, sanitizedData.UpdateOutputValue, null, "'"+utils.formatTimeStringForDB(sanitizedData.UpdateTrigger)+"'", utils.formatDateString(sanitizedData.UpdateStartDate), utils.formatDateString(sanitizedData.UpdateEndDate), '1', sanitizedData.username, null)
              .catch(() => {                    
                res.status(500).send("Database error! Event not changed. (failed at update)");
              })
            // Update Sensor schedule
            } else {
              dbcalls.addNewSchedule("'Sensor'", sanitizedData.UpdateEvent, sanitizedData.UpdateName, sanitizedData.UpdateSensorValue, sanitizedData.UpdateOutput, sanitizedData.UpdateOutputValue, sanitizedData.UpdateComparator, null, utils.formatDateString(sanitizedData.UpdateStartDate), utils.formatDateString(sanitizedData.UpdateEndDate), '1', sanitizedData.username, null)
              .catch(()=> {
                res.status(500).send("Database error! Event not changed. (failed at update)");
              });
            }
            //Update response message
            msg = "Event successfully modified!";
          }
          //Get index data
          let indexData = await utils.getIndexData(req);              
          indexData.msg = msg;
          res.status(200).send(indexData);
        }
      }          
    });
  }   
});

module.exports = router;
