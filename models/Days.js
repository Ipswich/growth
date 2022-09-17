const dbCalls = require('./utility/database_calls')

module.exports = class Days {

  static async createAsync(weekday, createdBy) {
    createdBy = null ?? 'NULL';
    await dbCalls.addDay(weekday, createdBy);
  }

  static async getAllAsync() {
    return await dbCalls.getDays();
  }

  static async updateAsync(dayID, weekday, createdBy){ 
    createdBy = null ?? 'NULL';
    await dbCalls.updateDay(dayID, weekday, createdBy);
  }

  static async deleteAsync(dayID){
    await dbCalls.removeDay(dayID);
  }
}