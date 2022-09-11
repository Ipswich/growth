const CameraEvents = require('./events/CameraEvents')
const { simpleErrorPrintout } = require('./utility/Printouts')
const Sensors = require('./Sensors')

const EVENT_TIMER = 1 * 1000 // 1 SECOND

module.exports = class Schedule {
  /**
   * Initializes the schedule; events, camera, etc.
   * @param {object} sensors
   */
  static async initializeSchedule(sensors, config, web_data) {
    //Take initial reading to update database
    //Run events when ready, then set Interval.
    await Sensors.addSensorReadings(sensors);
    // Handle camera things, if enabled.
    this._initializeCamera(config, web_data);
    // Set up future events
    setInterval(async function() {
      await Sensors.addSensorReadings(sensors);
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
        CameraEvents.takeImageBetween(config, web_data);
      } catch (e) {
        simpleErrorPrintout(e);
      } 
      setInterval(() => {
        try {
          CameraEvents.takeImageBetween(config, web_data)
        } catch (e) {
          simpleErrorPrintout(e);
        }
      }, config.camera.interval);
    }
  }
}