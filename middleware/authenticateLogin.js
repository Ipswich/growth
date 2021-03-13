const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const dbcalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = async function(req, res, next) {
  let config = req.app.get('config')
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
          let token = jwt.sign({username: username.slice(1, -1)}, config.jwt_secret, {expiresIn: config.jwt_expiration_time})          
          res.clearCookie("token")
          res.cookie("token", token, {maxAge: config.jwt_expiration_time * 1000, httpOnly: true})
          res.locals.username = username.slice(1, -1)
          res.locals.authenticated = true
          next()
        }
      })
    }
  } else if (req.cookies.token){
    let decode = jwt.decode(req.cookies.token)
    let username = decode.username
    jwt.verify(req.cookies.token, config.jwt_secret, (err, value) => {
      if (err) {    
        res.clearCookie("token")
        return res.status(400).send("Invalid JSON Web Token! Please login again.");
      } else {
        let token = jwt.sign({username: username}, config.jwt_secret, {expiresIn: config.jwt_expiration_time})        
        res.clearCookie("token")
        res.cookie("token", token, {maxAge: config.jwt_expiration_time * 1000, httpOnly: true})
        res.locals.username = username
        res.locals.authenticated = true
        next()
      }
    })
  } else {
    res.clearCookie("token")
    res.status(400).send("Login expired, please refresh page.")
  }
}