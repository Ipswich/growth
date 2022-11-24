const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RecurringEvents {
  static async createAsync(obj) {
    let { recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.addRecurringEvent(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
  }

  static async readAllAsync() {
    return dbCalls.getRecurringEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getRecurringEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.updateRecurringEvent(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRecurringEvent(eventID);
  }
}

// const dbcalls = require('../../utility_modules/database_calls.js')
// const eventTriggers = require('../eventTriggers.js')
// const moment = require('moment');
// const printouts = require('../../utility_modules/printouts')
// const utils = require('../../utility_modules/utils.js')
// const TriggeredScheduleMinder = require('./TriggeredScheduleMinder')

// // Clear triggered schedules every minute
// let triggeredScheduleMinder = new TriggeredScheduleMinder() 

// /**
//  * Runs periodic schedules based on the passed state. If a schedule's run time 
//  * matches the current minute, runs the schedule. Runs setTimeout to close event
//  * in the future. Schedules are minded, and only run once per minute. 
//  * @param {object} state The current state of the system.
//  */
// module.exports.periodicEventHandler = async function periodicEventHandler(state) {
//   const events = await dbcalls.getEnabledEvents();
//   let schedule = await utils.getSchedule('Periodic');
//   schedule = utils.eventTypeMapper(events, schedule)
//   //Error on things
//   if (events == undefined || schedule == undefined) {
//     printouts.simpleErrorPrintout("periodicEventHandler.js: periodicEventHandler() failed!");
//     throw new Error("periodicEventHandler.js: periodicEventHandler() failed!")
//   } else {
//     // Iterate through periodic Schedules
//     for(let i = 0; i < schedule.length; i++){
//       // If the minder includes the current schedule, skip to next schedule
//       if(triggeredScheduleMinder.includes(schedule[i].scheduleID)){
//         continue
//       }
//       // Set nextStartTime equal to the last trigger time plus the duration + interval
//       var nextStartTime = moment().add((schedule[i].eventInterval + schedule[i].eventDuration), 'minute') 
//       // If current time matches or is after start time, AND has not been triggered in the past minute -  trigger event.
//       if(moment().isSameOrAfter(moment(schedule[i].eventTriggerTime, "HH:mm:ss"), 'minute') && !triggeredScheduleMinder.includes(schedule[i].scheduleID)) {
//         // Add to array of triggered schedule
//         let data = {
//           scheduleID: schedule[i].scheduleID,
//           timeout: moment().add(1, 'm')
//         }
//         triggeredScheduleMinder.add_schedule(data)
//         eventTriggers.triggerEvent(schedule[i], state, "Output On");
//         // Set up next scheduled event!
//         await dbcalls.disableSchedule(schedule[i].scheduleID, "'SYSTEM'")
//         dbcalls.addNewSchedule("'Periodic'",'1', null, null, schedule[i].outputID, schedule[i].outputValue, null, "'" + nextStartTime.format("HH:mm:ss") + "'", schedule[i].eventDuration, schedule[i].eventInterval, null, null, '1', "'" + schedule[i].addedBy + "'", null, null)
//         // Set timeout to trigger off event after duration is up.
//         setTimeout(() => {
//           eventTriggers.triggerEvent(schedule[i], state, "Output Off");
//         }, 1000 * 60 * schedule[i].eventDuration); // Turn off after eventDuration minutes
//       }
//     }
//   }
//   // Clean up all schedules from minder
//   triggeredScheduleMinder.auto_remove_schedules()
// }
