const events = require('events')
const Constants = require('./Constants')
const five = require('johnny-five')
const dbCalls = require('./utility/database_calls')
const Mappings = require('./utility/Mappings')
const Printouts = require('./utility/Printouts')

module.exports = class Sensors {
  
  static sensors = undefined

  static async createAsync(model, type, location, units, hardwareID, sensorProtocol, sensorAddress, sensorPin) {
    await dbCalls.addSensor(model, type, location, units, hardwareID, sensorProtocol, sensorAddress, sensorPin);
  }

  static async readAllAsync() {
    return await dbCalls.getSensors();
  }

  static async updateAsync(id, model, type, location, units, hardwareID, sensorProtocol, sensorAddress){ 
    await dbCalls.updateSensor(id, model, type, location, units, hardwareID, sensorProtocol, sensorAddress);
  }

  static async updateAddressAsync(sensorID, address){
    await dbCalls.updateSensorAddress(sensorID, address)
  }
  
  static async updatePinAsync(sensorID, pin){
    await dbCalls.updateSensorPin(sensorID, pin)
  }

  static async deleteAsync(sensorID){
    await dbCalls.removeSensor(sensorID);
  }
  
  // ####

  static async createInitialState(config, board){
    let mapperState = await this._mapPins(config)

    mapperState = await this._initializeSensors(board, mapperState)
    let sensorDict = await this._createSensorDictionary(mapperState)

    Sensors.sensors = sensorDict
    return sensorDict
  }

  static async _mapPins(config) {
    let mapperState = {
      sensorPins : config.board_pinout.SENSOR_PINS,
      analogPins : config.board_pinout.ANALOG_PINS,
      sensors : await dbCalls.getSensors()
    }
    let onewirePin = -1;
    let hardwareObject = {}
    mapperState = this._filterSensorPins(mapperState)
    //Iterate through sensors
    for(let i = 0; i < mapperState.sensors.length; i++) {
      //Check to see if hardwareID exists in object
      if(Object.keys(hardwareObject).indexOf(String(mapperState.sensors[i].sensorHardwareID)) != -1){
        //if yes, set to stored hardwareID and skip (same hardware, same pin)
        mapperState.sensors[i].sensorPin = hardwareObject[mapperState.sensors[i].sensorHardwareID]
        continue;
      }
      //Otherwise, case switch to apply pins to appropriate sensors
      switch (mapperState.sensors[i].sensorProtocol) {
        case Constants.sensorProtocols.I2C:
          continue;
        case Constants.sensorProtocols.ANALOG:
          [ mapperState, hardwareObject ] = this._mapAnalog(mapperState, hardwareObject, mapperState.sensors[i])
          continue;
        case Constants.sensorProtocols.ONEWIRE:
          [ mapperState, hardwareObject, onewirePin ] = this._mapOnewire(mapperState, hardwareObject, onewirePin, mapperState.sensors[i])
          continue;
        default:
          [ mapperState, hardwareObject ] = this._mapDefault(mapperState, hardwareObject, mapperState.sensors[i])
      }
    };
    return mapperState;
  }

  static _filterSensorPins(mapperState){
    for (let index in mapperState.sensors){
      let pin = mapperState.sensors[index].sensorPin
      if (pin == null || pin == undefined){
        continue;
      }
      if (mapperState.sensors[index].sensorProtocol == 'ANALOG'){
        let pinIndex = Mappings._pinExists(pin, mapperState.analogPins, "analog");
        mapperState.sensors.splice(pinIndex, 1);
      } else {
        let pinIndex = Mappings._pinExists(pin, mapperState.sensorPins, "sensor");
        mapperState.sensors.splice(pinIndex, 1);
      }
    }
    return mapperState;
  }

  static _mapAnalog(mapperState, hardwareObject, sensor){
    //If we've run out of analog pins, error.
    try {
      Mappings._pinCountCheck(mapperState.analogPins, "analog")
    } catch (e) {
      throw e
    }
    let analogPin = sensor.sensorPin || mapperState.analogPins.shift();
    hardwareObject[sensor.sensorHardwareID] = analogPin;
    sensor.sensorPin = analogPin;
    return [mapperState, hardwareObject]
  }

  static _mapOnewire(mapperState, hardwareObject, onewirePin, sensor){
    if (onewirePin == -1) {
      //If we've run out of sensor pins, error.
      try {
        Mappings._pinCountCheck(mapperState.sensorPins, "sensor")
      } catch (e) {
        throw e
      }
      onewirePin = sensor.sensorPin || mapperState.sensorPins.shift()
    }
    hardwareObject[sensor.sensorHardwareID] = onewirePin;
    sensor.sensorPin = onewirePin;
    return [mapperState, hardwareObject, onewirePin]
  }

  static _mapDefault(mapperState, hardwareObject, sensor){
    //If we've run out of sensor pins, error.
    try {
      Mappings._pinCountCheck(mapperState.sensorPins, "sensor")
    } catch (e) {
      throw e
    }
    let sensorPin = sensor.sensorPin || mapperState.sensorPins.shift()
    hardwareObject[sensor.sensorHardwareID] = sensorPin;
    sensor.sensorPin = sensorPin
    return [mapperState, hardwareObject]
  }

  static _createSensorDictionary(mapperState){
    let result = Object.assign({}, ...mapperState.sensors.map(function(sensor){
      let id = sensor.sensorID;
      let data = {};
      for(let key in sensor){
        if (key != "sensorID"){
          data[key] = sensor[key]
        }
      }
      return {[id]: data}
    }))
    return result
  }


  /**
   * Adds sensors to the passed state object according to the values present in
   * the object. 
   * @param {object} state The current state of the app
   * @returns 
   */
  static async _initializeSensors(board, mapperState) {
    let address_event = new events.EventEmitter()
    return new Promise(async (resolve, reject) => {
      let [DS18B20_Count, DS18B20_Pin] = this._getDS18B20Data(mapperState)
      //Setup event on finish of getting DS18B20 arrays. There's something strange
      //going on there that has made it ... frustrating... to try to promisify the
      //events and stuff. Ultimately this was the only way I could make it work,
      //can't really explain it.
      address_event.on('done', (DS18B20_Array) => {
        //Set up sensors and bind to state object.
        DS18B20_Array = DS18B20_Array.map(e => e.toString())
        //###################Get max hardwareID 
        //###TODO: FIX ME
        let hardwareIDList = []
        for(let sensor in mapperState.sensors){
          if (hardwareIDList.hardwareID != null && hardwareIDList.hardwareID != undefined){
            hardwareIDList.push(sensor.hardwareID)
          }
        }
        for (hardwareID in hardwareIDList) {
          //Loop through sensors to find ones with matching hardwareID
          for(let i = 0; i < mapperState.sensors.length; i++){  
            let currentState = mapperState.sensors[i]  
            let sensor;
            let obj = {controller: currentState.sensorModel}

            if(hardwareID == currentState.sensorHardwareID && currentState.sensorProtocol == 'I2C'){
              obj.sensorAddress = currentState.sensorAddress
            } else if(hardwareID == currentState.sensorHardwareID) {
              obj.pin = currentState.sensorPin
            } else {
              continue
            }

            // Create sensor based on type
            try {
              switch (currentState.sensorType.toLowercase()) {
                case 'temperature':
                  // If DS18B20, go through array of addresses
                  if(currentState.sensorModel == "DS18B20"){
                    [ sensor, DS18B20_Array ] = this._createDS18B20(currentState, DS18B20_Array, obj)
                  } else {
                    //Otherwise normal temperature sensor
                    sensor = new five.Thermometer(obj)
                  } 
                  break;
                case 'humidity':
                  sensor = new five.Hygrometer(obj)
                  break;
                case 'pressure':
                  sensor = new five.Barometer(obj)
                  break;
                case 'carbondioxide':
                  sensor = -1;
                  break;
                default:
                  sensor = -1;
                }
              } catch (e) {
                Printouts.errorPrintout("Arduino out of sensor pins! Could not attach all sensors, please check your board config.")
                reject(e)
              }
              currentState.sensorObject = sensor;
            }

          }
        resolve(mapperState)
      });
      //Get addresses, calling event emitter thingy when done, which runs the top part of this function.
      this._getDS18B20Addresses(board, mapperState, DS18B20_Count, DS18B20_Pin, function(ret_val) {address_event.emit('done', ret_val)})
    })
  }

  static async _createDS18B20(currentState, DS18B20_Array, obj){
    return new Promise(resolve, reject => {
      let address = currentState.sensorAddress
      // If address is null, pull from bottom of array and update sensor
      if (address == null) {
        address = DS18B20_Array[0]
        dbCalls.updateSensorAddress(address, currentState.sensorID).catch((e) => {
          Printouts.errorPrintout("Could not update DS18B20 address! Database failure.")
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
      resolve([ sensor, DS18B20_Array ])
    })
  }

  static _getDS18B20Data(mapperState) {
    let count = 0
    let pin = undefined
    for (let i = 0; i < mapperState.sensors.length; i++) {      
      if (mapperState.sensors[i].sensorModel == "DS18B20") {
        count++
        pin = mapperState.sensors[i].sensorPin
      }
    }
    return [count, pin]
  }

  // This could probably be turned into an async thing...
  static async _getDS18B20Addresses(board, mapperState, DS18B20_Count, DS18B20_Pin, callback) {
    let DS18B20_Array = []
    if (DS18B20_Count > 0) {            
      five.Thermometer.Drivers.get(
          board, "DS18B20", {
            pin: DS18B20_Pin
        }).on('initialized', function(addr){       
        //If this address exists in database, do not include in list
        let include = true;
        // Look through each mapped sensor for DS18B20's with matching address
        for (let i = 0; i < mapperState.sensors.length; i++) {
          if (mapperState.sensors[i].sensorModel == "DS18B20" && mapperState.sensors[i].sensorAddress == addr) {              
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

  /**
   * Returns a promise that resolves with the data from the next "data" event
   * on the sensor. Intended to be used as part of a forloop over each sensor;
   * i refers to index of the sensorState.data array, NOT sensorID. This
   * promise rejects automatically after 2s.
   * @param {Number} i Index of sensor state data array.
   * @returns {promise}) to a data object that contains identifying 
   * information and a sensor reading.
   */
   static async getSensorVal(sensor) {
    let obj = sensor.sensorObject;
    let units = sensor.sensorUnits;
    let data = {}
    data.sensorType = sensor.sensorType;
    data.sensorLocation = sensor.sensorLocation;
    data.sensorID = sensor.sensorID;
    data.readingTime = moment().format('HH:mm');
    data.readingDate = moment().format('MM/DD/YYYY');
    return new Promise((resolve, reject) => {
      //Reject no matter what after 2s
      setTimeout(() => {
        reject(new Error("Timeout waiting for sensor data."))
      }, 2000)
      if(obj != null) {
        obj.once('data', () => {
          try {
            switch (this.data[i].sensorType) {
              case 'Temperature':
                if (units == "°C" || units == "C") {
                  data.val = obj.C;
                } else if (units == "°F" || units == "F") {
                  data.val = obj.F;
                }
                break;
              case 'Humidity':
                data.val = obj.RH;
                break;
              case 'Pressure':
                data.val = obj.pressure;
                break;
              case 'CarbonDioxide':
                data.val = -1;
                break;
              default:
                data.val = -1;
            }
            resolve(data);
          } catch (e) {
            reject(e)
          }
        })
      } else {
        reject(new Error("No sensor object, could not fetch data!"))
      }
    });
  }


/**
 * Iterates through the state object getting a reading from each sensor
 * and adding it to the database. Updates the state object with the last
 * reading of each sensor.
 * @param {object} state Current state object
 */
static async addSensorReadings(sensors){
  for(i in Object.keys(sensors)) {
    try {
      let data = await this.getSensorVal(i);
      if (data.val == undefined){
        throw ("Could not fetch data from sensor: {" + sensors[i].sensorType + ' @ ' + sensors[i].sensorLocation + '}')
      }
      await dbcalls.addSensorReading(i, data.val)
    } catch (e) {
      Printouts.simpleErrorPrintout(e)
    }
  }
}
}

