const dbCalls = require('../utility/database_calls')
const EventHandlerUtils = require('./EventHandlerUtils');
const TriggeredScheduleMinder = require('./TriggeredScheduleMinder');
const Outputs = require('../Outputs')
const moment = require('moment');
const Constants = require('../Constants');


module.exports = class TimeEvents {
  static triggeredScheduleMinder = new TriggeredScheduleMinder()
  
  static async createAsync(dayID, triggerTime, outputID, outputValue, createdBy) {
    await dbCalls.addTimeEvent(dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async getAllAsync() {
    return await dbCalls.getTimeEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getTimeEventsByDayID(dayID);
  }

  static async updateAsync(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy){ 
    await dbCalls.updateTimeEvent(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeTimeEvent(eventID);
    return this;
  }

  static async timeEventRunner(config, outputs, unusedOutputIDs, dayID) {
    const timeEvents = await this.getByDayIDAsync(dayID)
    //If no errors, get current timestamp
    const currentTime = moment().format('HH:mm:ss');
    //Iterate through time Schedules
    for(const timeEvent of timeEvents) {
      // If the minder includes the current event, skip to next schedule
      if(this.triggeredScheduleMinder.includes(timeEvent.timeEventID) ||
          !unusedOutputIDs.has(timeEvent.outputID)
        ){
        continue;
      }
      let triggerTime = moment(timeEvent.triggerTime, "HH:mm:ss");
      //If trigger time matches time stamp trigger event.
      if(moment(currentTime, "HH:mm:ss").isSame(triggerTime, 'minute')) {
        await this._handleTimeEvent(config, outputs[timeEvent.outputID], timeEvent);
        unusedOutputIDs.delete(timeEvent.outputID)        
      }
    }
    // Clean up all schedules from minder
    this.triggeredScheduleMinder.auto_remove_schedules();
    return unusedOutputIDs
  }

  static async _handleTimeEvent(config, output, timeEvent){
    let outputValue = timeEvent.outputValue;
    if (outputValue < 0){
      outputValue = Math.round((Math.random() * 100))
    }
    if(outputValue > 0) {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.TimeEvents);
      if (toggle){
        if(output.outputEventType != Constants.eventTypes.ManualEvents){
          await Outputs.turnOn(config, output, outputValue, true)
        } else {
          await Outputs.turnOn(config, output, outputValue, false)
        }
      }
    } else {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.TimeEvents);
      if (toggle){
        if(output.outputEventType != Constants.eventTypes.ManualEvents){
          await Outputs.turnOff(output, true)
        } else {
          await Outputs.turnOff(output, false)
        }
      }
    }

    await Outputs.updateEventTypeAsync(timeEvent.outputID, Constants.eventTypes.TimeEvents);

    // Add to array of triggered schedule
    this.triggeredScheduleMinder.add_schedule({
      scheduleID: timeEvent.timeEventID,
      timeout: moment().add(1, 'm')
    });
    return;
  }
}