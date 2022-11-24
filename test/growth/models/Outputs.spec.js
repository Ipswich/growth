const events = require('events')
const five = require('johnny-five')
const sinon = require('sinon')
const { assert } = require('chai');
const Outputs = require('../../../models/Outputs')
const dbCalls = require('../../../models/utility/database_calls');

describe('Outputs.js tests', function(){
  describe('createInitialState() tests', function() {
    it('should return a dictionary of outputs', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').returns({open:function(){}})
      sinon.stub(five, 'Led').returns({off:function(){}})
      sinon.stub(five, 'Pin')
        .returns({low:function(){}})
        .returns({high:function(){}})
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [5, 6, 7, 8]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      let result = await Outputs.createInitialState(config, board)
      assert.isDefined(result['relayControlObject'])

      assert.isDefined(result['42'].outputObject)
      assert.equal(result['42'].outputPin, 1)
      assert.isDefined(result['7'].outputPWMObject)
      assert.equal(result['7'].outputPin, 3)
      assert.equal(result['7'].outputPWMPin, 5)
      assert.isDefined(result['12'].outputPWMObject)
      assert.equal(result['12'].outputPin, 4)
      assert.equal(result['12'].outputPWMPin, 8)
    })

    it('should throw an error (no output pins)', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').returns({open:function(){}})
      sinon.stub(five, 'Led').returns({off:function(){}})
      sinon.stub(five, 'Pin').returns({low:function(){}})
      let config = {
        board_pinout:{
          OUTPUT_PINS: [],
          PWM_PINS: [5, 6, 7, 8]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
    
    it('should throw an error (no PWM pins)', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').returns({open:function(){}})
      sinon.stub(five, 'Led').returns({off:function(){}})
      sinon.stub(five, 'Pin').returns({low:function(){}})
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: []
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
    
    it('should throw an error (database error)', async function() {      
      sinon.stub(dbCalls, 'getOutputs').throws()
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [1, 2, 3, 4]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error (Relay object creation)', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').throws()
      sinon.stub(five, 'Led').returns({off:function(){}})
      sinon.stub(five, 'Pin').returns({low:function(){}})
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [1, 2, 3, 4]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error (Led object creation)', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').returns({open:function(){}})
      sinon.stub(five, 'Led').throws()
      sinon.stub(five, 'Pin').returns({low:function(){}})
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [1, 2, 3, 4]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error (Pin object creation)', async function() {
      let getOutputsReturn = [
        {outputID: 42, outputPin: 1, outputPWM: false},
        {outputID: 7, outputPin: null, outputPWM: true, outputPWMPin: undefined},
        {outputID: 12, outputPin: null, outputPWM: true, outputPWMPin: 8}
      ]
      sinon.stub(dbCalls, 'getOutputs').returns(getOutputsReturn)
      sinon.stub(five, 'Relay').returns({open:function(){}})
      sinon.stub(five, 'Led').throws({off:function(){}})
      sinon.stub(five, 'Pin').throws()
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [1, 2, 3, 4]
        },
        relay_toggle_prevention: true
      }
      let board = new events.EventEmitter()
      try {
        await Outputs.createInitialState(config, board)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
    
  })

  describe('_assignPinnedOutputs() tests', function() {
    it('should return a modified object', function(){
      let mapperState = {
        outputs: [
          { outputPin: null, outputPWM: false },
          { outputPin: 1, outputPWM: true, outputPWMPin: 6 },
          { outputPin: 3, outputPWM: true, outputPWMPin: null }
        ],
        outputPins: [1, 2, 3, 4],
        pwmPins: [5, 6, 7, 8]
      }
      let expected = {
        outputs: [
          { outputPin: null, outputPWM: false },
          { outputPin: 1, outputPWM: true, outputPWMPin: 6 },
          { outputPin: 3, outputPWM: true, outputPWMPin: null }
        ],
        outputPins: [ 2, 4 ],
        pwmPins: [ 5, 7, 8 ]
      }
      assert.deepEqual(Outputs._assignPinnedOutputs(mapperState), expected)
    })

    it('should throw an error for non existent output pin', function() {
      let mapperState = {
        outputs: [
          { outputPin: 6, outputPWM: false }
        ],
        outputPins: [1, 2, 3, 4],
        pwmPins: [5, 6, 7, 8]
      }
      try {
        Outputs._assignPinnedOutputs(mapperState)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error for non existent PWM pin',  function() {
      let mapperState = {
        outputs: [
          { outputPin: 3, outputPWM: true, outputPWMPin: 2 }
        ],
        outputPins: [1, 2, 3, 4],
        pwmPins: [5, 6, 7, 8]
      }
      try {
        Outputs._assignPinnedOutputs(mapperState)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('_assignRelayTogglePreetnionPin() tests', function() {
    it('should give mapperState a relayTogglePreventionPin property', function() {
      let mapperState = {
        outputPins: [1, 2, 3, 4]
      }
      let actual = Outputs._assignRelayTogglePreventionPin(mapperState)
      assert.equal(actual.relayTogglePreventionPin, 1)
    })

    it('should throw an error for running out of output pins', function() {
      let mapperState = {
        outputPins: []
      }
      try {
        Outputs._assignRelayTogglePreventionPin(mapperState)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('_assignOutputPins() tests', function() {
    it('should return a modified mapperState object', function() {
      let mapperState = {
        outputs: [
          { outputPin: 3, outputPWM: false },
          { outputPin: null, outputPWM: true, outputPWMPin: 6 },
          { outputPin: undefined, outputPWM: true, outputPWMPin: null }
        ],
        outputPins: [1, 2, 4],
        pwmPins: [5, 7, 8]
      }
      let expected = {
        outputs: [
          { outputPin: 3, outputPWM: false },
          { outputPin: 1, outputPWM: true, outputPWMPin: 6 },
          { outputPin: 2, outputPWM: true, outputPWMPin: 5 }
        ],
        outputPins: [4],
        pwmPins: [7, 8]
      }
      assert.deepEqual(Outputs._assignOutputPins(mapperState), expected)
    })


    it('should throw an error for running out of output pins', function() {
      let mapperState = {
        outputs: [
          { outputPin: null, outputPWM: false }
        ],
        outputPins: [],
        pwmPins: [5, 6, 7, 8]
      }
      try {
        Outputs._assignOutputPins(mapperState)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error for running out of PWM pins',  function() {
      let mapperState = {
        outputs: [
          { outputPin: 3, outputPWM: true, outputPWMPin: null }
        ],
        outputPins: [1, 2, 3, 4],
        pwmPins: []
      }
      try {
        Outputs._assignOutputPins(mapperState)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('_mapPins() tests', function() {
    it('should return an object with mapped outputs, remaining output pins, and remaining PWM pins', async function(){
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: [5, 6, 7, 8]
        },
        relay_toggle_prevention: true
      }
      sinon.stub(dbCalls, 'getOutputs').returns([
        { outputPin: 3, outputPWM: false },
        { outputPin: null, outputPWM: true, outputPWMPin: 3 },
        { outputPin: 2, outputPWM: true, outputPWMPin: null },
      ])
      let expected = {
        outputs: [
          { outputPin: 3, outputPWM: false },
          { outputPin: 4, outputPWM: true, outputPWMPin: 3 },
          { outputPin: 2, outputPWM: true, outputPWMPin: 5 }
        ],
        outputPins: [],
        pwmPins: [ 6, 7, 8 ],
        relayTogglePreventionPin: 1
      }
      assert.deepEqual(await Outputs._mapPins(config), expected)
    })

    it('should throw an error for no output pins', async function() {
      let config = {
        board_pinout:{
          OUTPUT_PINS: [],
          PWM_PINS: [5, 6, 7, 8]
        },
        relay_toggle_prevention: true
      }
      sinon.stub(dbCalls, 'getOutputs').returns([
        { outputPin: 3, outputPWM: false },
        { outputPin: null, outputPWM: true, outputPWMPin: 3 },
        { outputPin: 2, outputPWM: true, outputPWMPin: null },
      ])
      try {
        await Outputs._mapPins(config)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

    it('should throw an error for no PWM pins', async function() {
      let config = {
        board_pinout:{
          OUTPUT_PINS: [1, 2, 3, 4],
          PWM_PINS: []
        },
        relay_toggle_prevention: true
      }
      sinon.stub(dbCalls, 'getOutputs').returns([
        { outputPin: 3, outputPWM: false },
        { outputPin: null, outputPWM: true, outputPWMPin: 3 },
        { outputPin: 2, outputPWM: true, outputPWMPin: null },
      ])
      try {
        await Outputs._mapPins(config)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe("_assignRelayTogglePReventionOutput() tests", function(){
    it ("should add a five object to mapperState", function(){
      let five_stub = sinon.stub(five, 'Pin').returns("AM OBJECT")
      let board = new events.EventEmitter()
      let expected = {relayTogglePreventionPin: true, relayControlObject: {}}
      let result = Outputs._assignRelayTogglePreventionOutput(board, {relayTogglePreventionPin: true})
      assert.deepEqual(result, expected)
    })

    it ("should not change mapperState", function(){
      let mapperState = {relayTogglePreventionPin: false}
      let result = Outputs._assignRelayTogglePreventionOutput({}, mapperState)
      assert.deepEqual(mapperState, result)
    })
  })

  describe("_maxListenerCheck() tests", function(){
    it('should return twice the number of outputs', function() {
      let mapperState = {
        outputs:[{}, {}, {}, {}]
      }
      assert.equal(Outputs._maxListenerCheck(mapperState), 8)
    })

    it('should return twice the number of outputs plus one', function() {
      let mapperState = {
        relayTogglePreventionPin: true,
        outputs:[{}, {}, {}, {}]
      }
      assert.equal(Outputs._maxListenerCheck(mapperState), 9)
    })

  })

  describe('_createOutputDictionary() tests', function() {
    it('should return a JSON object with outputID as the key', async function() {
      let mapperState = {
        outputs:[
          { outputID: 3, someData: 4},
          { outputID: 4, someData: 4},
          { outputID: 5, someData: 4}
        ]
      }
      let expected = {
        '3': { outputID: 3, someData: 4 },
        '4': { outputID: 4, someData: 4 },
        '5': { outputID: 5, someData: 4 }
      }
      assert.deepEqual(await Outputs._createOutputDictionary(mapperState), expected)
     })
  })

  describe('_createOutputFromPin() tests', function() {
    it('should return an object', function(){
      let expected = {open:function(){}}
      sinon.stub(five, 'Relay').returns(expected)
      assert.equal(Outputs._createOutputFromPin(new events.EventEmitter(), 1), expected)
    })

    it('should throw an error', function() {
      try {
        Outputs._createOutputFromPin(new events.EventEmitter(), 1)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('_createPWMFromPin() tests', function() {
    it('should return an object', function(){
      let expected = {off:function(){}}
      sinon.stub(five, 'Led').returns(expected)
      assert.equal(Outputs._createPWMFromPin(new events.EventEmitter(), 1), expected)
    })

    it('should throw an error', function() {
      try {
        Outputs._createPWMFromPin(new events.EventEmitter(), 1)
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })

  })
})