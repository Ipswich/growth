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
    //Compare hash and password
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
      }
    });
  }    
});

module.exports = router;
