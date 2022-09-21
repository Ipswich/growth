const CameraEvents = require('./events/CameraEvents')
const { simpleErrorPrintout } = require('./utility/Printouts')
const Sensors = require('./Sensors')
const TimeEvents = require('./events/TimeEvents')
const SensorEvents = require('./events/SensorEvents')
const ManualEvents = require('./events/ManualEvents')
const Outputs = require('./Outputs')
const Constants = require('./Constants')

const EVENT_TIMER = 1 * 1000 // 1 SECOND

module.exports = class Schedule {
  /**
   * Initializes the schedule; events, camera, etc.
   * @param {object} config
   * @param {object} web_data
   * @param {object} sensors
   * @param {object} outputs
   */
  static async initializeSchedule(config, web_data, sensors, outputs) {
    // Sensor data logging
    await Sensors.addSensorReadings(sensors);
    setInterval(async function() {
      await Sensors.addSensorReadings(sensors);
    }, config.log_interval);

    // Event running
    let manualOutputs = await ManualEvents.manualEventRunner(config, outputs, 1);
    await TimeEvents.timeEventRunner(config, outputs, manualOutputs, 1);
    await SensorEvents.sensorEventRunner(config, outputs, manualOutputs, 1);
    await Schedule._scheduleMinder(outputs);
    setInterval(async function() {
      let manualOutputs = await ManualEvents.manualEventRunner(config, outputs, 1);
      await TimeEvents.timeEventRunner(config, outputs, manualOutputs, 1);
      await SensorEvents.sensorEventRunner(config, outputs, manualOutputs, 1);
      await Schedule._scheduleMinder(outputs);
    }, EVENT_TIMER);

    // Handle camera things
    this._cameraEventRunner(config, web_data);
  }

  /**
   * abstracted logic for camera pieces
   */
  static _cameraEventRunner = function(config, web_data) {
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

  /**
   * "Minds" the schedule. Ensures that outputs are turned off if there are no
   * schedules that reference them. Manually controlled outputs are untouched,
   * but outputScheduleState is updated if needed.
   */
  static async _scheduleMinder(outputs) {
    let schedulesObject = Object.assign({}, 
      await TimeEvents.getAllAsync(), 
      await SensorEvents.getAllAsync(),
      await ManualEvents.getAllAsync()
    );
    for(let i = 0; i < outputs.length; i++){
      let present = false
      for(const key in Object.keys(schedulesObject)){        
        for(let j = 0; j < schedulesObject[key].length; j++){
          if (outputs[i].outputID == schedulesObject[key][j].outputID){
            present = true;
            break;
          }
        }
        if(present) {
          break;
        }
      }
      if (present != true){
          Outputs.turnOff(outputs[i]);
      }
    }
  }
}