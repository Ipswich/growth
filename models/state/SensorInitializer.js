const events = require("events")
const five = require('johnny-five')
const dbcalls = require('../utility/database_calls')
const printouts = require('../utility/printouts')

const BME280_ADDRESS = 0x76; // TRY 0x77 IF BOARD ISN'T FINDING SENSOR


/**
 * Adds sensors to the passed state object according to the values present in
 * the object. 
 * @param {object} state The current state of the app
 * @returns 
 */
async function initializeSensors(state) {
  let address_event = new events.EventEmitter()
  return new Promise(async (resolve, reject) => {
    let [DS18B20_Count, DS18B20_Pin] = getDS18B20Data(state)

    //Setup event on finish of getting DS18B20 arrays. There's something strange
    //going on there that has made it ... frustrating... to try to promisify the
    //events and stuff. Ultimately this was the only way I could make it work,
    //can't really explain it.
    address_event.on('done', (DS18B20_Array) => {
      //Set up sensors and bind to state object.
      DS18B20_Array = DS18B20_Array.map(e => e.toString())
      //Get max hardwareID
      var hardwareID = Math.max.apply(Math, state.sensorState.data.map(function(o) { return o.sensorHardwareID; }));
      //Loop through hardware IDs
      let counter = 0
      while (hardwareID > counter) {
        counter++
        let i = 0;
        //Loop through sensors to find ones with matching hardwareID
        for(i; i < state.sensorState.data.length; i++){  
          let currentState = state.sensorState.data[i]  
          let sensor;
          let obj = {controller: currentState.sensorModel}
          //If matching hardwareID and protocol is I2C, get model
          if(counter == currentState.sensorHardwareID && currentState.sensorProtocol == 'I2C'){
            if(currentState.sensorModel == "BME280"){
              obj.address = BME280_ADDRESS;
            }
            // Else if the hardware ID is the current ID, get pin   
          } else if(counter == currentState.sensorHardwareID) {
            obj.pin = currentState.sensorPin
            // Otherwise, skip
          } else {
            continue
          }
          // Create sensor based on type
          try {
            switch (currentState.sensorType) {
              case 'Temperature':
                // If DS18B20, go through array of addresses
                if(currentState.sensorModel == "DS18B20"){
                  let address = currentState.sensorAddress
                  // If address is null, pull from bottom of array and update sensor
                  if (address == null) {
                    address = DS18B20_Array[0]
                    dbcalls.updateSensorAddress(address, currentState.sensorID).catch((e) => {
                      printouts.errorPrintout("Could not update DS18B20 address! Database failure.")
                      reject(e)
                    })                    
                  }
                  //Remove address from array
                  const index = DS18B20_Array.indexOf(address);
                  if (index > -1) {
                    DS18B20_Array.splice(index, 1);
                  }
                  obj.pin = DS18B20_Pin
                  address = Number(address)
                  obj.address = address
                  sensor = new five.Thermometer(obj)
                } else {
                  //Otherwise normal temperature sensor
                  sensor = new five.Thermometer(obj)
                } 
                break;
              case 'Humidity':
                sensor = new five.Hygrometer(obj)
                break;
              case 'Pressure':
                sensor = new five.Barometer(obj)
                break;
              case 'CarbonDioxide':
                sensor = -1;
                break;
              default:
                sensor = -1;
              }
            } catch (e) {
              printouts.errorPrintout("Arduino out of sensor pins! Could not attach all sensors, please check your board config.")
              reject(e)
            }
            currentState.sensorObject = sensor;
          }
        }
      resolve()
    });
    //Get addresses, calling event emitter thingy when done, which runs the top part of this function.
    getDS18B20Addresses(state, DS18B20_Count, DS18B20_Pin, function(ret_val) {address_event.emit('done', ret_val)})        
  })
}
module.exports.initializeSensors = initializeSensors


function getDS18B20Data(state) {
  let count = 0
  let pin = undefined
  for (let i = 0; i < state.sensorState.data.length; i++) {      
    if (state.sensorState.data[i].sensorModel == "DS18B20") {
      count++
      pin = state.sensorState.data[i].sensorPin
    }
  }
  return [count, pin]
}

function getDS18B20Addresses(state, DS18B20_Count, DS18B20_Pin, callback) {
  let DS18B20_Array = []
  if (DS18B20_Count > 0) {            
    five.Thermometer.Drivers.get(
      state.board, "DS18B20", {
        pin: DS18B20_Pin
      }).on('initialized', function(addr){       
      //If this address exists in database, do not include in list
      let include = true;
      // Look through each mapped sensor for DS18B20's with matching address
      for (i = 0; i < state.sensorState.data.length; i++) {
        if (state.sensorState.data[i].sensorModel == "DS18B20" && state.sensorState.data[i].sensorAddress == addr) {              
          include = false;
        }
      }
      // If it exists in the mapped sensors, add to list.
      if (include){
        DS18B20_Array.push(addr)
      }
      DS18B20_Count--
      if (DS18B20_Count <= 0){        
        callback(DS18B20_Array)
      }
    })      
  } else {
    callback(DS18B20_Array) 
  }  
}
