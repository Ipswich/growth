var express = require('express');
var router = express.Router();
var dbcalls = require('../custom_node_modules/utility_modules/database_calls.js');

router.get('/', async function(req, res, next) {
  try {
    let data = {}
    data.web_data = req.app.get('web_data')
    let results = await dbcalls.getAllUsers()
    if(results.length <= 1){
        //No user accounts created - prompt user
        data.new_user = 1
    } else {
        data.new_user = 0
    }
    res.status(200).render('settings', data);
  } catch (e) {
    res.status(500).send('500: Server error')
  }
});


module.exports = router;
