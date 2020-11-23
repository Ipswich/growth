var express = require('express');
var router = express.Router();
var utils = require('../custom_node_modules/utility_modules/Utils.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    //Get index data
    let indexData = await utils.getIndexData(res, req);
    //Clean up to conform to expected values for view engine
    delete indexData.schedules;
    delete indexData.currentConditions;
    delete indexData.addEvent;
    res.status(200).render('index', indexData);
  } catch (e) {
    res.status(500).send('500: Server error')
  }
});


module.exports = router;
