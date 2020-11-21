const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const config = require('../config/config.json')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = async function(req, res, next) {
  var results = await dbcalls.getUser(mysql.escape(req.body.username))
  .catch(() => {
    // Error on database failure
    return res.status(500).send("Database error!");
  })
  if (results.length == 0){
    // Error on no results from database
    return res.status(400).send("Invalid credentials!");
  } else {
    //Compare hash and password
    var hash = results[0].passhash;
    bcrypt.compare(req.body.password, hash, async (err, result) => {
      if (result != true){
        return res.status(400).send("Invalid credentials!");
      } else {
        next()
      }
    })
  }
}