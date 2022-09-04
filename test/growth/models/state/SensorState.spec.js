const chai = require('chai')
const events = require('events')
const sinon = require('sinon')
const assert = chai.assert;
const expect = chai.expect;

const mappings = require('../../../../models/utility/mappings');
const SensorState = require('../../../../models/state/SensorState');

describe('SensorState.js tests', function() {
  let config = {data_directory : "test"};
  let enabled_sensors_fixture = [
    {
      sensorID: 7,
      sensorModel: 'BME280',
      sensorType: 'Temperature',
      sensorLocation: 'Control Box',
      sensorUnits: '°F',
      SSenabled: 1,
      sensorHardwareID: 1,
      sensorProtocol: 'I2C',
      sensorAddress: null
    },
    {
      sensorID: 8,
      sensorModel: 'BME280',
      sensorType: 'Humidity',
      sensorLocation: 'Control Box',
      sensorUnits: '% RH',
      SSenabled: 1,
      sensorHardwareID: 1,
      sensorProtocol: 'I2C',
      sensorAddress: null
    },
    {
      sensorID: 9,
      sensorModel: 'BME280',
      sensorType: 'Pressure',
      sensorLocation: 'Control Box',
      sensorUnits: 'kPa',
      SSenabled: 1,
      sensorHardwareID: 1,
      sensorProtocol: 'I2C',
      sensorAddress: null
    },
    {
      sensorID: 12,
      sensorModel: 'DS18B20',
      sensorType: 'Temperature',
      sensorLocation: 'DWC Tote',
      sensorUnits: '°F',
      SSenabled: 1,
      sensorHardwareID: 2,
      sensorProtocol: 'ONEWIRE',
      sensorAddress: '3374090665499',
      SENSOR_PIN: 38
    },
    {
      sensorID: 14,
      sensorModel: 'DS18B20',
      sensorType: 'Temperature',
      sensorLocation: 'Outside',
      sensorUnits: '°F',
      SSenabled: 1,
      sensorHardwareID: 3,
      sensorProtocol: 'ONEWIRE',
      sensorAddress: '4500085429503',
      SENSOR_PIN: 38
    }
  ]
  let expected_default = {
    data: [
      {
        sensorID: 7,
        sensorHardwareID: 1,
        sensorModel: 'BME280',
        sensorType: 'Temperature',
        sensorLocation: 'Control Box',
        sensorUnits: '°F',
        sensorProtocol: 'I2C',
        sensorPin: null,
        sensorAddress: null,
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      },
      {
        sensorID: 8,
        sensorHardwareID: 1,
        sensorModel: 'BME280',
        sensorType: 'Humidity',
        sensorLocation: 'Control Box',
        sensorUnits: '% RH',
        sensorProtocol: 'I2C',
        sensorPin: null,
        sensorAddress: null,
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      },
      {
        sensorID: 9,
        sensorHardwareID: 1,
        sensorModel: 'BME280',
        sensorType: 'Pressure',
        sensorLocation: 'Control Box',
        sensorUnits: 'kPa',
        sensorProtocol: 'I2C',
        sensorPin: null,
        sensorAddress: null,
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      },
      {
        sensorID: 12,
        sensorHardwareID: 2,
        sensorModel: 'DS18B20',
        sensorType: 'Temperature',
        sensorLocation: 'DWC Tote',
        sensorUnits: '°F',
        sensorProtocol: 'ONEWIRE',
        sensorPin: 38,
        sensorAddress: '3374090665499',
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      },
      {
        sensorID: 14,
        sensorHardwareID: 3,
        sensorModel: 'DS18B20',
        sensorType: 'Temperature',
        sensorLocation: 'Outside',
        sensorUnits: '°F',
        sensorProtocol: 'ONEWIRE',
        sensorPin: 38,
        sensorAddress: '4500085429503',
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      }
    ]
  }
  let stub_mappings
  beforeEach(function() {
    stub_mappings = sinon.stub(mappings, 'getSensorMappings').resolves(enabled_sensors_fixture)
  })
  afterEach(function () {
    stub_mappings.restore()
  })

  describe('SensorState() tests', function() {
    it('should create a new sensor state object referencing the database', async function() {
      let actual = await new SensorState(config)
      assert.deepEqual(actual.data, expected_default.data)
    })

    it('should throw an error on creation', async function() {
      stub_mappings.throws(new Error('Error!'))
      try {
        await new SensorState(config)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('getSensorIndexData tests', function() {
    it('should get the data needed to render the sensors on webpages', async function() {
      let sensorState = await new SensorState(config)
      let expected = [
        {
          sensorID: 7,
          sensorModel: 'BME280',
          sensorType: 'Temperature',
          sensorLocation: 'Control Box',
          sensorUnits: '°F',
          SSenabled: 1,
          sensorHardwareID: 1,
          sensorProtocol: 'I2C',
          sensorAddress: null,
          sensorLastReading: null
        },
        {
          sensorID: 8,
          sensorModel: 'BME280',
          sensorType: 'Humidity',
          sensorLocation: 'Control Box',
          sensorUnits: '% RH',
          SSenabled: 1,
          sensorHardwareID: 1,
          sensorProtocol: 'I2C',
          sensorAddress: null,
          sensorLastReading: null
        },
        {
          sensorID: 9,
          sensorModel: 'BME280',
          sensorType: 'Pressure',
          sensorLocation: 'Control Box',
          sensorUnits: 'kPa',
          SSenabled: 1,
          sensorHardwareID: 1,
          sensorProtocol: 'I2C',
          sensorAddress: null,
          sensorLastReading: null
        },
        {
          sensorID: 12,
          sensorModel: 'DS18B20',
          sensorType: 'Temperature',
          sensorLocation: 'DWC Tote',
          sensorUnits: '°F',
          SSenabled: 1,
          sensorHardwareID: 2,
          sensorProtocol: 'ONEWIRE',
          sensorAddress: '3374090665499',
          sensorLastReading: null
        },
        {
          sensorID: 14,
          sensorModel: 'DS18B20',
          sensorType: 'Temperature',
          sensorLocation: 'Outside',
          sensorUnits: '°F',
          SSenabled: 1,
          sensorHardwareID: 3,
          sensorProtocol: 'ONEWIRE',
          sensorAddress: '4500085429503',
          sensorLastReading: null
        }
      ]
      assert.deepEqual(sensorState.getSensorIndexData(), expected)
    })
  })

  describe('getSensorTypes() tests', function() {
    it('should get a list of the existing sensor types', async function() {
      let actual = await new SensorState(config)
      let expected = [
        { sensorType: 'Temperature' },
        { sensorType: 'Humidity' },
        { sensorType: 'Pressure' }
      ]
      assert.deepEqual(actual.getSensorTypes(), expected)
    })
  })

  describe('getSensor() tests', function() {
    it('should get the data associated with the passed sensorID', async function() {
      let actual = await new SensorState(config)
      let expected = {
        sensorID: 7,
        sensorHardwareID: 1,
        sensorModel: 'BME280',
        sensorType: 'Temperature',
        sensorLocation: 'Control Box',
        sensorUnits: '°F',
        sensorProtocol: 'I2C',
        sensorPin: null,
        sensorAddress: null,
        sensorObject: null,
        SSenabled: 1,
        sensorLastReading: null
      }
      assert.deepEqual(actual.getSensor(7), expected)
    })
    it('should return undefined on non existent sensorID', async function() {
      let actual = await new SensorState(config)
      assert.isUndefined(actual.getSensor(-1))
    })
  })

  describe('getSensorState() tests', function() {
    it('should get the sensor data object', async function() {
      let actual = await new SensorState(config)
      assert.deepEqual(actual.getSensorState(), actual.data)
    })
  })

  describe('getSensorVal() tests', function() {
    it('should get a value from the sensor', async function() {
      let test_state = await new SensorState(config)
      test_state.data[0].sensorObject = new events.EventEmitter()
      test_state.data[0].sensorObject.F = 5

      let getSensorVal_promise = test_state.getSensorVal(0)
      test_state.data[0].sensorObject.emit('data')

      let data = await getSensorVal_promise
      assert.equal(data.val, 5)
    })

    it('should reject with an error for no sensor object', async function() {
      let test_state = await new SensorState(config)
      await test_state.getSensorVal(0).then(
        function() {
          assert.fail()}
        ).catch(function(error) {
          expect(error).to.be.an('error')
        })
    })
  })
})
