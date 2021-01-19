var express = require('express');
var router = express.Router();
var auth = require('../middleware/authenticateLogin.js')

router.post('/', auth, async function(req, res, next) {
  res.status(200).send()
})

module.exports = router;