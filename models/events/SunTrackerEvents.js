const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class SunTrackerEvents {
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, coordinates, outputID, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addSunTrackerEvent(dayID, startTime, stopTime, coordinates, outputID, createdBy);
  }

  static async readAllAsync() {
    return await dbCalls.getSunTrackerEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getSunTrackerEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { sunTrackerEventID, dayID, startTime, stopTime, coordinates, outputID, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateSunTrackerEvent(sunTrackerEventID, dayID, startTime, stopTime, coordinates, outputID, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeSunTrackerEvent(eventID);
  }
}