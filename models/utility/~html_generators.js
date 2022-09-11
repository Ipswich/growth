// const pug = require('pug')
// const path = require('path')
// const dbcalls = require('./database_calls')
// const utils = require('./utils')
// const printouts = require('./printouts')

// const CHART_INTERVAL = 24
// const INTERVALS = {
//   0:{
//     interval: 6,
//     title: "6 Hours",
//     default: false
//   },
//   1:{
//     interval: 12,
//     title: "12 Hours",
//     default: false
//   },
//   2:{
//     interval: 24,
//     title: "1 Day",
//     default: true
//   },
//   3:{
//     interval: 48,
//     title: "2 Days",
//     default: false
//   },
//   4:{
//     interval: 72,
//     title: "3 Days",
//     default: false
//   },
//   5:{
//     interval: 168,
//     title: "1 Week",
//     default: false
//   },
// }
// var chartData = {};

// // Generates HTML data from Pug templates for both current conditions and schedule.
// async function getIndexData(res, req, interval = CHART_INTERVAL) {
//   return new Promise(async (resolve, reject) => {
//     var web_data = req.app.get('web_data');
//     //Redo old pages
//     //setup paths
//     const schedules = path.join(req.app.get('views'), '/schedules.pug');
//     const currentConditions = path.join(req.app.get('views'), '/currentConditions.pug');
//     const addEvent = path.join(req.app.get('views'), '/addEvent.pug');
//     const manual = path.join(req.app.get('views'), '/manual.pug');
//     //Create pug render functions
//     var cSchedules = pug.compileFile(schedules);
//     var cCurrentConditions = pug.compileFile(currentConditions);
//     var cAddEvent = pug.compileFile(addEvent);
//     var cManual = pug.compileFile(manual);
//     //grab Index Page Data
//     try {
//       //Get last readings from sensors
//       var sensorData = chartData[interval]
//       var sensorTypes = {sensorTypes: req.app.get('state').sensorState.getSensorTypes()};
//       var scheduleData = {scheduleData: await dbcalls.getEnabledLiveSchedules()};
//       //Format trigger Time to be human readable
//       for (var key in scheduleData.scheduleData){
//         if(scheduleData.scheduleData[key].eventTriggerTime != null){
//           scheduleData.scheduleData[key].eventTriggerTime = utils.formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
//         }
//       }
//       //Get enabled outputs
//       var outputs = {outputs: req.app.get('state').outputState.getOutputIndexData()};
//       //Get enabled events
//       var events = {events: req.app.get('state').events};
//       //Get enabled sensors
//       var sensors = {sensors: req.app.get('state').sensorState.getSensorIndexData()};
//       //Get python scripts
//       var python = {python: utils.getScriptFileNames('py')}
//       //Create data object for rendering html
//       var intervals = {intervals: INTERVALS}      
//       //Get outputs from state
//       let state = {state: req.app.get('state').outputState.data}
//       if (res.locals.authenticated || utils.cookieDetector(req)){
//         var authenticated = {authenticated: true }
//       } else {
//         var authenticated = {authenticated: false }
//       }
//       var data = Object.assign({}, web_data, sensorTypes, sensorData, scheduleData, outputs, events, sensors, python, intervals, state, authenticated);
//       //Render and add to object
//       var manualPug = {manual: cManual(data)};
//       var addEventPug = {addEvent: cAddEvent(data)};
//       var schedulesPug = {schedules: cSchedules(data)};
//       var currentConditionsPug = {currentConditions: cCurrentConditions(data)};
//       //Create packet, resolve.
//       var packet = Object.assign({}, schedulesPug, currentConditionsPug, addEventPug, manualPug, data);
//       resolve(packet);
//     } catch (e) {
//       printouts.simpleErrorPrintout(e)
//       //If error, error
//       reject(e);
//     }
    
//   })
// }
// module.exports.getIndexData = getIndexData

// // Renders the 'schedules.pug' as HTML and returns the data.
// async function getSchedulesHTML(res, req) {
//   return new Promise(async (resolve, reject) => {
//     var web_data = req.app.get('web_data');
//     const schedules = path.join(req.app.get('views'), '/schedules.pug');
//     var cSchedules = pug.compileFile(schedules);
//     try {
//       var scheduleData = {scheduleData: await dbcalls.getEnabledLiveSchedules()};
//       //Format trigger Time to be human readable
//       for (var key in scheduleData.scheduleData){
//         if(scheduleData.scheduleData[key].eventTriggerTime != null){
//           scheduleData.scheduleData[key].eventTriggerTime = utils.formatTimeString(scheduleData.scheduleData[key].eventTriggerTime);
//         }      }
//       if (res.locals.authenticated || utils.cookieDetector(req)){
//         var authenticated = {authenticated: true }
//       } else {
//         var authenticated = {authenticated: false }
//       }
//       var data = Object.assign({}, web_data, scheduleData, authenticated);      
//       var schedulesPug = {schedules: cSchedules(data)};
//       resolve(schedulesPug);
//     } catch (e) {
//       //If error, error
//       printouts.simpleErrorPrintout(e)
//       reject(e);
//     }
//   })
// }
// module.exports.getSchedulesHTML = getSchedulesHTML

// // Renders the 'addEvents.pug' as HTML and returns the data.
// async function getAddEventHTML(res, req) {
//   return new Promise(async (resolve, reject) => {
//     var web_data = req.app.get('web_data');
//     const addEvent = path.join(req.app.get('views'), '/addEvent.pug');
//     var cAddEvent = pug.compileFile(addEvent);
//     try {
//       //Get enabled outputs
//       var outputs = {outputs: req.app.get('state').outputState.getOutputIndexData()};      
//       //Get enabled events
//       var events = {events: req.app.get('state').events};
//       //Get enabled sensors
//       var sensors = {sensors: req.app.get('state').sensorState.getSensorIndexData()};
//       //Get python scripts
//       var python = {python: utils.getScriptFileNames('py')}

//       if (res.locals.authenticated || utils.cookieDetector(req)){
//         var authenticated = {authenticated: true }
//       } else {
//         var authenticated = {authenticated: false }
//       }
//       var data = Object.assign({}, web_data, outputs, events, sensors, python, authenticated);
//       var addEventPug = {addEvent: cAddEvent(data)};
//       resolve(addEventPug);
//     } catch (e) {
//       //If error, error
//       printouts.simpleErrorPrintout(e)
//       reject(e);
//     }
//   })
// }
// module.exports.getAddEventHTML = getAddEventHTML

// async function getManualHTML(res, req) {
//   return new Promise(async (resolve, reject) => {
//     var web_data = req.app.get('web_data');
//     const manual = path.join(req.app.get('views'), '/manual.pug');
//     var cManual = pug.compileFile(manual);
//     try {
//       //Get outputs from state
//       let state = {state: req.app.get('state').outputState.data}
//       if (res.locals.authenticated || utils.cookieDetector(req)){
//         var authenticated = {authenticated: true }
//       } else {
//         var authenticated = {authenticated: false }
//       }
//       var data = Object.assign({}, web_data, state, authenticated);
//       var manualPug = {manual: cManual(data)};
//       resolve(manualPug);
//     } catch (e) {
//       //If error, error
//       printouts.simpleErrorPrintout(e)
//       reject(e);
//     }
//   })
// }
// module.exports.getManualHTML = getManualHTML

// // regenerates chart data for use by web data - offloads it so it only happens once every minute rather than each connect.
// async function regenerateChartData() {  
//   for (let key in INTERVALS){
//     let interval = INTERVALS[key].interval
//     chartData[interval] = await getAndFormatChartData(interval)   
//   }
// }
// module.exports.regenerateChartData = regenerateChartData

// //Generates chart data for a passed interval
// async function getAndFormatChartData(interval) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var sensorData = {sensorData: await dbcalls.getSensorLastReadings()}
//       let sensorLast12 = await dbcalls.getSensorLastReadingsByHours(interval)
//       for (var key in sensorData.sensorData){
//         //Format logtime to be human readable
//         sensorData.sensorData[key].logTime = utils.formatDateString(sensorData.sensorData[key].logTime);
//       }
//       //Format data for charts
//       sensorData.last12 = []
//       for (var key in sensorLast12){
//         if(sensorData.last12[sensorLast12[key].sensorID] == undefined){
//           sensorData.last12[sensorLast12[key].sensorID] = []
//         }
//         let dataPair = {}
//         dataPair.x = sensorLast12[key].logTime
//         dataPair.y = sensorLast12[key].data
//         sensorData.last12[sensorLast12[key].sensorID].push(dataPair)
//       }
//     } catch(e) {
//       printouts.simpleErrorPrintout(e)
//       reject(e)
//     }
//     resolve(sensorData)
//   })
// }