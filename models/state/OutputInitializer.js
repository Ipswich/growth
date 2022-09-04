const five = require('johnny-five')
const printouts = require('../utility/printouts')

module.exports = class OutputInitializer {
  /**
   * Adds outputs to the passed state object according to the values present in
   * the object. Adds both main and PWM controls as needed. Additionally, adds a
   * relay_control pin to the state object if specified in config.
   * @param {object} state The current state of the app
   * @param {config}
   * @returns 
   */
  static initializeOutputs(state, config) {
    state.relay_control = undefined
    //If relay toggle prevention is set in config, create pin with first output pin
    this._relayToggleCheck(state, config)

    //Ensure that max listeners for events is appropriate to suppress warnings.
    state.board.setMaxListeners(state.board.getMaxListeners() + this._maxListenerCheck(state, config))  
    
    //Set up outputs and bind to state object.
    for(let i = 0; i < state.outputState.data.length; i++){
      let outputPin = state.outputState.data[i].outputPin
      var output = new five.Relay({
        pin: outputPin,
        type: "NC"
      })
      state.outputState.data[i].outputObject = output
      if(state.outputState.data[i].outputPWMPin != null){
        let PWMPin = state.outputState.data[i].outputPWMPin
        var PWM = new five.Led(PWMPin);
        state.outputState.data[i].outputPWMObject = PWM
        //Handle board interrupts for PWM (turn off stuff)
        state.board.on('exit', () => {
          PWM.off()
        })
        try {
          PWM.off()
        } catch (e) {
          printouts.errorPrintout("Arduino out of PWM pins! Could not attach all output PWMs, please check your board config.")
          throw e
        }
      }
      //Handle board interrupts for main control (turn off stuff)
      state.board.on('exit', () => {
        output.open()           
      })
      try {
        output.open()
      } catch (e) {
        printouts.errorPrintout("Arduino out of output pins! Could not attach all outputs, please check your board config.")
        throw e
      }
    }
    return
  }

  /**
   * Calculates an approximate max number of event listeners for the given outputs.
   * @param {object} state
   * @param {object} config 
   * @returns The max number of event listeners
   */
  static _maxListenerCheck(state, config) {
    let maxListeners = state.outputState.data.length * 2
    if (config.relay_toggle_prevention){
      maxListeners++
    }
    return maxListeners
  }

  /**
   * Appends a relay control pin to the state object if it should exist.
   * @param {object} state
   * @param {object} config 
   */
  static _relayToggleCheck(state, config){
    if(config.relay_toggle_prevention){ 
      state.relay_control = new five.Pin(config.board_pinout.OUTPUT_PINS[0])
      //Handle board interrupts (turn off stuff)
      state.board.on('exit', () => {
        state.relay_control.low()           
      })
    }
  }
}