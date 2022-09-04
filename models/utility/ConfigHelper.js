const fs = require('fs');
const readline = require('readline')
const {simpleLogPrintout, simpleErrorPrintout} = require('./printouts')


module.exports = class ConfigHelper {
  static CONFIG_LOCATION = "./config/config.json";
  static DEFAULT_CONFIG_LOCATION = "./config/default_config.json";
  static BOARD_MAPPINGS_LOCATION = "./config/board_mappings.json";
  static WEB_DATA_LOCATION = "./config/web-data-config.json";
  static DEFAULT_WEB_DATA_LOCATION = "./config/web-data-config-default.json";

  static config = undefined
  static web_data = undefined;
  static board_pinout = undefined;

  /**
   * Reloads config from the passed file.
   */
  static reloadConfig = function() {
    this.constructor.config = JSON.parse(fs.readFileSync(this.CONFIG_LOCATION).toString());
  }

  /**
   * Reloads web-data from the passed file.
   */
  static reloadWebData = function() {
    this.constructor.web_data = JSON.parse(fs.readFileSync(this.CONFIG_LOCATION).toString());
  }

  /**
   * Reloads the board mapping for the board listed in config.
   */
   static reloadBoardPinout = function(){
    const board_mappings = JSON.parse(fs.readFileSync(this.BOARD_MAPPINGS_LOCATION).toString())    
    this.constructor.board_pinout = board_mappings[this.constructor.config.board]  
  }

  /**
   * Gets input from the user through stdin, prompting with the passed string.
   * @param {string} query String to prompt the user with. 
   * @returns The response entered by the user.
   */
  static getInput = function(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
  }

  /**
   * Returns config.json from the config directory; if not available, it copies it from default_config and returns it.
   * @returns a configuration file.
   */

  static initializeConfig = async function() {
    let config;
    return new Promise(async (resolve, reject) => {
      if(fs.existsSync(this.CONFIG_LOCATION)){
        config = JSON.parse(fs.readFileSync(this.CONFIG_LOCATION).toString())
        resolve(config)
      } else {
        simpleLogPrintout("[SETUP] Could not locate config.json, copying from default_config.json.");
        try {
          fs.copyFileSync(this.DEFAULT_CONFIG_LOCATION, this.CONFIG_LOCATION)
          config = JSON.parse(fs.readFileSync(this.CONFIG_LOCATION).toString())
          resolve(config)
        } catch(err) {
          simpleErrorPrintout("ERROR: Could not copy config.json from default_config.json.")
          reject(err)
        }
      }
    });    
  }

  /**
   * Returns web-data-config.json from the config directory; if not available, 
   * it copies it from web-data-config-default.json and returns it.
   * @returns a web-data configuration file.
   */

  static initializeWebData = async function() {
    let web_data;
    return new Promise(async (resolve, reject) => {
      if(fs.existsSync(this.WEB_DATA_LOCATION)){
        web_data = JSON.parse(fs.readFileSync(this.WEB_DATA_LOCATION).toString())
        resolve(web_data)
      } else {
        simpleLogPrintout("[SETUP] Could not locate web-data-config.json, copying from web-data-config-default.json.");
        try {
          fs.copyFileSync(this.DEAFULT_WEB_DATA_LOCATION, this.WEB_DATA_LOCATION)
          web_data = JSON.parse(fs.readFileSync(this.WEB_DATA_LOCATION).toString())
          resolve(web_data)
        } catch(err) {
          simpleErrorPrintout("ERROR: Could not copy web-data-config.json from web-data-config-default.json.")
          reject(err)
        }
      }
    });    
  }

  /**
   * Gets a list of the boards available, returns them as both an object and a string.
   * @returns An array of board_list_JSON and an output friendly string.
   */ 
  static getBoardData = function() {
    let board_list_JSON;
    let board_list = ''
    try {
      board_list_JSON = JSON.parse(fs.readFileSync(this.BOARD_MAPPINGS_LOCATION).toString())
    } catch (e) {
      simpleErrorPrintout('ERROR: Could not load board mappings.')
      throw e
    }
    let i = 1
    for (let e in board_list_JSON){
      board_list = board_list.concat(e)
      if (i != Object.keys(board_list_JSON).length){
        board_list = board_list.concat(", ")
        i++;
      }
    }
    return [board_list_JSON, board_list]
  }

  /**
   * Updates the saved config file with the passed version.
   * @param {JSON Object} config The updated config to write to file
   * @returns True on success, throws error otherwise.
   */
  static configUpdate = function(config) {
    try {      
      fs.writeFileSync(this.CONFIG_LOCATION, JSON.stringify(config))
      simpleLogPrintout("\n[SETUP] Config has been updated!\n")
      return true
    } catch (e) {
      simpleErrorPrintout('ERROR: Could not update config.')
      throw e
    }
  }

  /**
   * Checks config to see if there's a board listed, prompts user for
   * input and updates config accordingly.
   * @param {JSON Object} config Config file to check.
   * @param {boolean} update Current update status.
   * @returns An array of the possibly changed config file and update;
   *  [config, update]
   */

  static boardCheck = async function(config, update){
    if(config.board == 'null'){
      try {
        let [ board_list_JSON, board_list ] = this.getBoardData()
        simpleLogPrintout("[SETUP] No board specified in config. Please enter your arduino model:")
        let board;
        while (!(board in board_list_JSON)){
          simpleLogPrintout("Available: " + board_list);        
          board = await this.getInput('> ')
          config.board = board
          update = true 
        }
      } catch (e) {
        throw e
      }
    } 
    return [config, update]
  }

  /**
   * Checks config to see if there's a database password set, prompts user for
   * input and updates config accordingly.
   * @param {JSON Object} config Config file to check.
   * @param {boolean} update Current update status.
   * @returns An array of the possibly changed config file and update;
   *  [config, update]
   */
  static databaseCheck = async function(config, update) {
    if (config.database.password == 'null'){
      simpleLogPrintout("\n[SETUP] No database password specified in config. Please enter the database password for growth_admin:")
      config.database.password = await this.getInput("> ")  
      update = true  
    }
    return [config, update]
  }

  /**
   * Checks config to see if there's a javascript web token secret set,
   * prompts user for input and updates config accordingly.
   * @param {JSON Object} config Config file to check.
   * @param {boolean} update Current update status.
   * @returns An array of the possibly changed config file and update;
   *  [config, update]
   */
  static jwtCheck = async function(config, update) {
    if (config.jwt_secret == 'null'){
      simpleLogPrintout("\n[SETUP] jwt_secret has not been changed in config. Please enter a string to use for authentication security:")
      config.jwt_secret = await this.getInput("> ")
      update = true
    }
    return [config, update]
  }

  /**
   * Checks config to see if there's info for nodemailer set,
   * prompts user for input and updates config accordingly.
   * @param {JSON Object} config Config file to check.
   * @param {boolean} update Current update status.
   * @returns An array of the possibly changed config file, update, and warnState.
   *  [config, update, warnState]. warnState is used to inform the system whether 
   * or not nodemailer is setup and can be used.
   */
static nodemailerCheck = async function(config, update, warnState) {
  if ((config.nodemailer.service == 'null' || config.nodemailer.auth.user == 'null' || config.nodemailer.auth.pass == 'null') && config.nodemailer_setup_warn == 'true'){
      simpleLogPrintout("\n[SETUP] nodemailer has not been setup in config, 'Warn' will not be sent.")
      let input = await this.getInput("Would you like to set this up now? (y/N) ")
      if (input == 'y' || input == 'Y'){
        config.nodemailer.service = await this.getInput("Please input an emailing service (gmail): \n> ")
        config.nodemailer.auth.user = await this.getInput("Please input the account's email address: \n>  ")
        config.nodemailer.auth.pass = await this.getInput("Please input the account's password: \n>  ")
        config.nodemailer_setup_warn = false
        update = true
      } else {
        input = await this.getInput("Would you like to disable 'Warn' setup in the future? (Y/n) ")
        if (input != 'n' && input != 'N') {
          config.nodemailer_setup_warn = false
          update = true
        }
        warnState = false;
      }
    }
    return [config, update, warnState]
  }

  /**
   * Checks config to see if relay toggle prevention is set,
   * prompts user for input and updates config accordingly.
   * @param {JSON Object} config Config file to check.
   * @param {boolean} update Current update status.
   * @returns An array of the possibly changed config file and update;
   *  [config, update]
   */
  static relayTogglePreventionCheck = async function(config, update) {
    if (config.relay_toggle_prevention == 'null'){
      simpleLogPrintout("\n[SETUP] Relay toggle prevention has not been changed in config.")
      let input = await this.getInput("Would you like to enable this? (y/N)")
      if (input == 'y' || input == 'Y'){
        config.relay_toggle_prevention = true
      } else {
        config.relay_toggle_prevention = false
      }
      update = true
    }
    return [config, update]
  }

  /**
   * Checks config to see if camera enable is set,
   * prompts user for input and updates config accordingly.
   * @param {JSON object} config Config file to check.
   * @param {boolean} update  Current update status.
   * @returns An array of the possibly changed config file and update;
   *  [config, update]
   */
  static cameraCheck = async function(config, update) {
    if (config.camera.enable == 'null'){
      simpleLogPrintout("\n[SETUP] Camera enable has not been changed in config.")
      let input = await this.getInput("Would you like to enable this? (y/N)")
      if (input == 'y' || input == 'Y'){
        config.camera.enable = true
      } else {
        config.camera.enable = false
      }
      update = true
    }
    return [config, update]
  }

  /**
   * Runs config checks (board/database/jwt/nodemailer/relayTogglePrevention)
   * and updates config accordingly. Returns a value that indicates whether 
   * or not NodeMailer can be used.
   * @param {object} config Config file to run checks against. 
   * @returns {boolean} a boolean that is used to inform the system whether or not 
   * nodemailer is setup and can be used.
   */
  static configChecker = async function(config){
    let update = false;
    let warnState = true;
    return new Promise(async (resolve, reject) => {
      try {
        [config, update] = await this.boardCheck(config, update);
        [config, update] = await this.databaseCheck(config, update);
        [config, update] = await this.jwtCheck(config, update);    
        [config, update, warnState] = await this.nodemailerCheck(config, update, warnState);
        [config, update] = await this.relayTogglePreventionCheck(config, update);
        [config, update] = await this.cameraCheck(config, update);
        if(update == true){
          this.configUpdate(config)
        }
        this.reloadConfig()
        this.reloadWebData()
        this.reloadBoardPinout()   
        resolve(warnState)
      } catch (e) {
        reject(e)
      }
    })
  }
}