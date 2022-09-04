const mysql = require('mysql');
const {simpleLogPrintout, simpleErrorPrintout} = require('./printouts');

var pool
/**
 * Singleton; Creates and returns a mysql connection pool, 
 * or returns a previously created one.
 * @returns mysql connection pool.
 */
const getPool = function(config) {
  if (pool) return pool
  pool = mysql.createPool(config.database)
  return pool
}
module.exports.getPool = getPool

/**
 * Tests if the database pool and connection are functional.
 * @returns {Promise<[object]>} A promise that resolves with results of a simple query to test 
 * connectivity. 
 */
const testConnectivity = async function(){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    pool.query('SELECT 1 + 1 AS solution', (error, results) => {
      if (error) {
        simpleErrorPrintout(error)
        simpleErrorPrintout("ERROR: Database could not be reached.\n")
        reject(error)
      } else {
        simpleLogPrintout("Database successfully connected"); 
        resolve(results)
      }   
    });
  })
}
module.exports.testConnectivity = testConnectivity

/**
 * Adds a new output to the database.
 * @param {number} type Output type; must map to an existing output type.
 * @param {string} name Output name.
 * @param {string} description Description of the output. 
 * @param {number} order Ascending logical ordering of the output; higher 
 * number is lower on the list, with 0 being last. Defaults to 0.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is 
 * insert only.
 */
module.exports.addNewOutput = async function(type, name, description, order = 0) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addNewOutput(' + type + ',' + name + ',' + description + ',' + order + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addNewOutput() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a new output type to the database.
 * @param {string} type Output type name.
 * @param {number} pwm 1 for PWM enabled, 0 for not.
 * @param {number} pwm_inversion 1 for inverted PWM, 0 for not. (100% low, vs 
 * 0% low).
 * @param {number} enabled 0 for false, 1 for true; enables or disables the 
 * output type. 
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * insert only.
 */
module.exports.addNewOutputType = async function(type, pwm, pwm_inversion, enabled) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addNewOutputType(' + type + ',' + pwm + ',' + pwm_inversion + ',' + enabled + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addNewOutputType() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a new sensor to the database.
 * @param {string} model Model number or descriptor of sensor (i.e DS18B20,
 *  BME280).
 * @param {string} type Type of sensor; must map to an existing sensorType.
 * @param {string} location Location descriptor of sensor placement; used to
 *  identify individual sensors.
 * @param {string} units Units read by sensor; used for display purposes.
 * @param {number} hardwareID Hardware identifier used to group sensors that share
 * hardware (i.e. BME280). Each piece of hardware should have its own unique
 * hardwareID.
 * @param {string} sensorProtocol Sensor protocol for reading data (i.e. ANALOG
 * , I2C, ONEWIRE).
 * @param {string} sensorAddress Used for sensors that share a common data pin.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * insert only. 
 */
module.exports.addNewSensor = async function(model, type, location, units, hardwareID, sensorProtocol, sensorAddress = 'NULL') {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addNewSensor(' + model + ',' + type + ',' + location + ',' + units + ',' + hardwareID + ',' + sensorProtocol + ',' + sensorAddress + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addNewSensor() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a new sensorType to the database.
 * @param {string} type Descriptor of sensor data type (Temperature, Humidity, etc.)
 * @param {number} enabled 0 for false, 1 for true; enables or disables the 
 * sensor type. 
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * insert only. 
 */
module.exports.addNewSensorType = async function(type, enabled) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addNewSensorType(' + type + ',' + enabled + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addNewSensorType() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a new user to the database.
 * @param {string} username User's login name.
 * @param {string} hash Password hash.
 * @param {string} email Email address of the user; used for email warnings.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * insert only. 
 */
module.exports.addNewUser = async function(username, hash, email) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addNewUser(' + username + ',"' + hash + '",' + email + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addNewUser() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a sensor reading to the database.
 * @param {number} sensorID sensorID that refers to the sensor read.
 * @param {number} data Data read in by the sensor indicated by sensorID.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * insert only. 
 */
module.exports.addSensorReading = async function(sensorID, data) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL addSensorReading(' + sensorID + ',' + data + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addSensorReading() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Disables an output type in the database.
 * @param {number} id Output type to disable.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only. 
 */
module.exports.disableOutputType = async function(id) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL disableOutputType(' + id + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("disableOutputType() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Disables an output in the database.
 * @param {number} id Output to disable.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only. 
 */
module.exports.disableOutput = async function(id) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL disableOutput(' + id + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("disableOutput() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Disables a sensor in the database.
 * @param {number} id Sensor to disable.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only. 
 */
module.exports.disableSensor = async function(id) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL disableSensor(' + id + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("disableSensor() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all outputs from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getAllOutputs = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL getAllOutputs()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getAllOutputs() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all output types from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getAllOutputTypes = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL getAllOutputTypes()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getAllOutputTypes() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all sensors from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getAllSensors = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL getAllSensors()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getAllSensors() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all sensor types from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getAllSensorTypes = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL getAllSensorTypes()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getAllSensorTypes() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all users from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getAllUsers = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = 'CALL getAllUsers()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getAllUsers() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects enabled outputs from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getEnabledOutputs = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getEnabledOutputs()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getEnabledOutputs() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects enabled outputs from the database, in ascending order with 0
 * last.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getEnabledOrderedOutputs = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getEnabledOutputs()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getEnabledOrderedOutputs() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects enabled output types from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getEnabledOutputTypes = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getEnabledOutputTypes()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getEnabledOutputTypes() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects enabled sensors from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getEnabledSensors = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getEnabledSensors()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getEnabledSensors() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects enabled sensor types from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getEnabledSensorTypes = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getEnabledSensorTypes()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getEnabledSensorTypes() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects all data from the database for sensors with the passed type.
 * @param {string} type Type of sensor data to select; must map to an
 * existing sensor Type.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getSensorDataByType = async function(type) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getSensorDataByType(' + type + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getSensorDataByType() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}
/**
 * Selects the last reading for each sensor from the database.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getSensorLastReadings = async function() {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getSensorLastReadings()'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getSensorLastReadings() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Selects the data from all sensors that has been recorded in the last hours.
 * @param {number} hours Passed hours to select data for.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getSensorLastReadingsByHours = async function(hours) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getSensorLastReadingsByHours(' + hours + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getSensorLastReadingsByHours() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Select the passed username from the database.
 * @param {string} username User to select for.
 * @returns {Promise<[object]>} A promise that resovles with the results of the query.
 */
module.exports.getUser = async function(username) {
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {    
    let query = 'CALL getUser(' + username + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("getUser() failed, database error.");
        reject(error);
      } else {
        //(success)
        resolve(results[0])
      }
    })
  })
}

/**
 * Updates a sensor address in the database.
 * @param {string} address The new address.
 * @param {number} sensorID The sensor to update; must map to an existing
 * sensor.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only.
 */
module.exports.updateSensorAddress = async function(address, sensorID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL updateSensorAddress(' + address + ', ' + sensorID + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("updateSensorAddress() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Updates the passed output in the database with new data.
 * @param {number} id The ID of the output type to update.
 * @param {string} type Output type name.
 * @param {number} pwm 1 for PWM enabled, 0 for not.
 * @param {number} pwm_inversion 1 for inverted PWM, 0 for not. (100% low, vs 
 * 0% low).
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only.
 */
module.exports.updateOutputType = async function(id, type, pwm, pwm_inversion){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL updateOutputType(' + id + ', ' + type + ',' + pwm + ',' + pwm_inversion + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("updateOutputType() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Updates an output in the database.
 * @param {number} id The ID of the output to update.
 * @param {number} type Output type; must map to an existing output type.
 * @param {string} name Output name.
 * @param {string} description Description of the output. 
 * @param {number} order Ascending logical ordering of the output; higher 
 * number is lower on the list, with 0 being last. Defaults to 0.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only.
 */
module.exports.updateOutput = async function(id, type, name, description, order){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL updateOutput(' + id + ', ' + type + ',' + name + ',' + description + ',' + order + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("updateOutput() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Updates a sensor in the database.
 * @param {number} id ID of the sensor to update.
 * @param {string} model Model number or descriptor of sensor (i.e DS18B20,
 *  BME280).
 * @param {string} type Type of sensor; must map to an existing sensorType.
 * @param {string} location Location descriptor of sensor placement; used to
 *  identify individual sensors.
 * @param {string} units Units read by sensor; used for display purposes.
 * @param {number} hardwareID Hardware identifier used to group sensors that share
 * hardware (i.e. BME280). Each piece of hardware should have its own unique
 * hardwareID.
 * @param {string} protocol Sensor protocol for reading data (i.e. ANALOG
 * , I2C, ONEWIRE).
 * @param {string} address Used for sensors that share a common data pin.
 * @returns {Promise<[object]>} A promise that resolves with the results of the query - this is
 * update only.
 */
module.exports.updateSensor = async function(id, model, type, location, units, hardwareID, protocol, address){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL updateSensor(' + id + ', ' + model + ',' + type + ',' + location + ',' + units + ',' + hardwareID + ',' + protocol + ',' + address + ')'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("updateSensor() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

// ####### NEW STUFF #######

/**
 * Gets all of the days in the database.
 * @returns All of the days in the database.
 */
module.exports.getDays = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getDays()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getDays() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the events that reference the passed dayID
 * @param {number} dayID 
 * @returns All of the events that reference the passed dayID.
 */
module.exports.getEventsByDay = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getEventsByDay(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getEventsByDay() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
  
}

/**
 * Gets all of the bounded events in the database.
 * @returns All of the bounded events in the database.
 */
module.exports.getBoundedEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getBoundedEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getBoundedEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets bounded events by dayID in the database.
 * @returns Bounded events by day in the database.
 */
module.exports.getBoundedEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getBoundedEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getBoundedEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the email sensor events in the database.
 * @returns All of the email sensor events in the database.
 */
module.exports.getEmailSensorEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getEmailSensorEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getEmailSensorEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets EmailSensor events by dayID in the database.
 * @returns EmailSensor events by day in the database.
 */
module.exports.getEmailSensorEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getEmailSensorEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getEmailSensorEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the python sensor events in the database.
 * @returns All of the python sensor events in the database.
 */
module.exports.getPythonSensorEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getPythonSensorEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getPythonSensorEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets PythonSensor events by dayID in the database.
 * @returns PythonSensor events by day in the database.
 */
module.exports.getPythonSensorEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getPythonSensorEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getPythonSensorEventsByDay() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the python time events in the database.
 * @returns All of the python time events in the database.
 */
module.exports.getPythonTimeEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getPythonTimeEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getPythonTimeEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets PythonTime events by dayID in the database.
 * @returns PythonTime events by day in the database.
 */
module.exports.getPythonTimeEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getPythonTimeEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getPythonTimeEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the random events in the database.
 * @returns All of the random events in the database.
 */
module.exports.getRandomEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getRandomEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRandomEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets Random events by dayID in the database.
 * @returns Random events by day in the database.
 */
module.exports.getRandomEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getRandomEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRandomEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the random python events in the database.
 * @returns All of the random python events in the database.
 */
module.exports.getRandomPythonEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getRandomPythonEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRandomPythonEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets Random Python events by dayID in the database.
 * @returns Random Python events by day in the database.
 */
 module.exports.getRandomPythonEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getRandomPythonEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRandomPythonEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the recurring events in the database.
 * @returns All of the recurring events in the database.
 */
module.exports.getRecurringEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getRecurringEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRecurringEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets Recurring events by dayID in the database.
 * @returns Recurring events by day in the database.
 */
 module.exports.getRecurringEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getRecurringEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRecurringEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the recurring python events in the database.
 * @returns All of the recurring python events in the database.
 */
module.exports.getRecurringPythonEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getRecurringPythonEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRecurringPythonEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets RecurringPython events by dayID in the database.
 * @returns RecurringPython events by day in the database.
 */
 module.exports.getRecurringPythonEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getRecurringPythonEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getRecurringPythonEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the sensor events in the database.
 * @returns All of the sensor events in the database.
 */
module.exports.getSensorEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getSensorEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getSensorEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets Sensor events by dayID in the database.
 * @returns Sensor events by day in the database.
 */
 module.exports.getSensorEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getSensorEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getSensorEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the sun tracker events in the database.
 * @returns All of the sun tracker events in the database.
 */
module.exports.getSunTrackerEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getSunTrackerEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getSunTrackerEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets SunTracker events by dayID in the database.
 * @returns SunTracker events by day in the database.
 */
 module.exports.getSunTrackerEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getSunTrackerEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getSunTrackerEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets all of the time events in the database.
 * @returns All of the time events in the database.
 */
module.exports.getTimeEvents = async function(){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = 'CALL getTimeEvents()'
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getTimeEvents() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Gets time events by dayID in the database.
 * @returns Time events by day in the database.
 */
module.exports.getTimeEventsByDayID = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL getTimeEventsByDayID(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("getTimeEventsByDayID() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a day from the database.
 * @param {number} dayID
 */
module.exports.removeDay = async function(dayID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeDay(${dayID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeDay() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a email sensor event from the database.
 * @param {number} emailSensorEventID
 */
module.exports.removeEmailSensorEvent = async function(emailSensorEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeEmailSensorEvent(${emailSensorEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeEmailSensorEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a python sensor event from the database.
 * @param {number} pythonSensorEventID
 */
module.exports.removePythonSensorEvent = async function(pythonSensorEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removePythonSensorEvent(${pythonSensorEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removePythonSensorEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a python time event from the database.
 * @param {number} pythonTimeEventID
 */
module.exports.removePythonTimeEvent = async function(pythonTimeEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removePythonTimeEvent(${pythonTimeEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removePythonTimeEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a "random" event from the database.
 * @param {number} randomEventID
 */
module.exports.removeRandomEvent = async function(randomEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeRandomEvent(${randomEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeRandomEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a "random" python event from the database.
 * @param {number} randomPythonEventID
 */
module.exports.removeRandomPythonEvent = async function(randomPythonEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeRandomPythonEvent(${randomPythonEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeRandomPythonEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a recurring event from the database.
 * @param {number} recurringEventID
 */
module.exports.removeRecurringEvent = async function(recurringEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeRecurringEvent(${recurringEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeRecurringEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a recurring python event from the database.
 * @param {number} recurringPythonEventID
 */
module.exports.removeRecurringPythonEvent = async function(recurringPythonEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeRecurringPythonEvent(${recurringPythonEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeRecurringPythonEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a sensor event from the database.
 * @param {number} sensorEventID
 */
module.exports.removeSensorEvent = async function(sensorEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeSensorEvent(${sensorEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeSensorEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a sun tracker event from the database.
 * @param {number} sunTrackerEventID
 */
module.exports.removeSunTrackerEvent = async function(sunTrackerEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeSunTrackerEvent(${sunTrackerEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeSunTrackerEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Deletes a time event from the database.
 * @param {number} timeEventID
 */
module.exports.removeTimeEvent = async function(timeEventID){
  let pool = await exports.getPool()
  return new Promise(resolve => {
    let query = `CALL removeTimeEvent(${timeEventID})`
    pool.query(query, (error, results, fields) => {
      //Error on problem.
      if(error) {
        simpleErrorPrintout("removeTimeEvent() failed, database error.");          
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a day to the database.
 * @param {number} weekday 
 * @param {string} createdBy
 */
module.exports.addDay = async function(weekday, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addDay(${weekday}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addDay() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a bounded event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValueStart 
 * @param {number} outputValueEnd 
 * @param {string} createdBy 
 */
module.exports.addBoundedEvent = async function(dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addBoundedEvent(${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValueStart}, ${outputValueEnd}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addBoundedEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a python sensor event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.addPythonSensorEvent = async function(dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addPythonSensorEvent(${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addPythonSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds an email sensor event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} email 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.addEmailSensorEvent = async function(dayID, startTime, stopTime, email, sensorID, triggerValues, triggerComparator, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addEmailSensorEvent(${dayID}, ${startTime}, ${stopTime}, ${email}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addEmailSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a python time event to the database.
 * @param {number} dayID 
 * @param {string} triggerTime 
 * @param {string} pythonScript 
 * @param {string} createdBy 
 */
module.exports.addPythonTimeEvent = async function(dayID, triggerTime, pythonScript, createdBy){let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addPythonTimeEvent(${dayID}, ${triggerTime}, ${pythonScript}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addPythonTimeEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a "random" event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.addRandomEvent = async function(dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy){let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL addRandomEvent(${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addRandomEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a "random" python event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.addRandomPythonEvent = async function(dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addRandomPythonEvent(${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addRandomPythonEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a recurring event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.addRecurringEvent = async function(dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addRecurringEvent(${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addRecurringEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a recurring python event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.addRecurringPythonEvent = async function(dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addRecurringPythonEvent(${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addRecurringPythonEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a sensor event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.addSensorEvent = async function(dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addSensorEvent(${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a sun tracker event to the database.
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} coordinates 
 * @param {number} outputID 
 * @param {number} createdBy 
 */
module.exports.addSunTrackerEvent = async function(dayID, startTime, stopTime, coordinates, outputID, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addSunTrackerEvent(${dayID}, ${startTime}, ${stopTime}, ${coordinates}, ${outputID}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addSunTrackerEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a time event to the database.
 * @param {number} dayID 
 * @param {string} triggerTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {string} createdBy 
 */
module.exports.addTimeEvent = async function(dayID, triggerTime, outputID, outputValue, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL addTimeEvent(${dayID}, ${triggerTime}, ${outputID}, ${outputValue}, $${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("addTimeEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a day to the database.
 * @param {number} dayID
 * @param {number} weekday 
 * @param {string} createdBy
 */
module.exports.updateDay = async function(dayID, weekday, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updateDay(${dayID}, ${weekday}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateDay() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a bounded event to the database.
 * @param {number} boundedEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValueStart 
 * @param {number} outputValueEnd 
 * @param {string} createdBy 
 */
module.exports.updateBoundedEvent = async function(boundedEventID, dayID, startTime, stopTime, outputID, outputValueStart, outputValueEnd, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updateBoundedEvent(${boundedEventID}, ${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValueStart}, ${outputValueEnd}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateBoundedEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds an email sensor event to the database.
 * @param {number} emailSensorEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} email 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.updateEmailSensorEvent = async function(emailSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updateEmailSensorEvent(${emailSensorEventID}, ${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateEmailSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a python sensor event to the database.
 * @param {number} pythonSensorEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.updatePythonSensorEvent = async function(pythonSensorEventID, dayID, startTime, stopTime, pythonScript, sensorID, triggerValues, triggerComparator, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updatePythonSensorEvent(${pythonSensorEventID}, ${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updatePythonSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a python time event to the database.
 * @param {number} pythonTimeEventID
 * @param {number} dayID 
 * @param {string} triggerTime 
 * @param {string} pythonScript 
 * @param {string} createdBy 
 */
module.exports.updatePythonTimeEvent = async function(pythonTimeEventID, dayID, triggerTime, pythonScript, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updatePythonTimeEvent(${pythonTimeEventID}, ${dayID}, ${triggerTime}, ${pythonScript}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updatePythonTimeEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a "random" event to the database.
 * @param {number} randomEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.updateRandomEvent = async function(randomEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy){
  let pool = await exports.getPool()
  return new Promise((resolve, reject) => {
    let query = `CALL updateRandomEvent(${randomEventID}, ${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateRandomEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a "random" python event to the database.
 * @param {number} randomPythonEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.updateRandomPythonEvent = async function(randomPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateRandomPythonEvent(${randomPythonEventID}, ${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateRandomPythonEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a recurring event to the database.
 * @param {number} recurringEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.updateRecurringEvent = async function(recurringEventID, dayID, startTime, stopTime, outputID, outputValue, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateRecurringEvent(${recurringEventID}, ${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateRecurringEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a recurring python event to the database.
 * @param {number} recurringPythonEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} pythonScript 
 * @param {number} occurrences 
 * @param {number} duration 
 * @param {number} minTimeout 
 * @param {string} createdBy 
 */
module.exports.updateRecurringPythonEvent = async function(recurringPythonEventID, dayID, startTime, stopTime, pythonScript, occurrences, duration, minTimeout, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateRecurringPythonEvent(${recurringPythonEventID}, ${dayID}, ${startTime}, ${stopTime}, ${pythonScript}, ${occurrences}, ${duration}, ${minTimeout}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateRecurringPythonEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a sensor event to the database.
 * @param {number} sensorEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {number} sensorID 
 * @param {object} triggerValues 
 * @param {string} triggerComparator 
 * @param {string} createdBy 
 */
module.exports.updateSensorEvent = async function(sensorEventID, dayID, startTime, stopTime, outputID, outputValue, sensorID, triggerValues, triggerComparator, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateSensorEvent(${sensorEventID}, ${dayID}, ${startTime}, ${stopTime}, ${outputID}, ${outputValue}, ${sensorID}, ${triggerValues}, ${triggerComparator}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateSensorEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a sun tracker event to the database.
 * @param {number} sunTrackerEventID
 * @param {number} dayID 
 * @param {string} startTime 
 * @param {string} stopTime 
 * @param {string} coordinates 
 * @param {number} outputID 
 * @param {number} createdBy 
 */
module.exports.updateSunTrackerEvent = async function(sunTrackerEventID, dayID, startTime, stopTime, coordinates, outputID, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateSunTrackerEvent(${sunTrackerEventID}, ${dayID}, ${startTime}, ${stopTime}, ${coordinates}, ${outputID}, ${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateSunTrackerEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}

/**
 * Adds a time event to the database.
 * @param {number} timeEventID
 * @param {number} dayID 
 * @param {string} triggerTime 
 * @param {number} outputID 
 * @param {number} outputValue 
 * @param {string} createdBy 
 */
module.exports.updateTimeEvent = async function(timeEventID, dayID, triggerTime, outputID, outputValue, createdBy){
  return new Promise((resolve, reject) => {
    let query = `CALL updateTimeEvent(${timeEventID}, ${dayID}, ${triggerTime}, ${outputID}, ${outputValue}, $${createdBy})`
    pool.query(query, (error, results, fields) => {
      //Error on problem
      if(error) {
        simpleErrorPrintout("updateTimeEvent() failed, database error.");
        reject(error);
      } else {
        resolve(results[0])
      }
    })
  })
}
