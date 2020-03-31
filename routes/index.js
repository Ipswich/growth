var express = require('express');
var router = express.Router();
var app = require('../app.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var web_data = req.app.get('web_data');
  var sensorData = {
    "sensorData": {
      "temperature": {
        "displayName": "Temperature",
        "data": 75,
        "units": "C"
      },
      "humidity": {
        "displayName": "Humidity",
        "data": 75,
        "units": "% RH"
      },
      "pressure": {
        "displayName": "Pressure",
        "data": 1300,
        "units": "kPa"
      },
      "CO2": {
        "displayName": "CO2",
        "data": 75,
        "units": "ppm"
      },
    }
  }
  var data = Object.assign({}, web_data, sensorData);
  console.log(data);
  res.render('index', data);
});

module.exports = router;
