const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RecurringPythonEvents {
  static async createAsync(obj) {
    let { recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.addRecurringPythonEvent(recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
  }

  static async readAllAsync() {
    return await dbCalls.getRecurringPythonEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getRecurringPythonEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.updateRecurringPythonEvent(recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRecurringPythonEvent(eventID);
  }
}