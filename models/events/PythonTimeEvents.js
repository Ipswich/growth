const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class PythonEvents {
  static async createAsync(obj) {
    let { pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy } = obj;
    await dbCalls.addPythonEvent(pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getPythonEvents();
  }
  
  static async getByDayIDAsync(dayID) {
    return await dbCalls.getPythonTimeEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy } = obj;
    await dbCalls.updatePythonEvent(pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removePythonEvent(eventID);
  }
}