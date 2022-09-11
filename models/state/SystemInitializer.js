const five = require("johnny-five");
const Sensors = require('../Sensors')
const Outputs = require('../Outputs')
const Printouts = require('../utility/Printouts');
const Schedule = require("../Schedule");

module.exports = class SystemInitializer {
  static async initialize(state, config, web_data) {
    var board;
    return new Promise(async (resolve, reject) => {
      Printouts.simpleLogPrintout("Initializing board. . .");
      let board_object = {
        repl: false,
        // debug: false
      }
      board = new five.Board(board_object);
      state.board = board;
      //Find and push DS18B20 Address onto Array
      board.once("ready", async function() { 
        try {  
          Printouts.simpleLogPrintout("Initializing sensors. . .");
          let sensorDict = await Sensors.createInitialState(config, board)
          Printouts.simpleLogPrintout("Initializing outputs. . .");
          let outputDict = await Outputs.createInitialState(config, board)
          await Schedule.initializeSchedule(sensorDict, config, web_data)
          Printouts.simpleLogPrintout(". . .Done!");
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