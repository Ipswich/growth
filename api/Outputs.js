const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const Outputs = require('../models/Outputs')

router.get('/', auth, async function(req, res, next) {
  try {
    let results = await Outputs.readAllAsync()
    res.status(200).send(results)
  } catch (e) {
    res.status(500).send()
  }
})

//Add new output
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
  let output = {}
  output.name = sanitizedData.OutputName || '<unnamed>'
  output.type = sanitizedData.OutputType
  output.description = sanitizedData.OutputDescription
  output.PWM = sanitizedData.OutputPWM
  output.PWMPin = sanitizedData.OutputPWMPin
  output.PWMInversion = sanitizedData.OutputPWMInversion
  output.order = sanitizedData.OutputOrder

  try {
    await Outputs.createAsync(output.name, output.type, output.description, output.PWM, output.PWMPin = null, output.PWMInversion = null, output.order = 0)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Update output
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
  let output = {}
  output.id = sanitizedData.OutputID
  output.name = sanitizedData.OutputName || "<unnamed>"
  output.type = sanitizedData.OutputType
  output.description = sanitizedData.OutputDescription
  output.PWM = sanitizedData.OutputPWM
  output.PWMPin = sanitizedData.OutputPWMPin
  output.PWMInversion = sanitizedData.OutputPWMInversion
  output.order = sanitizedData.OutputOrder
  
  try {
    await Outputs.updateAsync(output.id, output.name, output.type, output.description, output.PWM, output.PWMPin, output.PWMInversion, output.order)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Delete output
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
  let id = sanitizedData.OutputID
  try {
    await Outputs.deleteAsync(id)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;