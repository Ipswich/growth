const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class Days {

  static async createAsync(obj) {
    let { weekday, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addDay(weekday, createdBy);
    return this;
  }

  static async readAllAsync() {
    return await dbCalls.getDays();
  }

  static async updateAsync(obj){ 
    let { dayID, weekday, createdBy } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.updateDay(dayID, weekday, createdBy);
    return this;
  }

  static async deleteAsync(eventID){
    await dbCalls.removeDay(eventID);
    return this;
  }
}