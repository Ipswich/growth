const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class SensorEvents{
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addSensorEvent(dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async readAllAsync() {
    return await dbCalls.getSensorEvents();
  }

  static async getByDayIDAsync(dayID) {
    return await dbCalls.getSensorEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { sensorEventID, dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateSensorEvent(sensorEventID, dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeSensorEvent(eventID);
  }
}