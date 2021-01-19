var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var auth = require('../middleware/authenticateLogin.js')
var dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
var utils = require('../custom_node_modules/utility_modules/Utils.js');

router.get('/', auth, async function(req, res, next) {
  try {
    var results = await dbcalls.getEnabledOutputs()
    res.status(200).send(results)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/html', auth, async function(req, res, next) {
  try {
    var data = {outputs: await dbcalls.getEnabledOutputs()}
    res.status(200).render('./settings/output/output_select', data);
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
  var output = {}
  output.type = sanitizedData.OutputOutputTypeSelect
  output.name = sanitizedData.OutputName == 'NULL' ? '"<unnamed>"' : sanitizedData.OutputName
  output.order = sanitizedData.OutputOrder
  output.description = sanitizedData.OutputDescription == 'NULL' ? '""' : sanitizedData.OutputDescription  
  try {
    await dbcalls.addNewOutput(output.type, output.name, output.description, output.order)
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
  let id = sanitizedData.OutputSelect.slice(1, -1).split("|")[4]
  var output = {}
  output.type = sanitizedData.OutputOutputTypeSelect
  output.name = sanitizedData.OutputName == 'NULL' ? '"<unnamed>"' : sanitizedData.OutputName
  output.order = sanitizedData.OutputOrder
  output.description = sanitizedData.OutputDescription == 'NULL' ? '""' : sanitizedData.OutputDescription  
  
  try {
    await dbcalls.updateOutput(id, output.type, output.name, output.description, output.order)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
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
  let id = sanitizedData.OutputSelect.slice(1, -1).split("|")[4]
  try {
    await dbcalls.disableOutput(id)
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;