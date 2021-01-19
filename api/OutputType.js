var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var auth = require('../middleware/authenticateLogin.js')
var dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
var utils = require('../custom_node_modules/utility_modules/Utils.js');

router.get('/', auth, async function(req, res, next) {
  try {
    var results = await dbcalls.getEnabledOutputTypes()
    res.status(200).send(results)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/html', auth, async function(req, res, next) {
  try {
    var data = {outputTypes: await dbcalls.getEnabledOutputTypes()}
    res.status(200).render('./settings/output_type/output_type_select', data);
  } catch (e) {
    res.status(500).send()
  }
})

//Add new output type
router.post('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  var outputType = {}
  outputType.type = sanitizedData.OutputTypeName == 'NULL' ? '"<unnamed>"' : sanitizedData.OutputTypeName
  if(sanitizedData.OutputTypePWM) {
    outputType.pwm = 1
  } else {
    outputType.pwm = 0
  }
  if(sanitizedData.OutputTypePWMInversion) {  
    outputType.pwm_inversion = 1
  } else {
    outputType.pwm_inversion = 0
  }
  try {
    await dbcalls.addNewOutputType(outputType.type, outputType.pwm, outputType.pwm_inversion, 1)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

//Update output type
router.put('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  var outputType = {}
  let id = sanitizedData.OutputTypesSelect.slice(1, -1).split("|")[3]
  outputType.type = sanitizedData.OutputTypeName == 'NULL' ? '"<unnamed>"' : sanitizedData.OutputTypeName
  if(sanitizedData.OutputTypePWM) {
    outputType.pwm = 1
  } else {
    outputType.pwm = 0
  }
  if(sanitizedData.OutputTypePWMInversion) {  
    outputType.pwm_inversion = 1
  } else {
    outputType.pwm_inversion = 0
  }
  await dbcalls.updateOutputType(id, outputType.type, outputType.pwm, outputType.pwm_inversion)  

  res.status(200).send()
})

//Delete output type
router.delete('/', auth, async function(req, res, next) {
  //Escape Data
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }  
  let id = sanitizedData.OutputTypesSelect.slice(1, -1).split("|")[3]
  try {
    await dbcalls.disableOutputType(id)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }

})

module.exports = router;