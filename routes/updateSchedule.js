var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', auth, async function(req, res, next) {
  var state = req.app.get('state');
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
    await dbcalls.disableSchedule(dbschedule.scheduleID, "'"+res.locals.username+"'")
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
        let output = sanitizedData.UpdateOutput.slice(1, -1).split("|")[0]
        let event = sanitizedData.UpdateEvent.slice(1, -1).split("|")[0]
        dbcalls.addNewSchedule("'Time'", event, null, null, output, sanitizedData.UpdateOutputValue, null, "'"+utils.formatTimeStringForDB(sanitizedData.UpdateTrigger)+"'", null, sanitizedData.UpdateWarnInterval, utils.formatDateString(sanitizedData.UpdateStartDate), utils.formatDateString(sanitizedData.UpdateEndDate), '1', "'"+res.locals.username+"'", null)
        .catch(() => {                    
          res.status(500).send("Database error! Event not changed. (failed at update)");
        })
      // Update Sensor schedule
      } else if (dbschedule.scheduleType == 'Sensor') {
        let output = sanitizedData.UpdateOutput.slice(1, -1).split("|")[0]
        let event = sanitizedData.UpdateEvent.slice(1, -1).split("|")[0]
        dbcalls.addNewSchedule("'Sensor'", event, sanitizedData.UpdateName, sanitizedData.UpdateSensorValue, output, sanitizedData.UpdateOutputValue, sanitizedData.UpdateComparator, null, null, sanitizedData.UpdateWarnInterval, utils.formatDateString(sanitizedData.UpdateStartDate), utils.formatDateString(sanitizedData.UpdateEndDate), '1', "'"+res.locals.username+"'", null)
        .catch(()=> {
          res.status(500).send("Database error! Event not changed. (failed at update)");
        });
      } else if (dbschedule.scheduleType == 'Periodic') { 
        let PeriodicDuration = parseInt(sanitizedData.UpdateDurationMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.UpdateDurationHours.slice(1,-1)) + 1440*parseInt(sanitizedData.UpdateDurationDays.slice(1,-1))
        let PeriodicInterval = parseInt(sanitizedData.UpdateIntervalMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.UpdateIntervalHours.slice(1,-1)) + 1440*parseInt(sanitizedData.UpdateIntervalDays.slice(1,-1))              
        await dbcalls.addNewSchedule("'Periodic'", '1', null, null, sanitizedData.UpdateOutput, sanitizedData.UpdateOutputValue, null, "'" + utils.formatTimeStringForDB(sanitizedData.UpdatePeriodicTrigger) + "'", "'" + PeriodicDuration + "'", "'" + PeriodicInterval + "'", null, null, '1', "'"+res.locals.username+"'", null).catch(()=> {
          res.status(500).send("Database error! Event not changed. (failed at update)");
        });
      }
      //Update response message
      msg = "Event successfully modified!";
    }
    //Get index data
    let indexData = await utils.getIndexData(res, req);
    let returnData = {}
    returnData.token = res.locals.token
    returnData.msg = msg
    returnData.schedules = indexData.schedules
    returnData.addEvent = indexData.addEvent
    res.status(200).send(returnData);                   
  }
});

module.exports = router;
