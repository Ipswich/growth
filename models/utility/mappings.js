const dbcalls = require('./database_calls.js')
const {errorPrintout} = require('./printouts')


module.exports = class Mappings {
  //Maps pins for each output.
  /**
   * Gets a mapping of outputs to output and PWM pins referencing the database.
   * @param config
   * @returns {[object]} A mapping of outputs to output and PWM pins.
   */
  static async getOutputMappings(config) {
    try {
      return this.mapOutputPins(config, await dbcalls.getEnabledOutputs())
    } catch (e) {
      throw e
    }
  }

  //Maps pins for each sensor
  /**
   * Gets a mapping of sensors to the appropriate pins referencing the database.
   * @param config
   * @returns {[object]} A mapping of sensors to various data pins.
   */
  static async getSensorMappings(config) {
    try {
      return this.mapSensorPins(await dbcalls.getEnabledSensors(), config.board_pinout)
    } catch (e) {
      throw e
    }
  }


  /**
   * Creates a mapping of outputs to the appropriate pins. Adds pins to the passed
   * object.
   * @param {[object]} outputs
   * @param {[object]} board_pinout
   * @returns {[object]} A mapping of sensors to various data pins.
   */
  static mapOutputPins(config, outputs) {
    console.log(outputs)
    var outputPins = config.board_pinout.OUTPUT_PINS
    var pwmPins = config.board_pinout.PWM_PINS
    //If relay toggle prevention is set in config, skip first output
    if(config.relay_toggle_prevention){
      try {
        this._pinCountCheck(outputPins, "output")
      } catch (e) {
        throw e
      }
      outputPins.shift();
    }
    //Iterate through outputs
    for(let i = 0; i < outputs.length; i++){
      //If we've run out of output pins, error.
      try {
        this._pinCountCheck(outputPins, "output")
      } catch (e) {
        throw e
      }
      //Otherwise set OUTPUTPIN property to outputPin and increment to the next one
      outputs[i].OUTPUT_PIN = outputPins.shift();
      //If we've run out of PWM pins, error.
      try {
        this._pinCountCheck(outputPins, "PWM")
      } catch (e) {
        throw e
      }
      //Otherwise apply PWMPIN property if necessary.
      if(outputs[i].outputPWM == 1) {
          outputs[i].PWM_PIN = pwmPins.shift();
      }
    };
    return outputs;
  }

  /**
   * Creates a mapping of sensors to the appropriate pins. Adds pins to the passed
   * object.
   * @param {[object]} sensors
   * @param {[object]} board_pinout
   * @returns {[object]} A mapping of sensors to various data pins.
   */
  static mapSensorPins(sensors, board_pinout) {
    let sensorPins = board_pinout.SENSOR_PINS;
    let analogPins = board_pinout.ANALOG_PINS;
    let onewirePin = -1;
    //Iterate through sensors
    let hardwareObject = {}
    for(let i = 0; i < sensors.length; i++) {
      //Check to see if hardwareID exists in object
      if(Object.keys(hardwareObject).indexOf(String(sensors[i].sensorHardwareID)) != -1){
        //if yes, set to stored hardwareID and end.
        sensors[i].SENSOR_PIN = hardwareObject[sensors[i].sensorHardwareID]
        continue;
      }
      //Otherwise, case switch to apply pins to appropriate sensors
      switch (sensors[i].sensorProtocol) {
        case "I2C":
          continue;
        case "ANALOG":
          //If we've run out of analog pins, error.
          try {
            this._pinCountCheck(analogPins, "analog")
          } catch (e) {
            throw e
          }
          let analogPin = analogPins.shift();
          hardwareObject[sensors[i].sensorHardwareID] = analogPin;
          sensors[i].SENSOR_PIN = analogPin;
          continue;
        case "ONEWIRE":
          if (onewirePin == -1) {
            //If we've run out of sensor pins, error.
            try {
              this._pinCountCheck(analogPins, "sensor")
            } catch (e) {
              throw e
            }
            onewirePin = sensorPins.shift()
          }
          hardwareObject[sensors[i].sensorHardwareID] = onewirePin;
          sensors[i].SENSOR_PIN = onewirePin;
          continue;
        default:
          //If we've run out of sensor pins, error.
          try {
            this._pinCountCheck(analogPins, "sensor")
          } catch (e) {
            throw e
          }
          let sensorPin = sensorPins.shift()
          hardwareObject[sensors[i].sensorHardwareID] = sensorPin;
          sensors[i].SENSOR_PIN = sensorPin
      }
    };
    return sensors;
  }

  /**
   * If pins has no elements left, prints an error statement and throws an error.
   * @param {Array} pins Array of pins to check for remaining values.
   * @param {string} pinTypeName String decription of pin type.
   * @returns {number} 1 on success, 0 otherwise.
   */
  static _pinCountCheck(pins, pinTypeName){
    if(pins.length < 1){
      errorPrintout("mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
      throw new Error("mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
    }
    return 1
  }
}