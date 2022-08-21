const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin')
const timeEvents = require('../../models/TimeEvents');

router.post('/create', auth, async function(req, res, next) {
  try {
    let sql_data = {};
    sql_data.dayID = req.body.dayID;
    sql_data.triggerTime = req.body.triggerTime;
    sql_data.outputID = req.body.outputID;
    sql_data.outputValue = req.body.outputValue;
    sql_data.createdBy = res.locals.username;
    timeEvents.createAsync(sql_data);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/get', auth, async function(req, res, next) {
  try {

    let result = timeEvents.readAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.put('/update', auth, async function(req, res, next) {
  try {
    let sql_data = {};
    sql_data.timeEventID = req.body.timeEventID;
    sql_data.dayID = req.body.dayID;
    sql_data.triggerTime = req.body.triggerTime;
    sql_data.outputID = req.body.outputID;
    sql_data.outputValue = req.body.outputValue;
    sql_data.createdBy = res.locals.username;
    timeEvents.updateAsync(sql_data);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/delete', auth, async function(req, res, next) {
  try {
    timeEvents.deleteAsync(req.body.dayID);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router