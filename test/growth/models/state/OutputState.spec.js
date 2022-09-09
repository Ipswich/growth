const chai = require('chai')
const sinon = require('sinon')
const assert = chai.assert;
const Mappings = require('../../../../models/utility/Mappings')
const OutputState = require('../../../../models/state/OutputState');


describe('OutputState.js tests', function() {
  let enabled_outputs_fixture = [
    {
      outputID: 1,
      outputTypeID: 1,
      outputName: 'QB Growlight 1',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 1,
      outputType: 'PWM Light',
      outputPWM: 1,
      outputPWMInversion: 1,
      OTenabled: 1,
      OUTPUT_PIN: 23,
      PWM_PIN: 2
    },
    {
      outputID: 2,
      outputTypeID: 1,
      outputName: 'QB Growlight 2',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 2,
      outputType: 'PWM Light',
      outputPWM: 1,
      outputPWMInversion: 1,
      OTenabled: 1,
      OUTPUT_PIN: 24,
      PWM_PIN: 3
    },
    {
      outputID: 3,
      outputTypeID: 1,
      outputName: '660nm Growlight',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 3,
      outputType: 'PWM Light',
      outputPWM: 1,
      outputPWMInversion: 1,
      OTenabled: 1,
      OUTPUT_PIN: 25,
      PWM_PIN: 4
    },
    {
      outputID: 4,
      outputTypeID: 8,
      outputName: 'Water Valve',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 0,
      outputType: 'Water Valve',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 26
    },
    {
      outputID: 5,
      outputTypeID: 7,
      outputName: 'Heater',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 4,
      outputType: 'Heat',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 27
    },
    {
      outputID: 6,
      outputTypeID: 5,
      outputName: 'Exhaust Fan',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 5,
      outputType: 'PWM Exhaust',
      outputPWM: 1,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 28,
      PWM_PIN: 5
    },
    {
      outputID: 7,
      outputTypeID: 3,
      outputName: 'Circulation Fan C1',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 6,
      outputType: 'Circulation',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 29
    },
    {
      outputID: 8,
      outputTypeID: 3,
      outputName: 'Circulation Fan W1',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 7,
      outputType: 'Circulation',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 30
    },
    {
      outputID: 9,
      outputTypeID: 2,
      outputName: 'UVC Lamp',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 0,
      outputType: 'Light',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 31
    },
    {
      outputID: 10,
      outputTypeID: 3,
      outputName: 'Circulation Fan W2',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 8,
      outputType: 'Circulation',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 32
    },
    {
      outputID: 11,
      outputTypeID: 3,
      outputName: 'Circulation Fan F1',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 9,
      outputType: 'Circulation',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 33
    },
    {
      outputID: 12,
      outputTypeID: 10,
      outputName: 'Air Pump',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 0,
      outputType: 'Air Pump',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 34
    },
    {
      outputID: 13,
      outputTypeID: 9,
      outputName: 'Water Pump',
      outputDescription: '',
      Oenabled: 1,
      outputOrder: 0,
      outputType: 'Water Pump',
      outputPWM: 0,
      outputPWMInversion: 0,
      OTenabled: 1,
      OUTPUT_PIN: 35
    }
  ]
  let expected_default = {
    data: [
      {
        outputID: 1,
        outputType: 'PWM Light',
        outputName: 'QB Growlight 1',
        outputDescription: '',
        outputOrder: 1,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 23,
        outputPWM: 1,
        outputPWMPin: 2,
        outputPWMInversion: 1,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 2,
        outputType: 'PWM Light',
        outputName: 'QB Growlight 2',
        outputDescription: '',
        outputOrder: 2,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 24,
        outputPWM: 1,
        outputPWMPin: 3,
        outputPWMInversion: 1,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 3,
        outputType: 'PWM Light',
        outputName: '660nm Growlight',
        outputDescription: '',
        outputOrder: 3,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 25,
        outputPWM: 1,
        outputPWMPin: 4,
        outputPWMInversion: 1,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 6,
        outputType: 'PWM Exhaust',
        outputName: 'Exhaust Fan',
        outputDescription: '',
        outputOrder: 5,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 28,
        outputPWM: 1,
        outputPWMPin: 5,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 7,
        outputType: 'Circulation',
        outputName: 'Circulation Fan C1',
        outputDescription: '',
        outputOrder: 6,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 29,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 8,
        outputType: 'Circulation',
        outputName: 'Circulation Fan W1',
        outputDescription: '',
        outputOrder: 7,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 30,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 10,
        outputType: 'Circulation',
        outputName: 'Circulation Fan W2',
        outputDescription: '',
        outputOrder: 8,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 32,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 11,
        outputType: 'Circulation',
        outputName: 'Circulation Fan F1',
        outputDescription: '',
        outputOrder: 9,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 33,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 4,
        outputType: 'Water Valve',
        outputName: 'Water Valve',
        outputDescription: '',
        outputOrder: 0,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 26,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 9,
        outputType: 'Light',
        outputName: 'UVC Lamp',
        outputDescription: '',
        outputOrder: 0,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 31,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 12,
        outputType: 'Air Pump',
        outputName: 'Air Pump',
        outputDescription: '',
        outputOrder: 0,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 34,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      },
      {
        outputID: 13,
        outputType: 'Water Pump',
        outputName: 'Water Pump',
        outputDescription: '',
        outputOrder: 0,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 35,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      }
    ]
  }
  let stub_mappings
  beforeEach(function() {
    stub_mappings = sinon.stub(Mappings, 'getOutputMappings').resolves(enabled_outputs_fixture)
  })
  afterEach(function() {
    stub_mappings.restore()
  })

  describe('OutputState() tests', function() {
    it('should create an outputState object referencing the database', async function() {
      let actual = await new OutputState()
      assert.deepEqual(actual.data, expected_default.data)
    })

    it('should throw an error on creation', async function() {
      stub_mappings.throws(new Error('Error!'))
      try {
        await new OutputState()
        assert.fail()
      } catch (e) {
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('getOutputIndexData() tests', function() {
    it('should get the data needed to render the outputs on webpages', async function() {
      let outputState =  await new OutputState()
      let expected = [
        {
          outputID: 1,
          outputType: 'PWM Light',
          outputName: 'QB Growlight 1',
          outputDescription: '',
          outputPWM: 1,
          outputPWMInversion: 1,
          outputOrder: 1
        },
        {
          outputID: 2,
          outputType: 'PWM Light',
          outputName: 'QB Growlight 2',
          outputDescription: '',          outputPWM: 1,
          outputPWMInversion: 1,
          outputOrder: 2
        },
        {
          outputID: 3,
          outputType: 'PWM Light',
          outputName: '660nm Growlight',
          outputDescription: '',
          outputPWM: 1,
          outputPWMInversion: 1,
          outputOrder: 3
        },
        {
          outputID: 5,
          outputType: 'Heat',
          outputName: 'Heater',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 4
        },
        {
          outputID: 6,
          outputType: 'PWM Exhaust',
          outputName: 'Exhaust Fan',
          outputDescription: '',
          outputPWM: 1,
          outputPWMInversion: 0,
          outputOrder: 5
        },
        {
          outputID: 7,
          outputType: 'Circulation',
          outputName: 'Circulation Fan C1',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 6
        },
        {
          outputID: 8,
          outputType: 'Circulation',
          outputName: 'Circulation Fan W1',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 7
        },
        {
          outputID: 10,
          outputType: 'Circulation',
          outputName: 'Circulation Fan W2',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 8
        },
        {
          outputID: 11,
          outputType: 'Circulation',
          outputName: 'Circulation Fan F1',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 9
        },
        {
          outputID: 4,
          outputType: 'Water Valve',
          outputName: 'Water Valve',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 0
        },
        {
          outputID: 9,
          outputType: 'Light',
          outputName: 'UVC Lamp',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 0
        },
        {
          outputID: 12,
          outputType: 'Air Pump',
          outputName: 'Air Pump',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 0
        },
        {
          outputID: 13,
          outputType: 'Water Pump',
          outputName: 'Water Pump',
          outputDescription: '',
          outputPWM: 0,
          outputPWMInversion: 0,
          outputOrder: 0
        }
      ]
      assert.deepEqual(outputState.getOutputIndexData(), expected)
    })
  })
  
  describe('setOutputScheduleState() tests', function() {
    it('should update the output schedule state to the passed values', async function() {
      let outputState =  await new OutputState()
      let expected = {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output On',
        scheduleOutputValue: 33,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      }
      outputState.setOutputScheduleState(5, 'Output On', 33)
      assert.deepEqual(outputState.data[3], expected)
    })
    it('should do nothing on non existent outputID', async function() {
      let outputState =  await new OutputState()
      outputState.setOutputScheduleState(-1, 'Output On', 33)
      assert.deepEqual(outputState, expected_default)
    })
  })

  describe('setOutputManualState() tests', function() {
    it('should update the output schedule state to the passed values', async function() {
      let outputState =  await new OutputState()
      let expected = {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output On',
        manualOutputValue: 33,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      }
      outputState.setOutputManualState(5, 'Output On', 33)
      assert.deepEqual(outputState.data[3], expected)
    })
    it('should do nothing on non existent outputID', async function() {
      let outputState =  await new OutputState()
      outputState.setOutputManualState(-1, 'Output On', 33)
      assert.deepEqual(outputState, expected_default)
    })
  })

  describe('getOutputState() tests', function() {
    it('should return the data object', async function() {
      let outputState =  await new OutputState()
      assert.deepEqual(outputState.getOutputState(), expected_default.data)
    })
  })

  describe('setOutputController() tests', function() {
    it('should update the output controller to the passed value', async function() {
      let outputState =  await new OutputState()
      let expected = {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Manual',
        lastOutputController: 'Schedule'
      }
      outputState.setOutputController(5, 'Manual')
      assert.deepEqual(outputState.data[3], expected)
    })
    it('should do nothing on non existent outputID', async function() {
      let outputState =  await new OutputState()      
      outputState.setOutputController(-1, 'Manual')
      assert.deepEqual(outputState, expected_default)
    })
  })

  describe('getOutputController() tests', function() {
    it('should get the current output controller for the passed outputID', async function() {
      let outputState =  await new OutputState()
      let expected = 'Schedule'
      assert.equal(outputState.getOutputController(3), expected)
    })
    it('should return undefined on non existent outputID', async function() {
      let outputState =  await new OutputState()
      assert.isUndefined(outputState.getOutputController(-1))
    })
  })

  describe('setLastOutputController() tests', function() {
    it('should set the last output controller', async function() {
      let outputState =  await new OutputState()
      let expected = {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Manual'
      }
      outputState.setLastOutputController(5, 'Manual')
      assert.deepEqual(outputState.data[3], expected)
    })
    it('should return undefined on non existent OutputID', async function() {
      let outputState =  await new OutputState()
      outputState.setLastOutputController(-1, 'Manual')
      assert.deepEqual(outputState, expected_default)
    })
  })

  describe('getOutputName() tests', function() {
    it('should get the output name', async function() {
      let outputState =  await new OutputState()
      assert.equal(outputState.getOutputName(5), 'Heater')
    })
    it('should return undefined on non existent OutputID', async function() {
      let outputState =  await new OutputState()
      assert.isUndefined(outputState.getOutputName(-1))
    })
  })

  describe('getOutput() tests', function() {
    it('should get the data associated with the passed outputID', async function() {
      let outputState =  await new OutputState()
      let expected = {
        outputID: 5,
        outputType: 'Heat',
        outputName: 'Heater',
        outputDescription: '',
        outputOrder: 4,
        scheduleState: 'Output Off',
        scheduleOutputValue: 0,
        manualState: 'Output Off',
        manualOutputValue: 0,
        outputPin: 27,
        outputPWM: 0,
        outputPWMPin: null,
        outputPWMInversion: 0,
        outputObject: null,
        outputPWMObject: null,
        outputController: 'Schedule',
        lastOutputController: 'Schedule'
      }
      assert.deepEqual(outputState.getOutput(5), expected)
    })
    it('should return undefined on non existent OutputID', async function() {
      let outputState = await new OutputState()
      assert.isUndefined(outputState.getOutput(-1))
    })
  })
  
  describe('sortAscending() tests', function() {
    it('should sort the array of outputs in ascending fashion, with 0 at the end', function() {
      let unsorted_array = [
        {outputOrder : 3},
        {outputOrder : 7}, 
        {outputOrder : 4}, 
        {outputOrder : 8}, 
        {outputOrder : 2}, 
        {outputOrder : 0}, 
        {outputOrder : 1}, 
        {outputOrder : 0}
      ]
      expected = [
        { outputOrder: 1 },
        { outputOrder: 2 },
        { outputOrder: 3 },
        { outputOrder: 4 },
        { outputOrder: 7 },
        { outputOrder: 8 },
        { outputOrder: 0 },
        { outputOrder: 0 }
      ]
      unsorted_array.sort(OutputState.sortAscending)
      assert.deepEqual(unsorted_array, expected)
    })
  })
})