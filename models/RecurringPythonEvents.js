const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RecurringPythonEvents {
  static async createAsync(obj) {
    let { recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addRecurringPythonEvent(recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getRecurringPythonEvents();
  }

  static async updateAsync(obj){ 
    let { recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateRecurringPythonEvent(recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRecurringPythonEvent(eventID);
    return this;
  }
}