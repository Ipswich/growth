const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RandomEvents {
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addRandomEvent(dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getRandomEvents();
  }

  static async updateAsync(obj){ 
    let { randomEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateRandomEvent(randomEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRandomEvent(eventID);
    return this;
  }
}