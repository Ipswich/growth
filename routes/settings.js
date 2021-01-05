var express = require('express');
var router = express.Router();
var utils = require('../custom_node_modules/utility_modules/Utils.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    res.status(200).render('settings');
  } catch (e) {
    res.status(500).send('500: Server error')
  }
});


module.exports = router;
