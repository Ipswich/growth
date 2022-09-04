const chai = require('chai')
const sinon = require('sinon');
const assert = chai.assert;
const dbcalls = require('../../../../models/utility/database_calls');

const mappings = require('../../../../models/utility/mappings');


describe('Mappings.js tests', function() {
  var sensor_fixture = [
    { sensorHardwareID: 1, sensorProtocol: 'I2C' },
    { sensorHardwareID: 1, sensorProtocol: 'I2C' },
    { sensorHardwareID: 1, sensorProtocol: 'I2C' },
    { sensorHardwareID: 2, sensorProtocol: 'ONEWIRE'},
    { sensorHardwareID: 4, sensorProtocol: 'ANALOG'},
    { sensorHardwareID: 3, sensorProtocol: 'ONEWIRE'},
    { sensorHardwareID: 5, sensorProtocol: 'ANALOG'},
    { sensorHardwareID: 6, sensorProtocol: 'FOO'},
    { sensorHardwareID: 7, sensorProtocol: 'BAZ'},
    { sensorHardwareID: 6, sensorProtocol: 'BAR'}
  ]

  var standard_board_mappings_return = {
    OUTPUT_PINS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    PWM_PINS: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    SDAPIN: 41,
    SCLPIN: 42,
    SENSOR_PINS: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    ANALOG_PINS: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40]    
  }

  var output_fixture = [
    {outputPWM: 1},
    {outputPWM: 0},
    {outputPWM: 0},
    {outputPWM: 1}
  ]

  describe('getOutputMappings() tests', async function() {
    it('should call mapOutputPins referencing the database', async function(){
      let expected = [
        { outputPWM: 1, OUTPUT_PIN: 2, PWM_PIN: 11 },
        { outputPWM: 0, OUTPUT_PIN: 3 },
        { outputPWM: 0, OUTPUT_PIN: 4 },
        { outputPWM: 1, OUTPUT_PIN: 5, PWM_PIN: 12 }
      ]
      let config = {
        relay_toggle_prevention: true,
        board_pinout: JSON.parse(JSON.stringify(standard_board_mappings_return))
      }
      sinon.stub(dbcalls, 'getEnabledOutputs').resolves(output_fixture)
      let actual = await mappings.getOutputMappings(config)
      assert.deepEqual(actual, expected)
    })
  })

  describe('getSensorMappings() tests', async function() {
    it('should call mapSensorPins referencing the database', async function(){
      let expected = [
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 2, sensorProtocol: 'ONEWIRE', SENSOR_PIN: 21 },
        { sensorHardwareID: 4, sensorProtocol: 'ANALOG', SENSOR_PIN: 31 },
        { sensorHardwareID: 3, sensorProtocol: 'ONEWIRE', SENSOR_PIN: 21 },
        { sensorHardwareID: 5, sensorProtocol: 'ANALOG', SENSOR_PIN: 32 },
        { sensorHardwareID: 6, sensorProtocol: 'FOO', SENSOR_PIN: 22 },
        { sensorHardwareID: 7, sensorProtocol: 'BAZ', SENSOR_PIN: 23 },
        { sensorHardwareID: 6, sensorProtocol: 'BAR', SENSOR_PIN: 22 }
      ]
      let config = {board_pinout: JSON.parse(JSON.stringify(standard_board_mappings_return))}
      sinon.stub(dbcalls, 'getEnabledSensors').resolves(sensor_fixture)
      let actual = await mappings.getSensorMappings(config)
      assert.deepEqual(actual, expected)
    })
  })

  describe('mapOutputPins() tests', function() {
    it('should return proper board mappings (relay toggle on)', function() {
      let config = {
        relay_toggle_prevention : true,
        board_pinout : JSON.parse(JSON.stringify(standard_board_mappings_return))
      }
      let expected = [
        { outputPWM: 1, OUTPUT_PIN: 2, PWM_PIN: 11 },
        { outputPWM: 0, OUTPUT_PIN: 3 },
        { outputPWM: 0, OUTPUT_PIN: 4 },
        { outputPWM: 1, OUTPUT_PIN: 5, PWM_PIN: 12 }
      ]
      let actual = mappings.mapOutputPins(config, output_fixture)
      assert.deepEqual(actual, expected)
    })

    it('should return proper board mappings (relay toggle off)', function() {
      let config = {
        relay_toggle_prevention : false,
        board_pinout: JSON.parse(JSON.stringify(standard_board_mappings_return))
      }
      let expected = [
        { outputPWM: 1, OUTPUT_PIN: 1, PWM_PIN: 11 },
        { outputPWM: 0, OUTPUT_PIN: 2 },
        { outputPWM: 0, OUTPUT_PIN: 3 },
        { outputPWM: 1, OUTPUT_PIN: 4, PWM_PIN: 12 }
      ]
      let actual = mappings.mapOutputPins(config, output_fixture)
      assert.deepEqual(actual, expected)
    })

    it('should run out of digital pins and throw an error', function() {     
      let config = {
        relay_toggle_prevention: false,
        board_pinout: {
          OUTPUT_PINS: [],
          PWM_PINS: [1]
        }
      }
      try {
        mappings.mapOutputPins(config, output_fixture)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should run out of PWM pins and throw an error', function() {
      let config = {
        relay_toggle_prevention: false,
        board_pinout: {
          OUTPUT_PINS: [1],
          PWM_PINS: []
        }
      }
      try {
        mappings.mapOutputPins(config, output_fixture)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })
  
  describe('mapSensorPins() tests', function() {
    it('should return proper sensor mappings', async function() {
      let expected = [
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 1, sensorProtocol: 'I2C' },
        { sensorHardwareID: 2, sensorProtocol: 'ONEWIRE', SENSOR_PIN: 21 },
        { sensorHardwareID: 4, sensorProtocol: 'ANALOG', SENSOR_PIN: 31 },
        { sensorHardwareID: 3, sensorProtocol: 'ONEWIRE', SENSOR_PIN: 21 },
        { sensorHardwareID: 5, sensorProtocol: 'ANALOG', SENSOR_PIN: 32 },
        { sensorHardwareID: 6, sensorProtocol: 'FOO', SENSOR_PIN: 22 },
        { sensorHardwareID: 7, sensorProtocol: 'BAZ', SENSOR_PIN: 23 },
        { sensorHardwareID: 6, sensorProtocol: 'BAR', SENSOR_PIN: 22 }
      ]
      let board_pinout = JSON.parse(JSON.stringify(standard_board_mappings_return));
      let actual = mappings.mapSensorPins(sensor_fixture, board_pinout);
      assert.deepEqual(actual, expected)      
    })

    it('Error on running out of sensor pins', async function() {
      let board_pinout = {
        SENSOR_PINS : [],
        ANALOG_PINS : [1]
      };
      try {
        mappings.mapSensorPins(sensor_fixture, board_pinout)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('Error on running out of analog pins', async function() {
      let board_pinout = {
        SENSOR_PINS : [1],
        ANALOG_PINS : []
      }
      try {
        mappings.mapSensorPins(sensor_fixture, board_pinout)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })
})