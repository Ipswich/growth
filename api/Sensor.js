var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var auth = require('../middleware/authenticateLogin.js')
var dbcalls = require('../models/utility/database_calls.js')

router.get('/', auth, async function(req, res, next) {
  try {
    var results = await dbcalls.getEnabledSensors()
    res.status(200).send(results)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/html', auth, async function(req, res, next) {
  try {
    var data = {sensors: await dbcalls.getEnabledSensors()}
    res.status(200).render('./settings/sensor/sensor_select', data);
  } catch (e) {
    res.status(500).send()
  }
})

//Add new sensor
router.post('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  var sensor = {}
  sensor.type = sanitizedData.SensorTypeSelect == 'NULL' ? '"<no type>"' : sanitizedData.SensorTypeSelect
  sensor.units = sanitizedData.SensorUnits == 'NULL' ? '"<no units>"' : sanitizedData.SensorUnits
  sensor.location = sanitizedData.SensorLocation == 'NULL' ? '"<no location>"' : sanitizedData.SensorLocation
  sensor.model = sanitizedData.SensorModel == 'NULL' ? '"<no model>"' : sanitizedData.SensorModel
  sensor.protocol = sanitizedData.SensorProtocolSelect
  sensor.address = sanitizedData.SensorAddress == 'NULL' ? 'NULL' : sanitizedData.SensorAddress
  sensor.hardwareID = sanitizedData.SensorHardwareID
  
  try {
    await dbcalls.addNewSensor(sensor.model, sensor.type, sensor.location, sensor.units, sensor.hardwareID, sensor.protocol, sensor.address)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Update sensor
router.put('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  let id = sanitizedData.SensorSelect.slice(1, -1).split("|")[7]  
  var sensor = {}
  sensor.type = sanitizedData.SensorTypeSelect == 'NULL' ? '"<no type>"' : sanitizedData.SensorTypeSelect
  sensor.units = sanitizedData.SensorUnits == 'NULL' ? '"<no units>"' : sanitizedData.SensorUnits
  sensor.location = sanitizedData.SensorLocation == 'NULL' ? '"<no location>"' : sanitizedData.SensorLocation
  sensor.model = sanitizedData.SensorModel == 'NULL' ? '"<no model>"' : sanitizedData.SensorModel
  sensor.protocol = sanitizedData.SensorProtocolSelect
  sensor.address = sanitizedData.SensorAddress == 'NULL' ? 'NULL' : sanitizedData.SensorAddress
  sensor.hardwareID = sanitizedData.SensorHardwareID == 'NULL' ? '0' : sanitizedData.SensorHardwareID

  try {
    await dbcalls.updateSensor(id, sensor.model, sensor.type, sensor.location, sensor.units, sensor.hardwareID, sensor.protocol, sensor.address)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Delete sensor
router.delete('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  let id = sanitizedData.SensorSelect.slice(1, -1).split("|")[7]
  try {
    await dbcalls.disableSensor(id)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;