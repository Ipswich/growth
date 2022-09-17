const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authenticateLogin')
const Manual = require('../../models/events/ManualEvents');
const mysql = require('mysql');

router.post('/manualEvents', auth, async function(req, res, next) {
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
    let outputID = sanitizedData.outputID;
    let outputValue = sanitizedData.outputValue;
    let createdBy = `'${res.locals.username}'`
    await Manual.createAsync(dayID, outputID, outputValue, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/manualEvents', auth, async function(req, res, next) {
  try {
    let result = await Manual.getAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/manualEvents/:dayID', auth, async function(req, res, next) {
  try {
    let result = await Manual.getByDayIDAsync(mysql.escape(req.params.dayID));
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.put('/manualEvents', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    }
    let manualEventID = sanitizedData.manualEventID
    let dayID = sanitizedData.dayID;
    let outputID = sanitizedData.outputID;
    let outputValue = sanitizedData.outputValue;
    let createdBy = `'${res.locals.username}'`
    await Manual.updateAsync(manualEventID, dayID, outputID, outputValue, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/manualEvents', auth, async function(req, res, next) {
  try {
    await Manual.deleteAsync(mysql.escape(req.body.eventID));
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router