const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authenticateLogin')
const TimeEvents = require('../../models/events/TimeEvents');
const mysql = require('mysql');

router.post('/timeEvents', auth, async function(req, res, next) {
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
    let triggerTime = sanitizedData.triggerTime;
    let outputID = sanitizedData.outputID;
    let outputValue = sanitizedData.outputValue;
    let createdBy = `'${res.locals.username}'`
    await TimeEvents.createAsync(dayID, triggerTime, outputID, outputValue, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/timeEvents', auth, async function(req, res, next) {
  try {
    let result = await TimeEvents.getAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/timeEvents/:dayID', auth, async function(req, res, next) {
  try {
    let result = await TimeEvents.getByDayIDAsync(mysql.escape(req.params.dayID));
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.put('/timeEvents', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    }
    let timeEventID = sanitizedData.eventID
    let dayID = sanitizedData.dayID;
    let triggerTime = sanitizedData.triggerTime;
    let outputID = sanitizedData.outputID;
    let outputValue = sanitizedData.outputValue;
    let createdBy = `'${res.locals.username}'`
    await TimeEvents.updateAsync(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/timeEvents', auth, async function(req, res, next) {
  try {
    await TimeEvents.deleteAsync(mysql.escape(req.body.eventID));
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router