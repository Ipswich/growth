const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;

const utils = require('../../../../models/utility/utils');
const printouts = require('../../../../models/utility/printouts');

const EventHandler = require('../../../../models/events/EventHandlerUtils');


describe("EventHandlerUtils.js tests", function() {
  let config;
  this.beforeAll(function() {
    config = {
      board_pinout: {
        MAX_PWM : 255
      },
      nodemailer: {
        "service": "null",
        "auth": {
          "user": "null",
          "pass": "null"
        },
        script_directory: 'test'
      },
      web_data : {title : "test"}
    };
  })

  // describe('triggerEvent tests', function() {
  //   let dummy_state = {
  //     outputState:{
  //       getOutputState: sinon.stub().returns([
  //         {
  //           output: {
  //             outputID: 1,
  //             outputPin: 1,
  //             outputPWMPin: 1 
  //           }
  //         }
  //       ])
  //     }
  //   }

  //   describe('manual tests', function() {
  //     it('should call disableSchedule and _outputOn', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Manual",
  //         scheduleID: 1,
  //         eventID: 'Output On',
  //         outputValue: 30,
  //       }
  //       let stub_disableSchedules = sinon.stub(dbcalls, 'disableSchedule').resolves();              
  //       let stub_filterOn = sinon.stub(eventTriggers, 'filterOn')
  //       stub_filterOn.returns(true)
  //       let stub_outputOn = sinon.stub(eventTriggers, '_outputOn')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)

  //       sinon.assert.calledOnce(stub_disableSchedules)
  //       sinon.assert.calledOnce(stub_filterOn)
  //       sinon.assert.calledOnce(stub_outputOn)
  //     })

  //     it('should call disableSchedule and _outputOff', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Manual",
  //         scheduleID: 1,
  //         eventID: 'Output Off'
  //       }

  //       let stub_disableSchedules = sinon.stub(dbcalls, 'disableSchedule').resolves();              
  //       let stub_filterOff = sinon.stub(eventTriggers, 'filterOff')
  //       stub_filterOff.returns(true)
  //       let stub_outputOff = sinon.stub(eventTriggers, '_outputOff')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state, null, 30)

  //       sinon.assert.calledOnce(stub_disableSchedules)
  //       sinon.assert.calledOnce(stub_filterOff)
  //       sinon.assert.calledOnce(stub_outputOff)
  //     })

  //     it('should call disableSchedule and _emailWarn', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Manual",
  //         scheduleID: 1,
  //         eventID: 'Email Warn'
  //       }
  //       let stub_disableSchedules = sinon.stub(dbcalls, 'disableSchedule').resolves();
  //       let stub_emailWarn = sinon.stub(eventTriggers, '_emailWarn')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)

  //       sinon.assert.calledOnce(stub_disableSchedules)
  //       sinon.assert.calledOnce(stub_emailWarn)
  //     })

  //     it('should call disableSchedule and spawn a python process', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Manual",
  //         scheduleID: 1,
  //         eventID: 'Python Script',
  //         parameter1: 'test.txt'
  //       }
  //       let stub_spawn = sinon.stub(child_process, 'spawn')
  //       let stub_disableSchedules = sinon.stub(dbcalls, 'disableSchedule').resolves();
  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)
  //       sinon.assert.calledOnce(stub_disableSchedules)
  //       sinon.assert.calledOnce(stub_spawn)
  //     })
  //   })

  //   describe('not manual tests', function() {
  //     it('should call _outputOn', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Schedule",
  //         scheduleID: 1,
  //         eventID: 'Output On',
  //         outputValue: 30,
  //       }
  //       let stub_filterOn = sinon.stub(eventTriggers, 'filterOn')
  //       stub_filterOn.returns(true)
  //       let stub_outputOn = sinon.stub(eventTriggers, '_outputOn')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)

  //       sinon.assert.calledOnce(stub_filterOn)
  //       sinon.assert.calledOnce(stub_outputOn)
  //     })

  //     it('should call _outputOff', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Schedule",
  //         scheduleID: 1,
  //         eventID: 'Output Off'
  //       }

  //       let stub_filterOff = sinon.stub(eventTriggers, 'filterOff')
  //       stub_filterOff.returns(true)
  //       let stub_outputOff = sinon.stub(eventTriggers, '_outputOff')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state, null, 30)

  //       sinon.assert.calledOnce(stub_filterOff)
  //       sinon.assert.calledOnce(stub_outputOff)
  //     })

  //     it('should call _emailWarn', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Schedule",
  //         scheduleID: 1,
  //         eventID: 'Email Warn'
  //       }
  //       let stub_emailWarn = sinon.stub(eventTriggers, '_emailWarn')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)
  //       sinon.assert.calledOnce(stub_emailWarn)
  //     })

  //     it('should spawn a python process', async function() {
  //       let dummy_schedule = {
  //         scheduleType: "Schedule",
  //         scheduleID: 1,
  //         eventID: 'Python Script',
  //         parameter1: 'test.txt'
  //       }
  //       let stub_spawn = sinon.stub(child_process, 'spawn')

  //       await eventTriggers.triggerEvent(dummy_schedule, dummy_state)
  //       sinon.assert.calledOnce(stub_spawn)
  //     })
  //   })
  // })

  describe("outputOn() tests", function() {
    let stub_close = sinon.stub()
    let stub_brightness = sinon.stub()
    let stub_setOutputManualState = sinon.stub()
    let stub_setOutputScheduleState = sinon.stub()
    afterEach(function() {
      stub_close.resetHistory()
      stub_brightness.resetHistory()
      stub_setOutputManualState.resetHistory()
      stub_setOutputScheduleState.resetHistory()
    })
    let dummy_state = {
      outputState: {
        setOutputManualState: stub_setOutputManualState,
        setOutputScheduleState: stub_setOutputScheduleState
      }
    }

    it('should call close() and update manual state', function() {
      let dummy_output = {
        outputID: 1,
        outputName: 'test',
        outputController: 'test',
        outputPWMPin: 1,
        outputPWMInversion: 0,
        outputPWMObject: null,
        outputPin: 1,
        outputObject: {
          close: stub_close
        }
      }
      EventHandler.outputOn(config, dummy_state, dummy_output, 30, 'Manual')
      sinon.assert.calledOnce(stub_close)
      sinon.assert.calledOnce(stub_setOutputManualState)
    })

    it('should call brightness(), close() and update schedule state (standard PWM)', function() {
      let dummy_output = {
        outputID: 1,
        outputName: 'test',
        outputController: 'test',
        outputPWMPin: 1,
        outputPWMInversion: 0,
        outputPWMObject: {brightness: stub_brightness},
        outputPin: 1,
        outputObject: {
          close: stub_close
        }
      }
      EventHandler.outputOn(config, dummy_state, dummy_output, 30, '')
      sinon.assert.calledOnce(stub_brightness)
      sinon.assert.calledWith(stub_brightness, Math.round(30 * (config.board_pinout.MAX_PWM/100)))
      sinon.assert.calledOnce(stub_close)
      sinon.assert.calledOnce(stub_setOutputScheduleState)
    })

    it('should call brightness(), close() and update schedule state (inverted PWM)', function() {
      let dummy_output = {
        outputID: 1,
        outputName: 'test',
        outputController: 'test',
        outputPWMPin: 1,
        outputPWMInversion: 1,
        outputPWMObject: {brightness: stub_brightness},
        outputPin: 1,
        outputObject: {
          close: stub_close
        }
      }
      EventHandler.outputOn(config, dummy_state, dummy_output, 30, '')
      sinon.assert.calledWith(stub_brightness, config.board_pinout.MAX_PWM - Math.round(30 * (config.board_pinout.MAX_PWM/100)))
      sinon.assert.calledOnce(stub_brightness)
      sinon.assert.calledOnce(stub_close)
      sinon.assert.calledOnce(stub_setOutputScheduleState)
    })
  })

  describe("_outputOff() tests", function() {
    let stub_open = sinon.stub()
    let stub_setOutputManualState = sinon.stub()
    let stub_setOutputScheduleState = sinon.stub()
    afterEach(function() {
      stub_open.resetHistory()
      stub_setOutputManualState.resetHistory()
      stub_setOutputScheduleState.resetHistory()
    })
    let dummy_state = {
      outputState: {
        setOutputManualState: stub_setOutputManualState,
        setOutputScheduleState: stub_setOutputScheduleState
      }
    }

    it('should call close() and update manual state', function() {
      let dummy_output = {
        outputID: 1,
        outputName: 'test',
        outputController: 'test',
        outputPin: 1,
        outputObject: {
          open: stub_open
        }
      }
      EventHandler.outputOff(dummy_state, dummy_output, 30, 'Manual')
      sinon.assert.calledOnce(stub_open)
      sinon.assert.calledOnce(stub_setOutputManualState)
    })

    it('should call close() and update schedule state', function() {
      let dummy_output = {
        outputID: 1,
        outputName: 'test',
        outputController: 'test',
        outputPin: 1,
        outputObject: {
          open: stub_open
        }
      }
      EventHandler.outputOff(dummy_state, dummy_output, 30, '')
      sinon.assert.calledOnce(stub_open)
      sinon.assert.calledOnce(stub_setOutputScheduleState)
    })
  })

  // describe("_emailWarn() tests", function() {
  //   let dummy_state = {
  //     warnState: true,    
  //   }

  //   it('should send an email (Time)', async function() {
  //     let stub_createTransport = sinon.stub(nodemailer, 'createTransport')
  //     let stub_sendMail = sinon.stub().resolves(null)
  //     stub_createTransport.returns({sendMail: stub_sendMail})
  //     let dummy_schedule = {
  //       email: "test",
  //       scheduleType: 'Time'
  //     }

  //     let ret_val = await eventTriggers._emailWarn(dummy_schedule, dummy_state)
  //     sinon.assert.calledOnce(stub_sendMail)
  //     assert.isTrue(ret_val)
  //   })

  //   it('should send an email (Sensor)', async function() {
  //     let stub_createTransport = sinon.stub(nodemailer, 'createTransport')
  //     let stub_sendMail = sinon.stub().resolves(null)
  //     stub_createTransport.returns({sendMail: stub_sendMail})
  //     let dummy_schedule = {
  //       email: "test",
  //       scheduleType: 'Sensor'
  //     }

  //     let ret_val = await eventTriggers._emailWarn(dummy_schedule, dummy_state)
  //     sinon.assert.calledOnce(stub_sendMail)
  //     assert.isTrue(ret_val)
  //   })

  //   it('should error on sending an email (Time)', async function() {
  //     let stub_createTransport = sinon.stub(nodemailer, 'createTransport')
  //     let stub_sendMail = sinon.stub().rejects("error")
  //     stub_createTransport.returns({sendMail: stub_sendMail})
  //     let dummy_schedule = {
  //       email: "test",
  //       scheduleType: 'Time'
  //     }

  //     let ret_val = await eventTriggers._emailWarn(dummy_schedule, dummy_state)
  //     sinon.assert.calledOnce(stub_sendMail)
  //     assert.isFalse(ret_val)
  //   })

  //   it('should error on sending an email (Sensor)', async function() {
  //     let stub_createTransport = sinon.stub(nodemailer, 'createTransport')
  //     let stub_sendMail = sinon.stub().rejects("error")
  //     stub_createTransport.returns({sendMail: stub_sendMail})
  //     let dummy_schedule = {
  //       email: "test",
  //       scheduleType: 'Sensor'
  //     }

  //     let ret_val = await eventTriggers._emailWarn(dummy_schedule, dummy_state)
  //     sinon.assert.calledOnce(stub_sendMail)
  //     assert.isFalse(ret_val)
  //   })
  // })

  // describe("_runPythonResult() tests", function() {
  //   let dummy_output = {}
  //   let dummy_schedule = {}
  //   let dummy_state = {}

  //   let dummy_filename = 'test'

  //   it('should return false (error reading file)', async function() {
  //     let fs_stub = sinon.stub(fs, 'readFile')
  //     fs_stub.yields("ERROR", null)

  //     let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
  //     assert.isFalse(result)
  //   })

  //   it('should return false (output value improperly defined)', async function() {
  //     let fs_stub = sinon.stub(fs, 'readFile')
  //     let dummy_data = '{"output": 3}'
  //     fs_stub.yields(null, dummy_data)

  //     let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
  //     assert.isFalse(result)
  //   })

  //   it('should return false (output PWM improperly defined)', async function() {
  //     let fs_stub = sinon.stub(fs, 'readFile')
  //     let dummy_data = '{"output": 1, "outputPWM": -1}'
  //     fs_stub.yields(null, dummy_data)

  //     let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
  //     assert.isFalse(result)
  //   })

  //   it('should call _outputOn() and return true', async function() {
  //     let stub_filterOn = sinon.stub(eventTriggers, 'filterOn').returns(true)
  //     let stub_outputOn = sinon.stub(eventTriggers, '_outputOn')
  //     let stub_fs = sinon.stub(fs, 'readFile')
  //     let dummy_data = '{"output": 1, "outputPWM": 30}'
  //     stub_fs.yields(null, dummy_data)

  //     let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
  //     sinon.assert.calledOnce(stub_filterOn)
  //     sinon.assert.calledOnce(stub_outputOn)
  //     assert.isTrue(result)
  //   })

  //   it('should call _outputOff() and return true', async function() {
  //     let stub_filterOff = sinon.stub(eventTriggers, 'filterOff').returns(true)
  //     let stub_outputOff = sinon.stub(eventTriggers, '_outputOff')
  //     let stub_fs = sinon.stub(fs, 'readFile')
  //     let dummy_data = '{"output": 0}'
  //     stub_fs.yields(null, dummy_data)

  //     let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
  //     sinon.assert.calledOnce(stub_filterOff)
  //     sinon.assert.calledOnce(stub_outputOff)
  //     assert.isTrue(result)
  //   })

  // })

  describe("turnOffOutput() tests", function() {
    let set_stub = sinon.stub()
    let dummy_state = {
      outputState :{setOutputScheduleState: set_stub}
    }
    let open_stub = sinon.stub()
    let dummy_output = {
      scheduleState: '',
      outputObject: {open: open_stub}
    }

    it('should call open() on the passed object', function() {
      set_stub.resetHistory()
      open_stub.resetHistory()
      EventHandler.turnOffOutput(dummy_state, dummy_output)      
      sinon.assert.calledOnce(set_stub)
      sinon.assert.calledOnce(open_stub)
    })

    it('should return early, not calling open()', function() {
      set_stub.resetHistory()
      open_stub.resetHistory()
      dummy_output.scheduleState = 'Output Off'
      
      EventHandler.turnOffOutput(dummy_state, dummy_output)

      sinon.assert.notCalled(set_stub)
      sinon.assert.notCalled(open_stub)
    })
  })

  /*
  describe("_runPythonResult() tests", function() {
    let dummy_output = {}
    let dummy_schedule = {}
    let dummy_state = {}

    let dummy_filename = 'test'

    it('should return false (error reading file)', async function() {
      let fs_stub = sinon.stub(fs, 'readFile')
      fs_stub.yields("ERROR", null)

      let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
      assert.isFalse(result)
    })

    it('should return false (output value improperly defined)', async function() {
      let fs_stub = sinon.stub(fs, 'readFile')
      let dummy_data = '{"output": 3}'
      fs_stub.yields(null, dummy_data)

      let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
      assert.isFalse(result)
    })

    it('should return false (output PWM improperly defined)', async function() {
      let fs_stub = sinon.stub(fs, 'readFile')
      let dummy_data = '{"output": 1, "outputPWM": -1}'
      fs_stub.yields(null, dummy_data)

      let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
      assert.isFalse(result)
    })

    it('should call _outputOn() and return true', async function() {
      let stub_filterOn = sinon.stub(eventTriggers, 'filterOn').returns(true)
      let stub_outputOn = sinon.stub(eventTriggers, '_outputOn')
      let stub_fs = sinon.stub(fs, 'readFile')
      let dummy_data = '{"output": 1, "outputPWM": 30}'
      stub_fs.yields(null, dummy_data)

      let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
      sinon.assert.calledOnce(stub_filterOn)
      sinon.assert.calledOnce(stub_outputOn)
      assert.isTrue(result)
    })

    it('should call _outputOff() and return true', async function() {
      let stub_filterOff = sinon.stub(eventTriggers, 'filterOff').returns(true)
      let stub_outputOff = sinon.stub(eventTriggers, '_outputOff')
      let stub_fs = sinon.stub(fs, 'readFile')
      let dummy_data = '{"output": 0}'
      stub_fs.yields(null, dummy_data)

      let result = await eventTriggers._runPythonResult(dummy_output, dummy_schedule, dummy_state, dummy_filename)
      sinon.assert.calledOnce(stub_filterOff)
      sinon.assert.calledOnce(stub_outputOff)
      assert.isTrue(result)
    })
  })
 */

  // describe("resumeSchedule() tests", function() {
  //   let stub_setLastOutputController = sinon.stub()
  //   let stub_brightness = sinon.stub()
  //   let stub_close = sinon.stub()
  //   let stub_open = sinon.stub()

  //   it('should return false (Output On, no state change)', function() {
  //     let dummy_state = {
  //       outputName: null,
  //       outputController: null,
  //       outputPin: null,
  //       outputPWMPin: null,
  //       manualState: 'Output On',
  //       scheduleState: 'Output On',
  //       manualOutputValue: 1,
  //       scheduleOutputValue: 1,
  //       outputPWMInversion: null,
  //       outputPWMObject: {brightness: stub_brightness},
  //       outputObject: {close: stub_close, open: stub_open}
  //     }
  //     let stub_getOutputState = sinon.stub().returns(dummy_state)      
  //     let dummy_outputState = {
  //       getOutput: stub_getOutputState,
  //       setLastOutputController: stub_setLastOutputController
  //     }

  //     let result = eventTriggers.resumeSchedule(dummy_outputState, 0)
  //     assert.isFalse(result)
  //     sinon.assert.notCalled(stub_close)
  //   })

  //   it('should return false (not Output On, no state change)', function() {
  //     let dummy_state = {
  //       outputName: null,
  //       outputController: null,
  //       outputPin: null,
  //       outputPWMPin: null,
  //       manualState: 'Output Off',
  //       scheduleState: 'Output Off',
  //       manualOutputValue: 1,
  //       scheduleOutputValue: 1,
  //       outputPWMInversion: null,
  //       outputPWMObject: {brightness: stub_brightness},
  //       outputObject: {close: stub_close, open: stub_open}
  //     }
  //     let stub_getOutputState = sinon.stub().returns(dummy_state)      
  //     let dummy_outputState = {
  //       getOutput: stub_getOutputState,
  //       setLastOutputController: stub_setLastOutputController
  //     }

  //     let result = eventTriggers.resumeSchedule(dummy_outputState, 0)
  //     assert.isFalse(result)
  //     sinon.assert.notCalled(stub_open)
  //   })

  //   it('should return true (Output On)', function() {
  //     let dummy_state = {
  //       outputName: null,
  //       outputController: null,
  //       outputPin: null,
  //       outputPWMPin: null,
  //       manualState: 'Output Off',
  //       scheduleState: 'Output On',
  //       manualOutputValue: 1,
  //       scheduleOutputValue: 1,
  //       outputPWMInversion: null,
  //       outputPWMObject: {brightness: stub_brightness},
  //       outputObject: {close: stub_close, open: stub_open}
  //     }
  //     let stub_getOutputState = sinon.stub().returns(dummy_state)      
  //     let dummy_outputState = {
  //       getOutput: stub_getOutputState,
  //       setLastOutputController: stub_setLastOutputController
  //     }

  //     let result = eventTriggers.resumeSchedule(dummy_outputState, 0)
  //     assert.isTrue(result)
  //     sinon.assert.calledOnce(stub_brightness)
  //     sinon.assert.calledOnce(stub_close)
  //   })

  //   it('should return true (not Output On)', function() {
  //     let dummy_state = {
  //       outputName: null,
  //       outputController: null,
  //       outputPin: null,
  //       outputPWMPin: null,
  //       manualState: 'Output On',
  //       scheduleState: 'Output Off',
  //       manualOutputValue: 1,
  //       scheduleOutputValue: 1,
  //       outputPWMInversion: null,
  //       outputPWMObject: {brightness: stub_brightness},
  //       outputObject: {close: stub_close, open: stub_open}
  //     }
  //     let stub_getOutputState = sinon.stub().returns(dummy_state)      
  //     let dummy_outputState = {
  //       getOutput: stub_getOutputState,
  //       setLastOutputController: stub_setLastOutputController
  //     }

  //     let result = eventTriggers.resumeSchedule(dummy_outputState, 0)
  //     assert.isTrue(result)
  //     sinon.assert.calledOnce(stub_open)
  //   })
    
    

  // })

  describe('filterOn() tests', function() {
    let setOutputScheduleState_stub = sinon.stub()
    let setOutputManualState_stub = sinon.stub()
    let setLastOutputController_stub = sinon.stub()

    afterEach(function() {
      setOutputScheduleState_stub.resetHistory()
      setOutputManualState_stub.resetHistory()
      setLastOutputController_stub.resetHistory()
    })

    let dummy_state = {
      outputState: {
        setOutputScheduleState: setOutputScheduleState_stub,
        setOutputManualState: setOutputManualState_stub,
        setLastOutputController: setLastOutputController_stub
      }
    }
    describe('manual controller tests', function() {
      it('should return false and update schedule state(schedule instruction)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: true,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 0, ""))
        sinon.assert.calledOnce(setOutputScheduleState_stub)
      })

      it('should return false and update manual state (manual instruction, schedule last state, no change in output/PWM)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: true,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, "Manual"))
        sinon.assert.calledOnce(setOutputManualState_stub)
      })

      it('should return false and update manual state (manual instruction, schedule last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: false,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, "Manual"))
        sinon.assert.calledOnce(setOutputManualState_stub)
      })

      it('should return false (manual instruction, manual last state, no change in output/PWM', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Manual",
          manualState: "Output On",
          outputPWMObject: true,
          manualOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, "Manual"))
      })

      it('should return false (manual instruction, manual last state, no change in output', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Manual",
          manualState: "Output On",
          outputPWMObject: false,
          manualOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, "Manual"))
      })
    })

    describe('not manual controller tests', function() {
      it('should return false and update manual state(schedule instruction)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: true,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, "Manual"))
        sinon.assert.calledOnce(setOutputManualState_stub)
      })

      it('should return false (schedule instruction, schedule last state, no change in output/PWM)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: true,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, ""))
      })

      it('should return false (schedule instruction, schedule last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Schedule",
          scheduleState: "Output On",
          outputPWMObject: false,
          scheduleOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, ""))
      })

      it('should return false and update schedule state (schedule instruction, manual last state, no change in output/PWM)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Manual",
          manualState: "Output On",
          outputPWMObject: true,
          manualOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, ""))
        sinon.assert.calledOnce(setOutputScheduleState_stub)
      })

      it('should return false and update schedule state (schedule instruction, manual last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Manual",
          manualState: "Output On",
          outputPWMObject: false,
          manualOutputValue: 1
        }
        assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, ""))
        sinon.assert.calledOnce(setOutputScheduleState_stub)
      })
    })

    it('should return true', function() {
      let dummy_output = {
        outputID: 1,
        outputName: "test",
        outputController: "Schedule",
        lastOutputController: "Manual",
        manualState: "Output On",
        outputPWMObject: false,
        manualOutputValue: 0
      }
      assert.isFalse(EventHandler.filterOn(dummy_state, dummy_output, 1, ""))
      sinon.assert.calledOnce(setOutputScheduleState_stub)
    })
  })

  describe('filterOff() tests', function() {
    let setOutputScheduleState_stub = sinon.stub()
    let setOutputManualState_stub = sinon.stub()
    let setLastOutputController_stub = sinon.stub()

    afterEach(function() {
      setOutputScheduleState_stub.resetHistory()
      setOutputManualState_stub.resetHistory()
      setLastOutputController_stub.resetHistory()
    })

    let dummy_state = {
      outputState: {
        setOutputScheduleState: setOutputScheduleState_stub,
        setOutputManualState: setOutputManualState_stub,
        setLastOutputController: setLastOutputController_stub
      }
    }

    describe('manual controller tests', function() {
      it('should return false update schedule state (schedule instruction)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Schedule",
          scheduleState: "Output Off"
        }
        assert.isFalse(EventHandler.filterOff(dummy_state, dummy_output, ''))
        sinon.assert.calledOnce(setOutputScheduleState_stub)
      })

      it('should return false and update manual state (manual instruction, schedule last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Schedule",
          scheduleState: "Output Off"
        }
        assert.isFalse(EventHandler.filterOff(dummy_state, dummy_output, 'Manual'))
        sinon.assert.calledOnce(setOutputManualState_stub)
      })

      it('should return false (manual instruction, manual last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Manual",
          lastOutputController: "Manual",
          manualState: "Output Off"
        }
        assert.isFalse(EventHandler.filterOff(dummy_state, dummy_output, 'Manual'))
      })
    })

    describe('not manual controller tests', function() {
      it('should return false (manual instruction)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Manual",
          manualState: "Output Off"
        }
        assert.isFalse(EventHandler.filterOff(dummy_state, dummy_output, 'Manual'))
        sinon.assert.calledOnce(setOutputManualState_stub)
      })

      it('should return false (manual instruction, schedule last state, no change in output)', function() {
        let dummy_output = {
          outputID: 1,
          outputName: "test",
          outputController: "Schedule",
          lastOutputController: "Schedule",
          scheduleState: "Output Off"
        }   
        assert.isFalse(EventHandler.filterOff(dummy_state, dummy_output, 'Manual'))
      })
    })
    it('should return true', function() {
      let dummy_output = {
        outputID: 1,
        outputName: "test",
        outputController: "Manual",
        lastOutputController: "Schedule",
        manualState: "Output Off"
      }
      assert.isTrue(EventHandler.filterOff(dummy_state, dummy_output, 'Manual'))
    })
  })
})