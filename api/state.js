const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const printouts = require('../custom_node_modules/utility_modules/printouts')

// Output states
router.get('/outputs', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    let return_data = state.outputState.getOutputData()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/outputs/:outputid', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    let outputID = parseInt(req.params.outputid)
    if (outputID == NaN){
      throw new TypeError()
    }
    let return_data = state.outputState.getOutputData(outputID).pop()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

// Sensor states
router.get('/sensors', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    let return_data = {}
    return_data = state.sensorState.getSensorData()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/sensors/:sensorid', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    let sensorID = parseInt(req.params.sensorid)
    if (sensorID == NaN){
      throw new TypeError()
    }
    let return_data = state.sensorState.getSensorData(sensorID).pop()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

// Events
router.get('/events', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    let return_data = {}
    return_data.events = state.events
    for(data in return_data.events){
      if (data.Eenabled == 1){
        data.Eenabled = true
      } else {
        data.Eenabled = false
      }
    }
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

// Email Warn State
router.get('/warn_state', auth, async function (req, res, next) {
  try {
    let state = req.app.get('state')
    let return_data = {}
    return_data.warn_state = state.warnState
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;

