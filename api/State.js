var express = require('express');
var jwt = require('jsonwebtoken')
var router = express.Router();
var auth = require('../middleware/authenticateLogin.js')
var utils = require('../custom_node_modules/utility_modules/Utils.js')

//Rebuild state
router.post('/', auth, async function(req, res, next) {

  let username = jwt.decode(req.cookies.token).username
  utils.debugPrintout("Server shutting down {" + username + "}.")
  res.status(200).send()
  setTimeout(function() {
    process.exit();
  }, 1000)
})

function restartServer() {
    setTimeout(function () {
      // When NodeJS exits
      process.on("exit", function () {
          require("child_process").spawn(process.argv.shift(), process.argv, {
              cwd: process.cwd(),
              detached : true,
              stdio: "inherit"
          });
      });
      process.exit();
  }, 1000)
}

module.exports = router;