var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/utils.js')
const html_generators = require('../custom_node_modules/utility_modules/html_generators.js')

router.post('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  let output = sanitizedData.PeriodicOutput.slice(1, -1).split("|")[0]
  //DO STUFF WITH ESCAPED DATA
  // Transform duration and interval into minutes
  let PeriodicDuration = parseInt(sanitizedData.PeriodicDurationMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.PeriodicDurationHours.slice(1,-1)) + 1440*parseInt(sanitizedData.PeriodicDurationDays.slice(1,-1))
  let PeriodicInterval = parseInt(sanitizedData.PeriodicIntervalMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.PeriodicIntervalHours.slice(1,-1)) + 1440*parseInt(sanitizedData.PeriodicIntervalDays.slice(1,-1))
  // Database call
  await dbcalls.addNewSchedule("'Periodic'", '1', null, null, output, sanitizedData.PeriodicOutputValue, null, "'" + utils.formatTimeStringForDB(sanitizedData.PeriodicTrigger) + "'", PeriodicDuration, PeriodicInterval, null, null, '1', "'"+res.locals.username+"'", null, null)
  .catch(() => {
    res.status(500).send("Database error! Event not added.");
  });
  //Get index data
  let addEvent = await html_generators.getAddEventHTML(res, req)
  let schedules = await html_generators.getSchedulesHTML(res, req)
  let manual = await html_generators.getManualHTML(res, req)
  .catch(() => {
    res.status(500).send("Database error! Could not fetch index.");                              
  })
  let returnData = {}
  returnData.token = res.locals.token
  returnData.msg = "Periodic event successfully added!"
  returnData.schedules = schedules.schedules
  returnData.addEvent = addEvent.addEvent
  returnData.manual = manual.manual
  res.status(200).send(returnData);                     
});

module.exports = router;
