const five = require("johnny-five");
const Sensors = require('../Sensors')
const Outputs = require('../Outputs')
const Printouts = require('../utility/Printouts');
const Schedule = require("../Schedule");

module.exports = class SystemInitializer {
  static async initialize(config, web_data) {
    var board;
    return new Promise(async (resolve, reject) => {
      Printouts.simpleLogPrintout("Initializing board. . .");
      let board_object = {
        repl: false,
        // debug: false
      }
      board = new five.Board(board_object);
      board.once("ready", async function() { 
        try {  
          Printouts.simpleLogPrintout("Initializing sensors. . .");
          let sensorDict = await Sensors.createInitialState(config, board)
          Printouts.simpleLogPrintout("Initializing outputs. . .");
          let outputDict = await Outputs.createInitialState(config, board)
          Printouts.simpleLogPrintout("Initializing schedule. . .")
          await Schedule.initializeSchedule(sensorDict, config, web_data)
          Printouts.simpleLogPrintout(". . .Done!");
          // If relay control exists, turn on relays
          if(outputDict.relay_control_object){
            outputDict.relay_control_object.high()
          }   
          resolve({
            sensors: sensorDict,
            outputs: outputDict
          })
        } catch (e) {
          reject(e)
        }
      })
    });
  }
}