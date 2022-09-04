const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const assert = chai.assert;
const moment = require('moment');
const TriggeredScheduleMinder = require('../../../../models/events/TriggeredScheduleMinder');

describe("eventHandlerHelpers.js tests", function() {
  describe('schedule_count() tests', function() {
    it('should return the number of stored schedules', function() {
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({"data1" : "data1"})
      test_object.add_schedule({"data2" : "data2"})
      assert.equal(test_object.schedule_count, 2)
    })
  })

  describe("add_schedule() tests", function() {
    it('should add a new schedule', function() {
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({"data" : "data"})
      assert.equal(test_object._triggeredSchedules.length, 1)
    })
  })
  
  describe('remove_schedule() tests', function() {
    it('should remove a schedule by index', function() {
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({"data1" : "data1"})
      test_object.add_schedule({"data2" : "data2"})
      test_object.remove_schedule(0)
      assert.deepEqual(test_object._triggeredSchedules[0], {"data2": "data2"})
    })
  })

  describe('auto_remove_schedules() tests', function() {
    it('should auto remove all schedules based on time', function() {
      let test_object = new TriggeredScheduleMinder()
      Date.now = sinon.stub().returns(new Date("2020-01-01T12:00:00.000Z"))
      test_object.add_schedule({timeout : moment().add(1, 'm')})
      test_object.auto_remove_schedules()
      assert.equal(test_object._triggeredSchedules.length, 1)
      Date.now = sinon.stub().returns(new Date("2020-01-01T12:01:00.000Z"))
      test_object.auto_remove_schedules()
      assert.equal(test_object._triggeredSchedules.length, 0)
    })
  })

  describe('get_schedule_data() tests', function() {
    it('should return the schedule data at the given index', function(){
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({"data1" : "data1"})
      assert.deepEqual({'data1' : "data1"}, test_object.get_schedule_data(0))
    })
  })

  describe("includes() tests", function() {
    it('should return true', function() {
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({scheduleID: 1})
      assert.isTrue(test_object.includes(1))
    })

    it('should return false', function() {
      let test_object = new TriggeredScheduleMinder()
      test_object.add_schedule({scheduleID: 1})
      assert.isFalse(test_object.includes(2))
    })
  })

  describe('clear() tests', function() {
    it('should empty out the list of schedules', function() {
      let test_object = new TriggeredScheduleMinder()      
      test_object.add_schedule({scheduleID: 1})
      assert.equal(test_object.schedule_count, 1)
      test_object.clear()
      assert.equal(test_object.schedule_count, 0)
    })
  })
})