const events = require('events')
const chai = require('chai')
const sinon = require('sinon')
const assert = chai.assert;
const five = require('johnny-five')
const OutputInitializer = require('../../../../models/state/OutputInitializer')

describe('OutputInitializer.js tests', function() {  
  describe('outputInitializer() tests', function() {
    it('should attach a relay control pin to state, update event listeners', function() {
      let dummy_board = new events.EventEmitter()
      let test_state = {
        "outputState": {
          "data": []    
        },
        "sensorState": {
          "data": []
        },
        "board": dummy_board
      }
      sinon.stub(five, 'Pin').returns({relay_control:1})
      let config = {
        relay_toggle_prevention: true,
        board_pinout: {OUTPUT_PINS : [4]}
      };
      OutputInitializer.initializeOutputs(test_state, config)
      assert.deepEqual(test_state.relay_control, {relay_control: 1})
      assert.equal(dummy_board.getMaxListeners(), 11)
    })

    it('should attach 3 outputs, 2 with PWM outputs with no relay control pin and update event listeners', function() {
      let dummy_board = new events.EventEmitter()
      let test_state = {
        "outputState": {
          "data": [{
            outputPin: 2, 
            outputObject: undefined, 
            outputPWMPin: 3,
            outputPWMObject: undefined
          }, {
            outputPin: 4,
            outputObject: undefined
          }, {
            outputPin: 5,
            outputObject: undefined,
            outputPWMPin: 6,
            outputPWMObject: undefined
          }]    
        },
        "sensorState": {
          "data": []
        },
        "board" : dummy_board
      }
      sinon.stub(five, 'Led').returns({
        PWM:1,
        off: function(){}
      })
      sinon.stub(five, 'Relay').returns({
        Output:1,
        open: function(){}
      })
      let config = {
        relay_toggle_prevention: false,
        board_pinout: {OUTPUT_PINS: [4]}
      };
      OutputInitializer.initializeOutputs(test_state, config)

      assert.typeOf(test_state.outputState.data[0].outputObject, 'object')
      assert.typeOf(test_state.outputState.data[0].outputPWMObject, 'object')
      assert.typeOf(test_state.outputState.data[1].outputObject, 'object')
      assert.typeOf(test_state.outputState.data[2].outputObject, 'object')
      assert.typeOf(test_state.outputState.data[2].outputPWMObject, 'object')
      assert.equal(dummy_board.getMaxListeners(), 16)
    })
    
    it('should run out of (output) pins and throw an error', function() {
      let dummy_board = new events.EventEmitter()
      let test_state = {
        "outputState": {
          "data": [{
            outputPin: 2,
            outputObject: undefined
          }]    
        },
        "sensorState": {
          "data": []
        },
         "board" : dummy_board
      }      

      let config = {
        relay_toggle_prevention: false,
        board_pinout: {OUTPUT_PINS : [4]}
      }
      sinon.stub(five, 'Relay').returns({
        Output:1,
        open: function(){throw new Error("Error!")}
      })
      assert.throws(function() {OutputInitializer.initializeOutputs(test_state, config)}, "Error!")
    })

    it('should run out of (PWM) pins and throw an error', () => {
      let dummy_board = new events.EventEmitter()
      let test_state = {
        "outputState": {
          "data": [{
            outputPin: 2, 
            outputObject: undefined, 
            outputPWMPin: 3,
            outputPWMObject: undefined
          }]    
        },
        "sensorState": {
          "data": []
        },
        "board" : dummy_board
      }
      let config = {
        relay_toggle_prevention: false,
        board_pinout: {OUTPUT_PINS : [4]}
      }
        
      sinon.stub(five, 'Relay').returns({
        Output:1,
        open: function(){}
      })
      sinon.stub(five, 'Led').returns({
        PWM:1,
        off: function(){throw new Error("Error!")}
      })
      assert.throws(function() {OutputInitializer.initializeOutputs(test_state, config)}, "Error!")
    })
  })
})