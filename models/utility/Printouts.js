const moment = require('moment')

/**
 * Prints a message to stdout. Does not print in test.
 * @param {string} string Message to print.
 */
module.exports.simpleLogPrintout = function(string){
  if(process.env.NODE_ENV !== 'test'){    
    console.log(string)
  }
}

/**
 * Prints an error message to stderror. Does not print in test.
 * @param {string} error Error message to print.
 */
module.exports.simpleErrorPrintout = function(error){
  if(process.env.NODE_ENV !== 'test'){    
    console.error(error)
  }
}

/**
 * Prints a debug message with a time stamp to stdout.
 * Only prints in debug mode.
 * @param {string} string Debug message to print.
 */
module.exports.debugPrintout = function(string){
  if (!!process.env.NODE_ENV && process.env.NODE_ENV.toLocaleLowerCase().includes('debug')){
    let currentTime = '[' + moment().format('M/D/YYYY - HH:mm') + ']'
    console.log(currentTime + "  " + string)
  }
}

/**
 * Prints an unrecoverable error message with a time stamp to stderror. 
 * Useful for tracking down crashes and why. Does not print in test.
 * @param {string} string Error message to print.
 */
module.exports.errorPrintout = function(string){
  if(process.env.NODE_ENV !== 'test'){
    let currentTime = 'UNRECOVERABLE ERROR: [' + moment().format('M/D/YYYY - HH:mm') + ']'
    console.error()
    console.error(currentTime + "  " + string)
  }
}