const dbCalls = require('../utility/database_calls')
const EventHandlerUtils = require('./EventHandlerUtils');
const TriggeredScheduleMinder = require('./TriggeredScheduleMinder');
const Outputs = require('../Outputs')
const Sensors = require('../Sensors')
const utils = require('../utility/utils')
const moment = require('moment');
const Constants = require('../Constants');

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

  static async sensorEventRunner(config, outputs, unusedOutputIDs, dayID){
    const sensorEvents = await this.getByDayIDAsync(dayID);
    
    for(const sensorEvent of sensorEvents){
      if (this.triggeredScheduleMinder.includes(sensorEvent.sensorEventID) ||
          !unusedOutputIDs.has(sensorEvent.outputID)
        ){
        continue;
      }
      let startTime = moment(sensorEvent.startTime, 'HH:mm:ss')
      let stopTime = moment(sensorEvent.stopTime, 'HH:mm:ss')
      if (!utils.isTimeBetween(startTime.format('H:mm'), stopTime.format('H:mm'), moment().format('H:mm'))){        
        continue;
      }
      let sensorVal = await Sensors.getSensorVal(Sensors.sensors[sensorEvent.sensorID])
      let { triggerValues } = JSON.parse(sensorEvent.triggerValues)
      switch(sensorEvent.triggerComparator) {
        case '>':
          triggerValues.sort((a, b) => a.triggerValue - b.triggerValue)
          for(const triggerValue of triggerValues){
            if(sensorVal.val >= triggerValue.triggerValue){
              unusedOutputIDs.delete(sensorEvent.outputID)
              await this._handleSensorEvent(config, outputs[sensorEvent.outputID], sensorEvent, triggerValue.triggerValue);
            }
          }
          break;
        case '<':
          triggerValues.sort((a, b) => b.triggerValue - a.triggerValue)
          for(const triggerValue of triggerValues){
            if(sensorVal.val <= triggerValue.triggerValue){
              unusedOutputIDs.delete(sensorEvent.outputID)
              await this._handleSensorEvent(config, outputs[sensorEvent.outputID], sensorEvent, triggerValue.triggerValue);
            }
          }
      }
    }
    // Clean up all schedules from minder
    this.triggeredScheduleMinder.auto_remove_schedules()
    return unusedOutputIDs;
  }
  
  /**
   * Helper function; Runs the schedule.
   */
  static async _handleSensorEvent(config, output, sensorEvent, triggerValue){
    let outputValue = triggerValue
    console.log(outputValue)
    if (outputValue < 0){
      outputValue = Math.round((Math.random() * 100))
    }
    if(outputValue > 0) {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.SensorEvents);
      if (toggle){
        if(output.outputEventType != Constants.eventTypes.ManualEvents){
          await Outputs.turnOn(config, output, outputValue, true)
        } else {
          await Outputs.turnOn(config, output, outputValue, false)
        }
      }
    } else {
      let toggle = EventHandlerUtils.filterRedundantOutputCalls(output, outputValue, Constants.eventTypes.SensorEvents);
      if (toggle){
        if(output.outputEventType != Constants.eventTypes.ManualEvents){
          await Outputs.turnOff(output, true)
        } else {
          await Outputs.turnOff(output, false)
        }
      }
    }

    await Outputs.updateEventTypeAsync(sensorEvent.outputID, Constants.eventTypes.SensorEvents);

    // Add to array of triggered schedule; update timeout
    this.triggeredScheduleMinder.add_schedule( {
      scheduleID: sensorEvent.sensorEventID,
      timeout: moment().add(1, 'm')
    });
    return;
  }

}


