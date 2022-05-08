const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const printouts = require('../custom_node_modules/utility_modules/printouts')

router.get('/current', auth, async function(req, res, next){
  let return_data = req.app.get('state')
  console.log(return_data)
  res.status(200).send(return_data)
})

module.exports = router;

