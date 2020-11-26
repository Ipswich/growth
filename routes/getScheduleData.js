var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pug = require('pug');
const path = require('path');
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const moment = require('moment')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', async function(req, res, next) {
  //Set variables for pug rendering (get file location, prep function)
  const file = path.join(req.app.get('views'), '/updateEventMeta.pug');
  var fn = pug.compileFile(file);
  //Get and escape scheduleID
  var scheduleID = mysql.escape(req.body.data);
  //If invalid scheduleID, send issue back to website.
  if (scheduleID < 0){
    res.status(400).send("Invalid ScheduleID!");
  } else {
    //DO STUFF WITH ESCAPED DATA 
    //Get schedule by ID
    var schedule = {schedule: (await dbcalls.getScheduleByID(scheduleID).catch(()=> {
      res.status(500).send("Database error! Could not fetch schedule data.")
    }))[0]};    
    //Get enabled sensor types
    var sensorTypes = {sensorTypes: await dbcalls.getEnabledSensorTypes().catch(() => {
      res.status(500).send("Database error! Could not fetch schedule data.")
    })};            
    //Get enabled outputs
    var outputs = {outputs: await dbcalls.getEnabledOutputs().catch(() => {
      res.status(500).send("Database error! Could not fetch schedule data.")
    })};
    //Get enabled events
    var events = {events: await dbcalls.getEnabledEvents().catch(() => {
      res.status(500).send("Database error! Could not fetch schedule data.")
    })};
    //Get enabled sensors                      
    var sensors = {sensors: await dbcalls.getEnabledSensors().catch(() => {
      res.status(500).send("Database error! Could not fetch schedule data.")
    })}
    //Check if authenticated
    var authenticated = {authenticated: utils.cookieDetector(req)}
    //Create data object for rendering html
    defaultData = {}
    defaultData.defaults = await formatDefaults(schedule, outputs, events, sensors)
    var data = Object.assign({}, defaultData, schedule, sensorTypes, outputs, events, sensors, authenticated);
    //Render html, send to server!        
    var html = fn(data);
    let result = Object.assign({}, {html: html}, defaultData);
    res.status(200).send(result);                     
  };
})


async function formatDefaults(schedule, outputs, events, sensors){
  var defaults = {};
  defaults.outputName = schedule.schedule.outputName;
  defaults.sensorValue = schedule.schedule.sensorValue;
  defaults.outputValue = schedule.schedule.outputValue;
  defaults.comparator = schedule.schedule.scheduleComparator;
  //If there is a trigger time, parse.
  if(schedule.schedule.eventTriggerTime) {
    var triggerTime = moment(schedule.schedule.eventTriggerTime, "HH:mm:ss");
    defaults.eventTriggerTime = triggerTime.format('HH:mm');
  }
  //If there are duration/intervals, parse.
  if(schedule.schedule.eventDuration) {
    let duration = schedule.schedule.eventDuration
    defaults.eventDurationDays = Math.floor(duration / 1440)
    duration = duration % 1440
    defaults.eventDurationHours = Math.floor(duration / 60)
    duration = duration % 60
    defaults.eventDurationMinutes = duration
  }
  if(schedule.schedule.eventInterval) {
    let interval = schedule.schedule.eventInterval
    defaults.eventIntervalDays = Math.floor(interval / 1440)
    interval = interval % 1440
    defaults.eventIntervalHours = Math.floor(interval / 60)
    interval = interval % 60
    defaults.eventIntervalMinutes = interval
  }
  //If there is a schedule start date, parse.
  if (schedule.schedule.scheduleStartDate) {
    defaults.scheduleStartDate = moment(schedule.schedule.scheduleStartDate).format("MM/DD/YYYY");
  } else {
    defaults.scheduleStartDate = false;
  }
  //If there is a schedule stop date, parse.
  if (schedule.schedule.scheduleStopDate) {
    defaults.scheduleStopDate = moment(schedule.schedule.scheduleStopDate).format("MM/DD/YYYY");
  } else {
    defaults.scheduleStopDate = false;
  }
  //Get default output
  for (let i = 0; i < outputs.outputs.length; i++){
    if(schedule.schedule.outputID == outputs.outputs[i].outputID) {
      defaults.output = outputs.outputs[i].outputName;
    }
  }
  //Get default event Type
  for (let i = 0; i < events.events.length; i++){
    if(schedule.schedule.eventID == events.events[i].eventID) {
      defaults.eventName = events.events[i].eventName;
    }
  }
  //Get default sensor
  for (let i = 0; i < sensors.sensors.length; i++) {
    //Create sensor list for schedule, matching sensor Type with Location
    if(schedule.schedule.sensorID == sensors.sensors[i].eventID) {
      defaults.sensor = sensors.sensors[i].sensorType + " @ " + sensors.sensors[i].sensorLocation;
    }
  }
  return defaults
}

module.exports = router;
