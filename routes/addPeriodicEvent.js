var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  //DO STUFF WITH ESCAPED DATA
  // Transform duration and interval into minutes
  let PeriodicDuration = parseInt(sanitizedData.PeriodicDurationMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.PeriodicDurationHours.slice(1,-1)) + 1440*parseInt(sanitizedData.PeriodicDurationDays.slice(1,-1))
  let PeriodicInterval = parseInt(sanitizedData.PeriodicIntervalMinutes.slice(1,-1)) + 60*parseInt(sanitizedData.PeriodicIntervalHours.slice(1,-1)) + 1440*parseInt(sanitizedData.PeriodicIntervalDays.slice(1,-1))
  // Database call
  await dbcalls.addNewSchedule("'Periodic'", '1', null, null, sanitizedData.PeriodicOutput, sanitizedData.PeriodicOutputValue, null, "'" + utils.formatTimeStringForDB(sanitizedData.PeriodicTrigger) + "'", PeriodicDuration, PeriodicInterval, null, null, '1', sanitizedData.username, null)
  .catch(() => {
    res.status(500).send("Database error! Event not added.");
  });
  //Get index data
  let indexData = await utils.getIndexData(req)
  .catch(() => {
    res.status(500).send("Database error! Could not fetch index.");                              
  })
  let returnData = {}
  returnData.msg = "Periodic event successfully added!"
  returnData.schedules = indexData.schedules
  res.status(200).send(returnData);                     
});

module.exports = router;
