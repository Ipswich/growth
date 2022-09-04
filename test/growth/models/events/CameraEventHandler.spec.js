const chai = require('chai')
const assert = chai.assert
const child_process = require('child_process')
const sinon = require('sinon')

const CameraEventHandler = require('../../../../models/events/CameraEventHandler')      
const printouts = require('../../../../models/utility/printouts')
const utils = require('../../../../models/utility/utils')

describe('CameraEventHandler.js tests', function() {
  describe('takeImage() tests', function () {
    describe('valid config tests', function() {
      let config = {
        camera: {
          image_directory: './test',
          image_width: 1920,
          image_height: 1080,
          image_quality: 100,
          overlay_time: true,
          overlay_date: true,
          overlay_black: true,
          active_hours:{
            start: '00:00',
            stop: '12:00'
          }
        }
      }
      let web_data = {
        title: 'title'
      }

      it('should call exec() and print on success', async function (){
        let stub = sinon.stub(child_process, 'exec').yields(null, null, null)
        let stub_log = sinon.stub(printouts, 'simpleLogPrintout')
        CameraEventHandler.takeImage(config, web_data)
        sinon.assert.calledOnce(stub_log)
        stub.restore()
      })
      
      it('should call exec() and print an error', async function() {
        let stub = sinon.stub(child_process, 'exec').yields('ERROR', null, null)
        let stub_error = sinon.stub(printouts, 'simpleErrorPrintout')
        CameraEventHandler.takeImage(config, web_data)
        sinon.assert.calledOnce(stub_error)
        stub.restore()
      })

      describe('takeImageBetween() tests', function() {
        it('should call takeImage()', function() {
          let stub = sinon.stub(utils, 'isTimeBetween').returns(true)
          let stub_takeImage = sinon.stub(CameraEventHandler, 'takeImage')
          CameraEventHandler.takeImageBetween(config, web_data)
          sinon.assert.calledOnce(stub_takeImage)
          stub.restore()
        })
        
        it('should not call takeImage()', function() {
          let stub = sinon.stub(utils, 'isTimeBetween').returns(false)
          let stub_takeImage = sinon.stub(CameraEventHandler, 'takeImage')
          CameraEventHandler.takeImageBetween(config, web_data)
          sinon.assert.notCalled(stub_takeImage)
          stub.restore()
        })
      })
    })

    describe('invalid config tests', function() {
      it('should throw a TypeError with invalid image dimensions', function() {
        let stub = sinon.stub(child_process, 'exec').yields(null, null, null)
      // Stub config before we require cameraEventHandler because it'll call these on
      // load.
        let config = {
          camera: {
            image_directory: './test',
            image_width: "test",
            image_height: 1080,
            image_quality: 100,
            overlay_time: true,
            overlay_date: true,
            overlay_black: true,
            active_hours:{
              start: '00:00',
              stop: '12:00'
            }
          }
        };
        assert.throws(function() {CameraEventHandler.takeImage(config, {})}, 'Image dimensions not a number.')
        stub.restore()
      })

      it('should throw a TypeError with invalid image quality', function() {
        let stub = sinon.stub(child_process, 'exec').yields(null, null, null)
      // Stub config before we require cameraEventHandler because it'll call these on
      // load.
        let config = {
          camera: {
            image_directory: './test',
            image_width: 1920,
            image_height: 1080,
            image_quality: "test",
            overlay_time: true,
            overlay_date: true,
            overlay_black: true,
            active_hours:{
              start: '00:00',
              stop: '12:00'
            }
          }
        }
        assert.throws(function() {CameraEventHandler.takeImage(config, {})}, 'Image quality not a number.')
        stub.restore()
      })

      it('should throw a TypeError with invalid image overlay value', function() {
        let stub = sinon.stub(child_process, 'exec').yields(null, null, null)
      // Stub config before we require cameraEventHandler because it'll call these on
      // load.
        let config = {
          camera: {
            image_directory: './test',
            image_width: 1920,
            image_height: 1080,
            image_quality: 100,
            overlay_time: "test",
            overlay_date: true,
            overlay_black: true,
            active_hours:{
              start: '00:00',
              stop: '12:00'
            }
          }
        }
        assert.throws(function() {CameraEventHandler.takeImage(config, {})}, 'Overlay value not true/false.')
        stub.restore()
      })
    })
  })
})