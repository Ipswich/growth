const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const printouts = require('../custom_node_modules/utility_modules/printouts')

router.get('/outputs', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    return_data = {}
    return_data.outputState = state.outputState.getOutputData()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/sensors', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    return_data = {}
    return_data.sensorState = state.sensorState.getSensorData()
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/events', auth, async function(req, res, next){
  try {
    let state = req.app.get('state')
    return_data = {}
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

router.get('/warn_state', auth, async function (req, res, next) {
  try {
    let state = req.app.get('state')
    return_data = {}
    return_data.warn_state = state.warnState
    res.status(200).send(return_data)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;

