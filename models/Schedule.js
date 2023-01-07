const CameraEvents = require('./events/CameraEvents')
const { simpleErrorPrintout } = require('./utility/Printouts')
const Sensors = require('./Sensors')
const TimeEvents = require('./events/TimeEvents')
const SensorEvents = require('./events/SensorEvents')
const ManualEvents = require('./events/ManualEvents')
const Outputs = require('./Outputs')
const Constants = require('./Constants')
const EventHandlerUtils = require('./events/EventHandlerUtils')

const EVENT_TIMER = 1000 // 1 SECOND

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
    // Default outputs to off and None/None

    await this._InitializeOutputDefaults(outputs);
    let unusedOutputIDs = new Set(Object.keys(outputs)
      .filter(key => !isNaN(key))
      .map(id => parseInt(id))
    )
    // Event running
    await ManualEvents.manualEventRunner(config, outputs, 1);
    unusedOutputIDs = await TimeEvents.timeEventRunner(config, outputs, unusedOutputIDs, 1);
    unusedOutputIDs = await SensorEvents.sensorEventRunner(config, outputs, unusedOutputIDs, 1);
    await Schedule._scheduleMinder(outputs);
    console.log(unusedOutputIDs)

    setInterval(async function() {
      let unusedOutputIDs = new Set(Object.keys(outputs)
        .filter(key => !isNaN(key))
        .map(id => parseInt(id))
      )
      await ManualEvents.manualEventRunner(config, outputs, 1);
      unusedOutputIDs = await TimeEvents.timeEventRunner(config, outputs, unusedOutputIDs, 1);
      unusedOutputIDs = await SensorEvents.sensorEventRunner(config, outputs, unusedOutputIDs, 1);
      await Schedule._scheduleMinder(outputs);
      console.log(unusedOutputIDs)
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
   * schedules that reference them.
   */
  static async _scheduleMinder(outputs) {
    let schedules = [
      await ManualEvents.getAllAsync(),
      await TimeEvents.getAllAsync(), 
      await SensorEvents.getAllAsync()
    ];
    for(const outputID in outputs){
      if (isNaN(outputID)){
        continue;
      }
      let isSchedulePresent = false
      for(const scheduleType of schedules){
        for(const schedule of scheduleType){
          if (outputID == schedule.outputID){
            isSchedulePresent = true;
            break;
          }
        }
        if(isSchedulePresent) {
          break;
        }
      }
      if (isSchedulePresent == false){
        if(EventHandlerUtils.filterRedundantOutputCalls(outputs[outputID], 0, Constants.eventTypes.None)){
          Outputs.turnOff(outputs[outputID]);
        }
        Outputs.updateEventTypeAsync(outputID, Constants.eventTypes.None);        
      }
    }
  }

  static async _InitializeOutputDefaults(outputs){
    for (const outputID in outputs){
      if (isNaN(outputID)){
        continue;
      }
      await Outputs.updateEventTypeAsync(outputID, Constants.eventTypes.None);        
      Outputs.turnOff(outputs[outputID])
    }
  }
}