const five = require('johnny-five')
const Constants = require('./Constants')
const dbCalls = require('./utility/database_calls')
const Mappings = require('./utility/Mappings')
const Printouts = require('./utility/Printouts')

module.exports = class Outputs {
  
  static outputs = undefined

  static async createAsync(name, type, description, outputPWM, outputPin, outputPWMPin, outputPWMInversion, order) {
    await dbCalls.addOutput(name, type, description, outputPWM, outputPin, outputPWMPin, outputPWMInversion, order);
  }

  static async readAllAsync() {
    return await dbCalls.getOutputs();
  }

  static async readOrderedAsync() {
    return await dbCalls.getOrderedOutputs();
  }

  static async readStateAsync(){
    return await dbCalls.getOutputState();
  }

  static async readStateAsync(outputID){
    return await dbCalls.getOutputStateByID(outputID);
  }

  static async updateAsync(id, name, type, description, outputPWM, outputPin, outputPWMPin, outputPWMInversion, order){ 
    await dbCalls.updateOutput(id, name, type, description, outputPWM, outputPin, outputPWMPin, outputPWMInversion, order);
  }

  static async updateManualStateAsync(id, outputManualState, outputManualValue) {
    await dbCalls.updateOutputManualState(id, outputManualState, outputManualValue);
    this.outputs[id].outputManualState = outputManualState;
    this.outputs[id].outputManualValue = outputManualValue;
  }
  
  static async updateScheduleStateAsync(id, outputScheduleState, outputScheduleValue) {
    await dbCalls.updateOutputScheduleState(id, outputScheduleState, outputScheduleValue);
    this.outputs[id].outputScheduleState = outputScheduleState;
    this.outputs[id].outputScheduleValue = outputScheduleValue;
  }
  
  static async updateControllerAsync(id, outputController) {
    await dbCalls.updateOutputController(id, `'${outputController}'`);
    this.outputs[id].outputController = outputController;
  }

  static async updateLastControllerAsync(id, outputLastController) {
    await dbCalls.updateOutputLastController(id, `'${outputLastController}'`);
    this.outputs[id].outputLastController = outputLastController;
  }

  static async updatePinAsync(outputID, pin){
    await dbCalls.updateOutputPin(outputID, pin)
  }

  static async updatePWMPinAsync(outputID, PWMpin){
    await dbCalls.updateOutputPWMPin(outputID, PWMpin)
  }

  static async deleteAsync(outputID){
    await dbCalls.removeOutput(outputID);
  }
  
  static async createInitialState(config, board){
    let mapperState = await this._mapPins(config)
    mapperState = this._assignRelayTogglePreventionOutput(board, mapperState)
    // console.log(board.getMaxListeners())
    // console.log(this._maxListenerCheck(mapperState))
    board.setMaxListeners(board.getMaxListeners() + this._maxListenerCheck(mapperState))

    //Set up outputs and bind to state object.
    for(let index in mapperState.outputs){
      mapperState.outputs[index].outputObject = this._createOutputFromPin(board, mapperState.outputs[index].outputPin)

      if(mapperState.outputs[index].outputPWM == true){
        mapperState.outputs[index].outputPWMObject = this._createPWMFromPin(board, mapperState.outputs[index].outputPWMPin)
      }
    }
    let outputDict = await this._createOutputDictionary(mapperState)
    if (mapperState.relayControlObject) {
      outputDict["relayControlObject"] = mapperState.relayControlObject
    }
    Outputs.outputs = outputDict
    return outputDict
  }

  /**
   * Turns on an output.
   * @param {object} config configuration file
   * @param {object} output output to turn on
   * @param {number} outputValue PWM value (0 - 100)
   * @param {boolean} stateOnly update state only
   */
   static async turnOn(config, output, outputValue, stateOnly) {
    if(output.outputPWMObject){
      let maxPWM = config.board_pinout.MAX_PWM;
      // Do math for PWM object
      let value;
      let base = maxPWM/100;
      //If inversion set, use module.exports.ANALOG_RESOLUTION - PWM value
      if (output.outputPWMInversion == 0) {
        value = Math.round(base * outputValue);
      } else {
        value = maxPWM - Math.round(base * outputValue);
      }
      if (!stateOnly){
        output.outputPWMObject.brightness(value);
        Printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] ON @ " + outputValue + "% - [Output Pin: " + output.outputPin + ", PWM Pin: " + output.outputPWMPin + "]");      
      }
    } else {
      if(!stateOnly){
        output.outputObject.close();
        Printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] ON - [Output Pin: " + output.outputPin + "]");      
      }
    }
    if(output.outputController == Constants.outputControllers.MANUAL){
      await this.updateManualStateAsync(output.outputID, Constants.outputStates.ON, outputValue);
    } else {
      await this.updateScheduleStateAsync(output.outputID, Constants.outputStates.ON, outputValue);
    }
  }

  
  /**
   * Turns off an output, logging the schedule. Helper function for triggerEvent.
   * @param {object} output output to turn off
   * @param {boolean} stateOnly true to only change system state, false otherwise.
   */
   static async turnOff(output, stateOnly) {
    Printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] OFF - [Output Pin: " + output.outputPin + "]");  
    if (!stateOnly){
      output.outputObject.open();
      if (output.outputPWM){
        output.outputPWMObject.brightness(0)
      }
    }
    if(output.outputController == Constants.outputControllers.MANUAL){
      await this.updateManualStateAsync(output.outputID, Constants.outputStates.OFF, 0);
    } else {
      await this.updateScheduleStateAsync(output.outputID, Constants.outputStates.OFF, 0);
    }
  }

  /**
   * Maps board pins to outputs
   * @param {[object]} config
   * @returns {[object]}
   */
   static async _mapPins(config) {
    let mapperState;
    try {
      mapperState = {
        outputs: await dbCalls.getOutputs(),
        outputPins: config.board_pinout.OUTPUT_PINS,
        pwmPins: config.board_pinout.PWM_PINS
      }
    } catch (e) {
      Printouts.errorPrintout("Error querying database for outputs!")
      throw e
    }

    mapperState = this._assignPinnedOutputs(mapperState)
    if(config.relay_toggle_prevention) {
      mapperState = this._assignRelayTogglePreventionPin(mapperState)
    }
    mapperState = this._assignOutputPins(mapperState)
    return mapperState;
  }

  static _assignPinnedOutputs(mapperState){
    for(const output of mapperState.outputs){
      //If no assigned output pin, skip
      if (output.outputPin == null || output.outputPin == undefined){
        continue;
      }
      //If the pin doesn't exist, error. Otherwise, give pin.
      try {
        let pinIndex = Mappings._pinExists(output.outputPin, mapperState.outputPins, "output")        
        mapperState.outputPins.splice(pinIndex, 1);
      } catch (e) {
        Printouts.errorPrintout("Cannot map preassigned output pin, pin does not exist!")
        throw e
      }

      //Apply PWM PIN property if necessary.
      if(output.outputPWM == true) {
        //If no assigned pwm pin, skip
        if (output.outputPWMPin == null || output.outputPWMPin == undefined){
          continue;
        }
        try{
          let pinIndex = Mappings._pinExists(output.outputPWMPin, mapperState.pwmPins, "PWM")
          mapperState.pwmPins.splice(pinIndex, 1);
        } catch (e) {
          Printouts.errorPrintout("Cannot map preassigned PWM pin, pin does not exist!")
          throw e
        }
      } 
    }
    return mapperState;
  }

  static _assignRelayTogglePreventionPin(mapperState){
    try {
      Mappings._pinCountCheck(mapperState.outputPins, "output");
      mapperState.relayTogglePreventionPin = mapperState.outputPins.shift();
      return mapperState;
    } catch (e) {
      Printouts.errorPrintout("Cannot map relay toggle pin, out of output pins!")
      throw e
    }
  }

  static _assignOutputPins(mapperState){
    //Iterate through outputs
    for(const output of mapperState.outputs){
      // skip if output already has a pin
      if(output.outputPin == null || output.outputPin == undefined){
        //If we've run out of output pins, error.
        try {
          Mappings._pinCountCheck(mapperState.outputPins, "output")
          let pin = mapperState.outputPins.shift();
          this.updatePinAsync(output.outputID, pin)
          output.outputPin = pin;
        } catch (e) {
          Printouts.errorPrintout("Cannot map output pin, out of pins!")
          throw e
        }
      }
      //If we've run out of PWM pins, error.
      if(output.outputPWM == true) {
        if(output.outputPWMPin != null || output.outputPWMPin != undefined){
          continue;
        }
        try {
          Mappings._pinCountCheck(mapperState.pwmPins, "PWM")
          let pin = mapperState.pwmPins.shift();
          this.updatePWMPinAsync(output.outputID, pin)
          output.outputPWMPin = pin;
        } catch (e) {
          Printouts.errorPrintout("Cannot map PWM pin, out of pins!")
          throw e
        }
      }
    };
    return mapperState
  }

  static _assignRelayTogglePreventionOutput(board, mapperState) {
    if (mapperState.relayTogglePreventionPin){
      mapperState.relayControlObject = new five.Pin(mapperState.relayTogglePreventionPin)
      board.on('exit', () => {
        mapperState.relayControlObject.low()
      })
    }
    return mapperState
  }

  /**
   * Calculates an approximate max number of event listeners for the given outputs.
   * @param {object} mapperState
   * @returns a new max number of event listeners
   */
  static _maxListenerCheck(mapperState) {
    let maxListeners = mapperState.outputs.length * 2
    if (mapperState.relayTogglePreventionPin){
      maxListeners++
    }
    return maxListeners
  }

  static _createOutputDictionary(mapperState){
    let result = Object.assign({}, ...mapperState.outputs.map(function(output){
      let id = output.outputID;
      let data = {};
      for(let key in output){
        data[key] = output[key]
      }
      return {[id]: data}
    }))
    return result
  }

  static _createOutputFromPin(board, pin){
    try {
      let output = new five.Relay({
        pin: pin,
        type: "NC"
      })
      //Handle board interrupts for main control (turn off stuff)
      board.on('exit', () => {
        output.open()           
      })
      output.open()
      
      return output;
      
    } catch (e) {
      Printouts.errorPrintout("Invalid Arduino output pin! Could not attach all outputs, please check your board config.")
      throw e
    }
  }

  static _createPWMFromPin(board, pin){
    try {
      let PWM = new five.Led(pin);
      //Handle board interrupts for PWM (turn off stuff)
      board.on('exit', () => {
        PWM.off()
      })
      PWM.off()
      return PWM
    } catch (e) {
      Printouts.errorPrintout("Invalid Arduino PWM pin! Could not attach all PWMs, please check your board config.")
      throw e
    }
  }
}