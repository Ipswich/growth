const five = require('johnny-five')
const dbCalls = require('./utility/database_calls')
const Mappings = require('./utility/Mappings')
const Printouts = require('./utility/Printouts')

module.exports = class Outputs {
  
  static outputs = undefined

  static async createAsync(name, type, description, outputPWM, outputPWMPin, outputPWMInversion, order) {
    await dbCalls.addOutput(name, type, description, outputPWM, outputPWMPin, outputPWMInversion, order);
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

  static async updateAsync(id, name, type, description, outputPWM, outputPWMPin, outputPWMInversion, order){ 
    await dbCalls.updateOutput(id, name, type, description, outputPWM, outputPWMPin, outputPWMInversion, order);
  }

  static async updateManualStateAsync(id, outputManualState, outputManualValue) {
    await dbCalls.updateOutputManualState(id, outputManualState, outputManualValue);
  }
  
  static async updateScheduleStateAsync(id, outputScheduleState, outputScheduleValue) {
    await dbCalls.updateOutputScheduleState(id, outputScheduleState, outputScheduleValue);
  }
  
  static async updateControllerAsync(id, outputController) {
    await dbCalls.updateOutputController(id, outputController);
  }

  static async updateLastControllerAsync(id, outputLastController) {
    await dbCalls.updateOutputLastController(id, outputLastController);
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
   * @param {object} outputState output to turn on's state
   */
   static turnOn(config, output, outputValue, outputState) {
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
      output.outputPWMObject.brightness(value);        
      output.outputObject.close();
      Printouts.simpleLogPrintout(output.outputName + ": [" + outputState.outputController + "] ON @ " + outputValue + "% - [Output Pin: " + output.outputPin + ", PWM Pin: " + output.outputPWMPin + "]");      
    } else {
      Printouts.simpleLogPrintout(output.outputName + ": [" + outputState.outputController + "] ON - [Output Pin: " + output.outputPin + "]");      
      output.outputObject.close();
    }
    if(outputState.controllerType == 'Manual'){
      this.updateManualState(output.outputID, Constants.outputStates.ON, outputValue);
    } else {
      this.updateScheduleState(output.outputID, Constants.outputStates.ON, outputValue);
    }
  }

  
  /**
   * Turns off an output, logging the schedule. Helper function for triggerEvent.
   * @param {object} output output to turn off
   * @param {object} state current output's state
   */
   static turnOff(output, outputState) {
    Printouts.simpleLogPrintout(output.outputName + ": [" + outputState.outputController + "] OFF - [Output Pin: " + output.outputPin + "]");  
    output.outputObject.open();
    if(controllerType == 'Manual'){
      this.updateManualState(output.outputID, Constants.outputStates.OFF, 0);
    } else {
      this.updateScheduleState(output.outputID, Constants.outputStates.OFF, 0);
    }
  }

  /**
   * Maps board pins to outputs
   * @param {[object]} config
   * @returns {[object]}
   */
   static async _mapPins(config) {
    let mapperState;
    try{
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
    for(let index in mapperState.outputs){
      //If no assigned output pin, skip
      if (mapperState.outputs[index].outputPin == null || mapperState.outputs[index].outputPin == undefined){
        continue;
      }
      //If the pin doesn't exist, error. Otherwise, give pin.
      try {
        let pinIndex = Mappings._pinExists(mapperState.outputs[index].outputPin, mapperState.outputPins, "output")        
        mapperState.outputPins.splice(pinIndex, 1);
      } catch (e) {
        Printouts.errorPrintout("Cannot map preassigned output pin, pin does not exist!")
        throw e
      }

      //Apply PWM PIN property if necessary.
      if(mapperState.outputs[index].outputPWM == true) {
        //If no assigned pwm pin, skip
        if (mapperState.outputs[index].outputPWMPin == null || mapperState.outputs[index].outputPWMPin == undefined){
          continue;
        }
        try{
          let pinIndex = Mappings._pinExists(mapperState.outputs[index].outputPWMPin, mapperState.pwmPins, "PWM")
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
    for(let index in mapperState.outputs){
      // skip if output already has a pin
      if(mapperState.outputs[index].outputPin == null || mapperState.outputs[index].outputPin == undefined){
        //If we've run out of output pins, error.
        try {
          Mappings._pinCountCheck(mapperState.outputPins, "output")
          mapperState.outputs[index].outputPin = mapperState.outputPins.shift();
        } catch (e) {
          Printouts.errorPrintout("Cannot map output pin, out of pins!")
          throw e
        }
      }
      //If we've run out of PWM pins, error.
      if(mapperState.outputs[index].outputPWM == true) {
        if(mapperState.outputs[index].outputPWMPin != null || mapperState.outputs[index].outputPWMPin != undefined){
          continue;
        }
        try {
          Mappings._pinCountCheck(mapperState.pwmPins, "PWM")
          mapperState.outputs[index].outputPWMPin = mapperState.pwmPins.shift();
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