const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const auth = require('../middleware/authenticateLogin.js')
const Printouts = require('../models/utility/Printouts')

//Rebuild state
router.post('/kill', auth, async function(req, res, next) {
  let username = jwt.decode(req.cookies.token).username
  Printouts.simpleLogPrintout("Server shutting down {" + username + "}.")
  res.status(200).send()
  setTimeout(function() {
    process.exit(0);
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

