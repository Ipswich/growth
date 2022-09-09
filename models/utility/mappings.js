const OutputState = require('../state/OutputState.js')
const dbcalls = require('./database_calls.js')
const {errorPrintout} = require('./Printouts')


module.exports = class Mappings {
  /**
   * If pins has no elements left, prints an error statement and throws an error.
   * @param {Array} pins Array of pins to check for remaining values.
   * @param {string} pinTypeName String decription of pin type.
   * @returns {number} 1 on success, error otherwise.
   */
  static _pinCountCheck(pins, pinTypeName){
    if(pins.length < 1){
      errorPrintout("Mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
      throw new Error("Mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
    }
    return 1
  }

  /**
   * If pins does not contain the passed pin number, error.
   * @param {number} pin 
   * @param {Array} pins 
   * @param {string} pinTypeName 
   * @returns {number} index of the pin in pins, error otherwise.
   */
  static _pinExists(pin, pins, pinTypeName){
    let index = pins.indexOf(pin)
    if(index == -1){
      errorPrintout("Mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
      throw new Error("Mappings.js: Mapping failed, out of " + pinTypeName + " pins.")
    }
    return index
  }
}