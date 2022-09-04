const utils = require('../../models/utility/utils.js')
const printouts = require('../../models/utility/printouts')
const mappings = require('../../models/utility/mappings')

module.exports = class EventHandlerUtils {

  //TODO
  static getOutputByEventID(state, eventID){
    //Iterate through output mappings to get output
    let output;
    for(let i = 0; i < state.outputState.getOutputState().length; i++){
      //if current output ID matches passed schedule output ID
      if (state.outputState.getOutputState()[i].outputID == eventID){
        //set output to that output and end forloop
        output = state.outputState.getOutputState()[i];
        break;
      } 
    }
    return output;
  }

  /**
   * Turns on an output.
   * @param {object} state current state
   * @param {object} output output to turn on
   * @param {number} outputValue PWM value (0 - 100)
   * @param {string} controllerType Schedule or Manual
   */
  static outputOn(config, state, output, outputValue, controllerType = "Schedule") {
    if(output.outputPWMObject){
      let maxPWM = config.board_pinout.MAX_PWM;
      // Do math for PWM object
      let value;
      let base = maxPWM/100;
      //If inversion set, use module.exports.ANALOG_RESOLUTION - PWM value
      if (output.outputPWMInversion == 0) {
        value = Math.round(base * outputValue);
      } else {
        value = maxPWM - Math.round(base * outputValue);
      }
      output.outputPWMObject.brightness(value);        
      output.outputObject.close();
      printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] ON @ " + outputValue + "% - [Output Pin: " + output.outputPin + ", PWM Pin: " + output.outputPWMPin + "]");      
    } else {
      printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] ON - [Output Pin: " + output.outputPin + "]");      
      output.outputObject.close();
    }
    if(controllerType == 'Manual'){
      state.outputState.setOutputManualState(output.outputID, "Output On", outputValue);
    } else {
      state.outputState.setOutputScheduleState(output.outputID, "Output On", outputValue);
    }
  }

  /**
   * Turns off an output, logging the schedule. Helper function for triggerEvent.
   * @param {object} state current state
   * @param {object} output output to turn off
   * @param {object} event
   */
  static outputOff(state, output, outputValue, controllerType = "Schedule") {
    printouts.simpleLogPrintout(output.outputName + ": [" + output.outputController + "] OFF - [Output Pin: " + output.outputPin + "]");  
    output.outputObject.open();
    if(controllerType == 'Manual'){
      state.outputState.setOutputManualState(output.outputID, "Output Off", outputValue);
    } else {
      state.outputState.setOutputScheduleState(output.outputID, "Output Off", outputValue);
    }
  }

  /**
   * Gracefully turns of a given output and updates its state. If the output is
   * already off, does nothing.
   * @param {object} state current state
   * @param {object} output the output to turn off
   */
  static turnOffOutput(state, output){
    // if state is already set to off, return
    if (output.scheduleState == 'Output Off') {
      return;
    }
    //Otherwise, update state and log and do stuff
    printouts.debugPrintout(output.outputName + ": [" + output.outputController + "] OFF - [Output Pin: " + output.outputPin + "]");  
    output.outputObject.open();
    state.outputState.setOutputScheduleState(output.outputID, "Output Off", 0);
  }

  /**
   * Used to filter whether an event should be turned ON or not; used to ensure
   * manual ons do not interfere with other running events, and vice versa. 
   * @param {object} state
   * @param {object} output
   * @param {object} outputValue 
   * @param {object} controllerType
   * @returns {boolean} true if the output should be turned on, false otherwise.
   */
  static filterOn(state, output, outputValue, controllerType = "Schedule") {
    if(output.outputController == "Manual") {
      //if last state was set to on output value hasn't changed, return  
      if(controllerType != "Manual") {
        //If output controller is manual but schedule type is not, update schedule state
        state.outputState.setOutputScheduleState(output.outputID, "Output On", outputValue);
        printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] ON @ " + outputValue + "% - SKIPPED, SCHEDULE IN MANUAL STATE")
        return false;
      }
      if(output.lastOutputController == 'Schedule' && output.scheduleState == "Output On") {
        //Change of controller - update last output controller, state
        state.outputState.setLastOutputController(output.outputID, output.outputController)          
        if(output.outputPWMObject) {
          if(output.scheduleOutputValue == outputValue) {
            state.outputState.setOutputManualState(output.outputID, "Output On", outputValue);
            printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
            return false;
          }
        } else {
          state.outputState.setOutputManualState(output.outputID, "Output On", outputValue);
          printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
          return false;
        }
      }
      if(output.lastOutputController == 'Manual' && output.manualState == "Output On") {
        if(output.outputPWMObject) {
          if(output.manualOutputValue == outputValue) {          
            printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS MANUAL STATE")
            return false;
          }
        } else {
          printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS MANUAL STATE")
          return false;
        }
      } 
    } else {
      //OutputController == Schedule
      //If output controller is NOT manual and schedule type is manual, return
      if(controllerType == "Manual") {
        state.outputState.setOutputManualState(output.outputID, "Output On", outputValue);
        printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] ON @ " + outputValue + "% - SKIPPED, MANUAL IN SCHEDULE STATE")
        return false;
      }
      if(output.lastOutputController == 'Schedule' && output.scheduleState == "Output On") {
        if(output.outputPWMObject) {
          if(output.scheduleOutputValue == outputValue) {          
            printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
            return false;
          }
        } else {
          printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
          return false;
        }
      }
      if(output.lastOutputController == 'Manual' && output.manualState == "Output On") {
        //Change of controller - update last output controller, state
        state.outputState.setLastOutputController(output.outputID, output.outputController)
        if(output.outputPWMObject) {
          if(output.manualOutputValue == outputValue) {              
            state.outputState.setOutputScheduleState(output.outputID, "Output On", outputValue);
            printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS MANUAL STATE")
            return false;
          }
        } else {
          state.outputState.setOutputScheduleState(output.outputID, "Output On", outputValue);
          printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] ON @ " + outputValue + "% - SKIPPED, SAME AS PREVIOUS MANUAL STATE")
          return false;
        }
      }   
    }   
    return true;         
  }

  /**
   * Used to filter whether an event should be turned OFF or not; used to ensure
   * manual offs do not interfere with other running events, and vice versa. 
   * @param {object} state
   * @param {object} output
   * @param {object} controllerType
   * @returns true if the event should be turned off, false otherwise.
   */
  static filterOff(state, output, controllerType = "Schedule") {
    //If currently in manual control
    if(output.outputController == "Manual"){
      if(controllerType != "Manual"){          
        // If output controller is manual, and schedule type is NOT manual, return
        state.outputState.setOutputScheduleState(output.outputID, "Output Off"); 
        printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] OFF - SKIPPED, SCHEDULE IN MANUAL STATE")
        return false;
      } 
      //if old state was set to off, return        
      if(output.lastOutputController == 'Schedule' && output.scheduleState == "Output Off") {
        state.outputState.setOutputManualState(output.outputID, "Output Off");
        printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] OFF - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
        return false;
      }
      if(output.lastOutputController == 'Manual' && output.manualState == "Output Off"){
        printouts.debugPrintout("[" + output.outputName + "]" + "[Manual] OFF - SKIPPED, SAME AS PREVIOUS MANUAL STATE")
        return false;
      }     
    // Else we're in schedule control
    } else {
      // If output controller is NOT manual, and schedule type is manual, return
      if(controllerType == "Manual"){          
        state.outputState.setOutputManualState(output.outputID, "Output Off");
        printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] OFF - SKIPPED, MANUAL IN SCHEDULE STATE")
        return false;
      }
      //if old state was set to off, return        
      if(output.lastOutputController == 'Schedule' && output.scheduleState == "Output Off") {
        printouts.debugPrintout("[" + output.outputName + "]" + "[Schedule] OFF - SKIPPED, SAME AS PREVIOUS SCHEDULE STATE")
        return false;
      }
    }
    return true;
  }
}

/**
 * Runs schedule on hardware; handles On, Off, Emails, and Python scripts.
 * @param {object} schedule schedule to run
 * @param {object} state current state
 * @param {string} event string representation of event to run
 * @param {number} triggerVal value of sensor trigger
 */
// async function triggerEvent(schedule, state, event = null, triggerVal = null) {
//   //Iterate through output mappings to get output
//   let config = config_helper.getConfig()
//   let output;
//   for(let i = 0; i < state.outputState.getOutputState().length; i++){
//     //if current output ID matches passed schedule output ID
//     if (state.outputState.getOutputState()[i].outputID == schedule.outputID){
//       //set output to that output and end forloop
//       output = state.outputState.getOutputState()[i];
//       break;
//     } 
//   }
//   //If event is not set, switch differently.
//   let switchCase = event
//   if (switchCase == null){
//     switchCase = schedule.eventID
//   }
//   //Disable schedule if it's a manual one to ensure it only ever runs once
//   if(schedule.scheduleType == "Manual"){
//     dbcalls.disableSchedule(schedule.scheduleID, "'SYSTEM'")
//   }
//   switch (switchCase) {
//     case 'Output On':
//       if(!module.exports.filterOn(output, schedule, state, schedule.outputValue)) {
//         return;
//       } 
//       module.exports._outputOn(output, schedule, state, schedule.outputValue)      
//       break;
//     case 'Output Off':
//       if(!module.exports.filterOff(output, schedule, state)){
//         return;
//       }
//       module.exports._outputOff(output, schedule, state)
//       break;
//     case 'Email Warn' :
//       module.exports._emailWarn(schedule, state)
//       break;
//     case 'Python Script':
//       let file = schedule.parameter1;
//       let fileName = schedule.parameter1.split('.')[0]
//       let input_file = [];
//       input_file.push(config.script_directory + '/' + file)
//       //cast triggerVal to string, add as argument
//       input_file.push('' + triggerVal)
//       //Add output Pin and PWM Pin as arguments (if there is an output defined)
//       if (output != undefined) {
//         input_file.push(output.outputPin)
//         input_file.push(output.outputPWMPin)
//       }
//       try {
//         let python = child_process.spawn('python3', input_file);      
//         printouts.simpleLogPrintout("Running python script: " + file)
//         python.stdout.on('data', function (data) {
//           printouts.simpleLogPrintout("PYTHON: " + data.toString())
//         });
//         python.stderr.on('data', function (data) {
//           printouts.simpleErrorPrintout("PYTHON ERROR: " + data.toString())
//         })
//         python.on('close', (code) => {
//           // If code not 3, do nothing.
//           if (code != 3) {
//             printouts.simpleLogPrintout(file + " exited, code: " + code) 
//           // Else, read output file and do stuff.
//           } else {
//             printouts.simpleLogPrintout(file + " exited, code: " + code + " - reading script output file, " + fileName + ".txt" + ".")          
//             module.exports._runPythonResult(output, schedule, state, fileName)
//           }
//         });
//       } catch (e) {
//         printouts.simpleErrorPrintout("Error opening python file: " + e)
//       }
//       break;
//   }
// }

// /**
//  * Sends an email, logging the schedule. Helper function for triggerEvent.
//  * @param {object} schedule schedule to follow
//  * @param {object} state current state
//  * @returns {boolean} true on success, false otherwise.
//  */
// async function _emailWarn(schedule, state) {
//   const config = config_helper.getConfig()
//   const webdata = config_helper.getWebData()
//   // If server says config isn't set up, pass
//   if(state.warnState == false){
//     return false;
//   }
//   // If no email, send no email
//   if(schedule.email == null || schedule.email == undefined){
//     return false;
//   }
//   const transporter = nodemailer.createTransport(config.nodemailer)
//   // Create message based on scheduleType
//   let msg = ''
//   switch (schedule.scheduleType) {
//     case 'Time':
//       msg = "Time warning: " + utils.formatTimeString(schedule.eventTriggerTime)
//       break;
//     case 'Sensor':
//       let comparator = (schedule.scheduleComparator == '<') ? ' is less than ' : ' is greater than '
//       msg = "Sensor warning: " + schedule.sensorType + " @ " + schedule.sensorLocation + comparator + schedule.sensorValue + schedule.sensorUnits + "."
//       break;
//     default:
//       msg = 'Default message'
//       break;
//   }
//   // Pull data from config files
//   const mailOptions = {
//     from: config.nodemailer.auth.user,
//     to: schedule.email,
//     subject: "Warning from " + webdata.title,
//     text: msg
//   }
//   // SEND THE MAIL! And log event.
//   let return_val = true
//   await transporter.sendMail(mailOptions)
//   .then((info) => {
//     printouts.simpleLogPrintout("Warning sent to " + schedule.email + ".")
//     dbcalls.logScheduledEvent(schedule.scheduleID).catch(() => {
//       printouts.simpleErrorPrintout("Could not log EMAIL event.")
//     });
//   })
//   .catch((error) => {
//     return_val = false
//     printouts.simpleLogPrintout("Error sending mail: " + error)
//   })
//   return return_val
// }

// /**
//  * Runs the result returned by running a python script for a schedule. Helper
//  * function for triggerEvent.
//  * @param {object} output output to update
//  * @param {object} schedule schedule to follow
//  * @param {object} state current state
//  * @param {object} fileName file to read and execute internally
//  */
// async function _runPythonResult(output, schedule, state, fileName) {
//   // Read script output file
//   let config = config_helper.getConfig()
//   let ret_val = false
//   await fs.readFile(config.script_directory + '/' + fileName + ".txt", "utf8", (err, data) => {
//     if(err) {
//       printouts.debugPrintout("Error reading output file: " + err)
//       return;
//     } else {
//       let parsed_data
//       try {
//         // Parse output file as JSON
//         parsed_data = JSON.parse(data)
//         //Check for valid values
//         if(parsed_data.output != 1 && parsed_data.output != 0) {
//           throw 'Output value improperly defined! Is it a 1 or a 0?'
//         }
//         if(parsed_data.outputPWM < 0 || parsed_data.outputPWM > 100) {
//           throw 'OutputPWM value improperly defined! Is it between 0 and 100?'
//         }
//       } catch (e) {
//         // Unsuccessful, return early.
//         printouts.debugPrintout("Error reading output file: " + e)
//         return;
//       }
//       //Turn on Output based on python output
//       if (parsed_data.output == 1) {
//         // Filter for the current output status
//         if(!module.exports.filterOn(output, schedule, state, parsed_data.outputPWM)) {
//           return;
//         }
//         module.exports._outputOn(output, schedule, state, parsed_data.outputPWM)
//       }
//       // Turn off Output based on python script
//       if (parsed_data.output == 0) {
//         // Filter for the current output status
//         if(!module.exports.filterOff(output, schedule, state)) {
//           return;
//         }
//         module.exports._outputOff(output, schedule, state)
//       }
//       // Update ret_val; Successful if we've reached here.
//       ret_val = true;
//     }
//   })
//   return ret_val;
// }
// module.exports._runPythonResult = _runPythonResult


// /**
//  * Resumes a schedule when passed from manual back to schedule.
//  * @param {object} outputState outputState object (part of state)
//  * @param {number} outputID the output ID of the object to be controlled.
//  * @returns {boolean} true if state changed, false otherwise.
//  */
// function resumeSchedule(outputState, outputID){
//   let output = outputState.getOutput(outputID)
//   if (output.scheduleState == 'Output On') {
//     //If no state change, return
//     if(output.manualState == output.scheduleState && output.manualOutputValue == output.scheduleOutputValue){
//       return false
//     }
//     if(output.outputPWMObject){
//       // Do math for PWM object (255 bit)
//       let value;
//       let base = 255/100;
//       //If inversion set, use 255 - PWM value
//       if (output.outputPWMInversion == 0) {
//         value = Math.round(base * output.scheduleOutputValue);
//       } else {
//         value = 255 - Math.round(base * output.scheduleOutputValue);
//       }
//       output.outputPWMObject.brightness(value);
//       printouts.debugPrintout(output.outputName + ": [" + output.outputController + "] ON @ " + output.scheduleOutputValue + "% - [Output Pin: " + output.outputPin + ", PWM Pin: " + output.outputPWMPin + "]");
//     } else {
//       printouts.debugPrintout(output.outputName + ": [" + output.outputController + "] ON - [Output Pin: " + output.outputPin + "]");      
//     }
//     output.outputObject.close()
//   } else {
//     //If no state change, return
//     if(output.manualState == output.scheduleState){
//       return false
//     }
//     printouts.debugPrintout(output.outputName + ": [" + output.outputController + "] OFF - [Output Pin: " + output.outputPin + "]");    
//     output.outputObject.open()    
//   }    
//   outputState.setLastOutputController(outputID, output.outputController)
//   return true
// }

