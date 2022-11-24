const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;

const Constants = require('../../../../models/Constants')
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
})