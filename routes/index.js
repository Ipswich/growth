var express = require('express');
var router = express.Router();
var html_generators = require('../custom_node_modules/utility_modules/html_generators.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    //Get index data
    let indexData = await html_generators.getIndexData(res, req);
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
