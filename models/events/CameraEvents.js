const child_process = require('child_process')
const moment = require('moment')
const Printouts = require('../utility/Printouts')
const utils = require('../utility/utils')

module.exports = class CameraEvents {
  /**
   * Takes an image using raspistill. Image is stored in the directory specified
   * in the config file.
   * @param config
   * @param web_data
   */
  static takeImage = function(config, web_data) {
    let now = new Date()
    let date = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`
    let time = `${now.getHours()}-${now.getMinutes()}`
    let output_file = `${config.camera.image_directory}/${date}_${time}_${web_data.title}.jpg`
    let flag_string = ''
    let overlay_string = ''
    if (config.camera.image_width != null && config.camera.image_height != null){
      if (typeof config.camera.image_width != "number" || typeof config.camera.image_height != "number"){
        throw TypeError(`Image dimensions not a number.`)
      }
      flag_string = ` -w ${config.camera.image_width} -h ${config.camera.image_height}`
    }
    if(config.camera.image_quality != null){
      if (typeof config.camera.image_quality != "number"){
        throw TypeError(`Image quality not a number.`)
      }
      flag_string += ` -q ${config.camera.image_quality}`
    }
    let overlay_sum = this.getOverlayValue(config)
    if (overlay_sum !== 0){
      overlay_string = ` -a ${overlay_sum}`
    }
    let command = `raspistill -o ${output_file}${flag_string}${overlay_string}`
    child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        Printouts.simpleErrorPrintout(`Error taking image: ${error}`)
        return
      }
      Printouts.simpleLogPrintout(`Image saved: ${output_file}`)
    })
  }

  /**
   * Takes an image if the current moment is between the values set in config.
   * If either value is null, takes an image.
   * @param config
   */
  static takeImageBetween = function(config, web_data) {
    if (config.camera.active_hours.start == null || config.camera.active_hours.stop == null){
      this.takeImage(config, web_data)
    } else {
      if(utils.isTimeBetween(config.camera.active_hours.start, config.camera.active_hours.stop, moment().format('H:mm'))){
        this.takeImage(config, web_data)
      }
    }
  }

  /**
   * Calculates the sum of date/time/black numbers to inform raspistill of overlay
   * contents.
   * @param config
   * @returns sum of overlay parts.
   */
  static getOverlayValue = function(config){
    if (typeof config.camera.overlay_date != "boolean" ||
        typeof config.camera.overlay_time != "boolean" ||
        typeof config.camera.overlay_black != "boolean") {
          throw TypeError(`Overlay value not true/false.`)
        }
    let overlay_sum = 0
    if (config.camera.overlay_date){
      overlay_sum += 4
    }
    if (config.camera.overlay_time){
      overlay_sum += 8
    }
    if (overlay_sum !== 0 && config.camera.overlay_black){
      overlay_sum += 1024
    }
    return overlay_sum
  }
}