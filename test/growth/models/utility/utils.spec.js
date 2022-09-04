const chai = require('chai')
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon')

const utils = require('../../../../models/utility/utils')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const fsPromises = require('fs/promises')

describe('utils.js tests', function() {
  describe('formatTimeString() tests', function() {
    it('should return a human friendly formatted time', function() {
      let test_val = '20:42:00'
      let expected = '8:42 PM'
      assert.equal(expected, utils.formatTimeString(test_val))
    })

    it('should return "Invalid date"', function() {
      let test_val = '25:42:00'
      let expected = 'Invalid date'
      assert.equal(expected, utils.formatTimeString(test_val))
    })
  })

  describe('formatDateString() tests', function() {
    it('should return a human friendly formatted date', function() {
      let test_val = '2000-01-01 20:42:24'
      let expected = 'January 1, 8:42 PM'
      assert.equal(expected, utils.formatDateString(test_val))
    })

    it('should return "Invalid date"', function() {
      let test_val = '2021-01-01 25:18:24'
      let expected = 'Invalid date'
      assert.equal(expected, utils.formatDateString(test_val))
    })
  })
  
  describe('formatTimeStringForDB() tests', function() {
    it('should return a database friendly formatted time', function() {
      let test_val = '8:42 PM'
      let expected = '20:42:00'
      assert.equal(expected, utils.formatTimeStringForDB(test_val))
    })

    it('should return "Invalid date"', function() {
      let test_val = '80:42 PM'
      let expected = 'Invalid date'
      assert.equal(expected, utils.formatTimeStringForDB(test_val))
    })
  })

  describe('formatDateStringForDB() tests', function() {
    it('should return a database friendly formatted date', function() {
      let test_val = "'01/01/2000'"
      let expected = "'2000-01-01'"
      assert.equal(expected, utils.formatDateStringForDB(test_val))
    })

    it('should return "Invalid date"', function() {
      let test_val1 = "'1/01/2000"
      let test_val2 = "'01/1/2000"
      let test_val3 = "'01/01/00"
      let expected = 'Invalid date'
      assert.equal(expected, utils.formatDateStringForDB(test_val1))
      assert.equal(expected, utils.formatDateStringForDB(test_val2))
      assert.equal(expected, utils.formatDateStringForDB(test_val3))
    })
  })

  // describe('scheduleMinder() tests', function() {
  //   it('should call turnOffOutput once, updateScheduleState twice', async function() {
  //     let dummy_schedules = [
  //       {outputID: 1}
  //     ]
  //     let dummy_outputs = [
  //       {outputID: 1},
  //       {outputID: 2, outputController: 'Manual'},
  //       {outputID: 3, outputController: 'Schedule'}
  //     ]
  //     sinon.stub(dbcalls, 'getEnabledLiveSchedules').resolves(dummy_schedules)
  //     let stub_setOutputScheduleState = sinon.stub()
  //     let stub_turnOffOutput = sinon.stub(eventTriggers, 'turnOffOutput')
  //     let stub_getOutputState = sinon.stub().returns(dummy_outputs)
      
  //     let dummy_state = {
  //       outputState: {
  //         getOutputState: stub_getOutputState,
  //         setOutputScheduleState: stub_setOutputScheduleState
  //       }
  //     }

  //     await utils.scheduleMinder(dummy_state)

  //     sinon.assert.calledOnce(stub_turnOffOutput)
  //     sinon.assert.calledTwice(stub_setOutputScheduleState)
  //   })
  // })

  describe('cookieDetector() tests', function() {
    let config;
    beforeEach(function() {
      config = {jwt_secret: 'test'};
    })

    it('should return true for valid token', function() {
      let req = {cookies:{token:jwt.sign('data','test')}}
      assert.isTrue(utils.cookieDetector(config, req))
    })
    it('should return false for invalid token', function() {
      let req = {cookies:{token:jwt.sign('data','test1')}}
      assert.isFalse(utils.cookieDetector(config, req))
    })
  })

  describe('getScriptFileNames() tests', function() {
    let config;
    beforeEach(function() {
      config = '';
      sinon.stub(fs, 'readdirSync').returns(['test_txt.txt', 'test_py.py', 'test_py1.py'])
    })

    it('should return an array containing two .py files', function() {
      let result = utils.getScriptFileNames(config, 'py')
      assert.equal(2, result.length)
      assert.deepEqual(['test_py.py', 'test_py1.py'], result)
    })

    it('should return an array containing one .txt file', function() {
      let result = utils.getScriptFileNames(config, 'txt')
      assert.equal(1, result.length)
      assert.deepEqual(['test_txt.txt'], result)
    })

    it('should return an empty array', function() {
      let result = utils.getScriptFileNames(config, 'test')
      assert.equal(0, result.length)
    })
  })

  describe("getLatestFileName() tests", function() {
    it('should return the name of the most recent txt file (ignore recent jpg)', async function() {
      sinon.stub(fsPromises, 'readdir').resolves(['test1.txt', 'test2.txt', 'test3.jpg'])
      let stub_stat = sinon.stub(fsPromises, 'stat')
      stub_stat.onFirstCall().resolves({ctimeMs: 1})
      stub_stat.onSecondCall().resolves({ctimeMs: 0})
      stub_stat.onThirdCall().resolves({ctimeMs: 2})
      assert.equal(await utils.getLatestFileName('txt', '/test'), 'test1.txt')
    })

    it('should throw an error', async function() {
      sinon.stub(fsPromises, 'readdir').resolves([])
      try {
        await utils.getLatestFileName('txt')
        assert.fail()
      } catch (e){
        assert.typeOf(e, 'Error')
      }
    })
  })

  describe('isTimeBetween() tests', function() {
    it('should return true, time is inside start - stop', function() {
      assert.isTrue(utils.isTimeBetween('22:30', '3:00', '23:50'))
      assert.isTrue(utils.isTimeBetween('22:30', '3:00', '1:50'))
    })

    it('should return false, time is outside start - stop', function() {
      assert.isFalse(utils.isTimeBetween('22:30', '3:00', '4:50'))
      assert.isFalse(utils.isTimeBetween('22:30', '3:00', '21:50'))
    })
  })
})