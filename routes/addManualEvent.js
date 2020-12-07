var mEventHandler = require('../custom_node_modules/event_modules/event_handlers/ManualEventHandler.js')
var eventTriggers = require('../custom_node_modules/event_modules/EventTriggers.js')
var express = require('express');
var moment = require('moment')
var mysql = require('mysql');
var router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', auth, async function(req, res, next) {
  let state = req.app.get('state')
  let eventMappings = req.app.get('state').outputState.eventMappings
  let outputState = req.app.get('state').outputState
  //Escape Data and organize 
  var sanitizedData = Object.assign({}, req.body);
  var organizedData = []
  let currentOutputID = -1
  let i = -1
  for (const key in sanitizedData){    
    if(key == 'username' || key == 'password'){
      continue
    }
    //Clean up and sanitize data
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
      continue
    }
    //Parse outputID and Item from key
    let outputItem = key.split("_")[0]
    let outputID = key.split("_")[1]
    //Get next outputID
    if (outputID != currentOutputID){
      currentOutputID = outputID
      i++
      organizedData[i] = {}
      organizedData[i].outputID = currentOutputID
    }
    // Checkboxes do weirdness - get first value from those that are actually arrays        
    if(typeof sanitizedData[key] === 'object') {      
      organizedData[i][outputItem] = sanitizedData[key][0]
    } else {
      organizedData[i][outputItem] = sanitizedData[key]
    }
    organizedData[i][outputItem] = mysql.escape(organizedData[i][outputItem])

    //Get eventID instead of "off" or "on"
    if(outputItem == 'manualOutputSwitch'){
      eventMappings.forEach((element) => {
        if(organizedData[i][outputItem] == "'off'"){
          if (element.eventName == 'Output Off'){
            organizedData[i]['eventString'] = 'Output Off'
            organizedData[i][outputItem] = element.eventID.toString()
          }
        }
        if(organizedData[i][outputItem] == "'on'"){
          if (element.eventName == 'Output On'){
            organizedData[i]['eventString'] = 'Output On'
            organizedData[i][outputItem] = element.eventID.toString()
          }
        }
      })
    }    
  }
  //DO STUFF WITH ESCAPED DATA
  let currentTime = '[' + moment().format('HH:mm') + ']'
  await organizedData.forEach(async (element) => {
    outputState.setLastOutputController(element.outputID, outputState.getOutputController(element.outputID))
    if(element.manualToggle == "'off'"){
      if(outputState.getOutputController(element.outputID) != "Schedule"){
        outputState.setOutputController(element.outputID, "Schedule")
        console.log(currentTime + "  " + outputState.getOutputName(element.outputID) + ": switched to [Schedule]")
        eventTriggers.resumeSchedule(outputState, element.outputID)      
      }
      // If manual toggle off, give control to Schedule
      return
    } else {
      if(outputState.getOutputController(element.outputID) != "Manual"){
        console.log(currentTime + "  " + outputState.getOutputName(element.outputID) + ": switched to [Manual]")
      }
      // Else, give control to Manual
      outputState.setOutputController(element.outputID, "Manual")
      if(element.manualOutputValue == undefined) {
        element.manualOutputValue = 100
      }
      // Add Manual schedule to DB
      await dbcalls.addNewSchedule("'Manual'", element.manualOutputSwitch, null, null, element.outputID, element.manualOutputValue, null, "'" + utils.formatTimeStringForDB(moment().format('h:mm A')) + "'", null, null, null, null, '1', "'"+res.locals.username+"'", null)
      .catch(() => {
        return res.status(500).send("Database error! Event not added.");
      });
    }
  })
  //Get index data
  try {
    await mEventHandler.ManualEventHandler(state)
  } catch(e) {
    console.log("ManualEventHandler error")
    return res.status(500).send("Database error, manual event failed.")
  }
  try {
    var addEvent = await utils.getAddEventHTML(res, req)
    var schedules = await utils.getSchedulesHTML(res, req)
    var manual = await utils.getManualHTML(res, req)
  } catch(e){
    console.log("Index error")
    return res.status(500).send("Database error! Could not fetch index.");                              
  }
  let returnData = {}
  returnData.token = res.locals.token
  returnData.msg = "Manual event successfully added!"
  returnData.schedules = schedules.schedules
  returnData.addEvent = addEvent.addEvent
  returnData.manual = manual.manual
  return res.status(200).send(returnData);                    
});

module.exports = router;
