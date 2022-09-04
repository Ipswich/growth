const dbCalls = require('../utility/database_calls')
const EventHandlerUtils = require('./EventHandlerUtils');
const TriggeredScheduleMinder = require('./TriggeredScheduleMinder');
const moment = require('moment');

let triggeredScheduleMinder = new TriggeredScheduleMinder()

module.exports = class TimeEvents {
  static async createAsync(obj) {
    let { dayID, triggerTime, outputID, outputValue, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addTimeEvent(dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async getAllAsync() {
    return await dbCalls.getTimeEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getTimeEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { timeEventID, dayID, triggerTime, outputID, outputValue, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateTimeEvent(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeTimeEvent(eventID);
    return this;
  }

  static async timeEventRunner(state, dayID) {
    const timeEvents = await this.getByDayIDAsync(dayID)
    //If no errors, get current timestamp
    const currentTime = moment().format('HH:mm:ss');
    //Iterate through time Schedules
    for(const timeEvent of timeEvents) {
      // If the minder includes the current event, skip to next schedule
      if(triggeredScheduleMinder.includes(timeEvent.timeEventID)){
        continue;
      }
      let triggerTime = moment(timeEvent.triggerTime, "HH:mm:ss");
      //If trigger time matches time stamp trigger event.
      if(moment(currentTime, "HH:mm:ss").isSame(triggerTime, 'minute')) {
        this.handleTimeEvent(state, timeEvent);
        // Add to array of triggered schedule
        triggeredScheduleMinder.add_schedule({
          scheduleID: timeEvent.timeEventID,
          timeout: moment().add(1, 'm')
        })
      }
    };
  // Clean up all schedules from minder
  triggeredScheduleMinder.auto_remove_schedules();
  }

  static async handleTimeEvent(state, timeEvent){
    let output = state.outputState.getOutput(timeEvent.outputID);
    let outputValue = timeEvent.outputValue;

    if (timeEvent.outputValue < 0){
      outputValue = Math.round((Math.random() * 100))
    }
    if(timeEvent.outputValue > 0) {
      let toggle = EventHandlerUtils.filterOn(state, output, outputValue);
      if (toggle){
        EventHandlerUtils.outputOn(state, output, outputValue)
      }
    } else {
      let toggle = EventHandlerUtils.filterOff(state, output, outputValue);
      if (toggle){
        EventHandlerUtils.outputOff(state, output, outputValue)
      }
    }
  }
}