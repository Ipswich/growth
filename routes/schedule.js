var express = require('express');
var router = express.Router();
var app = require('../app.js');
var mysql = require('mysql');
var dateFormat = require ('dateformat');

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
  }).then((con) => {
      con.query('CALL getEnabledLiveSchedules()', (error, results, fields) => {
        var scheduleData = {scheduleData: results[0]};
          for (var key in scheduleData.scheduleData){
            scheduleData.scheduleData[key].eventTriggerTime = formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
          }
            var web_data = req.app.get('web_data');
            var data = Object.assign({}, web_data, scheduleData);
            res.render('schedule', data);
    });
    con.destroy
  },
  (err) => {
    con.destroy
    res.render('error')
  });

});

//Formats the SQL TIME into a user friendly time.
function formatTimeString(input){
  if (input == null){
    return "";
  }
  var destructed = input.split(":");
  if(destructed[0] < 12){
    if (destructed[0] == 0){
      return ('12' + ':' + destructed[1] + ' AM');
    } else {
      return (destructed[0] + ':' + destructed[1] + ' AM');
    }
  } else {
    if (destructed[0] == 12){
      return (destructed[0] + ':' + destructed[1] + ' PM');
    } else{
      return ((destructed[0] - 12) + ':' + destructed[1] + ' PM');
    }
  }
}


module.exports = router;
