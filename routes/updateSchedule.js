var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/utils.js')
const html_generators = require('../custom_node_modules/utility_modules/html_generators.js')

router.post('/', auth, async function(req, res, next) {
  let eventMap = await dbcalls.getEnabledEvents()
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
    //Update response message
    var msg = "Event successfully removed!";
    //If marked for update, add new schedule with passed values.
    if (sanitizedData.UpdateMode == "'Update'"){
      // Update Time schedule
      if (dbschedule.scheduleType == 'Time'){
        let event = sanitizedData.UpdateEvent.slice(1, -1).split("|")[0]
        //Get the event name for non auto-incremented value comparison
        let eventName = eventMap.find(e => e.eventID == event).eventName
        let output = ''
        if (eventName == 'Python Script'){
          output = sanitizedData.UpdatePythonOutput.slice(1, -1).split("|")[0]
        } else {
          output = sanitizedData.UpdateOutput.slice(1, -1).split("|")[0]
        }
        dbcalls.addNewSchedule("'Time'", event, null, null, output, sanitizedData.UpdateOutputValue, null, "'"+utils.formatTimeStringForDB(sanitizedData.UpdateTrigger)+"'", null, null, utils.formatDateStringForDB(sanitizedData.UpdateStartDate), utils.formatDateStringForDB(sanitizedData.UpdateEndDate), '1', "'"+res.locals.username+"'", null, sanitizedData.UpdatePythonScript)
        .catch(() => {                    
          res.status(500).send("Database error! Event not changed. (failed at update)");
        })
      // Update Sensor schedule
      } else if (dbschedule.scheduleType == 'Sensor') {
        let event = sanitizedData.UpdateEvent.slice(1, -1).split("|")[0]
        //Get the event name for non auto-incremented value comparison
        let eventName = eventMap.find(e => e.eventID == event).eventName
        let output = ''
        if (eventName == 'Python Script'){
          output = sanitizedData.UpdatePythonOutput.slice(1, -1).split("|")[0]
        } else {
          output = sanitizedData.UpdateOutput.slice(1, -1).split("|")[0]
        }
        dbcalls.addNewSchedule("'Sensor'", event, sanitizedData.UpdateName, sanitizedData.UpdateSensorValue, output, sanitizedData.UpdateOutputValue, sanitizedData.UpdateComparator, null, null, sanitizedData.UpdateWarnInterval, utils.formatDateStringForDB(sanitizedData.UpdateStartDate), utils.formatDateStringForDB(sanitizedData.UpdateEndDate), '1', "'"+res.locals.username+"'", null, sanitizedData.UpdatePythonScript)
        .catch(()=> {
          res.status(500).send("Database error! Event not changed. (failed at update)");
        });
      // Update Periodic Schedule
      } else if (dbschedule.scheduleType == 'Periodic') { 
        let PeriodicDuration = parseInt(sanitizedData.UpdateDurationMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.UpdateDurationHours.slice(1,-1)) + 1440*parseInt(sanitizedData.UpdateDurationDays.slice(1,-1))
        let PeriodicInterval = parseInt(sanitizedData.UpdateIntervalMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.UpdateIntervalHours.slice(1,-1)) + 1440*parseInt(sanitizedData.UpdateIntervalDays.slice(1,-1))              
        await dbcalls.addNewSchedule("'Periodic'", '1', null, null, sanitizedData.UpdateOutput, sanitizedData.UpdateOutputValue, null, "'" + utils.formatTimeStringForDB(sanitizedData.UpdatePeriodicTrigger) + "'", "'" + PeriodicDuration + "'", "'" + PeriodicInterval + "'", null, null, '1', "'"+res.locals.username+"'", null, null)
        .catch(()=> {
          res.status(500).send("Database error! Event not changed. (failed at update)");
        });
      }
      //Update response message
      msg = "Event successfully modified!";
    }
    //Get index data
    let addEvent = await html_generators.getAddEventHTML(res, req)
    let schedules = await html_generators.getSchedulesHTML(res, req)
    let manual = await html_generators.getManualHTML(res, req)
    let returnData = {}
    returnData.token = res.locals.token
    returnData.msg = msg
    returnData.schedules = schedules.schedules
    returnData.addEvent = addEvent.addEvent
    returnData.manual = manual.manual
    res.status(200).send(returnData);                   
  }
});

module.exports = router;
