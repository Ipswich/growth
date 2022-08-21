const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RecurringEvents {
  static async createAsync(obj) {
    let { recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addRecurringEvent(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async readAllAsync() {
    return dbCalls.getRecurringEvents();
  }

  static async updateAsync(obj){ 
    let { recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateRecurringEvent(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRecurringEvent(eventID);
    return this;
  }
}