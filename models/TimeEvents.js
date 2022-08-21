const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class TimeEvents {
  static async createAsync(obj) {
    let { dayID, triggerTime, outputID, outputValue, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addTimeEvent(dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getTimeEvents();
  }

  static async updateAsync(obj){ 
    let { timeEventID, dayID, triggerTime, outputID, outputValue, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateTimeEvent(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeTimeEvent(eventID);
    return this;
  }
}