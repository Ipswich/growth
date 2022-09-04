const SensorLogger = require('../events/SensorLogger')
const utils = require('../utility/utils')
const CameraEventHandler = require('../events/CameraEventHandler')
const { simpleErrorPrintout } = require('../utility/printouts')

const EVENT_TIMER = 1 * 1000 // 1 SECOND

module.exports = class ScheduleInitializer {
  /**
   * Initializes the schedule (time/sensor/periodic/minder), logging, and
   * establishes chart regeneration.
   * @param {object} state the current state
   */
  static async initializeSchedule(state, config, web_data) {
    //Take initial reading to update database
    //Run events when ready, then set Interval.
    await SensorLogger.addSensorReadings(state);
    // Handle camera things, if enabled.
    CameraEventHandler
    this._initializeCamera(config, web_data);
    // Set up future events
    setInterval(async function() {
      await SensorLogger.addSensorReadings(state);
    }, config.log_interval);
    setInterval(async function() {
      // await utils.scheduleMinder(state);
    }, EVENT_TIMER);
  }

  /**
   * abstracted logic for camera pieces
   */
  static _initializeCamera = function(config, web_data) {
    if (config.camera.enable){
      try {
        CameraEventHandler.takeImageBetween(config, web_data);
      } catch (e) {
        simpleErrorPrintout(e);
      } 
      setInterval(() => {
        try {
          CameraEventHandler.takeImageBetween(config, web_data)
        } catch (e) {
          simpleErrorPrintout(e);
        }
      }, config.camera.interval);
    }
  }
}