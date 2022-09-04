const dbCalls = require('../custom_node_modules/utility_modules/database_calls')

module.exports = class Users {

  static async createAsync(obj) {
    let { username, hash, email } = obj;
    createdBy = null ?? 'NULL';
    await dbCalls.addUser(username, hash, email);;
  }

  static async readAllAsync() {
    return await dbCalls.getAllUsers();
  }

  static async getAsync(username){
    return await dbCalls.getUser(username);
  }
  
}