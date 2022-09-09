const five = require("johnny-five");
const initializeSensors = require('./SensorInitializer')
const Outputs = require('../Outputs')
const ScheduleInitializer = require('./ScheduleInitializer')
const printouts = require('../utility/printouts')

module.exports = class SystemInitializer {
  static async initialize(state, config, web_data) {
    var board;
    return new Promise(async (resolve, reject) => {
      printouts.simpleLogPrintout("Initializing board. . .");
      let board_object = {
        repl: false,
        // debug: false
      }
      board = new five.Board(board_object);
      state.board = board;
      //Find and push DS18B20 Address onto Array
      board.once("ready", async function() { 
        try {  
          printouts.simpleLogPrintout("Initializing sensors. . .");
          await initializeSensors.initializeSensors(state)
          printouts.simpleLogPrintout("Initializing outputs. . .");
          let outputDict = Outputs.createInitialState(config, board)
          printouts.simpleLogPrintout("Initializing schedule. . .")
          await ScheduleInitializer.initializeSchedule(state, config, web_data)
          printouts.simpleLogPrintout(". . .Done!");
          // If relay control exists, turn on relays
          if(state.relay_control){
            state.relay_control.high()
          }   
        } catch (e) {
          reject(e)
        } finally {
          resolve()
        }
      })
    });
  }
}