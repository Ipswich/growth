var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var utils = require('../custom_node_modules/Utils.js');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var config = req.app.get('config');
  new Promise((resolve, reject) => {
    var con = mysql.createConnection(config.database);
    con.connect((err) => {
    if(err){
      reject(err);
    }
      resolve(con);
    });
  }).then(async (con) => {
    //Get index data
    let indexData = await utils.getIndexData(req, con);
    if(indexData.err){
      res.status(500).send(indexData.err);
    } else {
      //Clean up to conform to expected values for view engine
      delete indexData.schedules;
      delete indexData.currentConditions;
      res.status(200).render('index', indexData);
    }
  },
  (err) => {
    res.status(500).render('error')
  });

});

module.exports = router;
