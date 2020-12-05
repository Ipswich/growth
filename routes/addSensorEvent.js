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
  let output = sanitizedData.SensorOutput.slice(1, -1).split("|")[0]
  let event = sanitizedData.SensorEvent.slice(1, -1).split("|")[0]
  //DO STUFF WITH ESCAPED DATA
  await dbcalls.addNewSchedule("'Sensor'", event, sanitizedData.SensorSensorName, sanitizedData.SensorSensorValue, output, sanitizedData.SensorOutputValue, sanitizedData.SensorComparator, null, null, sanitizedData.SensorWarnInterval, utils.formatDateString(sanitizedData.SensorStartDate), utils.formatDateString(sanitizedData.SensorEndDate), '1', "'"+res.locals.username+"'", null)
  .catch(() => {
    res.status(500).send("Database error! Event not added.");
  });
  //Get index data
  let addEvent = await utils.getAddEventHTML(res, req)
  let schedules = await utils.getSchedulesHTML(res, req)
  let manual = await utils.getManualHTML(res, req)
  .catch(() => {
    res.status(500).send("Database error! Could not fetch index.");                              
  })
  let returnData = {}
  returnData.token = res.locals.token
  returnData.msg = "Sensor event successfully added!"
  returnData.schedules = schedules.schedules
  returnData.addEvent = addEvent.addEvent
  returnData.manual = manual.manual
  res.status(200).send(returnData);                    
});

module.exports = router;
