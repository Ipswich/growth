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
  let output = sanitizedData.TimeOutput.slice(1, -1).split("|")[0]
  let event = sanitizedData.TimeEvent.slice(1, -1).split("|")[0]
  //DO STUFF WITH ESCAPED DATA
  await dbcalls.addNewSchedule("'Time'", event, null, null, output, sanitizedData.TimeOutputValue, null, "'" + utils.formatTimeStringForDB(sanitizedData.TimeTrigger) + "'", null, null, utils.formatDateString(sanitizedData.TimeStartDate), utils.formatDateString(sanitizedData.TimeEndDate), '1', "'"+res.locals.username+"'", null)
  .catch(() => {
    return res.status(500).send("Database error! Event not added.");
  });
  //Get index data
  let addEvent = await utils.getAddEventHTML(res, req)
  let schedules = await utils.getSchedulesHTML(res, req)
  .catch(() => {
    res.status(500).send("Database error! Could not fetch index.");                              
  })
  let returnData = {}
  returnData.token = res.locals.token
  returnData.msg = "Time event successfully added!"
  returnData.schedules = schedules.schedules
  returnData.addEvent = addEvent.addEvent
  res.status(200).send(returnData);                    
});

module.exports = router;
