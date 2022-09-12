const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const auth = require('../middleware/authenticateLogin');
const Sensors = require('../models/Sensors');

router.get('/', auth, async function(req, res, next) {
  try {
    let results = await Sensors.readAllAsync()
    res.status(200).send(results)
  } catch (e) {
    res.status(500).send()
  }
})

//Add new sensor
router.post('/', auth, async function(req, res, next) {
  //Escape Data
  let sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
      sanitizedData[key] = null
    } else {
      sanitizedData[key] = mysql.escape(sanitizedData[key])
    }
  }  
  let sensor = {}
  sensor.model = sanitizedData.SensorModel || '"<no model>"'
  sensor.type = sanitizedData.SensorType || '"<no type>"'
  sensor.location = sanitizedData.SensorLocation || '"<no location>"'
  sensor.units = sanitizedData.SensorUnits || '"<no units>"'
  sensor.hardwareID = sanitizedData.SensorHardwareID
  sensor.protocol = sanitizedData.SensorProtocol
  sensor.address = sanitizedData.SensorAddress
  sensor.pin = sanitizedData.SensorPin
  
  try {
    await Sensors.createAsync(sensor.model, sensor.type, sensor.location, sensor.units, sensor.hardwareID, sensor.protocol, sensor.address, sensor.pin)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Update sensor
router.put('/', auth, async function(req, res, next) {
  //Escape Data
  let sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
      sanitizedData[key] = null
    } else {
      sanitizedData[key] = mysql.escape(sanitizedData[key])
    }
  }  
  let sensor = {}
  sensor.id = sanitizedData.SensorID  
  sensor.model = sanitizedData.SensorModel || '"<no model>"'
  sensor.type = sanitizedData.SensorType || '"<no type>"'
  sensor.location = sanitizedData.SensorLocation || '"<no location>"'
  sensor.units = sanitizedData.SensorUnits || '"<no units>"'
  sensor.hardwareID = sanitizedData.SensorHardwareID
  sensor.protocol = sanitizedData.SensorProtocol
  sensor.address = sanitizedData.SensorAddress
  sensor.pin = sanitizedData.SensorPin
  
  try {
    await Sensors.updateAsync(sensor.id, sensor.model, sensor.type, sensor.location, sensor.units, sensor.hardwareID, sensor.protocol, sensor.address, sensor.pin)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Delete sensor
router.delete('/', auth, async function(req, res, next) {
  //Escape Data
  let sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
      sanitizedData[key] = null
    } else {
      sanitizedData[key] = mysql.escape(sanitizedData[key])
    }
  }  
  let id = sanitizedData.SensorID
  try {
    await Sensors.deleteAsync(id)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;