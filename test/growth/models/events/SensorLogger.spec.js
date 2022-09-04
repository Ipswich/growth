const chai = require('chai')
const sinon = require('sinon')
const assert = chai.assert;
const dbcalls = require('../../../../models/utility/database_calls')
const sensorLogger = require('../../../../models/events/SensorLogger')


describe('sensorLogger.js tests', function() {  
  describe('sensorLogger tests', function() {
    it('should get readings from 3 sensors and add to database', async function() {
      let getSensorVal_stub = sinon.stub()
      getSensorVal_stub.resolves({val: 1, sensorID: 1, sensorLocation: "Here?"})
      let addSensorReading_stub = sinon.stub(dbcalls, 'addSensorReading')
      let test_state = {
        sensorState: {
          data: [{
            sensorLastReading: undefined,
            sensorID: 1
          },
          {
            sensorLastReading: undefined,
            sensorID: 2
          },
          {
            sensorLastReading: undefined,
            sensorID: 3
          }
          ],      
          getSensorState: function(){
            return this.data
          },
          getSensorVal: getSensorVal_stub
        }
      }
      await sensorLogger.addSensorReadings(test_state)
      assert.equal(getSensorVal_stub.callCount, 3)
      assert.equal(addSensorReading_stub.callCount, 3)
    })
  })
})