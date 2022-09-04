const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const assert = chai.assert;
const TriggeredScheduleMinder = require('../../../../models/events/TriggeredScheduleMinder');
const EventHandlerUtils = require('../../../../models/events/EventHandlerUtils');
const { handleTimeEvent } = require('../../../../models/events/TimeEvents');
const TimeEvents = require('../../../../models/events/TimeEvents');

describe('TimeEvent.js tests', function() {
  describe('timeEventRunner() tests', function() {
    it('should call handleTimeEvent once', async function() {
      Date.now = sinon.stub().returns(new Date('2020-01-01T12:00:00.000Z'));
      const test_schedule = [
        {
          timeEventID: 1,
          triggerTime: new Date('2020-01-01T12:00:00.000Z')
        },
      ];
      sinon.stub(TimeEvents, 'getByDayIDAsync').resolves(test_schedule)
      const HandleTimeEvent_stub = sinon.stub(TimeEvents, 'handleTimeEvent');
      HandleTimeEvent_stub.returns();
      await TimeEvents.timeEventRunner({}, 1);
      sinon.assert.calledOnce(HandleTimeEvent_stub);
    });

    it('should not call handleTimeEvent (wrong time)', async function() {
      Date.now = sinon.stub().returns(new Date('2020-01-01T12:00:00.000Z'));
      const test_schedule = [
        {
          timeEventID: 1,
          eventTriggerTime: new Date('2020-01-01T12:01:00.000Z')
        },
      ];
      sinon.stub(TimeEvents, 'getByDayIDAsync').resolves(test_schedule);
      const HandleTimeEvent_stub = sinon.stub(TimeEvents, 'handleTimeEvent');
      HandleTimeEvent_stub.returns();
      await TimeEvents.timeEventRunner({}, 1);
      sinon.assert.notCalled(HandleTimeEvent_stub);
    });

    it('should not call triggerEvent (called recently)', async function() {
      Date.now = sinon.stub().returns(new Date('2020-01-01T12:00:00.000Z'));
      const test_schedule = [
        {
          timeEventID: 1,
          eventTriggerTime: new Date('2020-01-01T12:00:00.000Z')
        },
      ];
      const minder_stub = sinon.stub(TriggeredScheduleMinder.prototype, 'includes')
      minder_stub.returns(false);
      sinon.stub(TimeEvents, 'getByDayIDAsync').resolves(test_schedule);
      const HandleTimeEvent_stub = sinon.stub(TimeEvents, 'handleTimeEvent');
      HandleTimeEvent_stub.returns();
      await TimeEvents.timeEventRunner({}, 1);
      sinon.assert.notCalled(HandleTimeEvent_stub);
    });
  });

  describe('handleTimeEvent() Tests', function() {
    it('should assign a value between 0 and 1 to outputValue', async function() {
      let stub_state = {
        outputState : {
          getOutput: function(){}
        }
      }
      sinon.stub(EventHandlerUtils,'filterOff').returns(false)
      let mathSpy = sinon.spy(Math, 'random')
      await TimeEvents.handleTimeEvent(stub_state, {outputValue: -1})
      sinon.assert.calledOnce(mathSpy)
    });
    
    it('should call outputOn', function() {
      let stub_state = {
        outputState : {
          getOutput: function(){return this.data[0]},
          data: [{
            outputController : 'Schedule',
            lastOutputController: 'Schedule',
            scheduleState: 'Output Off'
          }]
        }
      }
      let outputOn_Stub = sinon.stub(EventHandlerUtils, 'outputOn').callsFake()
      handleTimeEvent(stub_state, {outputValue: 50})
      sinon.assert.calledOnce(outputOn_Stub)
    })

    it('should call outputOff', function() {
      let stub_state = {
        outputState : {
          getOutput: function(){return this.data[0]},
          data: [{
            outputController : 'Schedule',
            lastOutputController: 'Schedule',
            scheduleState: 'Output On'
          }]
        }
      }
      let outputOff_Stub = sinon.stub(EventHandlerUtils, 'outputOff').callsFake()
      handleTimeEvent(stub_state, {outputValue: 0})
      sinon.assert.calledOnce(outputOff_Stub)
    })
  })
});