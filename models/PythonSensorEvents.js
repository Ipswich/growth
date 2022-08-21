const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class PythonSensorEvents {
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addPythonSensorEvent(dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getPythonSensorEvents();
  }

  static async updateAsync(obj){ 
    let { pythonSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updatePythonSensorEvent(pythonSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removePythonSensorEvent(eventID);
    return this;
  }
}