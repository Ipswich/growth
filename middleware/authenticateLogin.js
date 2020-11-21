const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const config = require('../config/config.json')
const dbcalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = async function(req, res, next) {
  if(req.body.username) {
    let username = mysql.escape(req.body.username)
    var results = await dbcalls.getUser(username)
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
          let token = jwt.sign({username: username}, config.jwt_secret, {expiresIn: config.jwt_expiration_time})
          res.clearCookie("token")
          res.cookie("token", token, {maxAge: config.jwt_expiration_time * 1000, httpOnly: true})
          next()
        }
      })
    }
  } else {
    let tokenArray = req.headers.authorization.split(" ")
    let username = jwt.decode(tokenArray[1]).username.slice(1, -1)
    jwt.verify(tokenArray[1], config.jwt_secret, (err, value) => {
      if (err) {      
        return res.status(400).send("Invalid JSON Web Token!");
      } else {
        let token = jwt.sign({username: username}, config.jwt_secret, {expiresIn: config.jwt_expiration_time})
        res.clearCookie("token")
        res.cookie("token", token, {maxAge: config.jwt_expiration_time * 1000, httpOnly: true})
        next()
      }
    })
  }
}