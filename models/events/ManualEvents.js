const dbCalls = require('../utility/database_calls')
const EventHandlerUtils = require('./EventHandlerUtils');
const TriggeredScheduleMinder = require('./TriggeredScheduleMinder');
const Outputs = require('../Outputs')
const moment = require('moment');
const Constants = require('../Constants');


module.exports = class ManualEvents {
  static triggeredScheduleMinder = new TriggeredScheduleMinder()
  
  static async createAsync(dayID, outputID, outputValue, createdBy = 'NULL') {
    await dbCalls.addManualEvent(dayID, outputID, outputValue, createdBy);
    return this;
  }

  static async getAllAsync() {
    return await dbCalls.getManualEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getManualEventsByDayID(dayID);
  }

  static async updateAsync(manualEventID, dayID, outputID, outputValue, createdBy = 'NULL'){ 
    await dbCalls.updateManualEvent(manualEventID, dayID, outputID, outputValue, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeManualEvent(eventID);
    return this;
  }

  static async manualEventRunner(config, outputs, dayID) {
    let usedOutputIDs = new Set();
    const manualEvents = await this.getByDayIDAsync(dayID)
    //Iterate through time Schedules
    for(const manualEvent of manualEvents) {
      // If the minder includes the current event, or the output has already been used,
      // skip to next schedule
      if(this.triggeredScheduleMinder.includes(manualEvent.manualEventID) || usedOutputIDs.has(manualEvent.outputID)){
        usedOutputIDs.add(manualEvent.outputID)
        continue;
      }
      usedOutputIDs.add(manualEvent.outputID)
      await this._handleManualEvent(config, outputs[manualEvent.outputID], manualEvent);
      // Add to array of triggered schedule
      this.triggeredScheduleMinder.add_schedule({
        scheduleID: manualEvent.manualEventID,
        timeout: moment().add(1, 'm')
      })    
    };
    // Clean up all schedules from minder
    this.triggeredScheduleMinder.auto_remove_schedules();
  }

  static async _handleManualEvent(config, output, manualEvent){
    let outputValue = manualEvent.outputValue;
    if (outputValue < 0){
      outputValue = 0
    }
    if(outputValue > 0) {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.ManualEvents);
      if (toggle){
        await Outputs.turnOn(config, output, outputValue, false)
      }
    } else {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.ManualEvents);
      if (toggle){
        await Outputs.turnOff(output, outputState, false)
      }
    }
    await Outputs.updateEventTypeAsync(manualEvent.outputID, Constants.eventTypes.ManualEvents);
  }
}