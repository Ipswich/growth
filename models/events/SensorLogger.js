const printouts = require('../utility/printouts')
const dbcalls = require('../utility/database_calls.js')

/**
 * Iterates through the state object getting a reading from each sensor
 * and adding it to the database. Updates the state object with the last
 * reading of each sensor.
 * @param {object} state Current state object
 */
module.exports.addSensorReadings = async function addSensorReadings(state){
  for(i = 0; i < state.sensorState.getSensorState().length; i++) {
    try {
      let data = await state.sensorState.getSensorVal(i)
      if (data.val == undefined){
        throw ("Could not fetch data from sensor: {" + state.sensorState.data[i].sensorType + ' @ ' + state.sensorState.data[i].sensorLocation + '}')
      }
      state.sensorState.data[i].sensorLastReading = data.val
      await dbcalls.addSensorReading(data.sensorID, data.val)
    } catch (e) {
      printouts.simpleErrorPrintout(e)
    }
  }
}

