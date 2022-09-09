// const events = require('events')
// const chai = require('chai')
// const sinon = require('sinon')
// const assert = chai.assert;
// const five = require('johnny-five')
// const dbcalls = require('../../../../models/utility/database_calls')
// const SensorInitializer = require('../../../../models/state/SensorInitializer')



// describe('SensorInitializer.js tests', function() {  
//   describe('SensorInitializer() tests', function() {
//     it('should add no sensors', function() {
//       let test_state = {
//         sensorState: {
//           data:[
//           ]
//         }
//       }
//       SensorInitializer.initializeSensors(test_state)
//       assert.equal(0, test_state.sensorState.data.length)
//     })

//     it('should add 2 addressed and 2 unaddressed DS18B20s', async function() {
//       let test_state = {        
//         sensorState: {
//           data:[
//             {
//               sensorType: "Temperature",
//               sensorModel: "DS18B20",
//               sensorPin: 1,
//               sensorAddress: "1",
//               sensorHardwareID: 1,
//               sensorID: 1,
//               sensorObject: undefined
//             },
//             {
//               sensorType: "Temperature",
//               sensorModel: "DS18B20",
//               sensorPin: 1,
//               sensorAddress: "2",
//               sensorHardwareID: 2,
//               sensorID: 2,
//               sensorObject: undefined
//             },
//             {
//               sensorType: "Temperature",
//               sensorModel: "DS18B20",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 3,
//               sensorID: 3,
//               sensorObject: undefined
//             },
//             {
//               sensorType: "Temperature",
//               sensorModel: "DS18B20",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 4,
//               sensorID: 4,
//               sensorObject: undefined
//             }
//           ]
//         }
//       }
//       let dummy_emitter = new events.EventEmitter()
//       sinon.stub(five.Thermometer.Drivers, 'get').onFirstCall().returns(dummy_emitter)        
//       let db_mock = sinon.stub(dbcalls, 'updateSensorAddress').resolves()
//       sinon.stub(five, 'Thermometer').returns({thermometer: 1})
//       let initialize_function = SensorInitializer.initializeSensors(test_state)
//       dummy_emitter.emit('initialized', test_state.sensorState.data[0].sensorAddress)
//       dummy_emitter.emit('initialized', test_state.sensorState.data[1].sensorAddress)
//       dummy_emitter.emit('initialized', "3")
//       dummy_emitter.emit('initialized', "4")
//       await initialize_function
//       sinon.assert.calledTwice(db_mock)
//       assert.typeOf(test_state.sensorState.data[0].sensorObject, 'object')
//       assert.typeOf(test_state.sensorState.data[1].sensorObject, 'object')
//       assert.typeOf(test_state.sensorState.data[2].sensorObject, 'object')
//       assert.typeOf(test_state.sensorState.data[3].sensorObject, 'object')
//     })
    
//     it('should add a generic hygrometer object', async function() {
//       let test_state = {        
//         sensorState: {
//           data:[
//             {
//               sensorType: "Humidity",
//               sensorModel: "Hygrometer",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 1,
//               sensorID: 1,
//               sensorObject: undefined
//             }
//           ]
//         }
//       }
//       sinon.stub(five, 'Hygrometer').returns({hygrometer: 1})
//       let initialize_function = SensorInitializer.initializeSensors(test_state)
//       await initialize_function
//       assert.typeOf(test_state.sensorState.data[0].sensorObject, 'object')
//     })
    
//     it('should add a generic thermometer object', async function() {
//       let test_state = {        
//         sensorState: {
//           data:[
//             {
//               sensorType: "Temperature",
//               sensorModel: "Thermometer",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 1,
//               sensorID: 1,
//               sensorObject: undefined
//             }
//           ]
//         }
//       }
//       sinon.stub(five, 'Thermometer').returns({thermometer: 1})
//       let initialize_function = SensorInitializer.initializeSensors(test_state)
//       await initialize_function
//       assert.typeOf(test_state.sensorState.data[0].sensorObject, 'object')
//     })

//     it('should add a generic barometer object', async function() {
//       let test_state = {        
//         sensorState: {
//           data:[
//             {
//               sensorType: "Pressure",
//               sensorModel: "Barometer",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 1,
//               sensorID: 1,
//               sensorObject: undefined
//             }
//           ]
//         }
//       }
//       sinon.stub(five, 'Barometer').returns({barometer: 1})
//       let initialize_function = SensorInitializer.initializeSensors(test_state)
//       await initialize_function
//       assert.typeOf(test_state.sensorState.data[0].sensorObject, 'object')
//     })

//     it('should fail on adding a sensor and reject', async function() {
//       let test_state = {        
//         sensorState: {
//           data:[
//             {
//               sensorType: "Temperature",
//               sensorModel: "Thermometer",
//               sensorPin: 1,
//               sensorAddress: null,
//               sensorHardwareID: 1,
//               sensorID: 1,
//               sensorObject: undefined
//             }
//           ]
//         }
//       }
//       sinon.stub(five, 'Thermometer').throws(new Error())
//       await SensorInitializer.initializeSensors(test_state).then(function() {
//         // Error on success
//         throw new Error("Error!")
//       }).catch(function() {
//         // Nothing otherwise
//       })      
//     })
//   })
// })