var express = require('express');
var router = express.Router();
var dbcalls = require('../custom_node_modules/utility_modules/database_calls.js');
var utils = require('../custom_node_modules/utility_modules/Utils.js');

router.get('/', async function(req, res, next) {
  try {
    let data = {}
    data.web_data = req.app.get('web_data')
    let results = await dbcalls.getAllUsers()
    if(results.length <= 1){
      //No user accounts created - prompt user
      data.new_user = 1
      res.status(200).render('settings', data);
    } else {
      let authenticated = utils.cookieDetector(req)
      if (!authenticated){
        data.authenticated = 0
        //Prompt login
        res.status(401).render('settings', data)
      } else {
        let outputTypes = await dbcalls.getEnabledOutputTypes()
        let outputs = await dbcalls.getEnabledOrderedOutputs()
        let sensorTypes = await dbcalls.getEnabledSensorTypes()
        let sensors = await dbcalls.getEnabledSensors()
        data.new_user = 0
        data.outputTypes = outputTypes;
        data.outputs = outputs;
        data.sensorTypes = sensorTypes
        data.sensors = sensors
        res.status(200).render('settings', data);
      }
    }
  } catch (e) {
    res.status(500).send('500: Server error')
  }
});


module.exports = router;
