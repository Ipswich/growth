const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RecurringEvents {
  static async createAsync(obj) {
    let { recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
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
    createdBy = null ?? 'NULL';
    await dbCalls.updateRecurringEvent(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRecurringEvent(eventID);
  }
}