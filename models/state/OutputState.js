const Mappings = require('../utility/Mappings.js');

/**
 * Creates an output state object; this constructor gets a pinout mapping and
 * assigns the values returned to a JS object. This object is then sorted
 * according to output order (ascending), with 0 placed at the end.
 * Additionally, this object has the enabled events a requested from a database
 * query added at the end.
 * 
 * This object is used to track changes to the state of the system throughout 
 * runtime. It should probably only be created once and passed throughout; 
 * intended to be used as a singleton.
 */
module.exports = class OutputState {
  constructor(config) {
    return (async () => {
      this.data = [];
      //Get outputs
      let outputMappings
      try {
        outputMappings = await Mappings.getOutputMappings(config);
      } catch (e) {
        throw e
      }
      //map initial values (default to off (event 2))
      for (let i = 0; i < outputMappings.length; i++){
        this.data[i] = {};
        this.data[i].outputID = outputMappings[i].outputID;
        this.data[i].outputType = outputMappings[i].outputType;
        this.data[i].outputName = outputMappings[i].outputName;
        this.data[i].outputDescription = outputMappings[i].outputDescription;
        this.data[i].outputOrder = outputMappings[i].outputOrder;
        this.data[i].scheduleState = "Output Off";
        this.data[i].scheduleOutputValue = 0;
        this.data[i].manualState = "Output Off";
        this.data[i].manualOutputValue = 0;
        this.data[i].outputPin = outputMappings[i].OUTPUT_PIN;
        this.data[i].outputPWM = outputMappings[i].PWM_PIN ? 1 : 0;
        this.data[i].outputPWMPin = outputMappings[i].PWM_PIN ? outputMappings[i].PWM_PIN : null;
        this.data[i].outputPWMInversion = outputMappings[i].outputPWMInversion;
        this.data[i].outputObject = null;
        this.data[i].outputPWMObject = null;
        this.data[i].outputController = "Schedule"
        this.data[i].lastOutputController = "Schedule"
      }
      // Sort things according to logical order (iterating over state should return logical order now)
      this.data.sort(module.exports.sortAscending)
      return this;
    })();
  }

  /**
   * Fetches the output data for the API. This data is sorted by output order 
   * (ascending), with 0 at the end.
   * @param {Number} outputID Optional. The output ID to fetch data on.
   * @returns {object} The object data necessary to generate the index and
   * other pages.
   */
  getOutputData(outputID= undefined){
    let outputs = [];
    for(let i = 0; i < this.data.length; i++){
      if (outputID != undefined){
        if (this.data[i].outputID != outputID){
          continue
        }
      }
      let RowDataPacket = {}
      RowDataPacket.outputID = this.data[i].outputID
      RowDataPacket.outputType = this.data[i].outputType
      RowDataPacket.outputName = this.data[i].outputName
      RowDataPacket.outputDescription = this.data[i].outputDescription
      if (this.data[i].OEnabled == 1){
        RowDataPacket.Oenabled = true
      } else {
        RowDataPacket.Oenabled = false
      }
      if (this.data[i].OTenabled == 1){
        RowDataPacket.OTenabled = true
      } else {
        RowDataPacket.OTenabled = false
      }
      RowDataPacket.outputOrder = this.data[i].outputOrder
      RowDataPacket.scheduleState = this.data[i].scheduleState
      RowDataPacket.scheduleOutputValue = this.data[i].scheduleOutputValue
      RowDataPacket.manualState = this.data[i].manualState
      RowDataPacket.manualOutputValue = this.data[i].manualOutputValue
      RowDataPacket.delayTime = this.data[i].delayTime
      RowDataPacket.outputPin = this.data[i].outputPin
      if (this.data[i].outputPWM == 1){
        RowDataPacket.outputPWM = true
        RowDataPacket.outputPWMPin = this.data[i].outputPWMPin
        if (this.data[i].outputPWMInversion == 1){
          RowDataPacket.outputPWMInversion = true
        } else {
          RowDataPacket.outputPWMInversion = false
        }
      } else {
        RowDataPacket.outputPWM = false
      }
      RowDataPacket.outputController = this.data[i].outputController
      RowDataPacket.lastOutputController = this.data[i].lastOutputController
      RowDataPacket.outputSchedules = this.data[i].outputSchedules
      outputs.push(RowDataPacket)
    }
    //Sort outputs in ascending order, with 0 at the bottom
    outputs.sort(module.exports.sortAscending)
    return outputs
  }

  /**
   * Fetches the output data for generating the web pages. This data is sorted
   * by output order (ascending), with 0 at the end.
   * @returns {object} The object data necessary to generate the index and
   * other pages.
   */
  getOutputIndexData(){
    let outputs = [];
    for(let i = 0; i < this.data.length; i++){
      let RowDataPacket = {}
      RowDataPacket.outputID = this.data[i].outputID
      RowDataPacket.outputType = this.data[i].outputType
      RowDataPacket.outputName = this.data[i].outputName
      RowDataPacket.outputDescription = this.data[i].outputDescription
      RowDataPacket.outputPWM = this.data[i].outputPWM
      RowDataPacket.outputPWMInversion = this.data[i].outputPWMInversion
      RowDataPacket.outputOrder = this.data[i].outputOrder
      outputs.push(RowDataPacket)
    }
    //Sort outputs in ascending order, with 0 at the bottom
    outputs.sort(module.exports.sortAscending)
    return outputs
  }
  
  /**
   * Updates the passed outputID with the passed scheduleState and 
   * scheduleOutputValue.
   * @param {number} outputID The outputID to update.
   * @param {string} scheduleState The new schedule state.
   * @param {number} scheduleOutputValue The new schedule output value.
   */
  setOutputScheduleState(outputID, scheduleState, scheduleOutputValue) {
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        this.data[i].scheduleState = scheduleState;
        if(scheduleOutputValue){
          this.data[i].scheduleOutputValue = scheduleOutputValue;
        }
      }
    }
  }

  /**
   * Updates the passed outputID with the passed manualState and 
   * manualOutputValue.
   * @param {number} outputID The outputID to update.
   * @param {string} manualState The new manual state.
   * @param {number} manualOutputValue The new manual output value.
   */
  setOutputManualState(outputID, manualState, manualOutputValue) {
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        this.data[i].manualState = manualState;
        if(manualOutputValue){
          this.data[i].manualOutputValue = manualOutputValue;
        }
      }
    }
  }

  /**
   * Gets the output state object.
   * @returns {[object]} The output state object.
   */
  getOutputState(){
    return this.data;
  }

  /**
   * Updates the passed outputID controller; used to enforce only one type of
   * schedule will run at a time.
   * @param {number} outputID The outputID to update.
   * @param {string} status The new output controller (probably either
   * "Schedule" or "Manual")
   */
  setOutputController(outputID, status){
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        this.data[i].outputController = status;
      }
    }
  }
  
  /**
   * Gets the current controller for the passed outputID; used to enforce only
   * one type of schedule will run at a time.
   * @param {number} outputID The outputID to retrieve data from.
   * @returns {string} The current controller.
   */
  getOutputController(outputID){
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        return this.data[i].outputController
      }
    }
  }
  
  /**
   * Updates the passed outputID's last controller; used to maintain controller
   * states.
   * @param {number} outputID The outputID to update.
   * @param {string} status The new output controller (probably either
   * "Schedule" or "Manual")
   */
  setLastOutputController(outputID, status){
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        this.data[i].lastOutputController = status;
      }
    }
  }
  
  /**
   * Gets the output name from the passed outputID
   * @param {number} outputID The outputID to retrieve data from.
   * @returns {string} The output's name.
   */
  getOutputName(outputID){
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        return this.data[i].outputName
      }
    }
  }

  /**
   * Gets data for the passed outputID.
   * @param {number} outputID The outputID to retrieve data from.
   * @returns {object} The data associated with the passed outputID.
   */
  getOutput(outputID){
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].outputID == outputID){
        return this.data[i]
      }
    }
  }
}

/**
 * Compares the two passed Objects; sorts in ascending fashion, with 0 at the
 * end of the array.
 * @param {object} a.outputOrder Value to compare.
 * @param {object} b.outputOrder Value to compare.
 * @returns 1 (greater), 0 (the same), or -1 (less than).
 */
function sortAscending(a, b) {
  if(a.outputOrder == b.outputOrder){
    return 0;
  } else if(b.outputOrder == 0){
    return -1;
  } else if (a.outputOrder == 0) {
    return 1;
  }
  if(a.outputOrder >= b.outputOrder) {
    return 1;
  } else {
    return -1;
  }
}
module.exports.sortAscending = sortAscending