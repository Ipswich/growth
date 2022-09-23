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
    let manualOutputs = []
    const manualEvents = await this.getByDayIDAsync(dayID)
    //Iterate through time Schedules
    for(const manualEvent of manualEvents) {
      // If the minder includes the current event, skip to next schedule
      if(this.triggeredScheduleMinder.includes(manualEvent.manualEventID)){
        continue;
      }
      await this._handleManualEvent(config, outputs[manualEvent.outputID], manualEvent);
      manualOutputs.push(manualEvent.outputID)
      // Add to array of triggered schedule
      this.triggeredScheduleMinder.add_schedule({
        scheduleID: manualEvent.manualEventID,
        timeout: moment().add(1, 'm')
      })    
    };
    // Clean up all schedules from minder
    this.triggeredScheduleMinder.auto_remove_schedules();
    return manualOutputs
  }

  static async _handleManualEvent(config, output, manualEvent){output;
    let outputValue = manualEvent.outputValue;
    if (outputValue < 0){
      outputValue = 0
    }
    if(outputValue > 0) {
      let toggle = await EventHandlerUtils.filterOn(output, outputValue, Constants.outputControllers.MANUAL);
      if (toggle){
        await Outputs.turnOn(config, output, outputValue, false)
      }
    } else {
      let toggle = await EventHandlerUtils.filterOff(output, outputValue, Constants.outputControllers.MANUAL);
      if (toggle){
        await Outputs.turnOff(output, outputState, false)
      }
    }
  }
}