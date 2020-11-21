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
  await dbcalls.addNewSchedule("'Sensor'", sanitizedData.SensorEvent, sanitizedData.SensorSensorName, sanitizedData.SensorSensorValue, sanitizedData.SensorOutput, sanitizedData.SensorOutputValue, sanitizedData.SensorComparator, null, null, null, utils.formatDateString(sanitizedData.SensorStartDate), utils.formatDateString(sanitizedData.SensorEndDate), '1', sanitizedData.username, null)
  .catch(() => {
    res.status(500).send("Database error! Event not added.");
  });
  //Get index data
  let indexData = await utils.getIndexData(req)
  .catch(() => {
    res.status(500).send("Database error! Could not fetch index.");                              
  })
  let returnData = {}
  returnData.msg = "Sensor event successfully added!"
  returnData.schedules = indexData.schedules
  res.status(200).send(returnData);                   
});

module.exports = router;
