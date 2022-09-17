const dbCalls = require('../../custom_node_modules/utility_modules/database_calls')

module.exports = class BoundedEvents{
  static async createAsync(obj) {
    let { dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy } = obj;
    await dbCalls.addBoundedEvent(dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getBoundedEvents();
  }
  
  static async getByDayIDAsync(dayID) {
    return await dbCalls.getBoundedEventsByDayID(dayID);
  }

  static async updateAsync(obj){ 
    let { boundedEventID, dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy } = obj;
    await dbCalls.updateBoundedEvent(boundedEventID, dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeBoundedEvent(eventID);
    return this;
  }
}