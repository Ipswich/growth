const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class EmailSensorEvents{
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addEmailSensorEvent(dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async readAllAsync() {
    return await dbCalls.getEmailSensorEvents();
  }
  
  static async getByDayIDAsync(dayID) {
    return await dbCalls.getEmailSensorEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { emailSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateEmailSensorEvent(emailSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy);
  }

  static async deleteAsync(eventID){
    await dbCalls.removeEmailSensorEvent(eventID);
  }
}