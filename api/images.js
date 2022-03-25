const express = require('express');
const router = express.Router();
const config_helper = require('../custom_node_modules/utility_modules/config_helper')
const utils = require('../custom_node_modules/utility_modules/utils')

let config = config_helper.getConfig()

router.get('/latest', async function(req, res, next) {
  try {
    let image_name = await utils.getLatestImageName()
    res.status(200).sendFile(config.camera.image_directory + '/' + image_name)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

module.exports = router