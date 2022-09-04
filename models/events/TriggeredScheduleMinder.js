const moment = require('moment');


/**
 * Used to keep track of what schedules have been run and when. Used to ensure
 * that schedules don't run when they're not supposed to.
 */
class TriggeredScheduleMinder{
  constructor(){
    this._triggeredSchedules = []
  }
  /**
   * Returns the number of schedules currently stored
   */
  get schedule_count() {
    return this._triggeredSchedules.length
  }

  /**
   * Adds the passed schedule data to the object.
   * @param {object} data 
   */
  add_schedule(data){
    this._triggeredSchedules.push(data)
  }

  /**
   * Removes the schedule at the given index.
   * @param {number} schedule_index 
   */
  remove_schedule(schedule_index){
    this._triggeredSchedules.splice(schedule_index, 1)
  }
  
  /**
   * Removes all schedules that match timeout with the current 'moment'.
   * @param {string} moment_descriptor
   */
  auto_remove_schedules(moment_descriptor = 'minute'){
    for(let i = 0; i < this._triggeredSchedules.length; i++){
      if(moment().isSame(
        this._triggeredSchedules[i].timeout, moment_descriptor
        )){
        this._triggeredSchedules.splice(i, 1)      
      }
    }
  }

  /**
   * Returns the schedule at the corresponding index.
   * @param {number} schedule_index 
   * @returns {object} schedule information
   */
  get_schedule_data(schedule_index){    
    return this._triggeredSchedules[schedule_index]
  }

  /**
   * Returns True if the scheduleID is present in the minder.
   * @param {number} scheduleID
   * @return {boolean} True if present
   */
  includes(scheduleID){
    for(let i = 0; i < this._triggeredSchedules.length; i++){
      if (this._triggeredSchedules[i].scheduleID == scheduleID) {
        return true
      }
    }
    return false
  }

  /**
   * Clears the minder.
   */
  clear(){
    this._triggeredSchedules = []
  }
}

module.exports = TriggeredScheduleMinder