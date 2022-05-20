const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')

router.post('/', auth, async function(req, res, next) {
  res.status(200).send()
})

module.exports = router;