var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const utils = require('../custom_node_modules/Utils.js')

router.post('/', function(req, res, next) {
  //Load data from app
  var config = req.app.get('config');
  //Create promise/connection to database
  new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.database);
    con.connect((err) => {
      if(err){
        reject(err);
      }
        resolve(con);
      });
  }).then((con) => {
    //Check to see if usename is valid.
    var escapedUsername = mysql.escape(req.body.username);
    con.query('CALL getUser('+escapedUsername+')', (error, results, fields) => {
      //If error, error
      if (error) {
        con.destroy();
        res.status(500).send("Database error!");
      } else {
        if (results[0].length != 0){
          //If it is, compare password to hash.
          var hash = results[0][0].passhash;
          bcrypt.compare(req.body.password, hash, (err, result) => {
            if (result == true){
              //If yes, sanitize each entry in body and pass add it to sanitized data
              var sanitizedData = Object.assign({}, req.body);
              for (const key in sanitizedData){
                if (sanitizedData[key] == ''){
                  sanitizedData[key] = null
                }
                sanitizedData[key] = mysql.escape(sanitizedData[key])
              }
              //DO STUFF WITH ESCAPED DATA
              var query = "CALL addNewSchedule('Time', "+sanitizedData.TimeEvent+", NULL, NULL, "+sanitizedData.TimeOutput+", "+sanitizedData.TimeOutputValue+", NULL, '"+utils.formatTimeStringForDB(sanitizedData.TimeTrigger)+"', "+utils.formatDateString(sanitizedData.TimeStartDate)+", "+utils.formatDateString(sanitizedData.TimeEndDate)+", '1', "+sanitizedData.username+", NULL)";
              con.query(query, async (error, results, fields) => {
                //If error, destroy and error.
                if(error){
                  con.destroy();
                  res.status(500).send("Database error! Event not added.");
                } else {
                  //Get index data
                  let indexData = await utils.getIndexData(req, con);
                  if(indexData.err){
                    res.status(500).send(indexData.err);
                  } else {
                    var msg = "Time event successfully added!";
                    indexData.msg = msg;
                    res.status(200).send(indexData);
                  }
                }
              });
            } else {
                con.destroy();
                res.status(400).send("Invalid credentials!");
            }
          });
        } else {
          con.destroy();
          res.status(400).send("Invalid credentials!");
        }
      }
    });
  });
}), (err) => {
  res.status(500).send("Database error!")
};

module.exports = router;
