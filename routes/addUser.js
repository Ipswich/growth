var bcrypt = require('bcrypt');
var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const config = require('../config/config.json')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls.js')
const utils = require('../custom_node_modules/utility_modules/Utils.js')

router.post('/', async function(req, res, next) {
  //Escape Data  
  var sanitizedData = Object.assign({}, req.body);
  for (const key in sanitizedData){
    if (sanitizedData[key] == ''){
      sanitizedData[key] = null
    }
    sanitizedData[key] = mysql.escape(sanitizedData[key])
  }
  console.log(sanitizedData)
  let results = await dbcalls.getUser(sanitizedData.Username)
  if (results.length > 0){
    res.status(409).send();
  }
  else if (sanitizedData.Username.length > 32 || sanitizedData.Username.length == 0){
    res.status(422).send();
  }
  else if (sanitizedData.Email.length > 255 || sanitizedData.Email.length == 0){
    res.status(422).send();    
  }
  else if (sanitizedData.Password != sanitizedData.ConfirmPassword){    
    res.status(422).send();
  } else {
    try {
      let hash = await bcrypt.hash(sanitizedData.Password.slice(1,-1), config.salt_rounds)    
      await dbcalls.addNewUser(sanitizedData.Username, hash, sanitizedData.Email)
      if (!res.headersSent){
        res.status(200).send();                    
      }
    } catch(e) {
      res.status(500).send("Database Error: User not added.")
    }
  }
});

module.exports = router;
