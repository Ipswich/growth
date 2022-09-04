const fs = require('fs')
const fsPromises = require('fs/promises')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const printouts = require('./printouts')

module.exports = class Utilities {
  /**
   * Formats a time string from the database to be more human friendly.
   * @param {string} input Time string; MUST be of the format HH:mm:ss
   * @returns {string} The formatted string, or 'invalid date' if input was not
   * properly formatted
   */
  static formatTimeString(input) {
    let result = moment(input, 'HH:mm:ss').format("h:mm A");
    if(result == 'Invalid date') {
      printouts.simpleErrorPrintout("formatTimeString() - Invalid date")
    }
    return result
  }

  /**
   * Formats a date string from the database to be more human friendly.
   * @param {string} input Date string; Must be of the format YYYY/MM/DD HH:mm:ss
   * @returns {string} the formatted string, or 'invalid date' if input was not
   * properly formatted
   */
  static formatDateString(input) {
    let result = moment(input).format("MMMM D, h:mm A");
    if(result == 'Invalid date') {
      printouts.simpleErrorPrintout("formatDateString() - Invalid date")
    }
    return result
  }

  /**
   * Formats a human entered time string for the database.
   * @param {string} input Time string; MUST be of the format h:mm A
   * @returns {string} the formatted string, or 'invalid date' if input was not
   * properly formatted
   */
  static formatTimeStringForDB(input) {
    let result = moment(input, 'h:mm A').format("HH:mm:ss");
    if(result == 'Invalid date') {
      printouts.simpleErrorPrintout("formatTimeStringForDB() - Invalid date")
    }
    return result
  }

  /**
   * Formats a human entered date string for the database.
   * @param {string} input Date string; MUST be of the format MM/DD/YYYY
   * @returns {string} the formatted string, or 'invalid date' if input was not
   * properly formatted
   */
  static formatDateStringForDB(input) {
    if (input == 'NULL'){
      return input;
    }
    //Remove first and last character
    input = input.substring(1, input.length-1);
    var string = "";
    //Split input on '/'
    var destructed = input.split("/");
    if (
      destructed[0].toString().length != 2 ||
      destructed[1].toString().length != 2 ||
      destructed[2].toString().length != 4) {
      return 'Invalid date'
    }
    //Reassemble destructed parts
    string = "'" + destructed[2] + "-" + destructed[0] + "-" + destructed[1] + "'"
    return string;
  }

  /**
   * "Minds" the schedule. Ensures that outputs are turned off if there are no
   * schedules that reference them. Manually controlled outputs are untouched,
   * but outputScheduleState is updated if needed.
   * @param {object} state the curent state
   */
  // static async scheduleMinder(state) {
  //   let schedules = await Days.readAllAsync()
  //   let outputs = state.outputState.getOutputState()
  //   for(i = 0; i < outputs.length; i++){
  //     let present = false
  //     for(j = 0; j < schedules.length; j++){
  //       if (outputs[i].outputID == schedules[j].outputID){
  //         present = true
  //       }
  //     }
  //     if (present != true){
  //       if(outputs[i].outputController != 'Manual') {
  //         eventTriggers.turnOffOutput(state, outputs[i])
  //       }
  //       state.outputState.setOutputScheduleState(outputs[i].outputID, "Output Off", 0);
  //     }
  //   }
  // }

  /**
   * Checks a request to see if the attached cookie contains a valid JWT token.
   * @param {object} req express html request
   * @returns true if token is valid, false othrwise.
   */
  static cookieDetector(config, req) {
    try {
      jwt.verify(req.cookies.token, config.jwt_secret)
    } catch(e) {
      return false
    }
    return true
  }

  /**
   * Gets an array of files in the SCRIPT_DIRECTORY file that match 
   * @param {string} file_type file type ending
   * @returns {array} array of files that match the passed file type
   */
  static getScriptFileNames(config, file_type) {
    let files = fs.readdirSync(config.script_directory)
    let sortedFiles = files.filter(e => e.split('.').pop() == file_type);
    return sortedFiles;
  }

  /**
   * Gets the name of the latest file in the specified directory of the specified
   * file type.
   * @param {string} ending file type to grab.
   * @param {string} directory directory to grab from.
   * @returns The name of the most recent file.
   */
  static async getLatestFileName(ending, directory) {
    try {
      const files = await fsPromises.readdir(directory);
      if (files.length == 0){
        throw new Error("No files found!")
      }
      let most_recent = undefined
      let most_recent_time = -1
      for (const file of files) {
        if(file.split('.').pop() != ending){
          continue
        }
        let stat = await fsPromises.stat(directory + '/' + file)      
        if(most_recent_time < stat.ctimeMs) {
          most_recent_time = stat.ctimeMs
          most_recent = file
        }
      }
      return(most_recent)
    } catch (err) {
      throw err
    }
  }

  /**
   * Checks to see if serverTime is between the passed startTime and
   * endTime.
   * @param {string} startTime start time string ("H:mm")
   * @param {string} endTime end time string ("H:mm")
   * @param {string} serverTime current time string ("H:mm")
   * @returns true if the current time is between the start and end time
   */
  static isTimeBetween(startTime, endTime, serverTime) {
    let start = moment(startTime, "H:mm")
    let end = moment(endTime, "H:mm")
    let server = moment(serverTime, "H:mm")
    if (end < start) {
        return server >= start && server<= moment('23:59:59', "h:mm:ss") || server>= moment('0:00:00', "h:mm:ss") && server < end;
    }
    return server>= start && server< end
  }
}