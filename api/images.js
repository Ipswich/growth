const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateLogin')
const CameraEvents = require('../models/events/CameraEvents')
const utils = require('../models/utility/utils')

router.get('/latest', auth, async function(req, res, next) {
  let config = res.app.get('config');
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

router.get('/takeImage', auth, async function(req, res, next) {
  let config = res.app.get('config');
  let web_data = res.app.get('web_data');
  if (config.camera.image_api_enable != true){
    res.status(404).send()
  } else {
    try {
      CameraEvents.takeImage(config, web_data)
      res.status(200).send()
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
})

// Something for delete images

module.exports = router