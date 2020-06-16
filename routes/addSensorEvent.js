var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const utils = require('../custom_node_modules/Utils.js')
const path = require('path');
var pug = require('pug');

var saltRounds = 10;


router.post('/', function(req, res, next) {
  var config = req.app.get('config');
  new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.database);
    con.connect((err) => {
      if(err){
        reject(err);
      }
        resolve(con);
      });
  }).then((con) => {
    var escapedUsername = mysql.escape(req.body.username);
    con.query('CALL getUser('+escapedUsername+')', (error, results, fields) => {
      //If error, error
      if (error) {
        con.destroy();
        res.status(500).send("Database error!");
      } else {
        if (results[0].length != 0){
          var hash = results[0][0].passhash;
          bcrypt.compare(req.body.password, hash, (err, result) => {
            if (result == true){
              var sanitizedData = Object.assign({}, req.body);
              for (const key in sanitizedData){
                if (sanitizedData[key] == ''){
                  sanitizedData[key] = null
                }
                sanitizedData[key] = mysql.escape(sanitizedData[key])
              }
              //DO STUFF WITH ESCAPED DATA
              var query = "CALL addNewSchedule('Sensor', "+sanitizedData.SensorEvent+", "+sanitizedData.SensorSensorName+", "+sanitizedData.SensorSensorValue+", "+sanitizedData.SensorOutput+", "+sanitizedData.SensorOutputValue+", "+sanitizedData.SensorComparator+", NULL, "+utils.formatDateString(sanitizedData.SensorStartDate)+", "+utils.formatDateString(sanitizedData.SensorEndDate)+", '1', "+sanitizedData.username+", NULL)";
              con.query(query, async (error, results, fields) => {
                if(error){
                  con.destroy();
                  res.status(500).send("Database error! Event not added.");
                } else {
                  //Get index data
                  let indexData = await utils.getIndexData(req, con);
                  if(indexData.err){
                    res.status(500).send(indexData.err);
                  } else {
                    var msg = "Sensor event successfully added!";
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
