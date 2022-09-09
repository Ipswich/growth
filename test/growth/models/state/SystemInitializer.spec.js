// const chai = require('chai')
// const sinon = require('sinon')
// const assert = chai.assert;
// const five = require('johnny-five')
// const SensorInitializer = require('../../../../models/state/SensorInitializer')
// const Outputs = require('../../../../models/Outputs')
// const events = require('events')

// let ScheduleInitializer = require('../../../../models/state/ScheduleInitializer');

// let mappings
// let systemInitializer
// function resetModules() {
//   delete require.cache[require.resolve('../../../../models/state/Systeminitializer')];
//   delete require.cache[require.resolve('../../../../models/utility/mappings')];
//   mappings = require('../../../../models/utility/mappings');
//   systemInitializer = require('../../../../models/state/SystemInitializer');
// }

// describe('SystemInitializer.js tests', function() {
//   beforeEach(function() {
//     resetModules()
//   })
//   describe('initialize() tests', function() {
//     it('should add a board object, but no outputs or sensors', async function() {
//       let test_state = {
//         "outputState": {
//           "data": []    
//         },
//         "sensorState": {
//           "data": []
//         }
//       }

//       let board_dummy = new events.EventEmitter()
//       board_dummy.port = "Mock"
      
//       sinon.stub(five, "Board").returns(board_dummy)
//       sinon.stub(SensorInitializer, 'initializeSensors').resolves(undefined)
//       sinon.stub(Outputs, 'createInitialState').returns(undefined)
//       sinon.stub(ScheduleInitializer, 'initializeSchedule').returns()

//       let SI_promise = systemInitializer.initialize(test_state)
//       board_dummy.emit('initialized')
//       board_dummy.emit('ready')
//       await SI_promise

//       assert.equal(Object.keys(test_state).length, 3)
//       assert.equal(test_state.board.port, 'Mock')
//     })

//     it('should add a board object, and a relay control object', async function() {
//       let test_state = {
//         "outputState": {
//           "data": []    
//         },
//         "sensorState": {
//           "data": []
//         }
//       }

//       let board_dummy = new events.EventEmitter()
//       board_dummy.port = "Mock"
      
//       sinon.stub(five, "Board").returns(board_dummy)
//       sinon.stub(SensorInitializer, 'initializeSensors').resolves(undefined)
//       let relay_control_stub = sinon.stub()
//       let initializeOutputsStub = sinon.stub(OutputInitializer, 'initializeOutputs')
//       initializeOutputsStub.callsFake(function(state) { 
//         let relay_control = {high: relay_control_stub}                    
//         state.relay_control = relay_control
//         return undefined
//       })
//       sinon.stub(ScheduleInitializer, 'initializeSchedule').returns()

//       let SI_promise = systemInitializer.initialize(test_state)
//       board_dummy.emit('initialized')
//       board_dummy.emit('ready')
//       await SI_promise

//       assert.equal(Object.keys(test_state).length, 4)
//       assert.equal(test_state.board.port, 'Mock')
//     })
    
//     it('should add a board object and a PWM output', async function() {
//       let test_state = {
//         "outputState": {
//           "data": [{
//             outputPin: 2, 
//             outputObject: undefined, 
//             outputPWMPin: 3,
//             outputPWMObject: undefined
//           }]    
//         },
//         "sensorState": {
//           "data": []
//         }
//       }
//       let board_dummy = new events.EventEmitter()
//       board_dummy.port = "Mock"
//       sinon.stub(five, "Board").returns(board_dummy)
//       sinon.stub(SensorInitializer, 'initializeSensors').resolves()
//       sinon.stub(OutputInitializer, 'initializeOutputs').callsFake(function(state) {                     
//         state.outputState.data[0].outputObject = "output"
//         state.outputState.data[0].outputPWMObject = "PWM"
//         return undefined
//       })
//       sinon.stub(ScheduleInitializer, 'initializeSchedule').returns()

//       let SI_promise = systemInitializer.initialize(test_state)
//       board_dummy.emit('initialized')
//       board_dummy.emit('ready')
//       await SI_promise

//       assert.equal(Object.keys(test_state).length, 3)
//       assert.equal(test_state.board.port, 'Mock')
//       assert.deepEqual(test_state.outputState.data[0].outputObject, "output")
//       assert.deepEqual(test_state.outputState.data[0].outputPWMObject, "PWM")
//     })

//     it('should add a board object, and 1 thermometer', async function() {
//       let test_state = {
//         "outputState": {
//           "data": []    
//         },
//         "sensorState": {
//           "data": [{
//             sensorType: "Temperature",
//             sensorModel: "Thermometer",
//             sensorPin: 1,
//             sensorAddress: null,
//             sensorHardwareID: 1,
//             sensorID: 1,
//             sensorObject: undefined
//           }]
//         }
//       }
      
//       let board_dummy = new events.EventEmitter()
//       board_dummy.port = "Mock"
//       sinon.stub(five, "Board").returns(board_dummy)
//       sinon.stub(SensorInitializer, 'initializeSensors').callsFake(function(state) {
//         state.sensorState.data[0].sensorObject = "thermometer"
//         return undefined
//       })
//       sinon.stub(OutputInitializer, 'initializeOutputs').returns()
//       sinon.stub(ScheduleInitializer, 'initializeSchedule').returns()

//       let SI_promise = systemInitializer.initialize(test_state)
//       board_dummy.emit('initialized')
//       board_dummy.emit('ready')
//       await SI_promise
      
//       assert.equal(Object.keys(test_state).length, 3)
//       assert.equal(test_state.board.port, 'Mock')
//       assert.deepEqual(test_state.sensorState.data[0].sensorObject, "thermometer")
//     })

//     it('should reject with an error', async function() {
//       let test_state = {
//         "outputState": {
//           "data": []    
//         },
//         "sensorState": {
//           "data": []
//         }
//       }

//       let board_dummy = new events.EventEmitter()
//       board_dummy.port = "Mock"
      
//       sinon.stub(five, "Board").returns(board_dummy)
//       sinon.stub(SensorInitializer, 'initializeSensors').throws(new Error('Error!'))
//       try {
//         let SI_promise = systemInitializer.initialize(test_state)
//         board_dummy.emit('initialized')
//         board_dummy.emit('ready')
//         await SI_promise
//         assert.fail()
//       } catch (e) {
//         assert.typeOf(e, 'Error')
//       }
//     })
//   })
// })