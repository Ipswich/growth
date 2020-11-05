var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const utils = require('../custom_node_modules/utility_modules/Utils.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')

router.post('/', async function(req, res, next) {
  var results = await dbcalls.getUser(mysql.escape(req.body.username))
  .catch(() => {
    // Error on database failure
    res.status(500).send("Database error!");
  })
  if (results.length == 0){
    // Error on no results from database
    res.status(400).send("Invalid credentials!");
  } else {
    var hash = results[0].passhash;
    bcrypt.compare(req.body.password, hash, async (err, result) => {
      if (result != true){
        res.status(400).send("Invalid credentials!");
      } else {
        //Escape Data
        var sanitizedData = Object.assign({}, req.body);
        for (const key in sanitizedData){
          if (sanitizedData[key] == ''){
            sanitizedData[key] = null
          }
          sanitizedData[key] = mysql.escape(sanitizedData[key])
        }          
        //DO STUFF WITH ESCAPED DATA
        await dbcalls.addNewSchedule("'Sensor'", sanitizedData.SensorEvent, sanitizedData.SensorSensorName, sanitizedData.SensorSensorValue, sanitizedData.SensorOutput, sanitizedData.SensorOutputValue, sanitizedData.SensorComparator, null, utils.formatDateString(sanitizedData.SensorStartDate), utils.formatDateString(sanitizedData.SensorEndDate), '1', sanitizedData.username, null)
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
      }
    });
  }      
});

module.exports = router;
