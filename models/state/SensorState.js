const moment = require('moment')
const mappings = require('../utility/mappings.js');
/**
 * Creates a sensor state object; this constructor gets a pinout mapping and
 * assigns the values returned to a JS object.
 * 
 * This obejct is used to track changes to the state of the system throughout
 * runtime. It should probably onl be created once and passed throughout;
 * intended to be used as a singleton.
 */
module.exports = class SensorState {
  constructor(config) {
    return (async () => {
      this.data = [];
      let sensorMappings
      //Get sensors
      try {
        sensorMappings = await mappings.getSensorMappings(config);
      } catch (e) {
        throw e
      }
      //map initial values (default to off (event 2))
      for (let i = 0; i < sensorMappings.length; i++){
        this.data[i] = {};
        this.data[i].sensorID = sensorMappings[i].sensorID;
        this.data[i].sensorHardwareID = sensorMappings[i].sensorHardwareID;
        this.data[i].sensorModel = sensorMappings[i].sensorModel;
        this.data[i].sensorType = sensorMappings[i].sensorType;
        this.data[i].sensorLocation = sensorMappings[i].sensorLocation;
        this.data[i].sensorUnits = sensorMappings[i].sensorUnits;
        this.data[i].sensorProtocol = sensorMappings[i].sensorProtocol;
        this.data[i].sensorPin = sensorMappings[i].SENSOR_PIN ? sensorMappings[i].SENSOR_PIN : null;
        this.data[i].sensorAddress = sensorMappings[i].sensorAddress;
        this.data[i].sensorObject = null;
        this.data[i].SSenabled = sensorMappings[i].SSenabled;
        this.data[i].sensorLastReading = null;
      }
      return this;
    })();
  }
  
  /**
   * Fetches the sensor data for the API.
   * @param {Number} sensorID Optional. The sensorID to fetch data on.
   * @returns {object} the object data necessary to generate the index and 
   * other pages
   */
  getSensorData(sensorID = undefined){
    let sensors = [];
    for(let i = 0; i < this.data.length; i++){
      if (sensorID != undefined){
        if (this.data[i].sensorID != sensorID){
          continue
        }
      }
      let RowDataPacket = {}
      RowDataPacket.sensorID = this.data[i].sensorID
      RowDataPacket.sensorHardwareID = this.data[i].sensorHardwareID
      RowDataPacket.sensorModel = this.data[i].sensorModel
      RowDataPacket.sensorType = this.data[i].sensorType
      RowDataPacket.sensorLocation = this.data[i].sensorLocation
      RowDataPacket.sensorUnits = this.data[i].sensorUnits
      RowDataPacket.sensorProtocol = this.data[i].sensorProtocol
      RowDataPacket.sensorPin = this.data[i].sensorPin
      RowDataPacket.sensorAddress = this.data[i].sensorAddress
      RowDataPacket.SSenabled = this.data[i].SSenabled
      RowDataPacket.sensorLastReading = this.data[i].sensorLastReading
      sensors.push(RowDataPacket)
    }
    return sensors
  }
  
  /**
   * Fetches the sensor data for generating the web pages.
   * @returns {object} the object data necessary to generate the index and 
   * other pages
   */
  getSensorIndexData(){
    let sensors = [];
    for(let i = 0; i < this.data.length; i++){
      let RowDataPacket = {}
      RowDataPacket.sensorID = this.data[i].sensorID
      RowDataPacket.sensorModel = this.data[i].sensorModel
      RowDataPacket.sensorType = this.data[i].sensorType
      RowDataPacket.sensorLocation = this.data[i].sensorLocation
      RowDataPacket.sensorUnits = this.data[i].sensorUnits
      RowDataPacket.SSenabled = this.data[i].SSenabled
      RowDataPacket.sensorHardwareID = this.data[i].sensorHardwareID
      RowDataPacket.sensorProtocol = this.data[i].sensorProtocol
      RowDataPacket.sensorAddress = this.data[i].sensorAddress
      RowDataPacket.sensorLastReading = this.data[i].sensorLastReading
      sensors.push(RowDataPacket)
    }
    return sensors
  }
  
  /**
   * Creates a list of sensor types currently running.
   * @returns {[object]} An array of sensor types in an object.
   */
  getSensorTypes(){
    let sensorTypes = [];
    let types = []
    for(let i = 0; i < this.data.length; i++){
      if (!types.includes(this.data[i].sensorType)){
        let RowDataPacket = {};
        RowDataPacket.sensorType = this.data[i].sensorType
        sensorTypes.push(RowDataPacket)
        types.push(this.data[i].sensorType)
      }
    }
    return sensorTypes;
  }
  
  /**
   * Gets data for the passed sensorID
   * @param {number} sensorID The sensorID to retrieve data from.
   * @returns {object} The data associated with the passed outputID.
   */
  getSensor(sensorID) {
    for(let i = 0; i < this.data.length; i++){
      if(this.data[i].sensorID == sensorID){
        return this.data[i];
      }
    }
  }

  /**
   * Gets the sensor state object.
   * @returns {[object]} The sensorState object.
   */
  getSensorState(){
    return this.data;
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
  async getSensorVal(i) {
    if ((i >= this.data.length) || (i < 0)){
      throw new Error("Out of bounds of sensor state")
    }
    let obj = this.data[i].sensorObject;
    let units = this.data[i].sensorUnits;
    let data = {}
    data.sensorType = this.data[i].sensorType;
    data.sensorLocation = this.data[i].sensorLocation;
    data.sensorID = this.data[i].sensorID;
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
}
