const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authenticateLogin')
const mysql = require('mysql');
const SensorEvents = require('../../models/events/SensorEvents');

router.post('/sensorEvents', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    } 
    let dayID = sanitizedData.dayID;
    let startTime = sanitizedData.startTime;
    let stopTime = sanitizedData.stopTime;
    let outputID = sanitizedData.outputID;
    let sensorID = sanitizedData.sensorID;
    let triggerValues = sanitizedData.triggerValues;
    let triggerComparator = sanitizedData.triggerComparator;
    let createdBy = res.locals.username;
    await SensorEvents.createAsync(dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/sensorEvents', auth, async function(req, res, next) {
  try {
    let result = await SensorEvents.getAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.put('/sensorEvents', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    } 
    let sensorEventID = sanitizedData.sensorEventID;
    let dayID = sanitizedData.dayID;
    let startTime = sanitizedData.startTime;
    let stopTime = sanitizedData.stopTime;
    let outputID = sanitizedData.outputID;
    let sensorID = sanitizedData.sensorID;
    let triggerValues = sanitizedData.triggerValues;
    let triggerComparator = sanitizedData.triggerComparator;
    let createdBy = res.locals.username;
    await SensorEvents.updateAsync(sensorEventID, dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/sensorEvents', auth, async function(req, res, next) {
  try {
    await SensorEvents.deleteAsync(mysql.escape(req.body.dayID));
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router