const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class RandomPythonEvents {
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addRandomPythonEvent(dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getRandomPythonEvents();
  }

  static async updateAsync(obj){ 
    let { randomPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateRandomPythonEvent(randomPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeRandomPythonEvent(eventID);
    return this;
  }
}