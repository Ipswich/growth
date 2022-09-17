const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin')
const mysql = require('mysql');
const Days = require('../models/Days');

router.post('/', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    }  
    let sql_data = {};
    sql_data.weekday = parseInt(sanitizedData.weekday.slice(1,-1), 2);
    sql_data.createdBy = sanitizedData.createdBy;
    await Days.createAsync(sql_data.weekday, sql_data.createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get('/', auth, async function(req, res, next) {
  try {
    let result = await Days.getAllAsync();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
})

// NEEDS DAYS MODEL IMPLEMENTATION
// router.get('/:dayID', auth, async function(req, res, next) {
//   try {
//     let result = await Days.getByDayIDAsync(mysql.escape(req.params.dayID);
//     res.status(200).send(result);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// })

router.put('/', auth, async function(req, res, next) {
  try {
    let sanitizedData = Object.assign({}, req.body);
    for (const key in sanitizedData){
      if (sanitizedData[key] == '' || sanitizedData[key] == undefined){
        sanitizedData[key] = null
      } else {
        sanitizedData[key] = mysql.escape(sanitizedData[key])
      }
    } 
    let dayID = sanitizedData.dayID
    let weekday = parseInt(sanitizedData.weekday.slice(1,-1), 2);
    let createdBy = sanitizedData.createdBy;
    await Days.updateAsync(dayID, weekday, createdBy);
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.delete('/', auth, async function(req, res, next) {
  try {
    await Days.deleteAsync(mysql.escape(req.body.dayID));
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
})

module.exports = router