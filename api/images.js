const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin')
const cameraEventHandler = require('../custom_node_modules/event_modules/event_handlers/cameraEventHandler')
const config_helper = require('../custom_node_modules/utility_modules/config_helper')
const utils = require('../custom_node_modules/utility_modules/utils')

let config = config_helper.getConfig()

router.get('/latest', auth, async function(req, res, next) {
  if (config.camera.image_api_enable != true){
    res.status(404).send()
  } else {
    try {
      let image_name = await utils.getLatestFileName('jpg', config.camera.image_directory)
      res.status(200).sendFile(image_name, {root: config.camera.image_directory})
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
})

router.get('/take_image', auth, async function(req, res, next) {
  if (config.camera.image_api_enable != true){
    res.status(404).send()
  } else {
    try {
      cameraEventHandler.takeImage()
      res.status(200).send()
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
})

// Something for delete images

module.exports = router