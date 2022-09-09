const events = require('events')
const five = require('johnny-five')
const sinon = require('sinon')
const { assert } = require('chai');
const Sensors = require('../../../models/Sensors')
const dbCalls = require('../../../models/utility/database_calls');

describe('Sensors.js tests', function(){
  describe('createInitialState() tests', function() {
    it('should return a dictionary of sensors, with key = to ID and a sensorObject', async function(){
      let sensorReturn = [
        {sensorID: 42, sensorModel: 'BME280', sensorType: 'temperature', sensorHardwareID: 2, sensorProtocol: "I2C", sensorAddress: "0x76", sensorPin: null},
        {sensorID: 43, sensorModel: 'BME280', sensorType: 'hygrometer', sensorHardwareID: 2, sensorProtocol: "I2C", sensorAddress: "0x76", sensorPin: undefined},
        {sensorID: 44, sensorModel: 'BME280', sensorType: 'barometer', sensorHardwareID: 2, sensorProtocol: "I2C", sensorAddress: "0x76", sensorPin: null},
        {sensorID: 7, sensorModel: 'DS18B20', sensorType: "", sensorHardwareID: "1", sensorProtocol: "", sensorAddress: "", sensorPin: null},
        {sensorID: 12, sensorModel: 'DS18B20', sensorType: "", sensorHardwareID: "1", sensorProtocol: "", sensorAddress: "", sensorPin: 1},
        {sensorID: 23, sensorModel: null, sensorType: "", sensorHardwareID: "3", sensorProtocol: "", sensorAddress: "", sensorPin: null}
      ]
      let stub_getSensors = sinon.stub(dbCalls, 'getSensors').returns(sensorReturn)
      let stub_thermometer = sinon.stub(five, 'Thermometer').returns({thermometer: 1})
      let dummy_thermometerDriver = new events.EventEmitter()
      let stub_thermometerDrivers = sinon.stub(five.Thermometer.Drivers, 'get').returns(dummy_thermometerDriver);
      let stub_hygrometer = sinon.stub(five, 'Hygrometer')
      let stub_barometer = sinon.stub(five, 'Barometer')
      let board = new events.EventEmitter()
      let config = { board_pinout: {
        SDAPIN: 41,
        SCLPIN: 42,
        SENSOR_PINS: [1, 2, 3, 4, 5],
        ANALOG_PINS: [6, 7, 8, 9, 10]
      } }
      let createState_promise = Sensors.createInitialState(config, board)
      dummy_thermometerDriver.emit('initialized', "asdf")
      console.log(createState_promise)
      let result = await createState_promise
      console.log(result)
      
    })
    it('should error when out of sensor pins', function() {

    })
    it('should error if given an invalid pin', function() {

    })
    it('should error on sensor creation', function() {

    })
  })  
})