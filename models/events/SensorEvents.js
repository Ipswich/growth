const dbCalls = require('../utility/database_calls')
const EventHandlerUtils = require('./EventHandlerUtils');
const TriggeredScheduleMinder = require('./TriggeredScheduleMinder');
const Outputs = require('../Outputs')
const Sensors = require('../Sensors')
const utils = require('../utility/utils')
const moment = require('moment');

module.exports = class SensorEvents{
  static triggeredScheduleMinder = new TriggeredScheduleMinder()

  static async createAsync(dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy) {
    await dbCalls.addSensorEvent(dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async getAllAsync() {
    return await dbCalls.getSensorEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getSensorEventsByDayID(dayID);
  }

  static async updateAsync(sensorEventID, dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy){     
    await dbCalls.updateSensorEvent(sensorEventID, dayID, startTime, stopTime, outputID, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeSensorEvent(eventID);
  }

  static async sensorEventRunner(config, outputs, manualOutputs, dayID){
    const sensorEvents = await this.getByDayIDAsync(dayID);

    for(const sensorEvent in sensorEvents){
      if (this.triggeredScheduleMinder.includes(sensorEvent.sensorEventID)) {
        continue;
      }
      let startTime = moment(sensorEvent.startTime, 'HH:mm:ss')
      let stopTime = moment(sensorEvent.stopTime, 'HH:mm:ss')
      if (!utils.isTimeBetween(startTime.format('H:mm'), stopTime.format('H:mm'), moment().format('H:mm'))){        
        continue;
      }
      let sensorVal = await Sensors.getSensorVal(sensorEvent.sensorID)
      switch(sensorEvent.scheduleComparator) {
        case '>':
          data.triggerValues.sort((a, b) => a.triggerValue - b.triggerValue)
          for(const triggerValue in data.triggerValues){
            if(sensorVal >= triggerValue.triggerValue){
              this._handleSensorEvent(config, await Outputs.readStateAsync(timeEvent.outputID), outputs[sensorEvent.outputID], sensorEvent, manualOutputs)              
            }
          }
          break;
        case '<':
          data.triggerValues.sort((a, b) => b.triggerValue - a.triggerValue)
          for(const triggerValue in data.triggerValues){
            if(sensorVal <= triggerValue.triggerValue){
              this._handleSensorEvent(config, await Outputs.readStateAsync(timeEvent.outputID), outputs[sensorEvent.outputID], sensorEvent, manualOutputs)
            }
          }
      }      
    }
    // Clean up all schedules from minder
    this.triggeredScheduleMinder.auto_remove_schedules()
  }
  
  /**
   * Helper function; Runs the schedule.
   */
  static _handleSensorEvent(config, output, outputState, sensorEvent, manualOutputs){
    let outputValue = sensorEvent.outputValue;
    if (outputValue < 0){
      outputValue = Math.round((Math.random() * 100))
    }
    if(outputValue > 0) {
      let toggle = EventHandlerUtils.filterOn(output, outputState, outputValue);
      if (toggle){
        if(manualOutputs.includes(sensorEvent.outputID)){
          Outputs.turnOn(config, sensorEvent.outputID, outputValue, outputState, true)
        } else {
          Outputs.turnOn(config, sensorEvent.outputID, outputValue, outputState, false)
        }
      }
    } else {
      let toggle = EventHandlerUtils.filterOff(output, outputState, outputValue);
      if (toggle){
        if(manualOutputs.includes(sensorEvent.outputID)){
          Outputs.turnOff(sensorEvent.outputID, outputState, true)
        } else {
          Outputs.turnOff(sensorEvent.outputID, outputState, false)
        }
      }
    }
    // Add to array of triggered schedule; update timeout
    let data = {
      scheduleID: sensorEvent.sensorEventID,
      timeout: moment().add(1, 'm')
    }
    this.triggeredScheduleMinder.add_schedule(data)
    return
  }
}


