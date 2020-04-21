var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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
        if (results[0].length != 0){
          var hash = results[0][0].passhash;
          bcrypt.compare(req.body.password, hash, (err, result) => {
            if (result == true){
              console.log(req.body);




              con.destroy();
              res.send("Sensor event successfully added!");
            } else {

                con.destroy();
                res.send("Invalid credentials!");
            }
          });
        } else {
          con.destroy();
          res.send("Invalid credentials!");
        }
    });
  });
}), (err) => {
  con.destroy();
  res.send("Database error!")
};

module.exports = router;
