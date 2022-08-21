const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin')
const sensorEvent = require('../../models/SensorEvents');

router.post('/create', auth, async function(req, res, next) {
  try {
    let sql_data = {};
    sql_data.dayID = req.body.dayID;
    sql_data.startTime = req.body.startTime;
    sql_data.stopTime = req.body.stopTime;
    sql_data.outputID = req.body.outputID;
    sql_data.outputValue = req.body.outputValue;
    sql_data.sensorID = req.body.sensorID;
    sql_data.triggerValues = req.body.triggerValues;
    sql_data.triggerComparator = req.body.triggerComparator;
    sql_data.createdBy = res.locals.username;
    sensorEvent.createAsync(sql_data);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/get', auth, async function(req, res, next) {
  try {

    let result = sensorEvent.readAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.put('/update', auth, async function(req, res, next) {
  try {
    let sql_data = {};
    sql_data.sensorTriggerID = req.body.sensorTriggerID;
    sql_data.dayID = req.body.dayID;
    sql_data.startTime = req.body.startTime;
    sql_data.stopTime = req.body.stopTime;
    sql_data.outputID = req.body.outputID;
    sql_data.outputValue = req.body.outputValue;
    sql_data.sensorID = req.body.sensorID;
    sql_data.triggerValues = req.body.triggerValues;
    sql_data.triggerComparator = req.body.triggerComparator;
    sql_data.createdBy = res.locals.username;
    sensorEvent.updateAsync(sql_data);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/delete', auth, async function(req, res, next) {
  try {
    sensorEvent.deleteAsync(req.body.dayID);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router