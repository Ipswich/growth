const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class PythonEvents {
  static async createAsync(obj) {
    let { pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addPythonEvent(pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getPythonEvents();
  }

  static async updateAsync(obj){ 
    let { pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updatePythonEvent(pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removePythonEvent(eventID);
    return this;
  }
}