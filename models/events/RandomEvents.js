const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RandomEvents {
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.addRandomEvent(dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
  }

  static async readAllAsync() {
    return await dbCalls.getRandomEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getRandomEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { randomEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    await dbCalls.updateRandomEvent(randomEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRandomEvent(eventID);
  }
}